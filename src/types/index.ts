/**
 * Client options for initializing the Gemini SDK
 */
export interface ClientOptions {
  /** Base URL for API requests */
  apiEndpoint?: string;
  /** Timeout for API requests in milliseconds */
  timeout?: number;
}

/**
 * Configuration for thinking capabilities in Gemini 2.5+ models
 */
export interface ThinkingConfig {
  /** Token budget for thinking (0-24576). Setting to 0 disables thinking. */
  thinkingBudget?: number;
}

/**
 * Function calling mode for the model
 */
export enum FunctionCallingMode {
  /** Model decides whether to call functions or respond with text */
  AUTO = 'auto',
  /** Model is forced to call a function */
  ANY = 'any',
  /** Model is prevented from calling functions */
  NONE = 'none'
}

/**
 * Dynamic retrieval mode for Google Search retrieval
 */
export enum DynamicRetrievalConfigMode {
  /** Unspecified mode */
  MODE_UNSPECIFIED = 'MODE_UNSPECIFIED',
  /** Dynamic mode allows the model to decide when to use grounding */
  MODE_DYNAMIC = 'MODE_DYNAMIC',
  /** Always use grounding */
  MODE_ALWAYS = 'MODE_ALWAYS'
}

/**
 * Configuration for dynamic retrieval when using Google Search
 */
export interface DynamicRetrievalConfig {
  /** Threshold for determining when to use grounding (0.0-1.0) */
  dynamicThreshold?: number;
  /** Mode for dynamic retrieval */
  mode?: DynamicRetrievalConfigMode;
}

/**
 * Configuration for Google Search retrieval
 */
export interface GoogleSearchRetrievalConfig {
  /** Dynamic retrieval configuration */
  dynamicRetrievalConfig?: DynamicRetrievalConfig;
}

/**
 * Configuration for Google Search as a tool
 */
export interface GoogleSearchConfig {
  /** Optional configuration for Google Search */
  [key: string]: any;
}

/**
 * Configuration for function calling
 */
export interface FunctionCallingConfig {
  /** Function calling mode */
  mode?: FunctionCallingMode;
  /** List of allowed function names (when mode is ANY) */
  allowedFunctionNames?: string[];
}

/**
 * Tool config for function calling
 */
export interface ToolConfig {
  /** Function calling configuration */
  functionCallingConfig?: FunctionCallingConfig;
}

/**
 * Function declaration parameter schema
 */
export interface FunctionParameter {
  /** Parameter description */
  description: string;
  /** Parameter type */
  type: SchemaType;
  /** Enum values for string parameters */
  enum?: string[];
  /** Schema for items in an array */
  items?: {
    type: SchemaType;
  };
}

/**
 * Function declaration parameters
 */
export interface FunctionParameters {
  /** Parameter type (usually 'object') */
  type: SchemaType;
  /** Properties of the function parameters */
  properties: {
    [key: string]: FunctionParameter;
  };
  /** Required parameter names */
  required?: string[];
}

/**
 * Function declaration for function calling
 */
export interface FunctionDeclaration {
  /** Name of the function */
  name: string;
  /** Description of what the function does */
  description: string;
  /** Parameters the function accepts */
  parameters: FunctionParameters;
}

/**
 * Function call response from the model
 */
export interface FunctionCall {
  /** Name of the function to call */
  name: string;
  /** Arguments to pass to the function */
  args: {
    [key: string]: any;
  };
}

/**
 * Function response after executing a function
 */
export interface FunctionResponse {
  /** Name of the function that was called */
  name: string;
  /** Response from the function execution */
  response: {
    /** Result data from the function */
    result: any;
  };
}

/**
 * Tool for function declaration
 */
export interface Tool {
  /** Function declarations */
  functionDeclarations?: FunctionDeclaration[];
  /** Google Search retrieval tool (for Gemini 1.5 only) */
  googleSearchRetrieval?: GoogleSearchRetrievalConfig;
  /** Google Search tool (for Gemini 2.0+) */
  googleSearch?: GoogleSearchConfig;
  /** Code execution tool */
  codeExecution?: any;
}

