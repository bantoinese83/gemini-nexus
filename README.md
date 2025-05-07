# Gemini Nexus

A comprehensive TypeScript SDK for Google's Gemini AI API, providing easy access to all Gemini capabilities including text generation, chat, multimodal (image, audio, video), function calling, and more.

[![npm version](https://img.shields.io/npm/v/gemini-nexus.svg)](https://www.npmjs.com/package/gemini-nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue.svg)](https://www.typescriptlang.org/)

## Installation

```bash
npm install gemini-nexus
```

## Features

- **Text Generation** - Generate text with control over parameters like temperature and max tokens
- **Chat** - Create interactive chat sessions with history management
- **Multimodal** - Process images, audio, and video inputs
- **Function Calling** - Define custom functions for agentic use cases
- **File API** - Upload, manage, and process files with Gemini
- **Image Generation** - Generate images from text prompts
- **Video Generation** - Create videos from text descriptions
- **Document Understanding** - Analyze and extract information from documents
- **Image Understanding** - Process and analyze images
- **Audio Understanding** - Transcribe and analyze audio content
- **Video Understanding** - Process and analyze video content
- **Code Execution** - Execute and analyze code with AI assistance
- **Search Grounding** - Ground responses in Google Search results
- **Structured Output** - Generate data in structured formats
- **Token Counting** - Track and manage token usage and costs
- **Thinking** - Access Gemini's chain-of-thought capabilities

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

## Advanced Usage Examples

### Function Calling

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

const functions = [
  {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "The unit of temperature"
        }
      },
      required: ["location"]
    }
  }
];

const result = await gemini.functionCalling.generate(
  "What's the weather like in New York?",
  { functions }
);

console.log(result.functionCalls);
```

### Search Grounding

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

const response = await gemini.searchGrounding.generate(
  "Who won the most recent Super Bowl?"
);

console.log(response.text);
console.log(response.groundingMetadata.webSearchQueries);
```

## Usage Examples

Below are examples for all services provided by the SDK:

### Text Generation

```javascript
import GeminiClient, { GeminiModel } from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Basic text generation
const response = await gemini.textGeneration.generate(
  "What are three interesting facts about space?",
  { 
    model: GeminiModel.PRO,  // Using Gemini Pro model
    temperature: 0.7,         // Controls randomness (0.0 to 1.0)
    maxOutputTokens: 300      // Limit response length
  }
);

console.log(response.text);

// Text generation with system instructions
const instructedResponse = await gemini.textGeneration.generateWithSystemInstructions(
  "Explain quantum physics",
  "You are a university professor explaining complex topics to first-year students.",
  { temperature: 0.2 }
);

console.log(instructedResponse.text);

// Stream responses for real-time output
const stream = await gemini.textGeneration.streamGenerate(
  "Write a short poem about autumn",
  { temperature: 0.9 }
);

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

### Chat

```javascript
import GeminiClient, { GeminiModel } from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Create a chat session
const chat = gemini.chat.createChat({
  model: GeminiModel.PRO,
  temperature: 0.4,
  historyLimit: 10  // Keep only last 10 messages in history
});

// Send a message
const response1 = await chat.sendMessage("Hello! Can you help me plan a trip to Japan?");
console.log(`Gemini: ${response1.text}`);

// Continue the conversation
const response2 = await chat.sendMessage("What are the best places to visit in Tokyo?");
console.log(`Gemini: ${response2.text}`);

// Get the conversation history
const history = chat.getHistory();
console.log("Chat history:", history);

// Create a chat with an initial history
const existingHistory = [
  { role: 'user', parts: [{ text: 'What are the best programming languages to learn?' }] },
  { role: 'model', parts: [{ text: 'The best programming languages depend on your goals...' }] }
];

const continuedChat = gemini.chat.createChat({ history: existingHistory });
const response3 = await continuedChat.sendMessage("Which one is best for web development?");
console.log(`Gemini: ${response3.text}`);
```

### Multimodal

```javascript
import GeminiClient from 'gemini-nexus';
import fs from 'fs';

const gemini = new GeminiClient('YOUR_API_KEY');

// Generate from image
const imageResponse = await gemini.multimodal.generateFromImage(
  "Describe this image in detail",
  "/path/to/image.jpg"  // Local file path
);

console.log(imageResponse.text);

// Generate from image with URL
const urlResponse = await gemini.multimodal.generateFromImageUrl(
  "What's happening in this image?",
  "https://example.com/image.jpg"
);

console.log(urlResponse.text);

// Generate from multiple images
const images = [
  "/path/to/image1.jpg",
  "/path/to/image2.jpg"
];

const multiImageResponse = await gemini.multimodal.generateFromMultipleImages(
  "Compare these two images",
  images
);

console.log(multiImageResponse.text);

// Generate from image and audio
const multimodalResponse = await gemini.multimodal.generateFromMixedContent(
  "Analyze the image and audio file",
  {
    images: ["/path/to/image.jpg"],
    audio: ["/path/to/audio.mp3"]
  }
);

