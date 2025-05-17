import { TextGenerationService } from '../../src/services/textGeneration';
import { __mocks__ as genaiMocks } from '@google/genai';

const { mockGenerateContent, mockGenerateContentStream } = genaiMocks;

jest.mock('@google/genai');

describe('TextGenerationService', () => {
  let textGeneration: TextGenerationService;
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent.mockReset();
    mockGenerateContentStream.mockReset();
    mockGenerateContent.mockResolvedValue({ text: 'Mock response', raw: {} });
    mockGenerateContentStream.mockReturnValue((async function* () {
      yield { text: 'Mock stream response part 1' };
      yield { text: 'Mock stream response part 2' };
    })());
    mockClient = {
      models: {
        get: jest.fn(() => ({
          generateContent: mockGenerateContent,
          generateContentStream: mockGenerateContentStream
        }))
      }
    };
    textGeneration = new TextGenerationService(mockClient as any);
  });

  describe('generate', () => {
    it('should generate text from a prompt', async () => {
      const response = await textGeneration.generate('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock response');
    });

    it('should handle errors in text generation', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Generation error'));
      await expect(textGeneration.generate('Hello')).rejects.toThrow('Generation error');
    });
  });

  describe('generateWithSystemInstructions', () => {
    it('should generate text with system instructions', async () => {
      const response = await textGeneration.generateWithSystemInstructions('Hello', 'You are a cat.');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock response');
    });

    it('should handle errors in text generation with system instructions', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Generation error'));
      await expect(textGeneration.generateWithSystemInstructions('Hello', 'You are a cat.')).rejects.toThrow('Generation error');
    });
  });

  describe('streamGenerate', () => {
    it('should stream generated text from a prompt', async () => {
      const stream = await textGeneration.streamGenerate('Hello');
      const parts = [];
      for await (const part of stream) {
        parts.push(part.text);
      }
      expect(parts).toEqual(['Mock stream response part 1', 'Mock stream response part 2']);
    });

    it('should handle errors in streaming text generation', async () => {
      mockGenerateContentStream.mockRejectedValue(new Error('Stream generation error'));
      await expect(textGeneration.streamGenerate('Hello')).rejects.toThrow('Stream generation error');
    });
  });
});
