/**
 * Search grounding auto example for Gemini Nexus
 * Demonstrates using searchGrounding.generateAuto for factual Q&A.
 *
 * Run with: ts-node examples/search-grounding-auto.ts
 *
 * @example
 * // Get factual answer and search suggestions
 * const response = await gemini.searchGrounding.generateAuto('Who is the current president of France?');
 * if (response.groundingMetadata) {
 *   gemini.searchGrounding.getSearchSuggestionsHTML(response);
 *   gemini.searchGrounding.getWebSearchQueries(response);
 * }
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the search grounding auto example.
 * @returns {Promise<void>}
 */
async function searchGroundingAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'Who is the current president of France?';

  try {
    const response = await gemini.searchGrounding.generateAuto(prompt);
    console.log('Search grounding auto response:', response.text);
    if (response.groundingMetadata) {
      console.log('Search suggestions HTML:', gemini.searchGrounding.getSearchSuggestionsHTML(response));
      console.log('Web search queries:', gemini.searchGrounding.getWebSearchQueries(response));
    }
  } catch (error) {
    console.error('Error in search grounding auto example:', error);
  }
}

searchGroundingAutoExample(); 