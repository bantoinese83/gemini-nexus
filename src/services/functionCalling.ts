import { 
  GenerationConfig, 
  GenerationResponse, 
  FunctionDeclaration, 
  FunctionCall, 
  FunctionResponse,
  FunctionCallingMode} from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for function calling capabilities with Gemini models
 *
 * Function calling lets you connect models to external tools and APIs. Instead of generating
 * text responses, the model understands when to call specific functions and provides the necessary
 * parameters to execute real-world actions.
 */
export class FunctionCallingService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Generate content with function calling enabled
   * 
   * @param prompt - Text prompt for generation
   * @param functionDeclarations - Array of function declarations available for the model to use
   * @param config - Additional generation configuration
   * @returns Promise with the generated response and any function calls
   * 
   * @example
   * ```typescript
   * const weatherFunctionDeclaration = {
   *   name: 'get_current_temperature',
   *   description: 'Gets the current temperature for a given location.',
   *   parameters: {
   *     type: SchemaType.OBJECT,
   *     properties: {
   *       location: {
   *         type: SchemaType.STRING,
   *         description: 'The city name, e.g. San Francisco',
   *       },
   *     },
   *     required: ['location'],
   *   },
   * };
   * 
   * const response = await gemini.functionCalling.generate(
   *   "What's the temperature in London?",
   *   [weatherFunctionDeclaration]
   * );
   * 
   * if (response.functionCalls && response.functionCalls.length > 0) {
   *   const functionCall = response.functionCalls[0];
   *   console.log(`Function to call: ${functionCall.name}`);
   *   console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
   * }
   * ```
   */
  async generate(
    prompt: string,
    functionDeclarations: FunctionDeclaration[],
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents: prompt,
        ...(config && {
          generationConfig: {
            maxOutputTokens: config.maxOutputTokens,
            temperature: config.temperature,
            topK: config.topK,
            topP: config.topP,
            stopSequences: config.stopSequences,
          },
          ...(config.thinkingConfig && {
            thinkingConfig: {
              thinkingBudget: config.thinkingConfig.thinkingBudget,
            },
          }),
        })
      });
      const functionCalls = (response.functionCalls || []).map((fc: any) => ({
        name: fc.name ?? '',
        args: fc.args || {}
      })) as import('../types').FunctionCall[];
      return { text: response.text ?? '', functionCalls, raw: response };
    } catch (error) {
      throw new Error(`Function calling generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate content with function calls in a specific mode
   * 
   * @param prompt - Text prompt for generation
   * @param functionDeclarations - Array of function declarations available for the model to use
   * @param mode - Function calling mode (AUTO, ANY, NONE)
   * @param allowedFunctionNames - List of allowed function names (when mode is ANY)
   * @param config - Additional generation configuration
   * @returns Promise with the generated response and any function calls
   * 
   * @example
   * ```typescript
   * const response = await gemini.functionCalling.generateWithMode(
   *   "What's the temperature in London?",
   *   [weatherFunctionDeclaration],
   *   FunctionCallingMode.ANY
   * );
   * ```
   */
  async generateWithMode(
    prompt: string,
    functionDeclarations: FunctionDeclaration[],
    mode: FunctionCallingMode,
    allowedFunctionNames?: string[],
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<GenerationResponse> {
    try {
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
          ...(config.thinkingConfig && {
            thinkingConfig: {
              thinkingBudget: config.thinkingConfig.thinkingBudget,
            },
          }),
        }),
        tools: [{
          functionDeclarations: functionDeclarations
        }],
        toolConfig: {
          functionCallingConfig: {
            mode: mode,
            ...(allowedFunctionNames && { allowedFunctionNames })
          }
        }
      });

      const responseText = response.response?.text() || '';
      
      return {
        text: responseText,
        functionCalls: response.functionCalls,
        raw: response
      };
    } catch (error) {
      throw new Error(`Function calling generation with mode failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Send a function response back to the model to continue the conversation
   * 
   * @param prompt - Original user prompt
   * @param functionDeclarations - Array of function declarations
   * @param functionCall - The function call from the model
   * @param functionResponse - The response from executing the function
   * @param config - Additional generation configuration
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * // First, get a function call from the model
   * const initialResponse = await gemini.functionCalling.generate(
   *   "What's the temperature in London?",
   *   [weatherFunctionDeclaration]
   * );
   * 
   * if (initialResponse.functionCalls && initialResponse.functionCalls.length > 0) {
   *   const functionCall = initialResponse.functionCalls[0];
   *   
   *   // Execute the function (get real weather data)
   *   const result = await getWeatherData(functionCall.args.location);
   *   
   *   // Create a function response
   *   const functionResponse = {
   *     name: functionCall.name,
   *     response: { result }
   *   };
   *   
   *   // Send the function response back to the model
   *   const finalResponse = await gemini.functionCalling.sendFunctionResponse(
   *     "What's the temperature in London?",
   *     [weatherFunctionDeclaration],
   *     functionCall,
   *     functionResponse
   *   );
   *   
   *   console.log(finalResponse.text);
   * }
   * ```
   */
  async sendFunctionResponse(
    prompt: string,
    functionDeclarations: FunctionDeclaration[],
    functionCall: FunctionCall,
    functionResponse: FunctionResponse,
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<GenerationResponse> {
    try {
      // Create a history with the prompt, function call, and function response
      const contents = [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: '', functionCall: functionCall } as any] },
        { role: 'user', parts: [{ text: '', functionResponse: functionResponse } as any] }
      ];
      // Use config if provided (for future extensibility)
      // TODO: Implement real API call using contents and config
      return {
        text: "Function response processed",
        functionCalls: [],
        raw: { contents, config }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Function response handling failed: ${errorMessage}`);
    }
  }

  /**
   * Generate content with multiple function calls in parallel
   * 
   * @param prompt - Text prompt for generation
   * @param functionDeclarations - Array of function declarations
   * @param config - Additional generation configuration
   * @returns Promise with the generated response and any function calls
   * 
   * @example
   * ```typescript
   * const response = await gemini.functionCalling.generateParallel(
   *   "Turn this place into a party!",
   *   [powerDiscoBall, startMusic, dimLights]
   * );
   * 
   * if (response.functionCalls) {
   *   for (const functionCall of response.functionCalls) {
   *     console.log(`Function: ${functionCall.name}`);
   *     console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
   *     // Execute each function with its arguments...
   *   }
   * }
   * ```
   */
  async generateParallel(
    prompt: string,
    functionDeclarations: FunctionDeclaration[],
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<GenerationResponse> {
    // Force the model to call 'any' function
    return this.generateWithMode(
      prompt,
      functionDeclarations,
      FunctionCallingMode.ANY,
      undefined,
      config
    );
  }

  /**
   * Handle function response by adding it to the chat history
   * 
   * @param functionName - Name of the function that was called
   * @param functionResponse - Response from the function call
   * @param chat - Chat session to update
   * @param config - Additional generation configuration
   * @returns Promise with updated chat session
   */
  async handleFunctionResponse(
    functionName: string,
    functionResponse: any,
    chat: any,
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<any> {
    try {
      const lastHistory = chat.getHistory();
      // Add function call and response to history
      const updatedHistory = [
        ...lastHistory,
        { role: 'model', parts: [{ text: '', functionCall: { name: functionName, args: {} } }] as any },
        { role: 'user', parts: [{ text: '', functionResponse: { name: functionName, response: { result: functionResponse } } }] as any }
      ];
      // Use config if provided (for future extensibility)
      // Create a new chat with the updated history
      const newChat = this.client.chat({
        model: this.defaultModel,
        history: updatedHistory,
        ...(config && { config })
      });
      return newChat;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Function response handling failed: ${errorMessage}`);
    }
  }

  /**
   * Generate content with automatic model/config selection for function calling
   * @param prompt - Text prompt for generation
   * @param functionDeclarations - Array of function declarations
   * @param config - Optional generation configuration
   * @returns Promise with the generated response and any function calls
   * @example
   * ```typescript
   * const response = await gemini.functionCalling.generateAuto("Get weather info", [weatherFn]);
   * console.log(response.text);
   * ```
   */
  async generateAuto(
    prompt: string,
    functionDeclarations: FunctionDeclaration[],
    config?: Omit<GenerationConfig, 'tools' | 'toolConfig'>
  ): Promise<GenerationResponse> {
    const isComplex = prompt.length > 300 || functionDeclarations.length > 2;
    const model = config?.model || (isComplex ? 'gemini-2.5-pro-preview-05-06' : this.defaultModel);
    const response = await this.client.models.generateContent({
      model,
      contents: prompt
    });
    // Map functionCalls to your own type, ensuring name is always a string
    const functionCalls = (response.functionCalls || []).map((fc: any) => ({
      name: fc.name ?? '',
      args: fc.args || {}
    })) as import('../types').FunctionCall[];
    return { text: response.text ?? '', functionCalls, raw: response };
  }
} 