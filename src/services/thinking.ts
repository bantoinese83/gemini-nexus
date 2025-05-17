import { GenerationConfig, GenerationResponse, ThinkingConfig } from '../types';

/**
 * Service for working with Gemini's thinking capabilities
 * 
 * Thinking enables Gemini 2.5+ models to use an internal reasoning process
 * during response generation, improving handling of complex tasks.
 */
export class ThinkingService {
  private client: any;
  private defaultModel = 'gemini-2.5-flash-preview-04-17';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Generate a response with thinking enabled
   * 
   * @param prompt - Text prompt for generation
   * @param thinkingBudget - Token budget for thinking (0-24576)
   * @param config - Additional generation configuration
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * const response = await gemini.thinking.generate(
   *   "Solve problem 1 in AIME 2025: Find the sum of all integer bases b > 9 for which 17b is a divisor of 97b.",
   *   1024
   * );
   * console.log(response.text);
   * ```
   */
  async generate(
    prompt: string,
    thinkingBudget: number = 1024,
    config?: Omit<GenerationConfig, 'thinkingConfig'> & { thinkingConfig?: ThinkingConfig }
  ): Promise<GenerationResponse> {
    try {
      const model = this.client.models.get(config?.model || this.defaultModel);
      const thinkingConfig: ThinkingConfig = config?.thinkingConfig || { thinkingBudget };
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...(config && {
          generationConfig: {
            maxOutputTokens: config.maxOutputTokens,
            temperature: config.temperature,
            topK: config.topK,
            topP: config.topP,
            stopSequences: config.stopSequences,
          },
        }),
        thinkingConfig,
      });
      const responseText = response.response?.text() || '';
      return {
        text: responseText,
        raw: response
      };
    } catch (error) {
      throw new Error(`Thinking generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a response with thinking disabled
   * 
   * @param prompt - Text prompt for generation
   * @param config - Additional generation configuration
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * const response = await gemini.thinking.generateWithoutThinking(
   *   "What's the capital of France?"
   * );
   * console.log(response.text);
   * ```
   */
  async generateWithoutThinking(
    prompt: string,
    config?: Omit<GenerationConfig, 'thinkingConfig'>
  ): Promise<GenerationResponse> {
    return this.generate(prompt, 0, config);
  }

  /**
   * Generate a response with maximum thinking budget
   * 
   * @param prompt - Text prompt for generation (should be a complex task)
   * @param config - Additional generation configuration
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * const response = await gemini.thinking.generateWithMaxThinking(
   *   "Write Python code for a web application that visualizes real-time stock market data, including user authentication. Make it as efficient as possible."
   * );
   * console.log(response.text);
   * ```
   */
  async generateWithMaxThinking(
    prompt: string,
    config?: Omit<GenerationConfig, 'thinkingConfig'>
  ): Promise<GenerationResponse> {
    // Use the maximum allowed thinking budget (24576 tokens)
    return this.generate(prompt, 24576, config);
  }

  /**
   * Automatically determine appropriate thinking budget based on task complexity
   * 
   * @param prompt - Text prompt for generation
   * @param config - Additional generation configuration
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * const response = await gemini.thinking.generateAuto(
   *   "Compare and contrast electric cars and hybrid cars."
   * );
   * console.log(response.text);
   * ```
   */
  async generateAuto(
    prompt: string,
    config?: Omit<GenerationConfig, 'thinkingConfig'>
  ): Promise<GenerationResponse> {
    try {
      // Not specifying a thinking budget allows the model to automatically
      // determine how much thinking to use
      const model = this.client.models.get(config?.model || this.defaultModel);
      
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
      throw new Error(`Auto thinking generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 