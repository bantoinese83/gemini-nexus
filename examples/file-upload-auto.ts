/**
 * File upload auto example for Gemini Nexus
 * Demonstrates using files.uploadAndWait for file upload and processing.
 *
 * Run with: ts-node examples/file-upload-auto.ts
 *
 * @example
 * // Upload a file and wait for it to reach ACTIVE state
 * await gemini.files.uploadAndWait({ file: 'examples/data/sample.txt', config: { mimeType: 'text/plain' } });
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the file upload auto example.
 * @returns {Promise<void>}
 */
async function fileUploadAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const filePath = 'examples/data/sample.txt'; // Replace with your file

  try {
    const file = await gemini.files.uploadAndWait({ file: filePath, config: { mimeType: 'text/plain' } });
    console.log('File upload auto metadata:', file);
  } catch (error) {
    console.error('Error in file upload auto example:', error);
  }
}

fileUploadAutoExample(); 