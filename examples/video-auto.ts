/**
 * Video understanding auto example for Gemini Nexus
 * Demonstrates using videoUnderstanding.analyzeVideoAuto with a video file.
 *
 * Run with: ts-node examples/video-auto.ts
 *
 * @example
 * // Summarize the main events in a video file
 * await gemini.videoUnderstanding.analyzeVideoAuto('examples/data/sample.mp4', 'Summarize the main events in this video.');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the video understanding auto example.
 * @returns {Promise<void>}
 */
async function videoAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const videoPath = 'examples/data/sample.mp4'; // Replace with your video file
  const prompt = 'Summarize the main events in this video.';

  try {
    const response = await gemini.videoUnderstanding.analyzeVideoAuto(videoPath, prompt);
    console.log('Video auto response:', response.text);
  } catch (error) {
    console.error('Error in video auto example:', error);
  }
}

videoAutoExample(); 