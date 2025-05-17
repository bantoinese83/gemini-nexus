import { 
  GenerationConfig, 
  GenerationResponse, 
  DynamicRetrievalConfigMode, 
  DynamicRetrievalConfig
} from '../types';

/**
 * Service for Google Search grounding with Gemini models
 * 
 * This service provides methods for improving the accuracy and recency of responses
 * using Google Search grounding, which returns supporting links and search suggestions
 * to enable more factual responses.
 */
export class SearchGroundingService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Generate content using Google Search as a tool (Gemini 2.0+)
   * 
   * Allows the model to decide when to use Google Search to ground its responses.
   * 
   * @param prompt - Text prompt for generation
   * @param config - Generation configuration options
   * @returns Promise with the generation results including search grounding data
   * 
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generate(
   *   "Who individually won the most bronze medals during the Paris olympics in 2024?"
   * );
   * 
   * console.log("Response:", response.text);
   * 
   * // Get search suggestions HTML to display
   * if (response.groundingMetadata) {
   *   const searchSuggestionsHTML = response.groundingMetadata.searchEntryPoint.renderedContent;
   *   console.log("Search Suggestions HTML:", searchSuggestionsHTML);
   * }
   * ```
   */
  async generate(
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const model = this.client.models.get(config?.model || this.defaultModel);
      
      // Configure Google Search as a tool
      const response = await model.generateContent({
        contents: [{ text: prompt }],
        config: {
          tools: [{ googleSearch: {} }],
          ...(config && {
            generationConfig: {
              maxOutputTokens: config.maxOutputTokens,
              temperature: config.temperature,
              topK: config.topK,
              topP: config.topP,
              stopSequences: config.stopSequences,
            },
          }),
        }
      });
      
      const text = response.text();
      
      // Extract grounding metadata if present
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;
      
      return {
        text,
        groundingMetadata,
        raw: response
      };
    } catch (error) {
      throw new Error(`Google Search grounding generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate content using Google Search retrieval (Gemini 1.5 only)
   * 
   * Uses Google Search retrieval to ground responses in search results.
   * 
   * @param prompt - Text prompt for generation
   * @param config - Generation configuration options
   * @returns Promise with the generation results including search grounding data
   * 
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generateWithRetrieval(
   *   "Who individually won the most silver medals during the Paris olympics in 2024?",
   *   { model: "gemini-1.5-flash" }
   * );
   * 
   * console.log("Response:", response.text);
   * 
   * // Get search suggestions HTML to display
   * if (response.groundingMetadata) {
   *   const searchSuggestionsHTML = response.groundingMetadata.searchEntryPoint.renderedContent;
   *   console.log("Search Suggestions HTML:", searchSuggestionsHTML);
   * }
   * ```
   */
  async generateWithRetrieval(
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      // Ensure a compatible model is used - only works with 1.5 models
      const modelName = config?.model || 'gemini-1.5-flash';
      if (!modelName.includes('1.5')) {
        throw new Error('Google Search retrieval is only compatible with Gemini 1.5 models');
      }
      
      const model = this.client.models.get(modelName);
      
      // Configure Google Search retrieval
      const response = await model.generateContent({
        contents: [{ text: prompt }],
        config: {
          tools: [{ googleSearchRetrieval: {} }],
          ...(config && {
            generationConfig: {
              maxOutputTokens: config.maxOutputTokens,
              temperature: config.temperature,
              topK: config.topK,
              topP: config.topP,
              stopSequences: config.stopSequences,
            },
          }),
        }
      });
      
      const text = response.text();
      
      // Extract grounding metadata if present
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;
      
      return {
        text,
        groundingMetadata,
        raw: response
      };
    } catch (error) {
      throw new Error(`Google Search retrieval generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate content using dynamic retrieval with Google Search (Gemini 1.5 Flash only)
   * 
   * Allows configuring when to use Google Search based on a confidence threshold.
   * 
   * @param prompt - Text prompt for generation
   * @param dynamicThreshold - Threshold for determining when to use grounding (0.0-1.0, default: 0.3)
   * @param config - Generation configuration options
   * @returns Promise with the generation results including search grounding data
   * 
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generateWithDynamicRetrieval(
   *   "Who individually won the most gold medals during the Paris olympics in 2024?",
   *   0.5,
   *   { model: "gemini-1.5-flash" }
   * );
   * 
   * console.log("Response:", response.text);
   * 
   * // Get search suggestions HTML to display
   * if (response.groundingMetadata) {
   *   const searchSuggestionsHTML = response.groundingMetadata.searchEntryPoint.renderedContent;
   *   console.log("Search Suggestions HTML:", searchSuggestionsHTML);
   * }
   * ```
   */
  async generateWithDynamicRetrieval(
    prompt: string,
    dynamicThreshold: number = 0.3,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      // Ensure a compatible model is used - only works with Gemini 1.5 Flash
      const modelName = config?.model || 'gemini-1.5-flash';
      if (modelName !== 'gemini-1.5-flash') {
        throw new Error('Dynamic retrieval is only compatible with gemini-1.5-flash model');
      }
      
      const model = this.client.models.get(modelName);
      
      // Configure dynamic retrieval
      const dynamicRetrievalConfig: DynamicRetrievalConfig = {
        dynamicThreshold,
        mode: DynamicRetrievalConfigMode.MODE_DYNAMIC
      };
      
      const response = await model.generateContent({
        contents: [{ text: prompt }],
        config: {
          tools: [{
            googleSearchRetrieval: {
              dynamicRetrievalConfig
            }
          }],
          ...(config && {
            generationConfig: {
              maxOutputTokens: config.maxOutputTokens,
              temperature: config.temperature,
              topK: config.topK,
              topP: config.topP,
              stopSequences: config.stopSequences,
            },
          }),
        }
      });
      
      const text = response.text();
      
      // Extract grounding metadata if present
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;
      
      return {
        text,
        groundingMetadata,
        raw: response
      };
    } catch (error) {
      throw new Error(`Dynamic retrieval generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate content in a chat session with Google Search as a tool (Gemini 2.0+)
   * 
   * @param chatHistory - Previous chat messages
   * @param prompt - Text prompt for the current message
   * @param config - Generation configuration options
   * @returns Promise with the generation results including search grounding data
   * 
   * @example
   * ```typescript
   * const chatHistory = [
   *   {
   *     role: 'user',
   *     parts: [{ text: 'I have some questions about recent events.' }]
   *   },
   *   {
   *     role: 'model',
   *     parts: [{ text: 'Sure, I\'d be happy to help with recent events.' }]
   *   }
   * ];
   * 
   * const response = await gemini.searchGrounding.generateInChat(
   *   chatHistory,
   *   "Who won the most recent Formula 1 Grand Prix?"
   * );
   * 
   * console.log("Response:", response.text);
   * ```
   */
  async generateInChat(
    chatHistory: Array<{role: string, parts: Array<{text?: string}>}>,
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      // Create a chat session
      const chat = this.client.chats.create({
        model: config?.model || this.defaultModel,
        history: chatHistory,
        config: {
          tools: [{ googleSearch: {} }],
          ...(config && {
            generationConfig: {
              maxOutputTokens: config.maxOutputTokens,
              temperature: config.temperature,
              topK: config.topK,
              topP: config.topP,
              stopSequences: config.stopSequences,
            },
          }),
        }
      });
      
      // Send the message
      const response = await chat.sendMessage({ message: prompt });
      
      const text = response.text() || '';
      
      // Extract grounding metadata if present
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;
      
      return {
        text,
        groundingMetadata,
        raw: response
      };
    } catch (error) {
      throw new Error(`Google Search grounding in chat failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get rendered HTML for Google Search suggestions
   * 
   * @param response - Generation response that includes grounding metadata
   * @returns HTML string for rendering search suggestions UI or null if not available
   * 
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generate(
   *   "What's the latest Mars rover mission?"
   * );
   * 
   * const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(response);
   * if (suggestionsHTML) {
   *   // Render the HTML in your application
   *   document.getElementById('search-suggestions').innerHTML = suggestionsHTML;
   * }
   * ```
   */
  getSearchSuggestionsHTML(response: GenerationResponse): string | null {
    if (response.groundingMetadata?.searchEntryPoint?.renderedContent) {
      return response.groundingMetadata.searchEntryPoint.renderedContent;
    }
    return null;
  }

  /**
   * Get web search queries used for grounding
   * 
   * @param response - Generation response that includes grounding metadata
   * @returns Array of search queries or empty array if not available
   * 
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generate(
   *   "What's the latest Mars rover mission?"
   * );
   * 
   * const searchQueries = gemini.searchGrounding.getWebSearchQueries(response);
   * console.log("Search queries used:", searchQueries);
   * ```
   */
  getWebSearchQueries(response: GenerationResponse): string[] {
    return response.groundingMetadata?.webSearchQueries || [];
  }

  /**
   * Generate content with automatic model/config selection for search grounding
   * @param prompt - Text prompt for generation
   * @param config - Optional generation configuration
   * @returns Promise with the generation results including search grounding data
   * @example
   * ```typescript
   * const response = await gemini.searchGrounding.generateAuto("Who won the most medals in 2024 Olympics?");
   * console.log(response.text);
   * ```
   */
  async generateAuto(
    prompt: string,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    // Use 1.5-flash for grounding, 2.0-flash for general, 2.5 for complex
    const isComplex = prompt.length > 300 || /\b(latest|recent|news|search|find|lookup)\b/i.test(prompt);
    let model = config?.model;
    if (!model) {
      if (/\b(search|lookup|ground|fact|news|recent)\b/i.test(prompt)) {
        model = 'gemini-1.5-flash';
      } else if (isComplex) {
        model = 'gemini-2.5-flash-preview-04-17';
      } else {
        model = this.defaultModel;
      }
    }
    return this.generate(prompt, { ...config, model });
  }
} 