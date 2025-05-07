/**
 * Search Grounding examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/searchGrounding.ts
 */

import GeminiClient from '../src';
import * as fs from 'fs';
import * as path from 'path';

// Set your API key
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Helper function to wait for user confirmation
 */
async function waitForConfirmation(message: string): Promise<void> {
  console.log(`\n${message}`);
  console.log('Press Enter to continue...');
  
  return new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
}

/**
 * Helper function to save HTML content to a file
 */
function saveHtmlToFile(html: string, filename: string): string {
  const dir = path.join(__dirname, 'output');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, html);
  
  return filePath;
}

/**
 * Main function to run the examples
 */
async function main() {
  try {
    // Example 1: Basic Search Grounding with Gemini 2.0
    console.log("\n=== Example 1: Basic Search Grounding with Gemini 2.0 ===");
    
    console.log("Prompt: Who individually won the most bronze medals during the Paris olympics in 2024?");
    const response = await gemini.searchGrounding.generate(
      "Who individually won the most bronze medals during the Paris olympics in 2024?",
      { temperature: 0.2 }
    );
    
    console.log('\nResponse:');
    console.log(response.text);
    
    if (response.groundingMetadata) {
      console.log('\nSearch Queries:');
      console.log(gemini.searchGrounding.getWebSearchQueries(response));
      
      const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(response);
      if (suggestionsHTML) {
        const htmlPath = saveHtmlToFile(suggestionsHTML, 'search_suggestions_1.html');
        console.log(`\nSearch Suggestions HTML saved to: ${htmlPath}`);
        console.log('You can open this file in a browser to see the search suggestions UI.');
      }
    } else {
      console.log('\nNo grounding metadata found in the response.');
    }
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Search Retrieval with Gemini 1.5
    console.log("\n=== Example 2: Search Retrieval with Gemini 1.5 ===");
    
    console.log("Prompt: Who individually won the most silver medals during the Paris olympics in 2024?");
    const retrievalResponse = await gemini.searchGrounding.generateWithRetrieval(
      "Who individually won the most silver medals during the Paris olympics in 2024?",
      { 
        model: "gemini-1.5-flash",
        temperature: 0.2
      }
    );
    
    console.log('\nResponse:');
    console.log(retrievalResponse.text);
    
    if (retrievalResponse.groundingMetadata) {
      console.log('\nSearch Queries:');
      console.log(gemini.searchGrounding.getWebSearchQueries(retrievalResponse));
      
      const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(retrievalResponse);
      if (suggestionsHTML) {
        const htmlPath = saveHtmlToFile(suggestionsHTML, 'search_suggestions_2.html');
        console.log(`\nSearch Suggestions HTML saved to: ${htmlPath}`);
        console.log('You can open this file in a browser to see the search suggestions UI.');
      }
    } else {
      console.log('\nNo grounding metadata found in the response.');
    }
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Dynamic Retrieval with Gemini 1.5 Flash
    console.log("\n=== Example 3: Dynamic Retrieval with Gemini 1.5 Flash ===");
    
    console.log("Prompt: Who individually won the most gold medals during the Paris olympics in 2024?");
    console.log("Dynamic Threshold: 0.5");
    const dynamicResponse = await gemini.searchGrounding.generateWithDynamicRetrieval(
      "Who individually won the most gold medals during the Paris olympics in 2024?",
      0.5,
      { 
        model: "gemini-1.5-flash",
        temperature: 0.2
      }
    );
    
    console.log('\nResponse:');
    console.log(dynamicResponse.text);
    
    if (dynamicResponse.groundingMetadata) {
      console.log('\nSearch Queries:');
      console.log(gemini.searchGrounding.getWebSearchQueries(dynamicResponse));
      
      const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(dynamicResponse);
      if (suggestionsHTML) {
        const htmlPath = saveHtmlToFile(suggestionsHTML, 'search_suggestions_3.html');
        console.log(`\nSearch Suggestions HTML saved to: ${htmlPath}`);
        console.log('You can open this file in a browser to see the search suggestions UI.');
      }
      
      console.log('\nGrounding was applied based on the threshold.');
    } else {
      console.log('\nNo grounding metadata found in the response.');
      console.log('This could be because the model determined the prompt did not meet the threshold for grounding.');
    }
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Search Grounding in Chat with Gemini 2.0
    console.log("\n=== Example 4: Search Grounding in Chat with Gemini 2.0 ===");
    
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: 'I have some questions about recent events.' }]
      },
      {
        role: 'model',
        parts: [{ text: 'Sure, I\'d be happy to help with recent events. What would you like to know?' }]
      }
    ];
    
    console.log("Chat prompt: Who won the most recent Formula 1 Grand Prix?");
    const chatResponse = await gemini.searchGrounding.generateInChat(
      chatHistory,
      "Who won the most recent Formula 1 Grand Prix?",
      { temperature: 0.2 }
    );
    
    console.log('\nChat Response:');
    console.log(chatResponse.text);
    
    if (chatResponse.groundingMetadata) {
      console.log('\nSearch Queries:');
      console.log(gemini.searchGrounding.getWebSearchQueries(chatResponse));
      
      const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(chatResponse);
      if (suggestionsHTML) {
        const htmlPath = saveHtmlToFile(suggestionsHTML, 'search_suggestions_4.html');
        console.log(`\nSearch Suggestions HTML saved to: ${htmlPath}`);
        console.log('You can open this file in a browser to see the search suggestions UI.');
      }
    } else {
      console.log('\nNo grounding metadata found in the response.');
    }
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Search Grounding Examples");
console.log("========================");
console.log("This example demonstrates search grounding capabilities with the Gemini API.");
console.log("Note: You must have a valid API key with Google Search grounding enabled.");

main(); 