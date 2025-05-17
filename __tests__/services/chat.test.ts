import { ChatService } from '../../src/services/chat';

// Mock the chat session and GenerativeModel
const mockSendMessage = jest.fn().mockResolvedValue({
  response: {
    candidates: [{ content: { parts: [{ text: 'Mock chat response' }] } }]
  },
  text: () => 'Mock chat response'
});

const mockSendMessageStream = jest.fn().mockResolvedValue({
  stream: (async function* () {
    yield { text: 'Mock stream response part 1' };
    yield { text: 'Mock stream response part 2' };
  })()
});

const mockSendFunctionResponse = jest.fn().mockResolvedValue({
  response: {
    candidates: [{ content: { parts: [{ text: 'Mock function response' }] } }]
  },
  text: () => 'Mock function response'
});

const mockGetHistory = jest.fn().mockReturnValue([
  { role: 'user', parts: [{ text: 'Mock user message' }] },
  { role: 'model', parts: [{ text: 'Mock model response' }] }
]);

const mockChatSession = {
  sendMessage: mockSendMessage,
  sendMessageStream: mockSendMessageStream,
  sendFunctionResponse: mockSendFunctionResponse,
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

  describe('createChat', () => {
    it('should create a chat session', () => {
      const chat = chatService.createChat();
      expect(chat).toBeDefined();
      expect(chat.sendMessage).toBeDefined();
      expect(chat.sendMessageStream).toBeDefined();
      expect(chat.sendFunctionResponse).toBeDefined();
      expect(chat.getHistory).toBeDefined();
    });

    it('should send a message in chat', async () => {
      const chat = chatService.createChat();
      const response = await chat.sendMessage('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock chat response');
    });

    it('should stream a message in chat', async () => {
      const chat = chatService.createChat();
      const stream = await chat.sendMessageStream('Hello');
      const parts = [];
      for await (const part of stream) {
        parts.push(part.text);
      }
      expect(parts).toEqual(['Mock stream response part 1', 'Mock stream response part 2']);
    });

    it('should send a function response in chat', async () => {
      const chat = chatService.createChat();
      const response = await chat.sendFunctionResponse({ name: 'mockFunction' }, 'result');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock function response');
    });

    it('should get chat history', () => {
      const chat = chatService.createChat();
      const history = chat.getHistory();
      expect(history).toEqual([
        { role: 'user', parts: [{ text: 'Mock user message' }] },
        { role: 'model', parts: [{ text: 'Mock model response' }] }
      ]);
    });
  });

  describe('sendMessage', () => {
    it('should send a single message in a stateless manner', async () => {
      const response = await chatService.sendMessage('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock chat response');
    });

    it('should handle errors in sendMessage', async () => {
      chatService.createChat = jest.fn().mockImplementation(() => {
        throw new Error('sendMessage error');
      });
      await expect(chatService.sendMessage('Hello')).rejects.toThrow('sendMessage error');
    });
  });

  describe('createFunctionCallingChat', () => {
    it('should create a chat with function calling capabilities', () => {
      const chat = chatService.createFunctionCallingChat([]);
      expect(chat).toBeDefined();
      expect(chat.sendMessage).toBeDefined();
      expect(chat.sendMessageStream).toBeDefined();
      expect(chat.sendFunctionResponse).toBeDefined();
      expect(chat.getHistory).toBeDefined();
    });

    it('should send a message in function calling chat', async () => {
      const chat = chatService.createFunctionCallingChat([]);
      const response = await chat.sendMessage('Hello');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock chat response');
    });

    it('should send a function response in function calling chat', async () => {
      const chat = chatService.createFunctionCallingChat([]);
      const response = await chat.sendFunctionResponse({ name: 'mockFunction' }, 'result');
      expect(response).toBeDefined();
      expect(response.text).toBe('Mock function response');
    });
  });
});
