import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const maxDuration = 60; // Allow more time for doc generation

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), { status: 400 });
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const systemPrompt = `You are an expert technical writer and software architect.
Your task is to write highly professional, clear, and comprehensive documentation based on the topic provided by the user.
The output MUST be in valid JSON format with three fields:
1. "title": A concise, professional title for the documentation (max 50 chars).
2. "description": A short summary of what this document covers (1-2 sentences).
3. "content": The actual markdown documentation content.

The markdown content should be detailed and include:
- A clear H1 title
- Overview / Introduction
- Relevant sub-sections (like Prerequisites, Usage, Architecture, or API definitions depending on the topic)
- Code snippets where appropriate
- Best practices or notes

Return ONLY valid JSON. Do not include markdown code block backticks around the JSON string.`;

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: `Generate technical documentation for the following topic: ${topic}`,
      temperature: 0.3, // Lower temperature for more structured/professional output
    });

    // Attempt to parse the returned text as JSON
    let parsedResult;
    try {
      // Clean up in case the LLM wrapped it in markdown json block
      const cleanedText = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse LLM output as JSON:", text);
      return new Response(JSON.stringify({ error: "Failed to generate structured documentation." }), { status: 500 });
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("API Docs Generate Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
