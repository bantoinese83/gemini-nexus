/**
 * Image Understanding examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/imageUnderstanding.ts
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
    // Example 1: Basic image analysis
    console.log("\n=== Example 1: Basic Image Analysis ===");
    
    // Replace with path to your test image
    const imagePath = path.resolve(__dirname, '../examples/data/sample.jpg');
    
    if (!fs.existsSync(imagePath)) {
      console.log(`Image not found at ${imagePath}`);
      console.log('Please place a sample image at this location to run this example.');
      return;
    }
    
    console.log(`Analyzing image: ${imagePath}`);
    const analysisResponse = await gemini.imageUnderstanding.analyzeImage(
      imagePath,
      "Describe this image in detail. What do you see? What is happening?"
    );
    
    console.log('\nAnalysis Result:');
    console.log(analysisResponse.text);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Object detection
    console.log("\n=== Example 2: Object Detection with Bounding Boxes ===");
    
    console.log(`Detecting objects in image: ${imagePath}`);
    const detectionResponse = await gemini.imageUnderstanding.detectObjects(
      imagePath,
      { temperature: 0.2 }
    );
    
    console.log('\nDetected Objects:');
    if (detectionResponse.objects.length > 0) {
      detectionResponse.objects.forEach((obj, index) => {
        console.log(`${index + 1}. ${obj.label} - Bounding Box: [${obj.box_2d.join(', ')}]`);
        
        // Convert normalized coordinates to pixel coordinates for an 800x600 image
        const pixelBox = gemini.imageUnderstanding.normalizedToPixelCoordinates(
          obj.box_2d, 
          800, // Example image width
          600  // Example image height
        );
        console.log(`   Pixel coordinates (800x600 image): [${pixelBox.map(v => Math.round(v)).join(', ')}]`);
      });
    } else {
      console.log('No objects detected or unable to parse the detection results.');
      console.log('Raw response:');
      console.log(detectionResponse.text);
    }
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Image segmentation (requires Gemini 2.5 or later)
    console.log("\n=== Example 3: Image Segmentation ===");
    
    console.log(`Segmenting objects in image: ${imagePath}`);
    try {
      const segmentationResponse = await gemini.imageUnderstanding.segmentObjects(
        imagePath,
        "Identify and segment the main objects in this image."
      );
      
      console.log('\nSegmented Objects:');
      if (segmentationResponse.segments.length > 0) {
        segmentationResponse.segments.forEach((segment, index) => {
          console.log(`${index + 1}. ${segment.label} - Bounding Box: [${segment.box_2d.join(', ')}]`);
          console.log(`   Mask data available (base64-encoded PNG)`);
          
          // To save the mask, you would decode the base64 and save as PNG
          // For example:
          // const maskBuffer = Buffer.from(segment.mask, 'base64');
          // fs.writeFileSync(`mask_${index}.png`, maskBuffer);
        });
      } else {
        console.log('No segmentation results or unable to parse the segmentation results.');
        console.log('Raw response:');
        console.log(segmentationResponse.text);
      }
    } catch (error) {
      console.log(`Segmentation may require Gemini 2.5 or later: ${error.message}`);
    }
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Text extraction (OCR)
    console.log("\n=== Example 4: Text Extraction (OCR) ===");
    
    // This example works better with an image containing text
    console.log(`Extracting text from image: ${imagePath}`);
    const textResponse = await gemini.imageUnderstanding.extractText(imagePath);
    
    console.log('\nExtracted Text:');
    console.log(textResponse.text);
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Image Understanding Examples");
console.log("===========================");
console.log("This example demonstrates image understanding capabilities with the Gemini API.");
console.log("It requires sample images in the examples/data directory.");

main(); 