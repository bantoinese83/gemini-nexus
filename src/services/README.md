# Gemini SDK Services

This directory contains various service files for different functionalities of the Gemini SDK. Below is an overview of each service, example usage, and links to relevant documentation.

## Overview of Services

### Text Generation Service

The `textGeneration` service provides methods for generating text using Gemini models.

**Example Usage:**

```typescript
const response = await gemini.textGeneration.generate("How does AI work?");
console.log(response.text);
```

**Relevant Documentation:**
- [Text Generation Guide](../../docs/text-generation.md)

### Chat Service

The `chat` service allows for multi-turn chat conversations with Gemini models.

**Example Usage:**

```typescript
const chat = gemini.chat.createChat();
const reply = await chat.sendMessage("Hello, how are you?");
console.log(reply.text);
```

**Relevant Documentation:**
- [Chat Guide](../../docs/chat.md)

### Multimodal Service

The `multimodal` service provides methods for processing images, audio, and video inputs.

**Example Usage:**

```typescript
const imageResponse = await gemini.multimodal.generateFromImage(
  "Describe this image in detail",
  "/path/to/image.jpg"
);
console.log(imageResponse.text);
```

**Relevant Documentation:**
- [Multimodal Guide](../../docs/multimodal.md)

### Image Generation Service

The `imageGeneration` service allows for generating images from text prompts.

**Example Usage:**

```typescript
const image = await gemini.imageGeneration.generate(
  "A futuristic city with flying cars and neon lights",
  { 
    size: "1024x1024",
    style: "vivid"
  }
);
```

**Relevant Documentation:**
- [Image Generation Guide](../../docs/image-generation.md)

### Video Generation Service

The `videoGeneration` service provides methods for creating videos from text descriptions.

**Example Usage:**

```typescript
const video = await gemini.videoGeneration.generate(
  "A time-lapse of a blooming flower",
  { 
    duration: 10,  // seconds
    resolution: "720p"
  }
);
```

**Relevant Documentation:**
- [Video Generation Guide](../../docs/video-generation.md)

### Structured Output Service

The `structuredOutput` service allows for generating data in structured formats.

**Example Usage:**

```typescript
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

const structuredData = await gemini.structuredOutput.generate(
  "Create a profile for a fictional character named John who loves technology",
  { schema }
);
```

**Relevant Documentation:**
- [Structured Output Guide](../../docs/structured-output.md)

### Thinking Service

The `thinking` service provides access to Gemini's chain-of-thought capabilities.

**Example Usage:**

```typescript
const response = await gemini.thinking.generate(
  "What would happen if gravity suddenly became twice as strong?"
);
console.log(response.text);
```

**Relevant Documentation:**
- [Thinking Guide](../../docs/thinking.md)

### Function Calling Service

The `functionCalling` service allows for defining custom functions for agentic use cases.

**Example Usage:**

```typescript
const weatherFn = {
  name: 'get_weather',
  description: 'Get the current weather for a city.',
  parameters: {
    type: "object",
    properties: {
      city: { type: "string", description: 'City name' }
    },
    required: ['city']
  }
};

const response = await gemini.functionCalling.generate(
  "What is the weather in Paris?",
  [weatherFn]
);
console.log(response.text, response.functionCalls);
```

**Relevant Documentation:**
- [Function Calling Guide](../../docs/function-calling.md)

### File Service

The `files` service provides methods for uploading, managing, and processing files with Gemini.

**Example Usage:**

```typescript
const uploadedFile = await gemini.files.upload("/path/to/document.pdf");
console.log("File uploaded:", uploadedFile.name);
```

**Relevant Documentation:**
- [File API Guide](../../docs/file-api.md)

### Document Understanding Service

The `documentUnderstanding` service provides methods for analyzing and extracting information from documents.

**Example Usage:**

```typescript
const analysis = await gemini.documentUnderstanding.analyze(
  "/path/to/document.pdf",
  { extractText: true, extractStructure: true }
);
console.log("Document text:", analysis.text);
```

**Relevant Documentation:**
- [Document Understanding Guide](../../docs/document-understanding.md)

### Image Understanding Service

The `imageUnderstanding` service provides methods for processing and analyzing images.

**Example Usage:**

```typescript
const analysis = await gemini.imageUnderstanding.analyze(
  "/path/to/image.jpg",
  { detectObjects: true, detectText: true }
);
console.log("Image analysis:", analysis);
```

**Relevant Documentation:**
- [Image Understanding Guide](../../docs/image-understanding.md)

### Audio Understanding Service

The `audioUnderstanding` service provides methods for transcribing and analyzing audio content.

**Example Usage:**

```typescript
const transcript = await gemini.audioUnderstanding.transcribe(
  "/path/to/recording.mp3"
);
console.log("Transcript:", transcript.text);
```

**Relevant Documentation:**
- [Audio Understanding Guide](../../docs/audio-understanding.md)

### Video Understanding Service

The `videoUnderstanding` service provides methods for processing and analyzing video content.

**Example Usage:**

```typescript
const analysis = await gemini.videoUnderstanding.analyze(
  "/path/to/video.mp4",
  { 
    analyzeScenes: true,
    analyzeObjects: true,
    analyzeActions: true 
  }
);
console.log("Video analysis:", analysis);
```

**Relevant Documentation:**
- [Video Understanding Guide](../../docs/video-understanding.md)

### Code Execution Service

The `codeExecution` service provides methods for generating and executing code with AI assistance.

**Example Usage:**

```typescript
const codeResponse = await gemini.codeExecution.generateCode(
  "Write a function to calculate the Fibonacci sequence in JavaScript"
);
console.log("Generated code:", codeResponse.code);
```

**Relevant Documentation:**
- [Code Execution Guide](../../docs/code-execution.md)

### Search Grounding Service

The `searchGrounding` service provides methods for grounding responses in Google Search results.

**Example Usage:**

```typescript
const response = await gemini.searchGrounding.generate(
  "Who individually won the most bronze medals during the Paris olympics in 2024?"
);
console.log(response.text);
```

**Relevant Documentation:**
- [Search Grounding Guide](../../docs/search-grounding.md)

### Token Counter Service

The `tokenCounter` service provides methods for tracking and managing token usage and costs.

**Example Usage:**

```typescript
const tokenCount = await gemini.tokenCounter.countTokens(
  "This is a sample text that I want to count tokens for."
);
console.log("Token count:", tokenCount.totalTokens);
```

**Relevant Documentation:**
- [Token Counter Guide](../../docs/token-counter.md)
```
