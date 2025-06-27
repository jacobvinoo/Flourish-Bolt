import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calls the OpenAI GPT-4o model to grade the user's worksheet.
 *
 * @param base64Image The user's worksheet image encoded in base64.
 * @param worksheetTitle The title of the worksheet for context.
 * @param worksheetInstructions The specific instructions for the task.
 * @returns A promise that resolves to an object with a score and feedback.
 */
async function callAIGradingModel(
  base64Image: string,
  worksheetTitle: string,
  worksheetInstructions: string
): Promise<{ score: number; feedback: string }> {

  // --- AI Prompt Engineering ---
  // This prompt is sent to the AI along with the image.
  const prompt = `
    You are a friendly and encouraging handwriting teacher.
    A student has completed a worksheet and uploaded their work as an image.

    Worksheet Task: "${worksheetTitle}"
    Instructions: "${worksheetInstructions}"

    Your tasks are:
    1.  Analyze the provided image of the student's handwriting.
    2.  Compare their work against the worksheet's instructions.
    3.  Evaluate the work on accuracy, steadiness, and adherence to the guides.
    4.  Provide a single overall score between 50 and 100.
    5.  Provide a short, constructive, and encouraging feedback tip (1-2 sentences).

    Respond with ONLY a valid JSON object in the following format:
    {"score": <number>, "feedback": "<string>"}
  `;

  console.log("Sending request to OpenAI API...");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // The latest vision model from OpenAI
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                // We send the image as a base64 data URL
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      // Ensure the model returns a valid JSON object
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    console.log("Received response from OpenAI.");
    const content = response.choices[0].message.content;
    
    if (!content) {
        throw new Error("OpenAI returned an empty response.");
    }

    // Parse the JSON string from the AI's response
    const parsedResult = JSON.parse(content);

    // Basic validation to ensure the result has the expected shape
    if (typeof parsedResult.score !== 'number' || typeof parsedResult.feedback !== 'string') {
        throw new Error("AI response did not match the expected format.");
    }

    return parsedResult;

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // In case of an AI error, return a default error response
    return {
        score: 0,
        feedback: "Sorry, the AI grader is currently unavailable. Please try again later."
    };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const worksheetTitle = formData.get('worksheetTitle') as string;
    const worksheetInstructions = formData.get('worksheetInstructions') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Convert the image file to a base64 string
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    // Call our AI grading function
    const result = await callAIGradingModel(base64Image, worksheetTitle, worksheetInstructions);
    
    // Return the result from the AI to the client
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in AI grading route:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
