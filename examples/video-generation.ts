/**
 * Video generation examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/video-generation.ts
 */

import GeminiClient from '../src';
import * as path from 'path';
import * as fs from 'fs';

// Replace with your actual API key
const API_KEY = 'YOUR_GEMINI_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Generate a video from text
 */
async function generateVideoFromText() {
  console.log('\n=== Video Generation from Text ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.resolve(outputDir, 'kitten-sleeping.mp4');
    
    console.log('Generating video from text prompt...');
    console.log('This may take 2-3 minutes to complete.');
    
    const videoPaths = await gemini.videoGeneration.generateFromText(
      "Panning wide shot of a calico kitten sleeping in the sunshine",
      outputPath,
      { 
        personGeneration: 'dont_allow',
        aspectRatio: '16:9',
        apiKey: API_KEY  // Needed for direct download
      }
    );
    
    console.log(`Video generation complete!`);
    console.log(`Videos saved to:`);
    videoPaths.forEach(path => {
      console.log(`- ${path}`);
    });
  } catch (error) {
    console.error('Error during video generation from text:', error.message);
  }
}

/**
 * Generate a video from an image
 */
async function generateVideoFromImage() {
  console.log('\n=== Video Generation from Image ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Replace this with an actual path to an input image
    const inputPath = path.resolve(__dirname, '../samples/cat.png');
    const outputPath = path.resolve(outputDir, 'cat-video.mp4');
    
    // Skip this example if the input image doesn't exist
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping video from image example: Input file ${inputPath} not found`);
      return;
    }
    
    console.log('Generating video from image...');
    console.log('This may take 2-3 minutes to complete.');
    
    const videoPaths = await gemini.videoGeneration.generateFromImage(
      "Panning wide shot of a calico kitten sleeping in the sunshine",
      inputPath,
      outputPath,
      { 
        aspectRatio: '16:9',
        numberOfVideos: 1,
        apiKey: API_KEY  // Needed for direct download
      }
    );
    
    console.log(`Video generation from image complete!`);
    console.log(`Videos saved to:`);
    videoPaths.forEach(path => {
      console.log(`- ${path}`);
    });
  } catch (error) {
    console.error('Error during video generation from image:', error.message);
  }
}

/**
 * Generate an image with Imagen and then use it as the first frame for a video
 */
async function generateImagenToVideo() {
  console.log('\n=== Image-to-Video Generation (Imagen + Veo) ===');
  
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.resolve(outputDir, 'imagen-to-video.mp4');
    
    console.log('Generating image with Imagen and then creating video...');
    console.log('This may take 3-5 minutes to complete.');
    
    const result = await gemini.videoGeneration.generateFromImagenToVideo(
      "Panning wide shot of a robot holding a red skateboard in a skate park",
      outputPath,
      { 
        aspectRatio: '16:9',
        saveImage: true,
        imageOutputPath: path.resolve(outputDir, 'robot-skateboard.png'),
        apiKey: API_KEY  // Needed for direct download
      }
    );
    
    console.log(`Image and video generation complete!`);
    
    if (result.imagePath) {
      console.log(`Image saved to: ${result.imagePath}`);
    }
    
    console.log(`Videos saved to:`);
    result.videoPaths.forEach(path => {
      console.log(`- ${path}`);
    });
  } catch (error) {
    console.error('Error during combined image and video generation:', error.message);
  }
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    // Note: These operations take a long time, so we'll run them sequentially
    await generateVideoFromText();
    await generateVideoFromImage();
    await generateImagenToVideo();
    
    console.log('\nAll video generation examples completed!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run all examples
runExamples(); 