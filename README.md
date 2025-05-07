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

This SDK is currently in alpha (v0.1.0-alpha.3). Some features are implemented as stubs and will be expanded in future versions.

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

For commercial support options or partnerships, please reach out via email at your.email@example.com. 