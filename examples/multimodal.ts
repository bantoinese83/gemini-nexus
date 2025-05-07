/**
 * Multimodal examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/multimodal.ts
 */

import GeminiClient, { GeminiModel } from '../src';
import * as path from 'path';

// Replace with your actual API key
const API_KEY = 'YOUR_GEMINI_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Image-based generation example
 */
async function imageGeneration() {
  console.log('\n=== Image-based Generation ===');
  
  try {
    // Replace with the path to your image
    const imagePath = path.resolve(__dirname, '../samples/sunset.jpg');
    
    const response = await gemini.multimodal.generateFromImage(
      'Describe this image in detail and suggest a title for it.',
      imagePath,
      { 
        model: GeminiModel.PRO_VISION,
        temperature: 0.2,
        maxOutputTokens: 300
      }
    );
    
    console.log(response.text);
  } catch (error) {
    console.error('Error during image-based generation:', error.message);
  }
}

/**
 * Streaming image-based generation
 */
async function streamingImageGeneration() {
  console.log('\n=== Streaming Image-based Generation ===');
  
  try {
    // Replace with the path to your image
    const imagePath = path.resolve(__dirname, '../samples/chart.png');
    
    console.log('Gemini: ');
    
    const stream = await gemini.multimodal.streamGenerateFromImage(
      'Analyze this chart and explain what it shows. Include any key trends or insights.',
      imagePath,
      { 
        model: GeminiModel.PRO_VISION,
        temperature: 0.1
      }
    );
    
    for await (const chunk of stream) {
      process.stdout.write(chunk.text);
    }
    console.log('\n');
  } catch (error) {
    console.error('Error during streaming image generation:', error.message);
  }
}

/**
 * Image URL-based generation example
 */
async function imageUrlGeneration() {
  console.log('\n=== Image URL-based Generation ===');
  
  try {
    // Replace with an actual image URL
    const imageUrl = 'https://example.com/image.jpg';
    
    const response = await gemini.multimodal.generateFromImageData(
      'What can you tell me about this image?',
      imageUrl,
      'image/jpeg',
      { 
        model: GeminiModel.PRO_VISION,
        temperature: 0.3
      }
    );
    
    console.log(response.text);
  } catch (error) {
    console.error('Error during image URL-based generation:', error.message);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await imageGeneration();
    await streamingImageGeneration();
    await imageUrlGeneration();
    
    console.log('\nAll multimodal examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run all examples
runExamples(); 