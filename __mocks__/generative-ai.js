// Mock implementation for @google/generative-ai

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
