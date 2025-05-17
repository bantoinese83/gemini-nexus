/**
 * Multimodal auto example for Gemini Nexus
 * Demonstrates using multimodal.generateAuto with a text prompt and image file.
 *
 * Run with: ts-node examples/multimodal-auto.ts
 *
 * @example
 * // Describe the main objects and scene in an image
 * await gemini.multimodal.generateAuto('Describe the main objects and scene in this image.', 'examples/data/sample.jpg');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the multimodal auto example.
 * @returns {Promise<void>}
 */
async function multimodalAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'Describe the main objects and scene in this image.';
  const imagePath = 'examples/data/sample.jpg'; // Replace with your image file

  try {
    const response = await gemini.multimodal.generateAuto(prompt, imagePath);
    console.log('Multimodal auto response:', response.text);
  } catch (error) {
    console.error('Error in multimodal auto example:', error);
  }
}

multimodalAutoExample(); 