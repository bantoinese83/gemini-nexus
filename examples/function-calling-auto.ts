/**
 * Function calling auto example for Gemini Nexus
 * Demonstrates using functionCalling.generateAuto for function calling.
 *
 * Run with: ts-node examples/function-calling-auto.ts
 */

import { GeminiClient } from '../src/services/client';
import { SchemaType } from '../src/types';

async function functionCallingAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'Get the weather in New York.';
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

  try {
    const response = await gemini.functionCalling.generateAuto(prompt, [weatherFn]);
    console.log('Function calling auto response:', response.text);
    if (response.functionCalls) {
      console.log('Function calls:', response.functionCalls);
    }
  } catch (error) {
    console.error('Error in function calling auto example:', error);
  }
}

functionCallingAutoExample(); 