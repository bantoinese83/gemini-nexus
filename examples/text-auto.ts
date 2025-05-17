/**
 * Text generation auto example for Gemini Nexus
 * Demonstrates using textGeneration.generateAuto for text generation.
 *
 * Run with: ts-node examples/text-auto.ts
 *
 * @example
 * // Summarize the benefits of TypeScript for JavaScript developers
 * await gemini.textGeneration.generateAuto('Summarize the benefits of TypeScript for JavaScript developers.');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the text generation auto example.
 * @returns {Promise<void>}
 */
async function textAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'Summarize the benefits of TypeScript for JavaScript developers.';

  try {
    const response = await gemini.textGeneration.generateAuto(prompt);
    console.log('Text auto response:', response.text);
  } catch (error) {
    console.error('Error in text auto example:', error);
  }
}

textAutoExample(); 