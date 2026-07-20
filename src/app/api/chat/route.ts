import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // We use a high quality free/cheap model available on OpenRouter
    const result = await streamText({
      model: openrouter('google/gemini-2.5-flash') as any,
      messages,
      system: "You are a helpful AI coding assistant integrated into a Developer Workspace. You can help users write code, debug issues, and explain technical concepts.",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
