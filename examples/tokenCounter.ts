/**
 * Token Counter examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/tokenCounter.ts
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
 * Main function to run the examples
 */
async function main() {
  try {
    // Example 1: Count tokens in text
    console.log("\n=== Example 1: Count Tokens in Text ===");
    
    const text = "The quick brown fox jumps over the lazy dog.";
    console.log(`Text: "${text}"`);
    
    const textResult = await gemini.tokenCounter.countTokensInText(text);
    console.log(`Total tokens: ${textResult.totalTokens}`);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Count tokens in a longer passage
    console.log("\n=== Example 2: Count Tokens in a Longer Passage ===");
    
    const passage = `
      Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.
      
      AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.
      
      The term "artificial intelligence" had previously been used to describe machines that mimic and display "human" cognitive skills that are associated with the human mind, such as "learning" and "problem-solving".
      
      This definition has since been rejected by major AI researchers who now describe AI in terms of rationality and acting rationally, which does not limit how intelligence can be articulated.
    `;
    
    const passageResult = await gemini.tokenCounter.countTokensInText(passage);
    console.log(`Longer passage token count: ${passageResult.totalTokens}`);
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Count tokens in multimodal content
    console.log("\n=== Example 3: Count Tokens in Multimodal Content ===");
    
    // Create an image part using a base64 encoded image or placeholder
    let imagePart;
    const imagePath = path.join(__dirname, 'data', 'test-image.jpg');
    
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      };
      
      console.log("Using actual image from:", imagePath);
    } else {
      console.log("No test image found. Using a placeholder for demonstration.");
      // Just use text to simulate image for demonstration purposes
      imagePart = { text: "[This would be an image in a real example]" };
    }
    
    const multimodalContent = [
      { text: "Describe this image:" },
      imagePart
    ];
    
    const multimodalResult = await gemini.tokenCounter.countTokensInContent(multimodalContent);
    console.log(`Multimodal content token count: ${multimodalResult.totalTokens}`);
    
    // Note about image token counting
    console.log("\nNote: With Gemini 2.0, images ≤384 pixels in both dimensions count as 258 tokens.");
    console.log("Larger images are cropped and scaled into 768x768 pixel tiles, each counting as 258 tokens.");
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Count tokens in chat history
    console.log("\n=== Example 4: Count Tokens in Chat History ===");
    
    const chatHistory = [
      { role: "user", parts: [{ text: "Hi my name is Bob" }] },
      { role: "model", parts: [{ text: "Hi Bob! How can I help you today?" }] },
      { role: "user", parts: [{ text: "Tell me about the solar system" }] },
      { role: "model", parts: [{ text: "The solar system consists of the Sun and everything that orbits around it, including planets, moons, asteroids, comets, and other celestial bodies. There are eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune." }] }
    ];
    
    const chatResult = await gemini.tokenCounter.countTokensInChatHistory(chatHistory);
    console.log(`Chat history token count: ${chatResult.totalTokens}`);
    
    await waitForConfirmation('Example 4 completed.');

    // Example 5: Get usage metadata from a response
    console.log("\n=== Example 5: Get Usage Metadata from Response ===");
    
    const generationResponse = await gemini.textGeneration.generate(
      "What are three interesting facts about giraffes?",
      { 
        temperature: 0.7,
        maxOutputTokens: 100,
        model: "gemini-2.0-flash"
      }
    );
    
    console.log("\nGenerated Text:");
    console.log(generationResponse.text);
    
    const usageMetadata = gemini.tokenCounter.getUsageFromResponse(generationResponse);
    
    if (usageMetadata) {
      console.log("\nUsage Metadata:");
      console.log(`  Total tokens: ${usageMetadata.totalTokenCount}`);
      console.log(`  Prompt tokens: ${usageMetadata.promptTokenCount}`);
      console.log(`  Response tokens: ${usageMetadata.candidatesTokenCount}`);
    } else {
      console.log("\nNo usage metadata available in the response.");
    }
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Token Counter Examples");
console.log("=====================");
console.log("This example demonstrates how to count tokens with the Gemini API.");
console.log("Understanding token counts is helpful for managing costs and ensuring you stay within model limits.");

main(); 