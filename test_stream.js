const { streamText } = require('ai');
const { createGroq } = require('@ai-sdk/groq');
require('dotenv').config({ path: '.env.local' });

async function main() {
  const result = await streamText({
    model: createGroq({ apiKey: process.env.GROQ_API_KEY })('llama-3.3-70b-versatile'),
    prompt: 'Hello'
  });
  console.log(Object.keys(result));
  
  if (typeof result.toDataStreamResponse === 'function') {
      console.log('HAS toDataStreamResponse');
  } else if (typeof result.toTextStreamResponse === 'function') {
      console.log('HAS toTextStreamResponse');
  }
}
main().catch(console.error);
