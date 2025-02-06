import { NextResponse } from "next/server";
import { OpenAI } from "openai"; // Import OpenAI package

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you set your OpenAI API key in .env file
});

export async function POST(req: Request) {
  try {
    // Parse the incoming request JSON body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can adjust the model as needed
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    // Extract the response message from the completion
    const responseMessage = completion.choices[0].message.content;

    // Return the response to the frontend
    return NextResponse.json({ output: responseMessage });

  } catch (error) {
    console.error("Error fetching OpenAI response:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
