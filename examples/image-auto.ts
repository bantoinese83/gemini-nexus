/**
 * Image understanding auto example for Gemini Nexus
 * Demonstrates using imageUnderstanding.analyzeImageAuto with an image file.
 *
 * Run with: ts-node examples/image-auto.ts
 *
 * @example
 * // Describe the objects and scene in an image file
 * await gemini.imageUnderstanding.analyzeImageAuto('examples/data/sample.jpg', 'Describe the objects and scene in this image.');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the image understanding auto example.
 * @returns {Promise<void>}
 */
async function imageAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const imagePath = 'examples/data/sample.jpg'; // Replace with your image file
  const prompt = 'Describe the objects and scene in this image.';

  try {
    const response = await gemini.imageUnderstanding.analyzeImageAuto(imagePath, prompt);
    console.log('Image auto response:', response.text);
  } catch (error) {
    console.error('Error in image auto example:', error);
  }
}

imageAutoExample(); 