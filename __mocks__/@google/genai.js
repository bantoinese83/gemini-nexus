// Jest mock for @google/genai
const mockGenerateContent = jest.fn();
const mockGenerateContentStream = jest.fn();
const mockCountTokens = jest.fn();
const mockChatsCreate = jest.fn();
const mockFilesUpload = jest.fn();
const mockFilesGet = jest.fn();
const mockFilesList = jest.fn();
const mockFilesDelete = jest.fn();

module.exports = {
  __esModule: true,
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
      generateContentStream: mockGenerateContentStream,
      countTokens: mockCountTokens,
      get: jest.fn(() => ({
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
        countTokens: mockCountTokens,
        startChat: jest.fn(() => ({
          sendMessage: jest.fn(),
          sendMessageStream: jest.fn(),
          sendFunctionResponse: jest.fn(),
          getHistory: jest.fn()
        })),
      })),
    },
    chats: {
      create: mockChatsCreate
    },
    files: {
      upload: mockFilesUpload,
      get: mockFilesGet,
      list: mockFilesList,
      delete: mockFilesDelete
    }
  })),
  // Export mocks for per-test customization
  __mocks__: {
    mockGenerateContent,
    mockGenerateContentStream,
    mockCountTokens,
    mockChatsCreate,
    mockFilesUpload,
    mockFilesGet,
    mockFilesList,
    mockFilesDelete
  }
}; 