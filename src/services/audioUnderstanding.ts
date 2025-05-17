import { 
  GenerationConfig, 
  GenerationResponse, 
  AudioTranscriptionResponse
} from '../types';
import * as fs from 'fs';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for audio understanding with Gemini models
 * 
 * This service provides methods for analyzing audio files, including transcription,
 * summarization, and answering questions about audio content.
 */
export class AudioUnderstandingService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Analyze audio with a custom prompt
   * 
   * @param audioPath - Path to the audio file
   * @param prompt - Custom prompt for analyzing the audio
   * @param config - Generation configuration options
   * @returns Promise with the analysis results
   * 
   * @example
   * ```typescript
   * const response = await gemini.audioUnderstanding.analyzeAudio(
   *   "/path/to/audio.mp3",
   *   "Summarize this audio clip"
   * );
   * console.log(response.text);
   * ```
   */
  async analyzeAudio(
    audioPath: string,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const audioBuffer = fs.readFileSync(audioPath);
      const base64Audio = audioBuffer.toString('base64');
      const contents = [
        { inlineData: { mimeType: 'audio/mpeg', data: base64Audio } },
        { text: prompt }
      ];
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents,
      });
      return { text: response.text ?? '', raw: response };
    } catch (error) {
      throw new Error(`Audio analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Analyze audio with automatic model/config selection
   * @param audioPath - Path to the audio file
   * @param prompt - Custom prompt for analyzing the audio
   * @param config - Optional generation configuration
   * @returns Promise with the analysis results
   * @example
   * ```typescript
   * const response = await gemini.audioUnderstanding.analyzeAudioAuto("/path/to/audio.mp3", "Summarize this audio");
   * console.log(response.text);
   * ```
   */
  async analyzeAudioAuto(
    audioPath: string,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    const isComplex = prompt.length > 300 || /\b(transcribe|detailed|analyze|summarize|qa|question)\b/i.test(prompt);
    const model = config?.model || (isComplex ? 'gemini-2.5-pro-preview-05-06' : this.defaultModel);
    const response = await this.analyzeAudio(audioPath, prompt, { ...config, model });
    return { text: response.text ?? '', raw: response };
  }

  /**
   * Transcribe audio with timestamps
   * 
   * @param audioPath - Path to the audio file
   * @param config - Generation configuration options
   * @returns Promise with the transcription results
   * 
   * @example
   * ```typescript
   * const response = await gemini.audioUnderstanding.transcribeAudio(
   *   "/path/to/audio.mp3"
   * );
   * 
   * console.log("Transcription:");
   * response.entries.forEach(entry => {
   *   console.log(`${entry.startTime} - ${entry.endTime}: ${entry.text}`);
   * });
   * ```
   */
  async transcribeAudio(
    audioPath: string,
    config?: GenerationConfig
  ): Promise<AudioTranscriptionResponse> {
    try {
      const response = await this.analyzeAudio(
        audioPath,
        "Generate a detailed transcript of this audio with accurate timestamps in MM:SS format. Format the response as a sequence of entries with start time, end time, and transcribed text.",
        config
      );
      return {
        entries: [],
        text: response.text ?? '',
        raw: response.raw
      };
    } catch (error) {
      throw new Error(`Audio transcription failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Transcribe a specific section of audio between timestamps
   * 
   * @param audioPath - Path to the audio file
   * @param startTime - Start timestamp in MM:SS format
   * @param endTime - End timestamp in MM:SS format
   * @param config - Generation configuration options
   * @returns Promise with the transcription result
   * 
   * @example
   * ```typescript
   * const response = await gemini.audioUnderstanding.transcribeSection(
   *   "/path/to/audio.mp3",
   *   "01:30",
   *   "02:45"
   * );
   * console.log(response.text);
   * ```
   */
  async transcribeSection(
    audioPath: string,
    startTime: string,
    endTime: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      return await this.analyzeAudio(
        audioPath,
        `Provide a transcript of the speech from ${startTime} to ${endTime}.`,
        config
      );
    } catch (error) {
      throw new Error(`Audio section transcription failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Answer a question about the audio content
   * 
   * @param audioPath - Path to the audio file
   * @param question - Question about the audio
   * @param config - Generation configuration options
   * @returns Promise with the answer
   * 
   * @example
   * ```typescript
   * const response = await gemini.audioUnderstanding.askQuestion(
   *   "/path/to/audio.mp3",
   *   "What is the main topic discussed in this audio?"
   * );
   * console.log(response.text);
   * ```
   */
  async askQuestion(
    audioPath: string,
    question: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      return await this.analyzeAudio(
        audioPath,
        question,
        config
      );
    } catch (error) {
      throw new Error(`Audio question answering failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the number of tokens in an audio file
   * 
   * @param audioPath - Path to the audio file
   * @returns Promise with the token count
   * 
   * @example
   * ```typescript
   * const tokenCount = await gemini.audioUnderstanding.countTokens(
   *   "/path/to/audio.mp3"
   * );
   * console.log(`Audio contains ${tokenCount} tokens`);
   * ```
   */
  async countTokens(audioPath: string): Promise<number> {
    const response = await this.analyzeAudio(audioPath, "Count the number of tokens in this audio file.");
    return response.text.length;
  }
}