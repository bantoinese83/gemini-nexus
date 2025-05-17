import { FileService } from '../../src/services/fileService';
import * as fs from 'fs';
import * as path from 'path';

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

describe('FileService', () => {
  let fileService: FileService;
  let mockClient: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock client with files API
    mockClient = {
      files: {
        upload: jest.fn().mockResolvedValue({
          name: 'files/mock-file-123',
          uri: 'https://example.com/mock-file-123',
          mimeType: 'image/jpeg',
          state: 'ACTIVE'
        }),
        get: jest.fn().mockResolvedValue({
          name: 'files/mock-file-123',
          mimeType: 'image/jpeg',
          state: 'ACTIVE'
        }),
        list: jest.fn().mockResolvedValue({
          files: [{ name: 'files/mock-file-123' }],
          hasNextPage: jest.fn().mockReturnValue(false),
          nextPage: jest.fn()
        }),
        delete: jest.fn().mockResolvedValue({})
      }
    };
    
    fileService = new FileService(mockClient as any);
  });

  describe('upload', () => {
    it('should upload a file from path', async () => {
      const result = await fileService.upload({ file: 'path/to/file.jpg' });
      expect(result).toBeDefined();
      expect(result.name).toBe('files/mock-file-123');
      expect(mockClient.files.upload).toHaveBeenCalled();
    });

    it('should upload a file from buffer', async () => {
      const buffer = Buffer.from('fake file content');
      const result = await fileService.upload({ file: buffer, config: { mimeType: 'image/jpeg' } });
      expect(result).toBeDefined();
      expect(result.name).toBe('files/mock-file-123');
      expect(mockClient.files.upload).toHaveBeenCalled();
    });

    it('should handle errors during upload', async () => {
      mockClient.files.upload.mockRejectedValue(new Error('Upload error'));
      await expect(fileService.upload({ file: 'path/to/file.jpg' })).rejects.toThrow('File upload failed: Upload error');
    });
  });

  describe('get', () => {
    it('should get file metadata', async () => {
      const result = await fileService.get({ name: 'files/mock-file-123' });
      expect(result).toBeDefined();
      expect(result.name).toBe('files/mock-file-123');
      expect(mockClient.files.get).toHaveBeenCalled();
    });

    it('should handle errors during get', async () => {
      mockClient.files.get.mockRejectedValue(new Error('Get error'));
      await expect(fileService.get({ name: 'files/mock-file-123' })).rejects.toThrow('File get failed: Get error');
    });
  });

  describe('list', () => {
    it('should list files', async () => {
      const result = await fileService.list();
      expect(result).toBeDefined();
      expect(result.files.length).toBeGreaterThan(0);
      expect(mockClient.files.list).toHaveBeenCalled();
    });

    it('should handle errors during list', async () => {
      mockClient.files.list.mockRejectedValue(new Error('List error'));
      await expect(fileService.list()).rejects.toThrow('File list failed: List error');
    });
  });

  describe('delete', () => {
    it('should delete a file', async () => {
      await fileService.delete({ name: 'files/mock-file-123' });
      expect(mockClient.files.delete).toHaveBeenCalled();
    });

    it('should handle errors during delete', async () => {
      mockClient.files.delete.mockRejectedValue(new Error('Delete error'));
      await expect(fileService.delete({ name: 'files/mock-file-123' })).rejects.toThrow('File delete failed: Delete error');
    });
  });

  describe('waitForFileState', () => {
    it('should wait for file to reach target state', async () => {
      const result = await fileService.waitForFileState('files/mock-file-123', 'ACTIVE');
      expect(result).toBeDefined();
      expect(result.state).toBe('ACTIVE');
      expect(mockClient.files.get).toHaveBeenCalled();
    });

    it('should handle timeout waiting for file state', async () => {
      mockClient.files.get.mockResolvedValue({ name: 'files/mock-file-123', state: 'PROCESSING' });
      await expect(fileService.waitForFileState('files/mock-file-123', 'ACTIVE', 1, 100)).rejects.toThrow('Timeout waiting for file files/mock-file-123 to reach state ACTIVE');
    });

    it('should handle file processing failure', async () => {
      mockClient.files.get.mockResolvedValue({ name: 'files/mock-file-123', state: 'FAILED' });
      await expect(fileService.waitForFileState('files/mock-file-123', 'ACTIVE')).rejects.toThrow('File processing failed: files/mock-file-123');
    });
  });

  describe('createPartFromUri', () => {
    it('should create part from URI', () => {
      const part = fileService.createPartFromUri('https://example.com/mock-file-123', 'image/jpeg');
      expect(part).toBeDefined();
      expect(part.fileData.fileUri).toBe('https://example.com/mock-file-123');
    });
  });

  describe('createPartFromBase64', () => {
    it('should create part from base64 data', () => {
      const part = fileService.createPartFromBase64('base64data', 'image/jpeg');
      expect(part).toBeDefined();
      expect(part.inlineData.data).toBe('base64data');
    });
  });

  describe('createUserContent', () => {
    it('should create user content from parts', () => {
      const parts = [
        'This is a text part',
        { fileData: { fileUri: 'https://example.com/mock-file-123', mimeType: 'image/jpeg' } }
      ];
      const userContent = fileService.createUserContent(parts);
      expect(userContent).toBeDefined();
      expect(userContent.parts.length).toBe(2);
    });
  });
});
