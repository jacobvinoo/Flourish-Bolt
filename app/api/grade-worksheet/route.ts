// app/api/grade-worksheet/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
// It's crucial that OPENAI_API_KEY is set in your Vercel project settings.
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
    3. Evaluate the work on accuracy, steadiness, and adherence to the guides.
    4. Provide a single overall score between 50 and 100.
    5. Provide a short, constructive, and encouraging feedback tip (1-2 sentences).
    Respond with ONLY a valid JSON object in the following format:
    {"score": <number>, "feedback": "<string>"}
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

// --- THIS IS THE CRITICAL FIX ---
// The function name MUST be uppercase 'POST' to handle POST requests.
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const worksheetTitle = formData.get('worksheetTitle') as string;
    const worksheetInstructions = formData.get('worksheetInstructions') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    const result = await callAIGradingModel(base64Image, worksheetTitle, worksheetInstructions);
    
    // If successful, return the result from the AI
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("[AI GRADING API ERROR]:", error);
    return NextResponse.json(
        { error: "Failed to process AI grading request.", details: error.message }, 
        { status: 500 }
    );
  }
}

