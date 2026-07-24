import { createXai } from '@ai-sdk/xai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const xai = createXai({
      apiKey: process.env.XAI_API_KEY,
    });

    // Use Grok model
    const result = await streamText({
      model: xai('grok-2-latest'),
      messages,
      system: "You are a helpful AI coding assistant integrated into a Developer Workspace. You can help users write code, debug issues, and explain technical concepts.",
    });    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
