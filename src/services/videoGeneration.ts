import * as fs from 'fs';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import { GenerationConfig } from '../types';
import { GoogleGenAI } from "@google/genai";

/**
 * Service for video generation using Veo models
 */
export class VideoGenerationService {
  private client: any;
  private defaultVeoModel = 'veo-2.0-generate-001';
  private defaultImagenModel = 'imagen-3.0-generate-002';
  private pollingIntervalMs = 10000; // 10 seconds

  constructor(client: any) {
    this.client = client;
  }

  /**
   * Generate a video from a text prompt
   * 
   * @param prompt - Text prompt describing the video to generate
   * @param outputPath - Path to save the generated video
   * @param config - Optional configuration parameters
   * @returns Promise with the generated video path
   * 
   * @example
   * ```typescript
   * const videoPath = await gemini.videoGeneration.generateFromText(
   *   "Panning wide shot of a calico kitten sleeping in the sunshine",
   *   "./output/kitten.mp4",
   *   { aspectRatio: "16:9" }
   * );
   * console.log(`Video saved to: ${videoPath}`);
   * ```
   */
  async generateFromText(
    prompt: string,
    outputPath: string,
    config?: {
      personGeneration?: 'dont_allow' | 'allow_adult';
      aspectRatio?: '16:9' | '9:16';
      numberOfVideos?: 1 | 2;
      durationSeconds?: number;
      negativePrompt?: string;
      enhancePrompt?: boolean;
      apiKey?: string; // Optional API key for direct download
    }
  ): Promise<string[]> {
    try {
      // Start the video generation operation
      let operation = await this.client.models.generateVideos({
        model: this.defaultVeoModel,
        prompt,
        config: {
          personGeneration: config?.personGeneration || 'dont_allow',
          aspectRatio: config?.aspectRatio || '16:9',
          numberOfVideos: config?.numberOfVideos || 1,
          durationSeconds: config?.durationSeconds || 5,
          negativePrompt: config?.negativePrompt,
          enhancePrompt: config?.enhancePrompt
        }
      });

      // Poll until operation is complete
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, this.pollingIntervalMs));
        operation = await this.client.operations.getVideosOperation({
          operation
        });
      }

      // Process and save generated videos
      const videoPaths: string[] = [];
      
      if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
        // Create directory if it doesn't exist
        const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Process each generated video
        for (let i = 0; i < operation.response.generatedVideos.length; i++) {
          const generatedVideo = operation.response.generatedVideos[i];
          
          // Determine file path (handle multiple videos if requested)
          let filePath = outputPath;
          if (config?.numberOfVideos && config.numberOfVideos > 1) {
            const extension = outputPath.substring(outputPath.lastIndexOf('.'));
            const basePath = outputPath.substring(0, outputPath.lastIndexOf('.'));
            filePath = `${basePath}_${i + 1}${extension}`;
          }
          
          // Add API key to URI if provided
          let uri = generatedVideo.video?.uri || '';
          if (config?.apiKey && uri) {
            uri = `${uri}&key=${config.apiKey}`;
          }
          
          // Download and save the video
          if (uri) {
            const response = await fetch(uri);
            if (response.body) {
              const writer = createWriteStream(filePath);
              Readable.fromWeb(response.body as any).pipe(writer);
              
              // Wait for the file to be written
              await new Promise<void>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              videoPaths.push(filePath);
            }
          }
        }
      }
      
      return videoPaths;
    } catch (error) {
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a video from an image
   * 
   * @param prompt - Text prompt describing the video to generate
   * @param imagePath - Path to the input image
   * @param outputPath - Path to save the generated video
   * @param config - Optional configuration parameters
   * @returns Promise with the generated video path
   * 
   * @example
   * ```typescript
   * const videoPath = await gemini.videoGeneration.generateFromImage(
   *   "Panning wide shot of a calico kitten sleeping in the sunshine",
   *   "./input/kitten.png",
   *   "./output/kitten.mp4",
   *   { aspectRatio: "16:9" }
   * );
   * console.log(`Video saved to: ${videoPath}`);
   * ```
   */
  async generateFromImage(
    prompt: string,
    imagePath: string,
    outputPath: string,
    config?: {
      aspectRatio?: '16:9' | '9:16';
      numberOfVideos?: 1 | 2;
      durationSeconds?: number;
      negativePrompt?: string;
      enhancePrompt?: boolean;
      apiKey?: string; // Optional API key for direct download
    }
  ): Promise<string[]> {
    try {
      // Read and encode the image
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBytes = imageBuffer.toString('base64');
      const mimeType = this._getMimeType(imagePath);
      
      // Start the video generation operation
      let operation = await this.client.models.generateVideos({
        model: this.defaultVeoModel,
        prompt,
        image: {
          imageBytes,
          mimeType
        },
        config: {
          aspectRatio: config?.aspectRatio || '16:9',
          numberOfVideos: config?.numberOfVideos || 1,
          durationSeconds: config?.durationSeconds || 5,
          negativePrompt: config?.negativePrompt,
          enhancePrompt: config?.enhancePrompt
        }
      });

      // Poll until operation is complete
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, this.pollingIntervalMs));
        operation = await this.client.operations.getVideosOperation({
          operation
        });
      }

      // Process and save generated videos
      const videoPaths: string[] = [];
      
      if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
        // Create directory if it doesn't exist
        const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Process each generated video
        for (let i = 0; i < operation.response.generatedVideos.length; i++) {
          const generatedVideo = operation.response.generatedVideos[i];
          
          // Determine file path (handle multiple videos if requested)
          let filePath = outputPath;
          if (config?.numberOfVideos && config.numberOfVideos > 1) {
            const extension = outputPath.substring(outputPath.lastIndexOf('.'));
            const basePath = outputPath.substring(0, outputPath.lastIndexOf('.'));
            filePath = `${basePath}_${i + 1}${extension}`;
          }
          
          // Add API key to URI if provided
          let uri = generatedVideo.video?.uri || '';
          if (config?.apiKey && uri) {
            uri = `${uri}&key=${config.apiKey}`;
          }
          
          // Download and save the video
          if (uri) {
            const response = await fetch(uri);
            if (response.body) {
              const writer = createWriteStream(filePath);
              Readable.fromWeb(response.body as any).pipe(writer);
              
              // Wait for the file to be written
              await new Promise<void>((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              videoPaths.push(filePath);
            }
          }
        }
      }
      
      return videoPaths;
    } catch (error) {
      throw new Error(`Video generation from image failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate an image with Imagen and then use it as the first frame for a video
   * 
   * @param prompt - Text prompt describing the image and video to generate
   * @param outputPath - Path to save the generated video
   * @param config - Optional configuration parameters
   * @returns Promise with the generated video path and image path
   * 
   * @example
   * ```typescript
   * const result = await gemini.videoGeneration.generateFromImagenToVideo(
   *   "Panning wide shot of a calico kitten sleeping in the sunshine",
   *   "./output/kitten.mp4",
   *   { 
   *     aspectRatio: "16:9",
   *     saveImage: true,
   *     imageOutputPath: "./output/kitten.png"
   *   }
   * );
   * console.log(`Image saved to: ${result.imagePath}`);
   * console.log(`Video saved to: ${result.videoPaths[0]}`);
   * ```
   */
  async generateFromImagenToVideo(
    prompt: string,
    outputPath: string,
    config?: {
      aspectRatio?: '16:9' | '9:16';
      numberOfVideos?: 1 | 2;
      durationSeconds?: number;
      negativePrompt?: string;
      enhancePrompt?: boolean;
      apiKey?: string; // Optional API key for direct download
      saveImage?: boolean; // Whether to save the generated image
      imageOutputPath?: string; // Path to save the generated image
    }
  ): Promise<{ videoPaths: string[]; imagePath?: string }> {
    try {
      // First, generate an image using Imagen
      const response = await this.client.models.generateImages({
        model: this.defaultImagenModel,
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: (config?.aspectRatio === '9:16' ? '9:16' : '16:9') as any
        }
      });

      // Save the image if requested
      let imagePath: string | undefined;
      if (config?.saveImage && response.generatedImages && response.generatedImages.length > 0) {
        const imageBytes = response.generatedImages[0].image.imageBytes;
        const outputImagePath = config.imageOutputPath || `${outputPath.substring(0, outputPath.lastIndexOf('.'))}.png`;
        
        // Create directory if it doesn't exist
        const dir = outputImagePath.substring(0, outputImagePath.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Save the image
        const buffer = Buffer.from(imageBytes, 'base64');
        fs.writeFileSync(outputImagePath, buffer);
        imagePath = outputImagePath;
      }

      // Now generate a video using the image as the first frame
      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageBytes = response.generatedImages[0].image.imageBytes;
        
        // Start the video generation operation
        let operation = await this.client.models.generateVideos({
          model: this.defaultVeoModel,
          prompt,
          image: {
            imageBytes,
            mimeType: 'image/png'
          },
          config: {
            aspectRatio: config?.aspectRatio || '16:9',
            numberOfVideos: config?.numberOfVideos || 1,
            durationSeconds: config?.durationSeconds || 5,
            negativePrompt: config?.negativePrompt,
            enhancePrompt: config?.enhancePrompt
          }
        });

        // Poll until operation is complete
        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, this.pollingIntervalMs));
          operation = await this.client.operations.getVideosOperation({
            operation
          });
        }

        // Process and save generated videos
        const videoPaths: string[] = [];
        
        if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
          // Create directory if it doesn't exist
          const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Process each generated video
          for (let i = 0; i < operation.response.generatedVideos.length; i++) {
            const generatedVideo = operation.response.generatedVideos[i];
            
            // Determine file path (handle multiple videos if requested)
            let filePath = outputPath;
            if (config?.numberOfVideos && config.numberOfVideos > 1) {
              const extension = outputPath.substring(outputPath.lastIndexOf('.'));
              const basePath = outputPath.substring(0, outputPath.lastIndexOf('.'));
              filePath = `${basePath}_${i + 1}${extension}`;
            }
            
            // Add API key to URI if provided
            let uri = generatedVideo.video?.uri || '';
            if (config?.apiKey && uri) {
              uri = `${uri}&key=${config.apiKey}`;
            }
            
            // Download and save the video
            if (uri) {
              const response = await fetch(uri);
              if (response.body) {
                const writer = createWriteStream(filePath);
                Readable.fromWeb(response.body as any).pipe(writer);
                
                // Wait for the file to be written
                await new Promise<void>((resolve, reject) => {
                  writer.on('finish', resolve);
                  writer.on('error', reject);
                });
                
                videoPaths.push(filePath);
              }
            }
          }
        }
        
        return { videoPaths, imagePath };
      } else {
        throw new Error('Failed to generate image with Imagen');
      }
    } catch (error) {
      throw new Error(`Combined image-to-video generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Utility method to get MIME type from file path
   * @private
   */
  private _getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'pdf': 'application/pdf',
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  async generateVideo(prompt: string, config?: GenerationConfig): Promise<any> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.client.apiKey });
      const response = await ai.models.generateContent({
        model: config?.model || this.defaultVeoModel,
        contents: prompt,
      });
      return response;
    } catch (error) {
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 