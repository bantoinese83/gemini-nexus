/**
 * Structured output auto example for Gemini Nexus
 * Demonstrates using structuredOutput.generateAuto for structured JSON output.
 *
 * Run with: ts-node examples/structured-output-auto.ts
 *
 * @example
 * // Generate an array of programming languages with name and year_created
 * await gemini.structuredOutput.generateAuto('List three popular programming languages as an array of objects with name and year_created.', schema);
 */

import { GeminiClient } from '../src/services/client';
import { SchemaType } from '../src/types';

/**
 * Runs the structured output auto example.
 * @returns {Promise<void>}
 */
async function structuredOutputAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'List three popular programming languages as an array of objects with name and year_created.';
  const schema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: 'Language name' },
        year_created: { type: SchemaType.INTEGER, description: 'Year created' }
      },
      required: ['name', 'year_created']
    }
  };

  try {
    const result = await gemini.structuredOutput.generateAuto(prompt, schema);
    console.log('Structured output auto result:', result);
  } catch (error) {
    console.error('Error in structured output auto example:', error);
  }
}

structuredOutputAutoExample(); 