/**
 * File state in the Gemini File API
 */
export enum FileState {
  /** File state is unknown */
  UNKNOWN = 'UNKNOWN',
  /** File is being processed */
  PROCESSING = 'PROCESSING',
  /** File processing has completed successfully */
  PROCESSED = 'PROCESSED',
  /** File is ready to be used */
  ACTIVE = 'ACTIVE',
  /** File processing has failed */
  FAILED = 'FAILED'
}

/**
 * Metadata for a file uploaded to the Gemini File API
 */
export interface FileMetadata {
  /** Unique name of the file */
  name: string;
  /** URI for accessing the file content */
  uri?: string;
  /** MIME type of the file */
  mimeType?: string;
  /** Display name of the file */
  displayName?: string;
  /** Size of the file in bytes */
  sizeBytes?: number;
  /** Current state of the file */
  state?: FileState;
  /** Creation time */
  createTime?: string;
  /** Update time */
  updateTime?: string;
  /** Expiration time */
  expireTime?: string;
}

/**
 * Configuration for file upload
 */
export interface FileUploadConfig {
  /** Display name for the file */
  displayName?: string;
  /** MIME type of the file */
  mimeType?: string;
}

/**
 * Options for uploading a file
 */
export interface FileUploadOptions {
  /** The file to upload (Blob, Buffer, file path) */
  file: Blob | Buffer | string;
  /** Configuration options for the upload */
  config?: FileUploadConfig;
}

/**
 * Options for retrieving a file
 */
export interface FileGetOptions {
  /** Name of the file to retrieve */
  name: string;
}

/**
 * Options for listing files
 */
export interface FileListOptions {
  /** Configuration for listing files */
  config?: {
    /** Maximum number of files to return */
    pageSize?: number;
    /** Page token for pagination */
    pageToken?: string;
  };
}

/**
 * File list response
 */
export interface FileListResponse {
  /** List of files */
  files: FileMetadata[];
  /** Next page token for pagination */
  nextPageToken?: string;
}

/**
 * Options for deleting a file
 */
export interface FileDeleteOptions {
  /** Name of the file to delete */
  name: string;
}

/**
 * Inline data content
 */
export interface InlineData {
  /** MIME type of the data */
  mimeType: string;
  /** Base64-encoded data */
  data: string;
}

/**
 * File part for multimodal prompts
 */
export interface FilePart {
  /** File URI */
  fileUri: string;
  /** MIME type of the file */
  mimeType: string;
}

/**
 * Extended content types for document understanding
 */
export interface ExtendedContent extends Content {
  /** Inline data content (e.g., base64-encoded PDF) */
  inlineData?: InlineData;
  /** File reference for large files */
  fileData?: FilePart;
}

/**
 * Document processing options
 */
export interface DocumentProcessingOptions {
  /** Whether to extract text from the document */
  extractText?: boolean;
  /** Whether to preserve layout during extraction */
  preserveLayout?: boolean;
  /** Whether to include images in processing */
  includeImages?: boolean;
  /** Number of pages to process (null for all pages) */
  pageLimit?: number | null;
}

/**
 * Configuration options for text generation
 */
export interface GenerationConfig {
  /** The maximum number of tokens to generate */
  maxOutputTokens?: number;
  /** Temperature controls randomness (0.0-1.0) */
  temperature?: number;
  /** Top-k sampling parameter */
  topK?: number;
  /** Top-p sampling parameter */
  topP?: number;
  /** Stop sequences for generation */
  stopSequences?: string[];
  /** Model to use for generation */
  model?: string;
  /** Configuration for thinking capabilities */
  thinkingConfig?: ThinkingConfig;
  /** Tools to use with the model */
  tools?: Tool[];
  /** Tool configuration options */
  toolConfig?: ToolConfig;
  /** Document processing options */
  documentProcessing?: DocumentProcessingOptions;
}

