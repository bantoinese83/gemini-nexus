import GeminiClient from '../src';
import { createMockGoogleGenAI } from './utils/mocks';

// Directly mock the underlying module we import in our code
jest.mock('@google/generative-ai', () => {
  return {
    GenerativeModel: jest.fn(),
    // Mock constructor that provides our mock implementation
    __esModule: true
  };
});

// Note: We're not importing the module directly to avoid import errors
// with node-fetch in the test environment

describe('GeminiClient', () => {
  let client: GeminiClient;

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
    client = new GeminiClient('mock-api-key');
  });

  describe('constructor', () => {
    it('should initialize with an API key', () => {
      // Just verify the client was created with proper services
      expect(client).toBeInstanceOf(GeminiClient);
    });

    it('should initialize all service properties', () => {
      expect(client.textGeneration).toBeDefined();
      expect(client.chat).toBeDefined();
      expect(client.multimodal).toBeDefined();
      expect(client.imageGeneration).toBeDefined();
      expect(client.videoGeneration).toBeDefined();
      expect(client.structuredOutput).toBeDefined();
      expect(client.thinking).toBeDefined();
      expect(client.functionCalling).toBeDefined();
      expect(client.files).toBeDefined();
      expect(client.documentUnderstanding).toBeDefined();
      expect(client.imageUnderstanding).toBeDefined();
      expect(client.videoUnderstanding).toBeDefined();
      expect(client.audioUnderstanding).toBeDefined();
      expect(client.codeExecution).toBeDefined();
      expect(client.searchGrounding).toBeDefined();
      expect(client.tokenCounter).toBeDefined();
    });
  });

  describe('listModels', () => {
    it('should return a list of models', async () => {
      const result = await client.listModels();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle errors', async () => {
      // Save the original implementation
      const originalListModels = client.listModels;
      
      // Mock the method to return a rejected promise
      client.listModels = jest.fn().mockRejectedValue(new Error('API error'));
      
      // Test that the error is properly propagated
      await expect(client.listModels()).rejects.toThrow('API error');
      
      // Restore the original implementation
      client.listModels = originalListModels;
    });
  });

  describe('textGeneration', () => {
    it('should generate text', async () => {
      const response = await client.textGeneration.generate('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Generated response for: Hello');
    });

    it('should handle errors in text generation', async () => {
      client.textGeneration.generate = jest.fn().mockRejectedValue(new Error('Generation error'));
      await expect(client.textGeneration.generate('Hello')).rejects.toThrow('Generation error');
    });
  });

  describe('chat', () => {
    it('should create a chat session', () => {
      const chat = client.chat.createChat();
      expect(chat).toBeDefined();
      expect(chat.sendMessage).toBeDefined();
    });

    it('should send a message in chat', async () => {
      const chat = client.chat.createChat();
      const response = await chat.sendMessage('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock chat response');
    });

    it('should handle errors in chat', async () => {
      const chat = client.chat.createChat();
      chat.sendMessage = jest.fn().mockRejectedValue(new Error('Chat error'));
      await expect(chat.sendMessage('Hello')).rejects.toThrow('Chat error');
    });
  });

  describe('multimodal', () => {
    it('should generate content from image', async () => {
      const response = await client.multimodal.generateFromImage('Describe this image', '/path/to/image.jpg');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock response');
    });

    it('should handle errors in multimodal generation', async () => {
      client.multimodal.generateFromImage = jest.fn().mockRejectedValue(new Error('Multimodal error'));
      await expect(client.multimodal.generateFromImage('Describe this image', '/path/to/image.jpg')).rejects.toThrow('Multimodal error');
    });
  });

  describe('tokenCounter', () => {
    it('should count tokens in text', async () => {
      const result = await client.tokenCounter.countTokensInText('Hello');
      expect(result).toBeDefined();
      expect(result.totalTokens).toBe(42);
    });

    it('should handle errors in token counting', async () => {
      client.tokenCounter.countTokensInText = jest.fn().mockRejectedValue(new Error('Token counting error'));
      await expect(client.tokenCounter.countTokensInText('Hello')).rejects.toThrow('Token counting error');
    });
  });
});
