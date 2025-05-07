/**
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
