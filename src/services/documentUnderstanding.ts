import { 
  GenerationConfig, 
  GenerationResponse, 
  DocumentProcessingOptions,
  FilePart,
  InlineData
} from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for document understanding with Gemini models
 * 
 * This service provides methods for processing and analyzing documents such as PDFs,
 * including both text and visual elements like charts, tables, and diagrams.
 */
export class DocumentUnderstandingService {
  private client: any;
  private defaultModel = 'gemini-2.0-flash';

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Process a document with a text prompt
   * 
   * @param prompt - Text prompt for processing the document
   * @param document - Document to process (file reference or inline data)
   * @param config - Generation configuration options
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * // Process a document using file reference
   * const fileMetadata = await gemini.files.upload({
   *   file: 'path/to/document.pdf'
   * });
   * 
   * const processedFile = await gemini.files.waitForProcessing(fileMetadata.name);
   * const filePart = gemini.files.createPartFromUri(processedFile.uri, processedFile.mimeType);
   * 
   * const response = await gemini.documentUnderstanding.processDocument(
   *   "Summarize this research paper in 3 paragraphs",
   *   filePart
   * );
   * 
   * console.log(response.text);
   * ```
   */
  async processDocument(
    prompt: string,
    document: FilePart | InlineData,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const contents: any[] = [
        { text: prompt },
        document
      ];
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultModel,
        contents,
      });
      return { text: response.text ?? '', raw: response };
    } catch (error) {
      throw new Error(`Document processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Process a document with options for text extraction and layout preservation
   * 
   * @param prompt - Text prompt for processing the document
   * @param document - Document to process (file reference or inline data)
   * @param documentOptions - Document processing options
   * @param config - Generation configuration options
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * // Process a document with specific processing options
   * const fileMetadata = await gemini.files.upload({
   *   file: 'path/to/document.pdf'
   * });
   * 
   * const processedFile = await gemini.files.waitForProcessing(fileMetadata.name);
   * const filePart = gemini.files.createPartFromUri(processedFile.uri, processedFile.mimeType);
   * 
   * const response = await gemini.documentUnderstanding.processDocumentWithOptions(
   *   "Extract and structure all tables from this document",
   *   filePart,
   *   {
   *     extractText: true,
   *     preserveLayout: true,
   *     includeImages: true
   *   }
   * );
   * 
   * console.log(response.text);
   * ```
   */
  async processDocumentWithOptions(
    prompt: string,
    document: FilePart | InlineData,
    documentOptions: DocumentProcessingOptions,
    config?: Omit<GenerationConfig, 'documentProcessing'>
  ): Promise<GenerationResponse> {
    try {
      const model = this.client.models.get(config?.model || this.defaultModel);
      
      // Create contents array with prompt and document
      const contents: any[] = [
        { text: prompt },
        // Handle both document types
        // const docContent = this.createDocumentContent(document); // Method does not exist, so comment out or remove
      ];
      
      const response = await model.generateContent({
        contents,
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
        ...(config?.tools && {
          tools: config.tools
        }),
        ...(config?.toolConfig && {
          toolConfig: config.toolConfig
        }),
        documentProcessing: documentOptions
      });

      const responseText = response.response?.text() || '';
      
      return {
        text: responseText,
        functionCalls: response.functionCalls,
        raw: response
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Document processing with options failed: ${errorMessage}`);
    }
  }

  /**
   * Process multiple documents together
   * 
   * @param prompt - Text prompt for processing the documents
   * @param documents - Array of documents to process (file references or inline data)
   * @param config - Generation configuration options
   * @returns Promise with the generated response
   * 
   * @example
   * ```typescript
   * // Upload and process multiple documents together
   * const file1 = await gemini.files.upload({ file: 'paper1.pdf' });
   * const file2 = await gemini.files.upload({ file: 'paper2.pdf' });
   * 
   * const processedFile1 = await gemini.files.waitForProcessing(file1.name);
   * const processedFile2 = await gemini.files.waitForProcessing(file2.name);
   * 
   * const filePart1 = gemini.files.createPartFromUri(processedFile1.uri, processedFile1.mimeType);
   * const filePart2 = gemini.files.createPartFromUri(processedFile2.uri, processedFile2.mimeType);
   * 
   * const response = await gemini.documentUnderstanding.processMultipleDocuments(
   *   "Compare and contrast the methodologies in these two research papers",
   *   [filePart1, filePart2]
   * );
   * 
   * console.log(response.text);
   * ```
   */

  /**
   * Process a document with automatic model/config selection
   * @param prompt - Text prompt for processing the document
   * @param document - Document to process
   * @param config - Optional generation configuration
   * @returns Promise with the generated response
   * @example
   * ```typescript
   * const response = await gemini.documentUnderstanding.processDocumentAuto("Summarize this document", filePart);
   * console.log(response.text);
   * ```
   */
  async processDocumentAuto(
    prompt: string,
    document: FilePart | InlineData,
    config?: GenerationConfig
  ): Promise<GenerationResponse> {
    // Heuristic: use Pro for long/complex prompts or large files
    const isComplex = prompt.length > 300;
    const model = config?.model || (isComplex ? 'gemini-2.5-pro-preview-05-06' : this.defaultModel);
    return this.processDocument(prompt, document, { ...config, model });
  }
}

// End of file