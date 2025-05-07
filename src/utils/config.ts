/**
 * Available Gemini models
 */
export enum GeminiModel {
  /** Gemini 2.5 Pro Preview - advanced capabilities for coding, reasoning, multimodal */
  PRO_25_PREVIEW = 'gemini-2.5-pro-preview-05-06',
  /** Gemini 2.5 Flash Preview - optimized for large scale processing with thinking */
  FLASH_25_PREVIEW = 'gemini-2.5-flash-preview-04-17',
  /** Gemini Flash 2.0 - optimized for fast responses */
  FLASH = 'gemini-2.0-flash',
  /** Gemini Flash 2.0 Lite - cost-effective variant for long context */
  FLASH_LITE = 'gemini-2.0-flash-lite',
  /** Gemini Pro 2.0 - balanced model for most use cases */
  PRO = 'gemini-2.0-pro',
  /** Gemini Ultra 2.0 - highest capability model */
  ULTRA = 'gemini-2.0-ultra',
  /** Gemini 1.5 Pro - multimodal model for images, audio, video */
  PRO_VISION = 'gemini-1.5-pro',
  /** Gemini 1.5 Flash - fast multimodal model */
  FLASH_VISION = 'gemini-1.5-flash',
  /** Gemini 1.5 Flash 8B - compact, efficient model for low latency */
  FLASH_8B = 'gemini-1.5-flash-8b',
  /** Gemini Flash 2.0 Experimental - for image generation */
  FLASH_IMAGE_GEN = 'gemini-2.0-flash-exp-image-generation'
}

/**
 * Available Imagen models
 */
export enum ImagenModel {
  /** Imagen 3.0 - high-quality image generation */
  IMAGEN_3 = 'imagen-3.0-generate-002'
}

/**
 * Available Veo models
 */
export enum VeoModel {
  /** Veo 2.0 - high-quality video generation */
  VEO_2 = 'veo-2.0-generate-001'
}

/**
 * Default generation parameters
 */
export const DEFAULT_GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024
};

/**
 * Supported image aspect ratios
 */
export const IMAGE_ASPECT_RATIOS = [
  '1:1',   // Square (default)
  '4:3',   // Fullscreen
  '3:4',   // Portrait fullscreen
  '16:9',  // Widescreen
  '9:16'   // Portrait
];

/**
 * Supported video aspect ratios
 */
export const VIDEO_ASPECT_RATIOS = [
  '16:9',  // Widescreen (default)
  '9:16'   // Portrait
];

/**
 * Supported video durations (in seconds)
 */
export const VIDEO_DURATIONS = {
  MIN: 5,
  MAX: 8,
  DEFAULT: 5
};

/**
 * Helper to validate API key format
 * @param apiKey - Gemini API key to validate
 * @returns Boolean indicating if the key format is valid
 */
export function isValidApiKey(apiKey: string): boolean {
  // Basic validation - real implementation would be more sophisticated
  return Boolean(apiKey && apiKey.length > 10 && apiKey.startsWith('AI'));
}

/**
 * Helper to determine if a model supports multimodal inputs
 * @param model - The model name to check
 * @returns Boolean indicating if the model supports multimodal inputs
 */
export function isMultimodalModel(model: string): boolean {
  return [
    GeminiModel.PRO_25_PREVIEW,
    GeminiModel.FLASH_25_PREVIEW,
    GeminiModel.PRO_VISION,
    GeminiModel.FLASH_VISION,
    GeminiModel.FLASH,
    GeminiModel.FLASH_LITE,
    GeminiModel.FLASH_8B,
    GeminiModel.ULTRA,
    GeminiModel.FLASH_IMAGE_GEN
  ].includes(model as GeminiModel);
}

/**
 * Helper to determine if a model supports image generation
 * @param model - The model name to check
 * @returns Boolean indicating if the model supports image generation
 */
export function isImageGenerationModel(model: string): boolean {
  return [
    GeminiModel.FLASH_IMAGE_GEN,
    ImagenModel.IMAGEN_3
  ].includes(model as GeminiModel | ImagenModel);
}

/**
 * Helper to determine if a model supports video generation
 * @param model - The model name to check
 * @returns Boolean indicating if the model supports video generation
 */
export function isVideoGenerationModel(model: string): boolean {
  return [
    VeoModel.VEO_2
  ].includes(model as VeoModel);
} 