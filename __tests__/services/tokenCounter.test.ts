import { TokenCounterService } from '../../src/services/tokenCounter';
import { __mocks__ as genaiMocks } from '@google/genai';

const { mockCountTokens } = genaiMocks;

// Setup mock for entire module
jest.mock('@google/genai');
jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn(),
  genAI: {
    countTokens: mockCountTokens
  },
  __esModule: true
}));

describe('TokenCounterService', () => {
  let tokenCounter: TokenCounterService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockCountTokens.mockReset();
    mockCountTokens.mockResolvedValue({ totalTokens: 42 });
    // Provide a mock client with models.get().countTokens and models.countTokens for the service
    const mockClient = {
      models: {
        get: jest.fn(() => ({
          countTokens: mockCountTokens
        })),
        countTokens: mockCountTokens
      }
    };
    tokenCounter = new TokenCounterService(mockClient as any);
  });
  
  describe('countTokensInText', () => {
    it('should count tokens in text', async () => {
      const result = await tokenCounter.countTokensInText('Hello');
      expect(result).toBeDefined();
      expect(result.totalTokens).toBe(42);
    });

    it('should handle errors in token counting', async () => {
      mockCountTokens.mockRejectedValueOnce(new Error('Token counting error'));
      await expect(tokenCounter.countTokensInText('Hello')).rejects.toThrow('Token counting error');
    });
  });

  describe('countTokensInContent', () => {
    it('should count tokens in multimodal content', async () => {
      const content = [{ text: 'Hello' }];
      const result = await tokenCounter.countTokensInContent(content);
      expect(result).toBeDefined();
      expect(result.totalTokens).toBe(42);
    });

    it('should handle errors in token counting for content', async () => {
      mockCountTokens.mockRejectedValueOnce(new Error('Token counting error'));
      const content = [{ text: 'Hello' }];
      await expect(tokenCounter.countTokensInContent(content)).rejects.toThrow('Token counting error');
    });
  });

  describe('countTokensInChatHistory', () => {
    it('should count tokens in chat history', async () => {
      const chatHistory = [
        { role: 'user', parts: [{ text: 'Hi my name is Bob' }] },
        { role: 'model', parts: [{ text: 'Hi Bob!' }] }
      ];
      const result = await tokenCounter.countTokensInChatHistory(chatHistory);
      expect(result).toBeDefined();
      expect(result.totalTokens).toBe(42);
    });

    it('should handle errors in token counting for chat history', async () => {
      mockCountTokens.mockRejectedValueOnce(new Error('Token counting error'));
      const chatHistory = [
        { role: 'user', parts: [{ text: 'Hi my name is Bob' }] },
        { role: 'model', parts: [{ text: 'Hi Bob!' }] }
      ];
      await expect(tokenCounter.countTokensInChatHistory(chatHistory)).rejects.toThrow('Token counting error');
    });
  });

  describe('getUsageFromResponse', () => {
    it('should return null if no usage metadata exists', () => {
      const response = { response: {} };
      const usage = tokenCounter.getUsageFromResponse(response);
      expect(usage).toBeNull();
    });

    it('should handle unexpected response formats', () => {
      const usage = tokenCounter.getUsageFromResponse(null);
      expect(usage).toBeNull();
    });

    it('should extract usage metadata from response', () => {
      const response = {
        raw: {
          usageMetadata: {
            totalTokenCount: 100,
            promptTokenCount: 50,
            candidatesTokenCount: 50
          }
        }
      };
      const usage = tokenCounter.getUsageFromResponse(response);
      expect(usage).toEqual({
        totalTokenCount: 100,
        promptTokenCount: 50,
        candidatesTokenCount: 50
      });
    });
  });
});
