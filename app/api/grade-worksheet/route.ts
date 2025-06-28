import { NextResponse } from 'next/server';

// This line forces the function to run in a Node.js environment on Vercel.
export const runtime = 'nodejs';

// This is a minimal API route for testing purposes.
// It does not call the AI model. It only checks if a POST request
// can be successfully received and a JSON response sent back.
export async function POST(request: Request) {
  
  console.log("Simplified API Route was called successfully!");

  // If we receive the request, we immediately return a success message.
  // This removes any potential errors from file processing or AI calls.
  try {
    const successResponse = {
      score: 100,
      feedback: "This is a successful test response from the simplified API route!",
    };
    
    return NextResponse.json(successResponse);

  } catch (error: any) {
    console.error("[SIMPLE TEST API ERROR]:", error);
    return NextResponse.json(
        { error: "The simple test API failed.", details: error.message }, 
        { status: 500 }
    );
  }
}
