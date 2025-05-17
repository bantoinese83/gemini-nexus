import { 
  GenerationConfig, 
  GenerationResponse, 
  TranscriptionResponse,
  VideoAnalysisResponse,
  TranscriptEntry,
  VideoScene
} from '../types';
import * as fs from 'fs';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for video understanding with Gemini models
 * 
 * This service provides methods for analyzing videos, including transcription,
 * scene analysis, and answering questions about video content.
 */
export class VideoUnderstandingService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Analyze a video with a custom prompt
   * 
   * @param videoPath - Path to the video file
   * @param prompt - Custom prompt for analyzing the video
   * @param config - Generation configuration options
   * @returns Promise with the analysis results
   * 
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.analyzeVideo(
   *   "/path/to/video.mp4",
   *   "Summarize the main events in this video"
   * );
   * console.log(response.text);
   * ```
   */
  async analyzeVideo(
    videoPath: string,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const videoBuffer = fs.readFileSync(videoPath);
      const base64Video = videoBuffer.toString('base64');
      const contents = [
        { inlineData: { mimeType: 'video/mp4', data: base64Video } },
        { text: prompt }
      ];
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents,
      });
      return { text: response.text ?? '', raw: response };
    } catch (error) {
      throw new Error(`Video analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Transcribe a video with timestamps
   * 
   * @param videoPath - Path to the video file
   * @param config - Generation configuration options
   * @returns Promise with the transcription results
   * 
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.transcribeVideo(
   *   "/path/to/video.mp4"
   * );
   * 
   * console.log("Transcription:");
   * response.entries.forEach(entry => {
   *   console.log(`${entry.startTime} - ${entry.endTime}: ${entry.text}`);
   * });
   * ```
   */
  async transcribeVideo(
    videoPath: string,
    config?: GenerationConfig
  ): Promise<TranscriptionResponse> {
    try {
      const response = await this.analyzeVideo(
        videoPath,
        "Transcribe the audio from this video with accurate timestamps in MM:SS format. Format the response as a sequence of entries with start time, end time, and transcribed text.",
        config
      );

      // Parse the response to extract transcript entries
      const entries = this._parseTranscriptEntries(response.text);
      
      return {
        entries,
        text: response.text,
        raw: response.raw
      };
    } catch (error) {
      throw new Error(`Video transcription failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze scenes in a video with timestamps
   * 
   * @param videoPath - Path to the video file
   * @param config - Generation configuration options
   * @returns Promise with the scene analysis results
   * 
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.analyzeScenes(
   *   "/path/to/video.mp4"
   * );
   * 
   * console.log("Scene Analysis:");
   * response.scenes.forEach(scene => {
   *   console.log(`${scene.startTime} - ${scene.endTime}: ${scene.description}`);
   * });
   * ```
   */
  async analyzeScenes(
    videoPath: string,
    config?: GenerationConfig
  ): Promise<VideoAnalysisResponse> {
    try {
      const response = await this.analyzeVideo(
        videoPath,
        "Analyze this video and identify distinct scenes or segments. For each scene, provide the start time, end time (in MM:SS format), and a detailed description of what is happening. Format the response as a sequence of scenes with timestamps and descriptions.",
        config
      );

      // Parse the response to extract scene descriptions
      const scenes = this._parseSceneDescriptions(response.text);
      
      return {
        scenes,
        text: response.text,
        raw: response.raw
      };
    } catch (error) {
      throw new Error(`Video scene analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Answer questions about a specific timestamp in a video
   * 
   * @param videoPath - Path to the video file
   * @param question - Question about the video
   * @param timestamp - Timestamp to reference in MM:SS format
   * @param config - Generation configuration options
   * @returns Promise with the answer
   * 
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.questionAtTimestamp(
   *   "/path/to/video.mp4",
   *   "What is happening in this scene?",
   *   "01:45"
   * );
   * console.log(response.text);
   * ```
   */
  async questionAtTimestamp(
    videoPath: string,
    question: string,
    timestamp: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      return await this.analyzeVideo(
        videoPath,
        `At timestamp ${timestamp}, ${question}`,
        config
      );
    } catch (error) {
      throw new Error(`Video question at timestamp failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze a video from a YouTube URL
   * 
   * Note: YouTube URL support requires Gemini 2.0 or later
   * 
   * @param youtubeUrl - YouTube video URL
   * @param prompt - Custom prompt for analyzing the video
   * @param config - Generation configuration options
   * @returns Promise with the analysis results
   * 
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.analyzeYouTubeVideo(
   *   "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
   *   "Summarize this video and describe the key moments"
   * );
   * console.log(response.text);
   * ```
   */
  async analyzeYouTubeVideo(
    youtubeUrl: string,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const model = this.client.models.get(config?.model || this.defaultModel);
      
      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { 
                fileData: {
                  fileUri: youtubeUrl
                }
              },
              { text: prompt }
            ]
          }
        ],
        ...(config && {
          generationConfig: {
            maxOutputTokens: config.maxOutputTokens,
            temperature: config.temperature,
            topK: config.topK,
            topP: config.topP,
            stopSequences: config.stopSequences,
          },
        }),
      });

      const responseText = response.response?.text() || '';
      
      return {
        text: responseText,
        raw: response
      };
    } catch (error) {
      throw new Error(`YouTube video analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze video with automatic model/config selection
   * @param videoPath - Path to the video file
   * @param prompt - Custom prompt for analyzing the video
   * @param config - Optional generation configuration
   * @returns Promise with the analysis results
   * @example
   * ```typescript
   * const response = await gemini.videoUnderstanding.analyzeVideoAuto("/path/to/video.mp4", "Summarize this video");
   * console.log(response.text);
   * ```
   */
  async analyzeVideoAuto(
    videoPath: string,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    const isComplex = prompt.length > 300 || /\b(transcribe|detailed|analyze|summarize|qa|question|scene)\b/i.test(prompt);
    const model = config?.model || (isComplex ? 'gemini-2.5-pro-preview-05-06' : this.defaultModel);
    return this.analyzeVideo(videoPath, prompt, { ...config, model });
  }

  /**
   * Helper method to wait for file processing to complete
   * @private
   */
  private async _waitForFileProcessing(fileName: string, maxAttempts = 30, intervalMs = 5000): Promise<void> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const fileInfo = await this.client.files.get({ name: fileName });
      
      if (fileInfo.state === 'PROCESSED') {
        return;
      }
      
      if (fileInfo.state === 'FAILED') {
        throw new Error('File processing failed');
      }
      
      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempts++;
    }
    
    throw new Error('Timed out waiting for file processing');
  }

  /**
   * Parse transcript entries from the model response
   * @private
   */
  private _parseTranscriptEntries(text: string): TranscriptEntry[] {
    const entries: TranscriptEntry[] = [];
    
    // Look for patterns like "00:15 - 00:20: This is the transcript text"
    const timestampPattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2}):\s*(.*?)(?=\n\d{1,2}:\d{2}|$)/gs;
    
    let match;
    while ((match = timestampPattern.exec(text)) !== null) {
      if (match.length >= 4) {
        entries.push({
          startTime: match[1],
          endTime: match[2],
          text: match[3].trim()
        });
      }
    }
    
    return entries;
  }

  /**
   * Parse scene descriptions from the model response
   * @private
   */
  private _parseSceneDescriptions(text: string): VideoScene[] {
    const scenes: VideoScene[] = [];
    
    // Look for patterns like "Scene 1: 00:15 - 00:45: Description of the scene"
    // or "00:15 - 00:45: Description of the scene"
    const scenePattern = /(?:Scene \d+:\s*)?(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2}):\s*(.*?)(?=\n(?:Scene \d+:\s*)?\d{1,2}:\d{2}|$)/gs;
    
    let match;
    while ((match = scenePattern.exec(text)) !== null) {
      if (match.length >= 4) {
        scenes.push({
          startTime: match[1],
          endTime: match[2],
          description: match[3].trim()
        });
      }
    }
    
    return scenes;
  }

  /**
   * Utility method to get MIME type from file path
   * @private
   */
  private _getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      'mp4': 'video/mp4',
      'mpeg': 'video/mpeg',
      'mpg': 'video/mpg',
      'mov': 'video/mov',
      'avi': 'video/avi',
      'wmv': 'video/wmv',
      'flv': 'video/x-flv',
      'webm': 'video/webm',
      '3gp': 'video/3gpp',
    };
    
    return mimeTypes[extension || ''] || 'video/mp4';
  }
} 