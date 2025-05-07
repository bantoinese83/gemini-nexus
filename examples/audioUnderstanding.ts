/**
 * Audio Understanding examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/audioUnderstanding.ts
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
 * Ensure sample audio files exist
 */
async function ensureSampleAudio(outputPath: string): Promise<boolean> {
  if (fs.existsSync(outputPath)) {
    return true;
  }
  
  console.log("Sample audio not found.");
  
  try {
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    console.log(`Please place a sample audio file at ${outputPath}`);
    console.log("For this example, we'll check for alternative audio files in the data directory.");
    
    // Check if any audio file exists in the directory
    const files = fs.readdirSync(dir);
    const audioFiles = files.filter(file => 
      ['.mp3', '.wav', '.aac', '.flac', '.ogg'].some(ext => file.endsWith(ext))
    );
    
    if (audioFiles.length > 0) {
      console.log(`Found existing audio file: ${audioFiles[0]}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking for sample audio:", error.message);
    return false;
  }
}

/**
 * Main function to run the examples
 */
async function main() {
  try {
    // Example 1: Basic audio analysis
    console.log("\n=== Example 1: Basic Audio Analysis ===");
    
    // Use a sample audio file
    const audioPath = path.resolve(__dirname, './data/sample.mp3');
    
    // Ensure we have a sample audio file
    if (!await ensureSampleAudio(audioPath)) {
      console.log("Unable to find sample audio. Please provide an audio file at:");
      console.log(audioPath);
      return;
    }
    
    console.log(`Analyzing audio: ${audioPath}`);
    const analysisResponse = await gemini.audioUnderstanding.analyzeAudio(
      audioPath,
      "Describe this audio in detail. What sounds do you hear? If there is speech, what is being said?"
    );
    
    console.log('\nAnalysis Result:');
    console.log(analysisResponse.text);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Audio transcription
    console.log("\n=== Example 2: Audio Transcription ===");
    
    console.log(`Transcribing audio: ${audioPath}`);
    const transcriptionResponse = await gemini.audioUnderstanding.transcribeAudio(
      audioPath,
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

    // Example 3: Transcribe specific section
    console.log("\n=== Example 3: Transcribe Specific Section ===");
    
    // Use the first timestamp from the transcription if available
    const startTime = transcriptionResponse.entries.length > 0 
      ? transcriptionResponse.entries[0].startTime 
      : "00:00";
    const endTime = transcriptionResponse.entries.length > 0 
      ? transcriptionResponse.entries[Math.min(2, transcriptionResponse.entries.length - 1)].endTime 
      : "00:30";
    
    console.log(`Transcribing audio section from ${startTime} to ${endTime}`);
    const sectionResponse = await gemini.audioUnderstanding.transcribeSection(
      audioPath,
      startTime,
      endTime,
      { temperature: 0.2 }
    );
    
    console.log('\nSection Transcription:');
    console.log(sectionResponse.text);
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Ask questions about the audio
    console.log("\n=== Example 4: Ask Questions About the Audio ===");
    
    console.log("Asking questions about the audio");
    const questionResponse = await gemini.audioUnderstanding.askQuestion(
      audioPath,
      "What is the main topic or theme of this audio? Summarize in a few sentences.",
      { temperature: 0.2 }
    );
    
    console.log('\nAnswer:');
    console.log(questionResponse.text);
    
    await waitForConfirmation('Example 4 completed.');

    // Example 5: Count tokens in the audio
    console.log("\n=== Example 5: Count Tokens ===");
    
    console.log("Counting tokens in the audio file");
    try {
      const tokenCount = await gemini.audioUnderstanding.countTokens(audioPath);
      console.log(`\nToken count: ${tokenCount}`);
      console.log(`Estimated audio length: ~${Math.round(tokenCount/32)} seconds`);
    } catch (error) {
      console.log(`Token counting failed: ${error.message}`);
    }
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Audio Understanding Examples");
console.log("===========================");
console.log("This example demonstrates audio understanding capabilities with the Gemini API.");
console.log("It requires sample audio files in the examples/data directory.");

main(); 