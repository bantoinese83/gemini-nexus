const fs = require('fs');
const path = require('path');

// Find all test files in the __tests__ directory
function findTestFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTestFiles(filePath, fileList);
    } else if (file.endsWith('.test.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update import statements and mock setup in test files
function updateTestFile(filePath) {
  console.log(`Updating ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file uses GoogleGenAI
  if (content.includes('GoogleGenAI') || content.includes('@google/genai')) {
    // Replace GoogleGenAI import
    content = content.replace(
      /import.*from\s+['"]@google\/genai['"]/g,
      "// Updated import\nimport * as GenerativeAI from '@google/generative-ai'"
    );
    
    // Replace GoogleGenAI mock
    content = content.replace(
      /jest\.mock\(['"]@google\/genai['"].*\{[\s\S]*?\}\);/g,
      `// Updated mock
jest.mock('@google/generative-ai', () => {
  return {
    GenerativeModel: jest.fn().mockImplementation(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          candidates: [
            {
              content: {
                parts: [{ text: 'Mock generated text' }]
              },
              finishReason: 'STOP',
              safetyRatings: []
            }
          ],
          promptFeedback: { blockReason: null },
          usageMetadata: { 
            promptTokenCount: 10,
            candidatesTokenCount: 20,
            totalTokenCount: 30
          }
        },
        text: jest.fn().mockReturnValue('Mock generated text')
      }),
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            candidates: [
              {
                content: {
                  parts: [{ text: 'Mock chat response' }]
                }
              }
            ]
          },
          text: jest.fn().mockReturnValue('Mock chat response')
        })
      })
    })),
    genAI: {
      countTokens: jest.fn().mockResolvedValue({ totalTokens: 42 })
    },
    __esModule: true
  };
});`);
    
    // Save updated content
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes needed for ${filePath}`);
  }
}

// Update the mock.ts file
function updateMockFile() {
  const mockPath = path.join(__dirname, '__tests__', 'utils', 'mocks.ts');
  console.log(`Updating ${mockPath}`);
  
  if (fs.existsSync(mockPath)) {
    const content = `/**
 * Test utilities and mocks for the Gemini API SDK
 */

// Create a mock for the GenerativeAI client
export const createMockGoogleGenAI = () => {
  return {
    // Mock GenerativeModel functionality
    models: {
      get: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            candidates: [
              {
                content: {
                  parts: [{ text: 'Mock generated text' }]
                },
                finishReason: 'STOP',
                safetyRatings: []
              }
            ],
            promptFeedback: { blockReason: null },
            usageMetadata: { 
              promptTokenCount: 10,
              candidatesTokenCount: 20,
              totalTokenCount: 30
            }
          },
          text: () => 'Mock generated text'
        }),
        startChat: jest.fn().mockReturnValue({
          sendMessage: jest.fn().mockResolvedValue({
            response: {
              candidates: [
                {
                  content: {
                    parts: [{ text: 'Mock chat response' }]
                  }
                }
              ]
            },
            text: () => 'Mock chat response'
          })
        })
      }),
      list: jest.fn().mockResolvedValue(['gemini-2.0-flash', 'gemini-2.0-pro']),
      countTokens: jest.fn().mockResolvedValue({ totalTokens: 42 })
    },
    
    // Mock file API
    files: {
      upload: jest.fn().mockResolvedValue({
        name: 'files/abc123',
        uri: 'https://storage.googleapis.com/files/abc123',
        mimeType: 'image/jpeg',
        state: 'ACTIVE',
        sizeBytes: '12345',
        createTime: '2023-01-01T00:00:00Z',
        updateTime: '2023-01-01T00:00:00Z',
        expireTime: '2023-01-03T00:00:00Z'
      }),
      get: jest.fn().mockResolvedValue({
        name: 'files/abc123',
        uri: 'https://storage.googleapis.com/files/abc123',
        mimeType: 'image/jpeg',
        state: 'ACTIVE'
      }),
      list: jest.fn().mockResolvedValue({
        files: [
          {
            name: 'files/abc123',
            mimeType: 'image/jpeg',
            state: 'ACTIVE'
          }
        ],
        nextPageToken: ''
      }),
      delete: jest.fn().mockResolvedValue({})
    }
  };
};

// Mock for fetch responses
export const mockFetchResponse = (data, status = 200) => {
  return Promise.resolve({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
};
`;
    
    fs.writeFileSync(mockPath, content);
    console.log(`Updated ${mockPath}`);
  } else {
    console.log(`Mock file not found at ${mockPath}`);
  }
}

// Create generative-ai.js mock file
function createGenerativeAIMock() {
  const mockDir = path.join(__dirname, '__mocks__');
  const mockPath = path.join(mockDir, 'generative-ai.js');
  
  // Ensure directory exists
  if (!fs.existsSync(mockDir)) {
    fs.mkdirSync(mockDir, { recursive: true });
  }
  
  console.log(`Creating ${mockPath}`);
  
  const content = `// Mock implementation for @google/generative-ai

const GenerativeModel = jest.fn().mockImplementation(() => {
  return {
    generateContent: jest.fn().mockResolvedValue({
      response: {
        candidates: [
          {
            content: {
              parts: [{ text: 'Mock generated text' }]
            },
            finishReason: 'STOP',
            safetyRatings: []
          }
        ],
        promptFeedback: { blockReason: null },
        usageMetadata: { 
          promptTokenCount: 10,
          candidatesTokenCount: 20,
          totalTokenCount: 30
        }
      },
      text: () => 'Mock generated text'
    }),
    startChat: jest.fn().mockReturnValue({
      sendMessage: jest.fn().mockResolvedValue({
        response: {
          candidates: [
            {
              content: {
                parts: [{ text: 'Mock chat response' }]
              }
            }
          ]
        },
        text: () => 'Mock chat response'
      }),
      getHistory: jest.fn().mockReturnValue([
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Hi there!' }] }
      ])
    })
  };
});

// Export the mock implementations
module.exports = {
  GenerativeModel,
  genAI: {
    countTokens: jest.fn().mockResolvedValue({ totalTokens: 42 })
  },
  __esModule: true
};
`;
  
  fs.writeFileSync(mockPath, content);
  console.log(`Created ${mockPath}`);
}

// Main function to update all test files
function updateAllTests() {
  console.log("Starting test files update...");
  
  // Update the mocks.ts file first
  updateMockFile();
  
  // Create generative-ai.js mock
  createGenerativeAIMock();
  
  // Find and update all test files
  const testFiles = findTestFiles(path.join(__dirname, '__tests__'));
  console.log(`Found ${testFiles.length} test files`);
  
  testFiles.forEach(filePath => {
    updateTestFile(filePath);
  });
  
  console.log("Update completed!");
}

// Run the update
updateAllTests(); 