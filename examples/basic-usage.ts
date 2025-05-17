/**
 * Basic usage examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/basic-usage.ts
 */

// Modern Gemini Nexus Quickstart Example
import { GeminiClient } from '../src/services/client';
import { SchemaType } from '../src/types';

async function quickstart() {
  // Enable debug mode for all API calls
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);

  // Suggest a model for a coding task
  const bestModel = gemini.suggestModelForTask('code');
  console.log('Suggested model for code:', bestModel);

  // Use the new auto text generation method
  const autoText = await gemini.textGeneration.generateAuto('Explain the difference between TypeScript and JavaScript.');
  console.log('Auto text generation:', autoText.text);

  // Use the new auto function calling method
  const weatherFn = {
    name: 'get_weather',
    description: 'Get the current weather for a city.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        city: { type: SchemaType.STRING, description: 'City name' }
      },
      required: ['city']
    }
  };
  const autoFunc = await gemini.functionCalling.generateAuto('What is the weather in Paris?', [weatherFn]);
  console.log('Auto function calling:', autoFunc.text, autoFunc.functionCalls);

  // Demonstrate file upload + wait (requires a sample file)
  // const file = await gemini.files.uploadAndWait({ file: 'examples/data/sample.pdf', config: { mimeType: 'application/pdf' } });
  // console.log('Uploaded and processed file:', file);
}

quickstart().catch(console.error); 