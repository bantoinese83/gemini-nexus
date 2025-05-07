/**
 * Gemini API SDK - A comprehensive wrapper for Google's Gemini API
 * @packageDocumentation
 */

// Main client export
export { GeminiClient as default } from './services/client';

// Export utility types and enums
export * from './utils/config';
export * from './types';

// Export service interfaces - only include what should be public
export { TextGenerationService } from './services/textGeneration';
export { ChatService } from './services/chat';
export { MultimodalService } from './services/multimodal';
export { ImageGenerationService } from './services/imageGeneration';
export { VideoGenerationService } from './services/videoGeneration';
export { StructuredOutputService } from './services/structuredOutput';
export { ThinkingService } from './services/thinking';
export { FunctionCallingService } from './services/functionCalling';
export { FileService } from './services/fileService';
export { DocumentUnderstandingService } from './services/documentUnderstanding';
export { ImageUnderstandingService } from './services/imageUnderstanding';
export { VideoUnderstandingService } from './services/videoUnderstanding';
export { AudioUnderstandingService } from './services/audioUnderstanding';
export { CodeExecutionService } from './services/codeExecution';
export { SearchGroundingService } from './services/searchGrounding';
export { TokenCounterService } from './services/tokenCounter'; 