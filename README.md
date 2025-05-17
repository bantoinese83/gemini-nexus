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

## Modern Quickstart

```typescript
import { GeminiClient } from 'gemini-nexus';
import { SchemaType } from 'gemini-nexus/types';

async function quickstart() {
  // Enable debug mode for all API calls
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);

  // Suggest a model for a coding task
  const bestModel = gemini.suggestModelForTask('code');
  console.log('Suggested model for code:', bestModel);

  // Use the new auto text generation method
  const autoText = await gemini.textGeneration.generateAuto('Explain the difference between TypeScript and JavaScript.');
  console.log('Auto text generation:', autoText.text);

  // Use the new auto function calling method
  const weatherFn = {
    name: 'get_weather',
    description: 'Get the current weather for a city.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        city: { type: SchemaType.STRING, description: 'City name' }
      },
      required: ['city']
    }
  };
  const autoFunc = await gemini.functionCalling.generateAuto('What is the weather in Paris?', [weatherFn]);
  console.log('Auto function calling:', autoFunc.text, autoFunc.functionCalls);

  // Demonstrate file upload + wait (commented out for safety)
  // const file = await gemini.files.uploadAndWait({ file: 'examples/data/sample.pdf', config: { mimeType: 'application/pdf' } });
  // console.log('File uploaded and active:', file);
}

quickstart();
```

## Auto Methods for All Services

All major services now provide an `auto` method that selects the best model/config for your task. These are the recommended entry point for most use cases.

| Service                | Auto Method Example Script                | Usage Example |
|------------------------|-------------------------------------------|--------------|
| Text Generation        | `examples/text-auto.ts`                   | `await gemini.textGeneration.generateAuto('Summarize...')` |
| Function Calling       | `examples/function-calling-auto.ts`       | `await gemini.functionCalling.generateAuto(prompt, [fn])` |
| Document Understanding | `examples/document-auto.ts`               | `await gemini.documentUnderstanding.processDocumentAuto(prompt, filePart)` |
| File Upload            | `examples/file-upload-auto.ts`            | `await gemini.files.uploadAndWait({ file, config })` |
| Audio Understanding    | `examples/audio-auto.ts`                  | `await gemini.audioUnderstanding.analyzeAudioAuto(audioPath, prompt)` |
| Video Understanding    | `examples/video-auto.ts`                  | `await gemini.videoUnderstanding.analyzeVideoAuto(videoPath, prompt)` |
| Image Understanding    | `examples/image-auto.ts`                  | `await gemini.imageUnderstanding.analyzeImageAuto(imagePath, prompt)` |
| Multimodal             | `examples/multimodal-auto.ts`             | `await gemini.multimodal.generateAuto(prompt, imagePath)` |
| Structured Output      | `examples/structured-output-auto.ts`      | `await gemini.structuredOutput.generateAuto(prompt, schema)` |
| Search Grounding       | `examples/search-grounding-auto.ts`       | `await gemini.searchGrounding.generateAuto(prompt)` |
| Code Execution         | `examples/code-execution-auto.ts`         | `await gemini.codeExecution.executeAuto(prompt)` |

Each script is fully documented with JSDoc and ready to run with `ts-node`.

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

## Examples

The repository includes comprehensive examples for all features in the `/examples` directory:

- `basic-usage.ts` - Simple text generation and chat examples
- `text-auto.ts` - Text generation with auto model selection
- `function-calling-auto.ts` - Function calling with auto model selection
- `document-auto.ts` - Document understanding with auto model selection
- `file-upload-auto.ts` - File upload and wait for ACTIVE state
- `audio-auto.ts` - Audio understanding with auto model selection
- `video-auto.ts` - Video understanding with auto model selection
- `image-auto.ts` - Image understanding with auto model selection
- `multimodal-auto.ts` - Multimodal generation with auto model selection
- `structured-output-auto.ts` - Structured output with auto model selection
- `search-grounding-auto.ts` - Search grounding with auto model selection
- `code-execution-auto.ts` - Code execution with auto model selection
- `thinking.ts` - Using chain-of-thought capabilities
- `gemini-2.5-flash.ts` - Examples for the Gemini 2.5 Flash model
- `fileApi.ts` - File API usage examples
- `functionCalling.ts` - Function calling for agentic use cases
- `imageGeneration.ts` - Generate images from text prompts
- `videoGeneration.ts` - Generate videos from text prompts or images
- `imageUnderstanding.ts` - Image analysis and processing
- `videoUnderstanding.ts` - Video analysis
- `audioUnderstanding.ts` - Audio analysis and transcription
- `documentUnderstanding.ts` - Document processing
- `searchGrounding.ts` - Using Google Search for grounding
- `structuredOutput.ts` - Generate structured JSON data
- `codeExecution.ts` - Execute code and get results
- `multimodal.ts` - Process multiple types of content together

> **Note:** All auto example scripts are fully documented with JSDoc and ready to run with `ts-node`. They are the recommended starting point for most use cases.

## Current Status

This SDK is currently in alpha (v0.1.0-alpha.6). Some features are implemented as stubs and will be expanded in future versions.

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

## Next.js API Route Compatibility

If you use the gemini-nexus SDK in Next.js API routes, you must ensure your API routes run in the Node.js runtime (not the Edge runtime). This is because the SDK uses Node.js modules (like `fs`, `path`, etc.), which are not available in the Edge runtime.

**To do this, add the following line to the top of every API route file that uses Node.js modules:**

```ts
export const runtime = "nodejs";
```

### Automate with Patch Script

To avoid adding this manually to every file, you can use the provided `patch-api-runtime.js` script to automatically add the export to all your API route files:

1. Make sure `patch-api-runtime.js` is in your project root (see below for script contents).
2. Run:

```sh
node patch-api-runtime.js
```

This will add `export const runtime = "nodejs";` to the top of every `route.ts` file under `demo/src/app/api/gemini/` if not already present.

**Example script:**
```js
const fs = require('fs');
const path = require('path');

const apiRoot = path.join(__dirname, 'demo/src/app/api/gemini');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const runtime = "nodejs";')) {
    content = 'export const runtime = "nodejs";\n' + content;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      patchFile(fullPath);
    }
  });
}

walk(apiRoot);
console.log('✅ All API routes patched with Node.js runtime!');
```

**After running the script, restart your dev server.**

For more details, see the [Next.js documentation on API route runtimes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-into-nodejs-runtime).

## Services Documentation

For detailed instructions on how to use the Gemini SDK services, please refer to the [services README](src/services/README.md).
