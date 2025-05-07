# Gemini Nexus

A comprehensive SDK for Google's Gemini AI API, providing easy access to all Gemini capabilities including text generation, chat, multimodal (image, audio, video), and more.

## Installation

```bash
npm install gemini-nexus
```

## Important Note for Development

This SDK depends on Google's Generative AI SDK. If you're developing this package, install the necessary dependency:

```bash
npm install @google/generative-ai
npm install --save-dev @types/node-fetch
npm install node-fetch
```

## Getting Started

```javascript
import GeminiClient from 'gemini-nexus';

// Initialize with your API key
const gemini = new GeminiClient('YOUR_API_KEY');

// Generate text
const response = await gemini.textGeneration.generate(
  "What is the meaning of life?"
);
console.log(response.text);

// Chat with Gemini
const chat = gemini.chat.createChat();
const reply = await chat.sendMessage("Hello, how are you?");
console.log(reply.text);

// Process an image
const imageResponse = await gemini.multimodal.generateFromImage(
  "Describe this image in detail",
  "/path/to/image.jpg"
);
console.log(imageResponse.text);
```

## Features

- **Text Generation**: Generate text with various parameters
- **Chat**: Create chat sessions with memory
- **Multimodal**: Process images, audio, and video
- **Function Calling**: Define and use functions
- **File Handling**: Upload and process documents
- **And more!**

## Test Suite

This SDK comes with a comprehensive test suite. To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage reporting
npm run test:cov

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test groups
npm run test:client     # Test the main client
npm run test:text       # Test text generation service
npm run test:chat       # Test chat service
npm run test:multimodal # Test multimodal service
npm run test:file       # Test file service
npm run test:token      # Test token counter service
```

## License

MIT 