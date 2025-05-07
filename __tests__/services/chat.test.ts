
import { ChatService } from '../../src/services/chat';

// Mock the chat session and GenerativeModel
const mockSendMessage = jest.fn().mockResolvedValue({
  response: {
    candidates: [{ content: { parts: [{ text: 'Mock chat response' }] } }]
  },
  text: () => 'Mock chat response'
});

const mockGetHistory = jest.fn().mockReturnValue([
  { role: 'user', parts: [{ text: 'Mock user message' }] },
  { role: 'model', parts: [{ text: 'Mock model response' }] }
]);

const mockChatSession = {
  sendMessage: mockSendMessage,
  getHistory: mockGetHistory
};

const mockStartChat = jest.fn().mockReturnValue(mockChatSession);

const mockModel = {
  startChat: mockStartChat
};

const mockGetModel = jest.fn().mockReturnValue(mockModel);

// Setup mock for entire module
jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn(),
  __esModule: true
}));

describe('ChatService', () => {
  let chatService: ChatService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    const mockClient = {
      models: {
        get: mockGetModel
      }
    };
    chatService = new ChatService(mockClient as any);
  });
  
  // This test is a stub - more comprehensive tests will be added
  // when the migration to the new API is complete
  it('stub test to ensure TypeScript compilation', () => {
    expect(chatService).toBeDefined();
  });
});
