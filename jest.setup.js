// Configure fetch-mock
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

// Add fetch to global scope for tests
global.fetch = fetchMock;

// Mock the fs module for tests
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => Buffer.from('Mock file content')),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'finish') {
        callback();
      }
      return this;
    }),
  })),
}));

// Add a generic mock for Readable stream
jest.mock('stream', () => ({
  Readable: jest.fn().mockImplementation(() => ({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
  })),
})); 