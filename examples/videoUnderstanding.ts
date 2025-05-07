/**
 * Video Understanding examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/videoUnderstanding.ts
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
 * Download sample video if needed
 */
async function ensureSampleVideo(outputPath: string): Promise<boolean> {
  if (fs.existsSync(outputPath)) {
    return true;
  }
  
  console.log("Sample video not found. Downloading NASA sample video...");
  
  try {
    // This sample uses the NASA video "Jupiter's Great Red Spot Shrinks and Grows"
    // which is in the public domain
    const videoUrl = "https://images.nasa.gov/details-GSFC_20180926_Archive_e001362.html";
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // In a real application, you would download the file here
    console.log(`Please download the sample video manually from ${videoUrl}`);
    console.log(`and save it to ${outputPath}`);
    console.log("For this example, we'll check for alternate videos in the data directory.");
    
    // Check if any MP4 file exists in the directory
    const files = fs.readdirSync(dir);
    const mp4Files = files.filter(file => file.endsWith('.mp4'));
    
    if (mp4Files.length > 0) {
      console.log(`Found existing video: ${mp4Files[0]}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error ensuring sample video:", error.message);
    return false;
  }
}

/**
 * Main function to run the examples
 */
async function main() {
  try {
    // Example 1: Basic video analysis
    console.log("\n=== Example 1: Basic Video Analysis ===");
    
    // Use a sample video
    const videoPath = path.resolve(__dirname, './data/sample.mp4');
    
    // Ensure we have a sample video
    if (!await ensureSampleVideo(videoPath)) {
      console.log("Unable to find or download sample video. Please provide a video file at:");
      console.log(videoPath);
      return;
    }
    
    console.log(`Analyzing video: ${videoPath}`);
    const analysisResponse = await gemini.videoUnderstanding.analyzeVideo(
      videoPath,
      "Summarize this video in 3-5 sentences. What is it showing?"
    );
    
    console.log('\nAnalysis Result:');
    console.log(analysisResponse.text);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Video transcription
    console.log("\n=== Example 2: Video Transcription ===");
    
    console.log(`Transcribing video: ${videoPath}`);
    const transcriptionResponse = await gemini.videoUnderstanding.transcribeVideo(
      videoPath,
      { temperature: 0.2 }
    );
    
    console.log('\nTranscription:');
    if (transcriptionResponse.entries.length > 0) {
      transcriptionResponse.entries.forEach(entry => {
        console.log(`${entry.startTime} - ${entry.endTime}: ${entry.text}`);
      });
    } else {
      console.log('No transcription entries found or unable to parse the transcription results.');
      console.log('Raw response:');
      console.log(transcriptionResponse.text);
    }
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Scene analysis
    console.log("\n=== Example 3: Scene Analysis ===");
    
    console.log(`Analyzing scenes in video: ${videoPath}`);
    const sceneResponse = await gemini.videoUnderstanding.analyzeScenes(
      videoPath,
      { temperature: 0.2 }
    );
    
    console.log('\nScene Analysis:');
    if (sceneResponse.scenes.length > 0) {
      sceneResponse.scenes.forEach((scene, index) => {
        console.log(`Scene ${index + 1}: ${scene.startTime} - ${scene.endTime}`);
        console.log(`  ${scene.description}`);
      });
    } else {
      console.log('No scene descriptions found or unable to parse the scene results.');
      console.log('Raw response:');
      console.log(sceneResponse.text);
    }
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Question about a specific timestamp
    console.log("\n=== Example 4: Question at Timestamp ===");
    
    // For this example, we'll just use the first timestamp from the scene analysis
    // In a real application, you might let the user choose a timestamp
    const timestamp = sceneResponse.scenes.length > 0 
      ? sceneResponse.scenes[0].startTime 
      : "00:10";
    
    console.log(`Asking question about timestamp ${timestamp} in the video`);
    const timestampResponse = await gemini.videoUnderstanding.questionAtTimestamp(
      videoPath,
      "What is happening at this moment? Describe in detail.",
      timestamp,
      { temperature: 0.2 }
    );
    
    console.log('\nResponse:');
    console.log(timestampResponse.text);
    
    await waitForConfirmation('Example 4 completed.');

    // Example 5: YouTube video analysis
    console.log("\n=== Example 5: YouTube Video Analysis ===");
    
    // Replace with a valid YouTube URL
    const youtubeUrl = "https://www.youtube.com/watch?v=9hE5-98ZeCg"; // NASA video about planet formation
    
    try {
      console.log(`Analyzing YouTube video: ${youtubeUrl}`);
      const youtubeResponse = await gemini.videoUnderstanding.analyzeYouTubeVideo(
        youtubeUrl,
        "Summarize this video and identify the key scientific concepts it explains.",
        { 
          temperature: 0.2,
          model: 'gemini-2.0-flash' 
        }
      );
      
      console.log('\nYouTube Analysis:');
      console.log(youtubeResponse.text);
    } catch (error) {
      console.log(`YouTube analysis may require Gemini 2.0 or later: ${error.message}`);
      console.log('Skipping YouTube example.');
    }
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Video Understanding Examples");
console.log("===========================");
console.log("This example demonstrates video understanding capabilities with the Gemini API.");
console.log("It requires sample videos in the examples/data directory.");

main();