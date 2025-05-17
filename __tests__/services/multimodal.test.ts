import { MultimodalService } from '../../src/services/multimodal';
import * as fs from 'fs';

// Mock the GenerativeModel class
const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    candidates: [{ content: { parts: [{ text: 'Mock response' }] } }]
  },
  text: () => 'Mock response'
});

const mockGenerateContentStream = jest.fn().mockResolvedValue({
  stream: (async function* () {
    yield { text: 'Mock stream response part 1' };
    yield { text: 'Mock stream response part 2' };
  })()
});

const mockModel = {
  generateContent: mockGenerateContent,
  generateContentStream: mockGenerateContentStream
};

const mockGetModel = jest.fn().mockReturnValue(mockModel);

// Setup mock for entire module
jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn(),
  __esModule: true
}));

// Mock fs.readFileSync to return fake file data
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(Buffer.from('fake file content')),
  existsSync: jest.fn().mockReturnValue(true),
  statSync: jest.fn().mockReturnValue({ size: 1024 * 1024 }) // 1MB
}));

describe('MultimodalService', () => {
  let multimodal: MultimodalService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    const mockClient = {
      models: {
        get: mockGetModel
      },
      files: {
        upload: jest.fn().mockResolvedValue({
          name: 'files/mock-file-123',
          uri: 'https://example.com/mock-file-123',
          mimeType: 'image/jpeg',
          state: 'ACTIVE'
        })
      }
    };
    multimodal = new MultimodalService(mockClient as any);
  });

  describe('generateFromImage', () => {
    it('should generate content from image', async () => {
      const response = await multimodal.generateFromImage('Describe this image', '/path/to/image.jpg');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock response');
    });

    it('should handle errors in image-based generation', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Multimodal error'));
      await expect(multimodal.generateFromImage('Describe this image', '/path/to/image.jpg')).rejects.toThrow('Multimodal error');
    });
  });

  describe('generateFromImageData', () => {
    it('should generate content from image data', async () => {
      const response = await multimodal.generateFromImageData('Describe this image', 'base64data', 'image/jpeg');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock response');
    });

    it('should handle errors in image data generation', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Multimodal error'));
      await expect(multimodal.generateFromImageData('Describe this image', 'base64data', 'image/jpeg')).rejects.toThrow('Multimodal error');
    });
  });

  describe('streamGenerateFromImage', () => {
    it('should stream generated content from image', async () => {
      const stream = await multimodal.streamGenerateFromImage('Describe this image in detail', '/path/to/image.jpg');
      const parts = [];
      for await (const part of stream) {
        parts.push(part.text);
      }
      expect(parts).toEqual(['Mock stream response part 1', 'Mock stream response part 2']);
    });

    it('should handle errors in stream image-based generation', async () => {
      mockGenerateContentStream.mockRejectedValue(new Error('Stream multimodal error'));
      await expect(multimodal.streamGenerateFromImage('Describe this image in detail', '/path/to/image.jpg')).rejects.toThrow('Stream multimodal error');
    });
  });
});