/**
 * Content for prompting the model
 */
export interface Content {
  /** Text content */
  text?: string;
  /** Image content as base64 or URL */
  image?: string;
  /** Audio content as base64 or URL */
  audio?: string;
  /** Video content as base64 or URL */
  video?: string;
}

/**
 * System instructions for the model
 */
export interface SystemInstruction {
  /** Text instructions to guide model behavior */
  text: string;
}

/**
 * Chat message format
 */
export interface ChatMessage {
  /** Role of the message sender (user or model) */
  role: 'user' | 'model' | 'system';
  /** Content parts of the message */
  parts: Content[];
}

/**
 * Chat history for continuing conversations
 */
export interface ChatHistory {
  /** Array of previous messages */
  messages: ChatMessage[];
}

/**
 * Web information chunk from grounding
 */
export interface WebChunk {
  /** URI to the content that was used for grounding */
  uri: string;
  /** Title of the web content */
  title: string;
}

/**
 * Grounding text segment in the response
 */
export interface GroundingSegment {
  /** Start index of the segment in the text */
  startIndex?: number;
  /** End index of the segment in the text */
  endIndex: number;
  /** Text content of the segment */
  text: string;
}

/**
 * Grounding support information for a text segment
 */
export interface GroundingSupport {
  /** The segment that is grounded */
  segment: GroundingSegment;
  /** Indices of the grounding chunks used for this segment */
  groundingChunkIndices: number[];
  /** Confidence scores for each grounding source */
  confidenceScores: number[];
}

/**
 * Search entry point data with rendered HTML
 */
export interface SearchEntryPoint {
  /** HTML/CSS for rendering Google Search Suggestions UI */
  renderedContent: string;
}

/**
 * Grounding metadata for search-grounded responses
 */
export interface GroundingMetadata {
  /** Search entry point data */
  searchEntryPoint: SearchEntryPoint;
  /** Chunks of web information used for grounding */
  groundingChunks: Array<{web: WebChunk}>;
  /** Information about which parts of the response are grounded */
  groundingSupports: GroundingSupport[];
  /** Search queries that were used for grounding */
  webSearchQueries: string[];
}

/**
 * Usage metadata for token counting
 */
export interface UsageMetadata {
  /** Total number of tokens used in the request and response */
  totalTokenCount: number;
  /** Number of tokens used in the prompt */
  promptTokenCount: number;
  /** Number of tokens used in the candidates */
  candidatesTokenCount: number;
}

/**
 * Response from the text generation API
 */
export interface GenerationResponse {
  /** Generated text */
  text: string;
  /** Function calls from the model */
  functionCalls?: FunctionCall[];
  /** Grounding metadata if search grounding was used */
  groundingMetadata?: GroundingMetadata;
  /** Token usage information */
  usageMetadata?: UsageMetadata;
  /** Raw response from the API */
  raw: any;
}

/**
 * Aspect ratios for image generation
 */
export type ImageAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

/**
 * Person generation options for Imagen model
 */
export type PersonGeneration = "DONT_ALLOW" | "ALLOW_ADULT";

/**
 * Options specific to Imagen image generation
 */
export interface ImagenOptions {
  /** Number of images to generate (1-4) */
  numberOfImages?: number;
  /** Aspect ratio of the generated images */
  aspectRatio?: ImageAspectRatio;
  /** Whether to allow generating images with people */
  personGeneration?: PersonGeneration;
  /** Base filename for saving generated images */
  baseFilename?: string;
}

/**
 * Response from the image generation API
 */
export interface ImageGenerationResponse {
  /** Path to the generated image file */
  imagePath: string;
  /** Any text that was generated alongside the image */
  text?: string;
  /** Whether the image was successfully generated */
  success: boolean;
  /** Raw response from the API */
  raw: any;
}

/**
 * Aspect ratios for video generation
 */
