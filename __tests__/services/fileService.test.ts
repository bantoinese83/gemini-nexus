
import { FileService } from '../../src/services/fileService';

// Setup mock for entire module
jest.mock('@google/generative-ai', () => ({
  GenerativeModel: jest.fn(),
  __esModule: true
}));

// Mock fs.readFileSync to return fake file data
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(Buffer.from('fake file content')),
  existsSync: jest.fn().mockReturnValue(true)
}));

describe('FileService', () => {
  let fileService: FileService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock client with files API
    const mockClient = {
      files: {
        upload: jest.fn().mockResolvedValue({
          name: 'files/mock-file-123',
          uri: 'https://example.com/mock-file-123'
        }),
        get: jest.fn().mockResolvedValue({
          name: 'files/mock-file-123',
          mimeType: 'image/jpeg',
          state: 'ACTIVE'
        }),
        list: jest.fn().mockResolvedValue({
          files: [{ name: 'files/mock-file-123' }]
        }),
        delete: jest.fn().mockResolvedValue({})
      }
    };
    
    fileService = new FileService(mockClient as any);
  });
  
  // This test is a stub - more comprehensive tests will be added
  // when the migration to the new API is complete
  it('stub test to ensure TypeScript compilation', () => {
    expect(fileService).toBeDefined();
  });
});
