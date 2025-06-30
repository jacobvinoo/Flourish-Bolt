// app/api/grade-worksheet/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

// This line forces the function to run in a Node.js environment on Vercel,
// which is more robust for complex operations like AI API calls.
export const runtime = 'nodejs';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callAIGradingModel(
  base64Image: string,
  worksheetTitle: string,
  worksheetInstructions: string
) {
  const prompt = `
    You are a friendly and encouraging handwriting teacher.
    A student has completed a worksheet and uploaded their work as an image.
    Worksheet Task: "${worksheetTitle}"
    Instructions: "${worksheetInstructions}"
    Your tasks are:
    1. Analyze the provided image of the student's handwriting.
    2. Compare their work against the worksheet's instructions.
    3. Evaluate their work on accuracy(how well they follow the guides), steadiness (how smooth their lines are, and adherence to the guides.
    4. Provide a single overall score between 50 and 100.
    5. Provide separate scores for 'steadiness' and 'accuracy', each between 0 and 100
    6. If the uploaded image differs from the worksheet in structure, mark the score as 0 and provide the feedback tip to upload the correct worksheet.
    6. Provide a short, constructive, and encouraging feedback tip (1-2 sentences).
    Respond with ONLY a valid JSON object in the following format:
    {"score": <number>, "steadiness": <number>, "accuracy": <number>, "feedback": "<string>"}
  `;

  console.log("Sending request to OpenAI API...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
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
  try {
    const { data: { user }} = await supabase.auth.getUser();
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
    // 1. Upload Image to Storage
    const imagePath = `${user.id}/${worksheetId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from('submissions').upload(imagePath, file);
    if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);

    // 2. Get AI Grade
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const aiResult = await callAIGradingModel(base64Image, formData.get('worksheetTitle') as string, formData.get('worksheetInstructions') as string);

    // 3. Save submission to the database
    const submissionData = {
      user_id: user.id,
      worksheet_id: worksheetId,
      score: aiResult.score,
      steadiness: aiResult.steadiness,
      accuracy: aiResult.accuracy,
      feedback: aiResult.feedback,
      image_path: imagePath,
    };

    //Check both error and the returned data
    // If RLS prevents the insert, 'data' will be null and throw an error
    const { data: insertData, error: dbError } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select() // Use .select() to get the inserted row back
      .single(); // Expect a single row back

    if (dbError || !insertData) {
      console.error("Database Insert Failed.", dbError);
      throw new Error("Failed to save submission record to the database.");
    }

    console.log("Successfully saved submission:", insertData.id);
    return NextResponse.json(aiResult);

  } catch (error: any) {
    console.error("[AI GRADING API ERROR]:", error);
    return NextResponse.json(
        { error: "Failed to process AI grading request.", details: error.message }, 
        { status: 500 }
    );
  }
}