export type VideoAspectRatio = "16:9" | "9:16";

/**
 * Person generation options for video generation
 */
export type VideoPersonGeneration = "dont_allow" | "allow_adult";

/**
 * Options specific to Veo video generation from text
 */
export interface VideoGenerationOptions {
  /** Whether to allow generating videos with people */
  personGeneration?: VideoPersonGeneration;
  /** Aspect ratio of the generated video */
  aspectRatio?: VideoAspectRatio;
  /** Number of videos to generate (1-2) */
  numberOfVideos?: 1 | 2;
  /** Duration of the video in seconds (5-8) */
  durationSeconds?: number;
  /** Text string that describes anything you want to discourage the model from generating */
  negativePrompt?: string;
  /** Enable or disable the prompt rewriter */
  enhancePrompt?: boolean;
  /** API key for direct download */
  apiKey?: string;
}

/**
 * Options specific to Veo video generation from image
 */
export interface ImageToVideoOptions {
  /** Aspect ratio of the generated video */
  aspectRatio?: VideoAspectRatio;
  /** Number of videos to generate (1-2) */
  numberOfVideos?: 1 | 2;
  /** Duration of the video in seconds (5-8) */
  durationSeconds?: number;
  /** Text string that describes anything you want to discourage the model from generating */
  negativePrompt?: string;
  /** Enable or disable the prompt rewriter */
  enhancePrompt?: boolean;
  /** API key for direct download */
  apiKey?: string;
}

/**
 * Options specific to Imagen-to-Video generation
 */
export interface ImagenToVideoOptions extends ImageToVideoOptions {
  /** Whether to save the generated image */
  saveImage?: boolean;
  /** Path to save the generated image */
  imageOutputPath?: string;
}

/**
 * Response from the video generation API
 */
export interface VideoGenerationResponse {
  /** Paths to the generated video files */
  videoPaths: string[];
  /** Path to the generated image file (if applicable) */
  imagePath?: string;
  /** Whether the video was successfully generated */
  success: boolean;
  /** Raw response from the API */
  raw: any;
}

/**
 * OpenAPI schema data types
 */
export enum SchemaType {
  /** String type */
  STRING = 'string',
  /** Integer type */
  INTEGER = 'integer',
  /** Number type (floating point) */
  NUMBER = 'number',
  /** Boolean type */
  BOOLEAN = 'boolean',
  /** Array type */
  ARRAY = 'array',
  /** Object type */
  OBJECT = 'object'
}

/**
 * String format for string and number types
 */
export enum SchemaFormat {
  /** ISO-8601 date-time format */
  DATE_TIME = 'date-time',
  /** ISO-8601 date format */
  DATE = 'date',
  /** ISO-8601 time format */
  TIME = 'time',
  /** URI format */
  URI = 'uri',
  /** 32-bit integer */
  INT32 = 'int32',
  /** 64-bit integer */
  INT64 = 'int64',
  /** Floating point */
  FLOAT = 'float',
  /** Double precision floating point */
  DOUBLE = 'double'
}

/**
 * Schema for object properties
 */
export interface SchemaProperty {
  /** Data type */
  type: SchemaType;
  /** Format for string and number types */
  format?: SchemaFormat;
  /** Description of the property */
  description?: string;
  /** Whether the property can be null */
  nullable?: boolean;
  /** Enum values for string type */
  enum?: string[];
  /** Minimum number of items for array type */
  minItems?: number;
  /** Maximum number of items for array type */
  maxItems?: number;
  /** Properties for object type */
  properties?: Record<string, SchemaProperty>;
  /** Required properties for object type */
  required?: string[];
  /** Property ordering for object type */
  propertyOrdering?: string[];
  /** Schema for array items */
  items?: SchemaProperty;
}

/**
 * JSON schema for structuring model responses
 */
export interface JsonSchema extends SchemaProperty {}

/**
 * Options for structured output generation
 */
