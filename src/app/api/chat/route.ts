import { createGroq } from '@ai-sdk/groq';
import { streamText, createUIMessageStreamResponse } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const coreMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.parts ? msg.parts.map((p: any) => p.text || '').join('') : (msg.content || "")
    }));

    // Use Groq model
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages: coreMessages,
      system: "You are a helpful AI coding assistant integrated into a Developer Workspace. You can help users write code, debug issues, and explain technical concepts.",
    });
    
    return createUIMessageStreamResponse({
      stream: result.toUIMessageStream(),
    });
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
