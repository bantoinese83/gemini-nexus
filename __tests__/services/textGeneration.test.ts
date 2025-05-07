
import { TextGenerationService } from '../../src/services/textGeneration';

// Mock the GenerativeModel class
const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    candidates: [{ content: { parts: [{ text: 'Mock response' }] } }]
  },
  text: () => 'Mock response'
});

const mockModel = {
  generateContent: mockGenerateContent
};

const mockGetModel = jest.fn().mockReturnValue(mockModel);

// Setup mock for entire module
jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn(),
  __esModule: true
}));

describe('TextGenerationService', () => {
  let textGeneration: TextGenerationService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    const mockClient = {
      models: {
        get: mockGetModel
      }
    };
    textGeneration = new TextGenerationService(mockClient as any);
  });
  
  // This test is a stub - more comprehensive tests will be added
  // when the migration to the new API is complete
  it('stub test to ensure TypeScript compilation', () => {
    expect(textGeneration).toBeDefined();
  });
});
