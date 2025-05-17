import { GoogleGenAI } from "@google/genai";
import { 
  ChatMessage, 
  GenerationConfig, 
  GenerationResponse, 
  FunctionDeclaration
} from '../types';

/**
 * Service for multi-turn chat conversations with Gemini models
 */
export class ChatService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Create a new chat session
   * 
   * @param config - Generation configuration options
   * @param history - Initial chat history
   * @returns Chat session object
   * 
   * @example
   * ```typescript
   * const chat = gemini.chat.createChat();
   * const response1 = await chat.sendMessage("Hello");
   * console.log(response1.text);
   * ```
   */
  createChat(config?: GenerationConfig, history?: ChatMessage[]) {
    const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
    const chat = ai.chats.create({
      model: config?.model || this.defaultModel,
      history: history || [],
    });
    return {
      sendMessage: async (message: string) => {
        try {
          const response = await chat.sendMessage({ message });
          return { text: response.text ?? '', raw: response };
        } catch (error) {
          throw new Error(`Failed to send message: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      sendMessageStream: async (message: string) => {
        try {
          const stream = await chat.sendMessageStream({ message });
          return stream;
        } catch (error) {
          throw new Error(`Failed to stream message: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      getHistory: () => chat.getHistory(),
    };
  }

  /**
   * Send a single message in a stateless manner
   * 
   * @param message - The message to send
   * @param history - Previous conversation history
   * @param config - Generation configuration options
   * @returns Promise with the response
   * 
   * @example
   * ```typescript
   * const response = await gemini.chat.sendMessage("How many planets are there?");
   * console.log(response.text);
   * ```
   */
  async sendMessage(
    message: string, 
    history?: ChatMessage[], 
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    const chat = this.createChat(config, history);
    return chat.sendMessage(message);
  }

  /**
   * Create a chat with function calling capabilities
   * 
   * @param functionDeclarations - Array of function declarations
   * @param config - Generation configuration options
   * @param history - Initial chat history
   * @returns Chat session object with function calling support
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
   * const chat = gemini.chat.createFunctionCallingChat([weatherFunctionDeclaration]);
   * const response = await chat.sendMessage("What's the temperature in London?");
   * 
   * if (response.functionCalls && response.functionCalls.length > 0) {
   *   const functionCall = response.functionCalls[0];
   *   // Get actual weather data
   *   const weatherData = await getWeatherData(functionCall.args.location);
   *   // Send function result back to the conversation
   *   const finalResponse = await chat.sendFunctionResponse(functionCall, weatherData);
   *   console.log(finalResponse.text);
   * }
   * ```
   */
  createFunctionCallingChat(
    functionDeclarations: FunctionDeclaration[],
    config?: Omit<GenerationConfig, 'tools'>,
    history?: ChatMessage[]
  ) {
    const fullConfig: GenerationConfig = {
      ...config,
      tools: [{
        functionDeclarations
      }]
    };
    
    return this.createChat(fullConfig, history);
  }
} 