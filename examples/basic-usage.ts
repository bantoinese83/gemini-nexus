/**
 * Basic usage examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/basic-usage.ts
 */

import GeminiClient, { GeminiModel } from '../src';

// Replace with your actual API key
const API_KEY = 'YOUR_GEMINI_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Basic text generation example
 */
async function basicTextGeneration() {
  console.log('\n=== Basic Text Generation ===');
  
  try {
    const response = await gemini.textGeneration.generate(
      'Explain quantum computing in simple terms',
      { 
        model: GeminiModel.PRO,
        temperature: 0.2,
        maxOutputTokens: 200
      }
    );
    
    console.log(response.text);
  } catch (error) {
    console.error('Error during text generation:', error.message);
  }
}

/**
 * Text generation with system instructions
 */
async function textGenerationWithInstructions() {
  console.log('\n=== Text Generation with System Instructions ===');
  
  try {
    const response = await gemini.textGeneration.generateWithSystemInstructions(
      'Tell me a story',
      'You are a children\'s book author who writes short, whimsical stories with a moral lesson.',
      { temperature: 0.7 }
    );
    
    console.log(response.text);
  } catch (error) {
    console.error('Error during text generation with instructions:', error.message);
  }
}

/**
 * Multi-turn chat conversation
 */
async function chatConversation() {
  console.log('\n=== Chat Conversation ===');
  
  try {
    const chat = gemini.chat.createChat({
      model: GeminiModel.PRO,
      temperature: 0.3
    });
    
    const response1 = await chat.sendMessage('What are the top 3 programming languages for AI development?');
    console.log('User: What are the top 3 programming languages for AI development?');
    console.log(`Gemini: ${response1.text}`);
    
    const response2 = await chat.sendMessage('Which one is best for beginners?');
    console.log('User: Which one is best for beginners?');
    console.log(`Gemini: ${response2.text}`);
  } catch (error) {
    console.error('Error during chat conversation:', error.message);
  }
}

/**
 * Streaming response example
 */
async function streamingResponse() {
  console.log('\n=== Streaming Response ===');
  
  try {
    console.log('Gemini: ');
    
    const stream = await gemini.textGeneration.streamGenerate(
      'Write a short poem about artificial intelligence',
      { temperature: 0.7 }
    );
    
    for await (const chunk of stream) {
      process.stdout.write(chunk.text);
    }
    console.log('\n');
  } catch (error) {
    console.error('Error during streaming response:', error.message);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await basicTextGeneration();
    await textGenerationWithInstructions();
    await chatConversation();
    await streamingResponse();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run all examples
runExamples(); 