import * as fs from 'fs';
import * as path from 'path';
import { 
  FileMetadata, 
  FileUploadOptions, 
  FileGetOptions,
  FileListOptions,
  FileListResponse,
  FileDeleteOptions
} from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for managing files with the Gemini API
 * 
 * The Files API allows uploading media files to be used with Gemini models. 
 * Files are stored for 48 hours and can be used for multimodal prompts.
 */
export class FileService {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Upload a file to the Gemini API
   * 
   * @param options - Options for uploading a file
   * @returns Promise with the file metadata
   * 
   * @example
   * ```typescript
   * // Upload using a file path
   * const audioFile = await gemini.files.upload({
   *   file: "path/to/sample.mp3",
   *   config: { mimeType: "audio/mpeg" }
   * });
   * 
   * // Upload using a Buffer
   * const imageBuffer = fs.readFileSync('path/to/image.jpg');
   * const imageFile = await gemini.files.upload({
   *   file: imageBuffer,
   *   config: { mimeType: "image/jpeg" }
   * });
   * ```
   */
  async upload(options: FileUploadOptions): Promise<FileMetadata> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      let fileData: string | Blob;
      if (typeof options.file === 'string') {
        fileData = options.file;
      } else if (Buffer.isBuffer(options.file)) {
        if (typeof Blob !== 'undefined') {
          fileData = new Blob([options.file]);
        } else {
          throw new Error('Buffer uploads require Blob support in this environment.');
        }
      } else {
        fileData = options.file as Blob;
      }
      const mimeType = options.config?.mimeType || 'application/octet-stream';
      const config = {
        displayName: options.config?.displayName || 'uploaded_file',
        mimeType: mimeType
      };
      const response = await ai.files.upload({ file: fileData, config });
      return this.normalizeFileResponse(response);
    } catch (error) {
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get metadata for an uploaded file
   * 
   * @param options - Options with the file name to retrieve
   * @returns Promise with the file metadata
   * 
   * @example
   * ```typescript
   * const file = await gemini.files.get({ 
   *   name: "files/abc123" 
   * });
   * console.log(file);
   * ```
   */
  async get(options: FileGetOptions): Promise<FileMetadata> {
    try {
      const response = await this.client.files.get({
        name: options.name
      });
      
      return this.normalizeFileResponse(response);
    } catch (error) {
      throw new Error(`File get failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * List uploaded files
   * 
   * @param options - Options for listing files
   * @returns Promise with a list of file metadata
   * 
   * @example
   * ```typescript
   * // List files with pagination
   * const response = await gemini.files.list({
   *   config: { pageSize: 10 }
   * });
   * 
   * for (const file of response.files) {
   *   console.log(file.name);
   * }
   * 
   * // If there are more files, you can use the nextPageToken
   * if (response.nextPageToken) {
   *   const nextPage = await gemini.files.list({
   *     config: { 
   *       pageSize: 10,
   *       pageToken: response.nextPageToken
   *     }
   *   });
   * }
   * ```
   */
  async list(options?: FileListOptions): Promise<FileListResponse> {
    try {
      const response = await this.client.files.list({
        config: options?.config
      });
      
      // Initialize result array
      const files: FileMetadata[] = [];
      
      // Iterate over the paged response
      let page = response.page;
      while (true) {
        // Add files from current page
        for (const file of page) {
          files.push(this.normalizeFileResponse(file));
        }
        
        // Check if there are more pages
        if (!response.hasNextPage()) break;
        
        // Get next page
        page = await response.nextPage();
      }
      
      return {
        files,
        nextPageToken: response.nextPageToken || undefined
      };
    } catch (error) {
      throw new Error(`File list failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete an uploaded file
   * 
   * @param options - Options with the file name to delete
   * @returns Promise that resolves when the file is deleted
   * 
   * @example
   * ```typescript
   * await gemini.files.delete({ 
   *   name: "files/abc123" 
   * });
   * ```
   */
  async delete(options: FileDeleteOptions): Promise<void> {
    try {
      await this.client.files.delete({
        name: options.name
      });
    } catch (error) {
      throw new Error(`File delete failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a content part from a file URI for use in multimodal prompts
   * 
   * @param fileUri - The URI of the uploaded file
   * @param mimeType - The MIME type of the file
   * @returns Part object for use in multimodal prompts
   * 
   * @example
   * ```typescript
   * const myfile = await gemini.files.upload({
   *   file: "path/to/sample.mp3",
   *   config: { mimeType: "audio/mpeg" }
   * });
   * 
   * const response = await gemini.textGeneration.generate(
   *   [
   *     gemini.files.createPartFromUri(myfile.uri, myfile.mimeType),
   *     "Describe this audio clip"
   *   ]
   * );
   * ```
   */
  createPartFromUri(fileUri: string, mimeType: string): any {
    // Uses the SDK's createPartFromUri helper
    return {
      fileData: {
        fileUri,
        mimeType
      }
    };
  }

  /**
   * Create a content part from base64-encoded data for use in multimodal prompts
   * 
   * @param base64Data - The base64-encoded file data
   * @param mimeType - The MIME type of the data
   * @returns Part object for use in multimodal prompts
   * 
   * @example
   * ```typescript
   * const imageBuffer = fs.readFileSync('path/to/image.jpg');
   * const base64Data = imageBuffer.toString('base64');
   * 
   * const response = await gemini.textGeneration.generate(
   *   [
   *     gemini.files.createPartFromBase64(base64Data, "image/jpeg"),
   *     "Describe this image"
   *   ]
   * );
   * ```
   */
  createPartFromBase64(base64Data: string, mimeType: string): any {
    // Uses the SDK's createPartFromBase64 helper
    return {
      inlineData: {
        data: base64Data,
        mimeType
      }
    };
  }

  /**
   * Create a multimodal user content message for use with generateContent
   * 
   * @param parts - Array of content parts (can be text strings, file parts, or inline data parts)
   * @returns User content object for use with generateContent
   * 
   * @example
   * ```typescript
   * const myfile = await gemini.files.upload({
   *   file: "path/to/sample.mp3",
   *   config: { mimeType: "audio/mpeg" }
   * });
   * 
   * const userContent = gemini.files.createUserContent([
   *   gemini.files.createPartFromUri(myfile.uri, myfile.mimeType),
   *   "Describe this audio clip"
   * ]);
   * 
   * const response = await gemini.models.generateContent({
   *   model: "gemini-2.0-flash",
   *   contents: userContent
   * });
   * ```
   */
  createUserContent(parts: Array<string | any>): any {
    // Process the parts to handle string conversion
    const processedParts = parts.map(part => {
      if (typeof part === 'string') {
        return { text: part };
      }
      return part;
    });
    
    return {
      role: 'user',
      parts: processedParts
    };
  }

  /**
   * Wait for a file to reach a specific state
   * 
   * @param name - The name of the file to wait for
   * @param targetState - The target state to wait for (defaults to ACTIVE)
   * @param maxAttempts - Maximum number of polling attempts
   * @param intervalMs - Polling interval in milliseconds
   * @returns Promise with the file metadata when the target state is reached
   * 
   * @example
   * ```typescript
   * const videoFile = await gemini.files.upload({
   *   file: "path/to/video.mp4",
   *   config: { mimeType: "video/mp4" }
   * });
   * 
   * // Wait for the video file to be processed
   * const readyFile = await gemini.files.waitForFileState(
   *   videoFile.name, 
   *   "ACTIVE"
   * );
   * ```
   */
  async waitForFileState(
    name: string, 
    targetState: string = 'ACTIVE', 
    maxAttempts: number = 30, 
    intervalMs: number = 5000
  ): Promise<FileMetadata> {
    let attempt = 0;
    
    while (attempt < maxAttempts) {
      const file = await this.get({ name });
      
      // Check if file has reached the target state
      if (file.state === targetState) {
        return file;
      }
      
      // Check if file has failed
      if (file.state === 'FAILED') {
        throw new Error(`File processing failed: ${name}`);
      }
      
      // Wait before next polling attempt
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      attempt++;
    }
    
    throw new Error(`Timeout waiting for file ${name} to reach state ${targetState}`);
  }

  /**
   * Normalize the file response object to match our interface
   */
  private normalizeFileResponse(file: any): FileMetadata {
    // Ensure name is always a string
    return {
      ...file,
      name: file.name || 'uploaded_file'
    };
  }

  /**
   * Try to guess the MIME type from a filename
   */
  private guessMimeType(fileName: string): string {
    const extension = path.extname(fileName).toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Upload a file and wait for it to reach ACTIVE state
   * @param options - Options for uploading a file
   * @returns Promise with the processed file metadata
   * @example
   * ```typescript
   * const file = await gemini.files.uploadAndWait({ file: "path/to/file.pdf", config: { mimeType: "application/pdf" } });
   * console.log(file.state); // Should be 'ACTIVE'
   * ```
   */
  async uploadAndWait(options: FileUploadOptions): Promise<FileMetadata> {
    const file = await this.upload(options);
    if (!file.name) throw new Error('Uploaded file is missing a name.');
    return this.waitForFileState(file.name, 'ACTIVE');
  }
} 