/**
 * Audio understanding auto example for Gemini Nexus
 * Demonstrates using audioUnderstanding.analyzeAudioAuto with an audio file.
 *
 * Run with: ts-node examples/audio-auto.ts
 *
 * @example
 * // Summarize the main topic of an audio file
 * await gemini.audioUnderstanding.analyzeAudioAuto('examples/data/sample.mp3', 'Summarize the main topic of this audio clip.');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the audio understanding auto example.
 * @returns {Promise<void>}
 */
async function audioAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const audioPath = 'examples/data/sample.mp3'; // Replace with your audio file
  const prompt = 'Summarize the main topic of this audio clip.';

  try {
    const response = await gemini.audioUnderstanding.analyzeAudioAuto(audioPath, prompt);
    console.log('Audio auto response:', response.text);
  } catch (error) {
    console.error('Error in audio auto example:', error);
  }
}

audioAutoExample(); 