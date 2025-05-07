/**
 * Image generation examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/image-generation.ts
 */

import GeminiClient, { GeminiModel, ImagenModel } from '../src';
import * as path from 'path';
import * as fs from 'fs';

// Replace with your actual API key
const API_KEY = 'YOUR_GEMINI_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Generate an image with Gemini
 */
async function generateImageWithGemini() {
  console.log('\n=== Image Generation with Gemini ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.resolve(outputDir, 'gemini-pig.png');
    
    const result = await gemini.imageGeneration.generateWithGemini(
      "Hi, can you create a 3D rendered image of a pig with wings and a top hat flying over a happy futuristic scifi city with lots of greenery?",
      outputPath,
      { 
        model: GeminiModel.FLASH_IMAGE_GEN,
        temperature: 0.7
      }
    );
    
    console.log(`Image generated: ${result.imagePath}`);
    if (result.response.text) {
      console.log(`Model description: ${result.response.text}`);
    }
  } catch (error) {
    console.error('Error during Gemini image generation:', error.message);
  }
}

/**
 * Edit an image with Gemini
 */
async function editImageWithGemini() {
  console.log('\n=== Image Editing with Gemini ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Replace this with an actual path to an input image
    const inputPath = path.resolve(__dirname, '../samples/input-image.png');
    const outputPath = path.resolve(outputDir, 'gemini-edited.png');
    
    // Skip this example if the input image doesn't exist
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping image editing example: Input file ${inputPath} not found`);
      return;
    }
    
    const result = await gemini.imageGeneration.editWithGemini(
      "Add a llama next to the image",
      inputPath,
      outputPath
    );
    
    console.log(`Edited image saved to: ${result.imagePath}`);
    if (result.response.text) {
      console.log(`Model description: ${result.response.text}`);
    }
  } catch (error) {
    console.error('Error during Gemini image editing:', error.message);
  }
}

/**
 * Generate images with Imagen
 */
async function generateImagesWithImagen() {
  console.log('\n=== Image Generation with Imagen ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const imagePaths = await gemini.imageGeneration.generateWithImagen(
      "Robot holding a red skateboard",
      outputDir,
      {
        numberOfImages: 2,
        aspectRatio: "16:9",
        baseFilename: 'robot-skateboard'
      }
    );
    
    console.log(`Generated ${imagePaths.length} images:`);
    imagePaths.forEach(path => {
      console.log(`- ${path}`);
    });
  } catch (error) {
    console.error('Error during Imagen image generation:', error.message);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await generateImageWithGemini();
    await editImageWithGemini();
    await generateImagesWithImagen();
    
    console.log('\nAll image generation examples completed!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run all examples
runExamples(); 