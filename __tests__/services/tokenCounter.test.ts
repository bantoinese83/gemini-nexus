
import { TokenCounterService } from '../../src/services/tokenCounter';

// Mock genAI.countTokens
const mockCountTokens = jest.fn().mockResolvedValue({ totalTokens: 42 });

// Setup mock for entire module
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
    tokenCounter = new TokenCounterService({} as any);
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
  });
});