export interface StructuredOutputOptions extends GenerationConfig {
  /** MIME type for response */
  responseMimeType?: string;
  /** Schema for response */
  responseSchema?: JsonSchema;
}

/**
 * Response from structured output generation
 */
export interface StructuredOutputResponse<T = any> {
  /** Parsed response data */
  data: T;
  /** Raw response from the API */
  raw: any;
}

/**
 * Normalized bounding box coordinates in format [y_min, x_min, y_max, x_max]
 * Values are between 0-1000, relative to image dimensions
 */
export type BoundingBox = [number, number, number, number];

/**
 * Object detection result
 */
export interface DetectedObject {
  /** Label or name of the detected object */
  label: string;
  /** Bounding box coordinates [y_min, x_min, y_max, x_max] normalized to 0-1000 */
  box_2d: BoundingBox;
  /** Confidence score for the detection (0-1) */
  confidence?: number;
}

/**
 * Image segmentation result
 */
export interface SegmentedObject extends DetectedObject {
  /** Base64 encoded PNG representing the segmentation mask */
  mask: string;
}

/**
 * Response from object detection
 */
export interface ObjectDetectionResponse {
  /** List of detected objects */
  objects: DetectedObject[];
  /** Generated text description */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Response from image segmentation
 */
export interface SegmentationResponse {
  /** List of segmented objects */
  segments: SegmentedObject[];
  /** Generated text description */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Video timestamp format (MM:SS or HH:MM:SS)
 */
export type VideoTimestamp = string;

/**
 * Video transcript entry
 */
export interface TranscriptEntry {
  /** Start timestamp (MM:SS format) */
  startTime: VideoTimestamp;
  /** End timestamp (MM:SS format) */
  endTime: VideoTimestamp;
  /** Transcribed text */
  text: string;
}

/**
 * Video scene description
 */
export interface VideoScene {
  /** Start timestamp (MM:SS format) */
  startTime: VideoTimestamp;
  /** End timestamp (MM:SS format) */
  endTime: VideoTimestamp;
  /** Description of the scene */
  description: string;
}

/**
 * Response from video transcription
 */
export interface TranscriptionResponse {
  /** Entries in the transcription */
  entries: TranscriptEntry[];
  /** Generated text description */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Response from video scene analysis
 */
export interface VideoAnalysisResponse {
  /** Scenes identified in the video */
  scenes: VideoScene[];
  /** Generated text description */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Audio transcript entry
 */
export interface AudioTranscriptEntry {
  /** Start timestamp (MM:SS format) */
  startTime: VideoTimestamp;
  /** End timestamp (MM:SS format) */
  endTime: VideoTimestamp;
  /** Transcribed text */
  text: string;
}

/**
 * Response from audio transcription
 */
export interface AudioTranscriptionResponse {
  /** Entries in the transcription */
  entries: AudioTranscriptEntry[];
  /** Full transcription text */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Response from audio analysis
 */
export interface AudioAnalysisResponse {
  /** Analysis text */
  text: string;
  /** Raw response from the API */
  raw: any;
}

/**
 * Code execution tool configuration
 */
export interface CodeExecutionConfig {
  /** Any additional configuration for code execution */
  [key: string]: any;
}

/**
 * Tool configuration for code execution
 */
export interface CodeExecutionTool {
  /** Code execution configuration */
  codeExecution: CodeExecutionConfig;
}

/**
 * Executable code part in a response
 */
export interface ExecutableCodePart {
  /** Generated code */
  code: string;
  /** Programming language */
  language?: string;
}

/**
 * Code execution result part in a response
 */
export interface CodeExecutionResultPart {
  /** Output from code execution */
  output: string;
  /** Execution status */
  status?: 'success' | 'error';
}

/**
 * Response from code execution
 */
export interface CodeExecutionResponse {
  /** Full text response */
  text: string;
  /** Generated code */
  generatedCode?: string;
  /** Code execution result */
  executionResult?: string;
  /** Raw response from the API */
  raw: any;
} 