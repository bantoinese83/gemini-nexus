import { TextGenerationService } from './textGeneration';
import { ChatService } from './chat';
import { MultimodalService } from './multimodal';
import { ImageGenerationService } from './imageGeneration';
import { VideoGenerationService } from './videoGeneration';
import { StructuredOutputService } from './structuredOutput';
import { ThinkingService } from './thinking';
import { FunctionCallingService } from './functionCalling';
import { FileService } from './fileService';
import { DocumentUnderstandingService } from './documentUnderstanding';
import { ImageUnderstandingService } from './imageUnderstanding';
import { VideoUnderstandingService } from './videoUnderstanding';
import { AudioUnderstandingService } from './audioUnderstanding';
import { CodeExecutionService } from './codeExecution';
import { SearchGroundingService } from './searchGrounding';
import { TokenCounterService } from './tokenCounter';
import * as Types from '../types';

/**
 * Main client for the Gemini API SDK
 */
export class GeminiClient {
  private client: any;
  private debug: boolean;
  public textGeneration: TextGenerationService;
  public chat: ChatService;
  public multimodal: MultimodalService;
  public imageGeneration: ImageGenerationService;
  public videoGeneration: VideoGenerationService;
  public structuredOutput: StructuredOutputService;
  public thinking: ThinkingService;
  public functionCalling: FunctionCallingService;
  public files: FileService;
  public documentUnderstanding: DocumentUnderstandingService;
  public imageUnderstanding: ImageUnderstandingService;
  public videoUnderstanding: VideoUnderstandingService;
  public audioUnderstanding: AudioUnderstandingService;
  public codeExecution: CodeExecutionService;
  public searchGrounding: SearchGroundingService;
  public tokenCounter: TokenCounterService;

  /**
   * Create a new GeminiClient
   * 
   * @param apiKey - Gemini API key for authentication
   * @param debug - Enable debug logging (default: false)
   */
  constructor(apiKey: string, debug: boolean = false) {
    this.client = { apiKey };
    this.debug = debug;
    
    // Initialize services
    this.textGeneration = new TextGenerationService(this.client);
    this.chat = new ChatService(this.client);
    this.multimodal = new MultimodalService(this.client);
    this.imageGeneration = new ImageGenerationService(this.client);
    this.videoGeneration = new VideoGenerationService(this.client);
    this.structuredOutput = new StructuredOutputService(this.client);
    this.thinking = new ThinkingService(this.client);
    this.functionCalling = new FunctionCallingService(this.client);
    this.files = new FileService(this.client);
    this.documentUnderstanding = new DocumentUnderstandingService(this.client);
    this.imageUnderstanding = new ImageUnderstandingService(this.client);
    this.videoUnderstanding = new VideoUnderstandingService(this.client);
    this.audioUnderstanding = new AudioUnderstandingService(this.client);
    this.codeExecution = new CodeExecutionService(this.client);
    this.searchGrounding = new SearchGroundingService(this.client);
    this.tokenCounter = new TokenCounterService(this.client);

    // Patch all services to log if debug is enabled
    if (this.debug) {
      for (const key of Object.keys(this)) {
        const service = (this as any)[key];
        if (service && typeof service === 'object') {
          for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(service))) {
            if (typeof service[method] === 'function' && method !== 'constructor') {
              const orig = service[method].bind(service);
              service[method] = async (...args: any[]) => {
                console.log(`[GeminiClient DEBUG] Calling ${key}.${method} with:`, ...args);
                const result = await orig(...args);
                console.log(`[GeminiClient DEBUG] Result from ${key}.${method}:`, result);
                return result;
              };
            }
          }
        }
      }
    }
  }

  /**
   * Get available models
   * 
   * @returns Promise with list of available models
   */
  async listModels() {
    try {
      // We need to implement this based on the available models in the API
      return [
        'gemini-2.5-pro-preview-05-06',
        'gemini-2.5-flash-preview-04-17',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.0-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b'
      ];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to list models: ${errorMessage}`);
    }
  }

  /**
   * Suggest the best model for a given task type
   * @param taskType - Task type (e.g., 'text', 'code', 'image', 'video', 'multimodal', 'chat', 'grounding')
   * @returns Model name string
   * @example
   * ```typescript
   * const model = gemini.suggestModelForTask('code');
   * console.log(model); // e.g., 'gemini-2.5-pro-preview-05-06'
   * ```
   */
  suggestModelForTask(taskType: string): string {
    switch (taskType.toLowerCase()) {
      case 'text':
        return 'gemini-2.5-pro-preview-05-06';
      case 'code':
        return 'gemini-2.5-pro-preview-05-06';
      case 'image':
        return 'gemini-2.0-flash-exp-image-generation';
      case 'video':
        return 'veo-2.0-generate-001';
      case 'multimodal':
        return 'gemini-2.5-flash-preview-04-17';
      case 'chat':
        return 'gemini-2.5-pro-preview-05-06';
      case 'grounding':
        return 'gemini-1.5-flash';
      default:
        return 'gemini-2.0-flash';
    }
  }
}

// Export all public types for developer use
export type { Types }; 