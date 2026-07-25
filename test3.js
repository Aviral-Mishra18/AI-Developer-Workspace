const { streamText, createUIMessageStreamResponse, toUIMessageStream } = require('ai');
const { createGroq } = require('@ai-sdk/groq');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const result = await streamText({
    model: createGroq({ apiKey: process.env.GROQ_API_KEY })('llama-3.3-70b-versatile'),
    prompt: 'Hello'
  });
  
  console.log('toUIMessageStream exists on result?', typeof result.toUIMessageStream);
  
  if (typeof result.toUIMessageStream === 'function') {
      const response = createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
      console.log('Response created:', response);
  } else {
      console.log('Trying pipeTextStreamToResponse?');
      // Wait, streamText is designed for streamText API. Does streamText itself generate DataStream?
      // Maybe streamText is for text streams, and we need to use streamText but return it using `createDataStreamResponse` from `ai`?
      const aiKeys = Object.keys(require('ai'));
      console.log(aiKeys.filter(k => k.toLowerCase().includes('data')));
  }
}
main().catch(console.error);