console.log(multimodalResponse.text);
```

### File API

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Upload a file
const uploadedFile = await gemini.files.upload("/path/to/document.pdf");
console.log("File uploaded:", uploadedFile.name);

// List uploaded files
const filesList = await gemini.files.list();
console.log("Files:", filesList.files);

// Get file details
const fileDetails = await gemini.files.get(uploadedFile.name);
console.log("File details:", fileDetails);

// Generate content with file reference
const response = await gemini.files.generateFromFile(
  "Summarize this document",
  uploadedFile.name
);
console.log(response.text);

// Delete a file when no longer needed
await gemini.files.delete(uploadedFile.name);
console.log("File deleted");
```

### Image Generation

```javascript
import GeminiClient from 'gemini-nexus';
import fs from 'fs';

const gemini = new GeminiClient('YOUR_API_KEY');

// Generate an image
const image = await gemini.imageGeneration.generate(
  "A futuristic city with flying cars and neon lights",
  { 
    size: "1024x1024",
    style: "vivid"
  }
);

// Save the image
fs.writeFileSync('generated-image.png', image.data);
console.log("Image saved to generated-image.png");

// Image variation
const variationImage = await gemini.imageGeneration.createVariation(
  "/path/to/source-image.png",
  { 
    variationStrength: 0.7  // How different from original (0.0 to 1.0)
  }
);

fs.writeFileSync('variation-image.png', variationImage.data);
```

### Video Generation

```javascript
import GeminiClient from 'gemini-nexus';
import fs from 'fs';

const gemini = new GeminiClient('YOUR_API_KEY');

// Generate a video
const video = await gemini.videoGeneration.generate(
  "A time-lapse of a blooming flower",
  { 
    duration: 10,  // seconds
    resolution: "720p"
  }
);

// Save the video
fs.writeFileSync('generated-video.mp4', video.data);
console.log("Video saved to generated-video.mp4");

// Text-to-video with audio narration
const narratedVideo = await gemini.videoGeneration.generateWithNarration(
  "A documentary about coral reefs",
  "Coral reefs are some of the most diverse ecosystems on the planet...",
  { duration: 30 }
);

fs.writeFileSync('narrated-video.mp4', narratedVideo.data);
```

### Document Understanding

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Analyze a document
const analysis = await gemini.documentUnderstanding.analyze(
  "/path/to/document.pdf",
  { extractText: true, extractStructure: true }
);

console.log("Document text:", analysis.text);
console.log("Document structure:", analysis.structure);

// Answer questions about a document
const answer = await gemini.documentUnderstanding.answerQuestion(
  "/path/to/document.pdf",
  "What are the main conclusions in the executive summary?"
);

console.log("Answer:", answer.text);

// Extract specific data
const data = await gemini.documentUnderstanding.extractData(
  "/path/to/invoice.pdf",
  ["invoice_number", "date", "total_amount", "vendor_name"]
);

console.log("Extracted data:", data);
```

### Audio Understanding

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Transcribe audio
const transcript = await gemini.audioUnderstanding.transcribe(
  "/path/to/recording.mp3"
);

console.log("Transcript:", transcript.text);

// Analyze audio content
const analysis = await gemini.audioUnderstanding.analyze(
  "/path/to/audio.wav",
  { detectLanguage: true, detectSpeakers: true, detectEmotion: true }
);

console.log("Analysis:", analysis);

// Answer questions about audio
const answer = await gemini.audioUnderstanding.answerQuestion(
  "/path/to/lecture.mp3",
  "What were the three main topics discussed?"
);

console.log("Answer:", answer.text);
```

### Video Understanding

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Analyze video content
const analysis = await gemini.videoUnderstanding.analyze(
  "/path/to/video.mp4",
  { 
    analyzeScenes: true,
    analyzeObjects: true,
    analyzeActions: true 
  }
);

console.log("Video analysis:", analysis);

// Generate video summary
const summary = await gemini.videoUnderstanding.summarize(
  "/path/to/video.mp4",
  { maxLength: 300 }  // Max summary length in words
);

console.log("Video summary:", summary.text);

// Answer questions about a video
const answer = await gemini.videoUnderstanding.answerQuestion(
  "/path/to/tutorial.mp4",
  "What are the key steps in the process demonstrated?"
);

console.log("Answer:", answer.text);
```

### Code Execution

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Generate code
const codeResponse = await gemini.codeExecution.generateCode(
  "Write a function to calculate the Fibonacci sequence in JavaScript"
);

console.log("Generated code:", codeResponse.code);

// Execute generated code
const result = await gemini.codeExecution.executeCode(
  codeResponse.code,
  "javascript",
  { input: "10" }  // Optional input for the code
);

console.log("Execution result:", result);

// Debug code
const debugResult = await gemini.codeExecution.debugCode(
  `function sum(a, b) {
    return a - b;  // Bug: should be a + b
  }`,
  "javascript"
);

console.log("Debug suggestions:", debugResult.suggestions);
```

### Structured Output

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Define the output schema
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
    interests: { 
      type: "array",
      items: { type: "string" }
    },
    contact: {
      type: "object",
      properties: {
        email: { type: "string" },
        phone: { type: "string" }
      }
    }
  },
  required: ["name", "age", "interests"]
};

