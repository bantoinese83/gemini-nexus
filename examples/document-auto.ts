/**
 * Document understanding auto example for Gemini Nexus
 * Demonstrates using documentUnderstanding.processDocumentAuto with a PDF file.
 *
 * Run with: ts-node examples/document-auto.ts
 *
 * @example
 * // Summarize a PDF document
 * const file = await gemini.files.uploadAndWait({ file: 'examples/data/sample.pdf', config: { mimeType: 'application/pdf' } });
 * const filePart = gemini.files.createPartFromUri(file.uri, file.mimeType);
 * await gemini.documentUnderstanding.processDocumentAuto('Summarize this document.', filePart);
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the document understanding auto example.
 * @returns {Promise<void>}
 */
async function documentAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const filePath = 'examples/data/sample.pdf'; // Replace with your PDF file

  try {
    // Upload and wait for the file to be processed
    const file = await gemini.files.uploadAndWait({ file: filePath, config: { mimeType: 'application/pdf' } });
    const filePart = gemini.files.createPartFromUri(file.uri!, file.mimeType!);
    const response = await gemini.documentUnderstanding.processDocumentAuto('Summarize this document.', filePart);
    console.log('Document auto response:', response.text);
  } catch (error) {
    console.error('Error in document auto example:', error);
  }
}

documentAutoExample(); 