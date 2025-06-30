// app/api/grade-worksheet/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import fs from 'fs/promises'; // import the node filesystem module
import path from 'path'; // import the node path module

// This line forces the function to run in a Node.js environment on Vercel,
// which is more robust for complex operations like AI API calls.
export const runtime = 'nodejs';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Helper function to get the blank worksheet image as base 64
async function getBlankWorksheetAsBase64(worksheetId: string): Promise<string> {
  //construct the path to the image in the public directory
  const imagePath = path.join(process.cwd(), 'public', 'worksheet-blanks', `${worksheetId}.png`);
  try {
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error(`Failed to read blank worksheet image for id: ${worksheetId}`, error);
    throw new Error(`Reference worksheet image not found for id: ${worksheetId}.`);
  }
}

async function callAIGradingModel(
  blankWorksheetBase64: string,
  studentSubmissionBase64: string,
  worksheetTitle: string,
  worksheetInstructions: string
) {
  const prompt = `
    You are a friendly and encouraging handwriting teacher.
    you will be provided with TWO images.
    1. The 'BLANK WORKSHEET': This is the reference image showing the intended task and guides.
    2. The 'STUDENT SUBMISSION': This is the image of the student's completed work.
    
    Worksheet Task: "${worksheetTitle}"
    Instructions: "${worksheetInstructions}"
    Your tasks are:
    1. Compare the 'STUDENT SUBMISSION' against the 'BLANK WORKSHEET'.
    2. Based on this comparison, do the following:
    2a. ** First, verify the submission.** Does the 'STUDENT SUBMISSION' look like a completed version of the 'BLANK WORKSHEET'? If it is clearly a different worksheet or a random image, you MUST give a score of 0 and provide feedback telling the user to upload the correct worksheet.
    2b. **Evaluate the handwriting** Assess the student's work on 'accuracy' (how well they followed the lines/guides from the blank sheet) and 'steadiness' (how smooth and controlled their strokes are).
    2c. **Provide scores.** Give separate score between 0 and 100 for 'accuracy' and 'steadiness'
    2d. **Provide an overall score** Give a single overall 'score' between 50 and 100 (unless it is the wrong sheet, then 0) 
    2e. **Provide feedback ** Write a short, constructive, and encouraging feedback tip (1-2 sentences).
    
    Respond with ONLY a valid JSON object in the following format:
    {"score": <number>, "steadiness": <number>, "accuracy": <number>, "feedback": "<string>"}
  `;

  console.log("Sending request to OpenAI API...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [ { type: "text", text: prompt }, 
                  { type: "image_url", // Correct: no extra braces around the 'url' property 
                    image_url: { url: `data:image/png;base64,${blankWorksheetBase64}` }, }, 
                  { type: "image_url", // Correct: no extra braces around the 'url' property
                   image_url: { url: `data:image/jpeg;base64,${studentSubmissionBase64}` }, },         ],
    response_format: { type: "json_object" },
    max_tokens: 300,
  });

  console.log("Received response from OpenAI.");
  const content = response.choices[0].message.content;
  if (!content) {
      throw new Error("OpenAI returned an empty response.");
  }
  return JSON.parse(content);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  let user;
  
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
    
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const worksheetId = formData.get('worksheetId') as string;
    const worksheetTitle = formData.get('worksheetTitle') as string;
    const worksheetInstructions = formData.get('worksheetInstructions') as string;

    if (!file || !worksheetId) {
      return NextResponse.json({ error: 'Missing file or worksheet ID' }, { status: 400 });
    }

    /*
    // 1. Upload Image to Storage
    const imagePath = `${user.id}/${worksheetId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from('submissions').upload(imagePath, file);
    if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
    */

    // 2. Get AI Grade
    const blankWorksheetBase64 = await getBlankWorksheetAsBase64(worksheetId);
    const studentSubmissionBuffer = await file.arrayBuffer();
    const studentSubmissionBase64 = Buffer.from(studentSubmissionBuffer).toString('base64');
    
    const aiResult = await callAIGradingModel(blankWorksheetBase64, studentSubmissionBase64, worksheetTitle, worksheetInstructions);
    
    if (typeof aiResult.score !== 'number' || typeof aiResult.steadiness !== 'number' || typeof aiResult.accuracy !== 'number'){
      throw new Error('AI returned an invalid data structure.');
    }
    // 3. Save submission to the database

    const imagepath = `${user.id}/${worksheetId}/${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
    const submissionData = {
      user_id: user.id,
      worksheet_id: worksheetId,
      score: aiResult.score,
      steadiness: aiResult.steadiness,
      accuracy: aiResult.accuracy,
      feedback: aiResult.feedback,
      image_path: imagepath,
    };

    //Check both error and the returned data
    // If RLS prevents the insert, 'data' will be null and throw an error

    const [uploadResult, insertResult] = await Promise.all([
      supabase.storage.from('submissions').upload(imagepath, file),
      supabase.from('submissions').insert(submissionData).select().single()
    ]);

    /*
    const { data: insertData, error: dbError } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select() // Use .select() to get the inserted row back
      .single(); // Expect a single row back

    if (dbError || !insertData) {
      console.error("Database Insert Failed.", dbError);
      throw new Error("Failed to save submission record to the database.");
    } 
    */
    if (uploadResult.error) throw new Error(`Storage Error: ${uploadResult.error.message}`);
    if (insertResult.error || !insertResult.data) throw new Error(`Database Error: ${insertResult.error?.message || 'Insert failed'}`);

    console.log("Successfully saved submission:", insertResult.data.id);
    
    return NextResponse.json(insertResult.data);

  } catch (error: any) {
    console.error("[AI GRADING API ERROR]:", error);
    return NextResponse.json(
        { error: "Failed to process AI grading request.", details: error.message }, 
        { status: 500 }
    );
  }
}