// Generate structured data
const structuredData = await gemini.structuredOutput.generate(
  "Create a profile for a fictional character named John who loves technology",
  { schema }
);

console.log("Structured output:", structuredData.data);

// Generate structured array
const arraySchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: { type: "string" },
      author: { type: "string" },
      year: { type: "number" }
    },
    required: ["title", "author"]
  }
};

const bookList = await gemini.structuredOutput.generate(
  "Create a list of 5 science fiction books",
  { schema: arraySchema }
);

console.log("Book list:", bookList.data);
```

### Token Counter

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Count tokens in text
const tokenCount = await gemini.tokenCounter.countTokens(
  "This is a sample text that I want to count tokens for."
);

console.log("Token count:", tokenCount.totalTokens);

// Estimate cost
const costEstimate = await gemini.tokenCounter.estimateCost(
  "This is a sample prompt.",
  { model: "gemini-pro", includeResponse: true, estimatedResponseLength: 500 }
);

console.log("Estimated cost:", costEstimate);

// Get usage from a response
const response = await gemini.textGeneration.generate("Tell me about Mars");
const usage = gemini.tokenCounter.getUsageFromResponse(response);

console.log("Prompt tokens:", usage.promptTokenCount);
console.log("Response tokens:", usage.completionTokenCount);
console.log("Total tokens:", usage.totalTokenCount);
```

### Thinking (Chain of Thought)

```javascript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Generate with visible thinking process
const thinking = await gemini.thinking.generateWithVisibleThinking(
  "What would happen if gravity suddenly became twice as strong?"
);

console.log("Thinking process:", thinking.thinkingProcess);
console.log("Final answer:", thinking.finalAnswer);

// Generate with internal thinking
const response = await gemini.thinking.generateWithInternalThinking(
  "Solve the following math problem step by step: If a train travels at 120 km/h and needs to cover a distance of 450 km, how long will the journey take?"
);

console.log("Response:", response.text);
```

## Documentation

For detailed documentation on all features, please visit:

- [Models Overview](https://github.com/bantoinese83/gemini-nexus/blob/main/docs/models.md)
- [Gemini 2.5 Models Guide](https://github.com/bantoinese83/gemini-nexus/blob/main/docs/gemini-2.5-models.md)
- [File API Documentation](https://github.com/bantoinese83/gemini-nexus/blob/main/docs/file-api.md)
- [Search Grounding Guide](https://github.com/bantoinese83/gemini-nexus/blob/main/docs/search-grounding.md)
- [Token Counter Documentation](https://github.com/bantoinese83/gemini-nexus/blob/main/docs/token-counter.md)

## Development

This SDK depends on Google's Generative AI SDK. If you're developing this package, install the necessary dependencies:

```bash
npm install @google/generative-ai
npm install --save-dev @types/node-fetch
npm install node-fetch
```

To build the package:

```bash
npm run build
```

## Testing

This SDK comes with a comprehensive test suite:

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

## Examples

The repository includes comprehensive examples for all features in the `/examples` directory:

- `basic-usage.ts` - Simple text generation and chat examples
- `thinking.ts` - Using chain-of-thought capabilities
- `gemini-2.5-flash.ts` - Examples for the Gemini 2.5 Flash model
- `fileApi.ts` - File API usage examples
- `functionCalling.ts` - Function calling for agentic use cases
- `imageUnderstanding.ts` - Image analysis and processing
- `videoUnderstanding.ts` - Video analysis
- `audioUnderstanding.ts` - Audio analysis and transcription
- `documentUnderstanding.ts` - Document processing
- `searchGrounding.ts` - Using Google Search for grounding

## Current Status

This SDK is currently in alpha (v0.1.0-alpha.4). Some features are implemented as stubs and will be expanded in future versions.

## License

MIT

## Links

- [GitHub Repository](https://github.com/bantoinese83/gemini-nexus)
- [NPM Package](https://www.npmjs.com/package/gemini-nexus)
- [Issues](https://github.com/bantoinese83/gemini-nexus/issues)

## Getting Help

If you need help with using Gemini Nexus, here are some resources:

- **Documentation**: First check the [documentation](https://github.com/bantoinese83/gemini-nexus/tree/main/docs) which covers all features in detail
- **Examples**: Look at the [examples directory](https://github.com/bantoinese83/gemini-nexus/tree/main/examples) for code samples covering all SDK capabilities
- **GitHub Issues**: If you encounter a bug or want to request a feature, please [open an issue](https://github.com/bantoinese83/gemini-nexus/issues/new)
- **Questions**: For questions about usage, you can [start a discussion](https://github.com/bantoinese83/gemini-nexus/discussions) on GitHub
- **Contributing**: Contributions are welcome! Please read our [contributing guidelines](https://github.com/bantoinese83/gemini-nexus/blob/main/CONTRIBUTING.md) before submitting PRs

For commercial support options or partnerships, please reach out via email at B.Antoine.SE@Gmail.com. 