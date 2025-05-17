import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, GenerationResponse } from '../types';

/**
 * Service for text generation with Gemini models
 */
export class TextGenerationService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Generate text from a prompt
   * 
   * @param prompt - Text prompt for generation
   * @param config - Generation configuration options
   * @returns Promise with the generated text
   * 
   * @example
   * ```typescript
   * const response = await gemini.textGeneration.generate("How does AI work?");
   * console.log(response.text);
   * ```
   */
  async generate(prompt: string, config?: GenerationConfig): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents: prompt,
        config: config ? {
          maxOutputTokens: config.maxOutputTokens,
          temperature: config.temperature,
          topK: config.topK,
          topP: config.topP,
          stopSequences: config.stopSequences,
        } : undefined,
      });
      return { text: response.text ?? '', raw: response };
    } catch (error) {
      throw new Error(`Text generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate text with system instructions
   * 
   * @param prompt - Text prompt for generation
   * @param systemInstruction - System instructions to guide the model
   * @param config - Generation configuration options
   * @returns Promise with the generated text
   * 
   * @example
   * ```typescript
   * const response = await gemini.textGeneration.generateWithSystemInstructions(
   *   "Hello there", 
   *   "You are a cat. Your name is Neko."
   * );
   * console.log(response.text);
   * ```
   */
  async generateWithSystemInstructions(
    prompt: string, 
    systemInstruction: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const fullPrompt = `${systemInstruction}\n${prompt}`;
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents: fullPrompt,
        config: config ? {
          maxOutputTokens: config.maxOutputTokens,
          temperature: config.temperature,
          topK: config.topK,
          topP: config.topP,
          stopSequences: config.stopSequences,
        } : undefined,
      });
      return { text: response.text ?? '', raw: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Text generation with system instructions failed: ${errorMessage}`);
    }
  }

  /**
   * Stream generated text from a prompt
   * 
   * @param prompt - Text prompt for generation
   * @param config - Generation configuration options
   * @returns AsyncIterable of response chunks
   * 
   * @example
   * ```typescript
   * const stream = await gemini.textGeneration.streamGenerate("Explain how AI works");
   * for await (const chunk of stream) {
   *   console.log(chunk.text);
   * }
   * ```
   */
  async streamGenerate(prompt: string, config?: GenerationConfig): Promise<AsyncIterable<any>> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const stream = await ai.models.generateContentStream({
        model: config?.model || this.defaultModel,
        contents: prompt,
        config: config ? {
          maxOutputTokens: config.maxOutputTokens,
          temperature: config.temperature,
          topK: config.topK,
          topP: config.topP,
          stopSequences: config.stopSequences,
        } : undefined,
      });
      return stream;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Stream text generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generate text with automatic model and config selection based on prompt complexity
   * @param prompt - Text prompt for generation
   * @param config - Optional generation configuration
   * @returns Promise with the generated text
   * @example
   * ```typescript
   * const response = await gemini.textGeneration.generateAuto("Explain quantum computing simply.");
   * console.log(response.text);
   * ```
   */
  async generateAuto(prompt: string, config?: GenerationConfig): Promise<GenerationResponse> {
    // Simple heuristic: use Pro for long/complex prompts, Flash for short/simple
    const isComplex = prompt.length > 300 || /\b(explain|analyze|compare|summarize|step by step|detailed)\b/i.test(prompt);
    const model = config?.model || (isComplex ? 'gemini-2.5-pro-preview-05-06' : this.defaultModel);
    return this.generate(prompt, { ...config, model });
  }
} 