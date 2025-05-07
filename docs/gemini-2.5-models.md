# Using Gemini 2.5 Models

The Gemini 2.5 family of models represents the latest generation of Google's AI models, offering significant improvements in reasoning, coding, and multimodal understanding capabilities. This guide focuses specifically on how to use these models effectively with our SDK.

## Available Gemini 2.5 Models

Our SDK currently supports these Gemini 2.5 models:

| Model | ID | Best For | Context Window |
|-------|----|---------|--------------------|
| Gemini 2.5 Pro Preview | `gemini-2.5-pro-preview-05-06` | Advanced reasoning, coding, multimodal tasks | 2M tokens |
| Gemini 2.5 Flash Preview | `gemini-2.5-flash-preview-04-17` | Large-scale processing, agentic tasks, tool use | 2M tokens |

## Unique Capabilities

### Thinking Process

A key feature of Gemini 2.5 models is their ability to "think" about problems before responding. This thinking process can be controlled through the thinkingConfig parameter:

```typescript
// Using Gemini 2.5 Flash Preview with thinking enabled
const response = await gemini.textGeneration.generate(
  "Solve this complex math problem step by step: x^4 - 5x^2 + 4 = 0",
  { 
    model: GeminiModel.FLASH_25_PREVIEW,
    thinkingConfig: { thinkingBudget: 1000 } // Allocate 1000 tokens for thinking
  }
);
```

Adjusting the `thinkingBudget` parameter lets you control how much "thinking" the model does before responding. This is particularly useful for complex reasoning tasks.

### Massive Context Window

Both Gemini 2.5 models support a 2 million token context window, allowing them to process extremely large documents or datasets:

```typescript
// Processing a large document with Gemini 2.5 Pro Preview
const fileMetadata = await gemini.files.upload({
  file: 'path/to/large-document.pdf',
  config: { mimeType: "application/pdf" }
});

const processedFile = await gemini.files.waitForFileState(fileMetadata.name);
const filePart = gemini.files.createPartFromUri(processedFile.uri, processedFile.mimeType);

const response = await gemini.documentUnderstanding.processDocument(
  "Summarize the key findings from this research paper in 5 paragraphs",
  filePart,
  { model: GeminiModel.PRO_25_PREVIEW }
);
```

## Common Use Cases

### Complex Coding Tasks

Gemini 2.5 Pro Preview excels at coding tasks:

```typescript
const codingTask = await gemini.textGeneration.generate(
  `Create a JavaScript function that implements a binary search tree with 
   methods for insertion, deletion, and traversal. Include detailed comments 
   explaining the time complexity of each operation.`,
  { 
    model: GeminiModel.PRO_25_PREVIEW,
    temperature: 0.2
  }
);
```

### Large-scale Document Processing

Gemini 2.5 Flash Preview is ideal for processing multiple documents:

```typescript
// Upload multiple documents
const doc1 = await gemini.files.upload({ file: 'document1.pdf' });
const doc2 = await gemini.files.upload({ file: 'document2.pdf' });
const doc3 = await gemini.files.upload({ file: 'document3.pdf' });

// Wait for processing
const processedDoc1 = await gemini.files.waitForFileState(doc1.name);
const processedDoc2 = await gemini.files.waitForFileState(doc2.name);
const processedDoc3 = await gemini.files.waitForFileState(doc3.name);

// Create file parts
const filePart1 = gemini.files.createPartFromUri(processedDoc1.uri, processedDoc1.mimeType);
const filePart2 = gemini.files.createPartFromUri(processedDoc2.uri, processedDoc2.mimeType);
const filePart3 = gemini.files.createPartFromUri(processedDoc3.uri, processedDoc3.mimeType);

// Process multiple documents together
const response = await gemini.documentUnderstanding.processMultipleDocuments(
  "Compare and contrast the methodologies described in these research papers",
  [filePart1, filePart2, filePart3],
  { 
    model: GeminiModel.FLASH_25_PREVIEW,
    thinkingConfig: { thinkingBudget: 5000 }
  }
);
```

### Agentic Use Cases with Tool Calling

Gemini 2.5 Flash Preview works well with function calling for agentic applications:

```typescript
// Define a weather function
const weatherFunction = {
  name: "getWeather",
  description: "Get the current weather for a location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g., San Francisco, CA"
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "The unit of temperature"
      }
    },
    required: ["location"]
  }
};

// Use Gemini 2.5 Flash Preview with function calling
const response = await gemini.functionCalling.generateWithMode(
  "What's the weather like in Tokyo and San Francisco? Compare them and recommend which city has nicer weather today.",
  [weatherFunction],
  FunctionCallingMode.ANY,
  undefined,
  { 
    model: GeminiModel.FLASH_25_PREVIEW,
    thinkingConfig: { thinkingBudget: 1000 }
  }
);
```

## Best Practices

### Optimizing for Cost and Performance

1. **Selective Thinking**: While the thinking capability is powerful, it's more expensive. Use it selectively for complex tasks where step-by-step reasoning is valuable.

```typescript
// For simple tasks, avoid using thinking budget
const simpleResponse = await gemini.textGeneration.generate(
  "What's the capital of France?",
  { model: GeminiModel.FLASH_25_PREVIEW }
);

// For complex tasks, enable thinking
const complexResponse = await gemini.textGeneration.generate(
  "Explain quantum entanglement and its implications for quantum computing",
  { 
    model: GeminiModel.FLASH_25_PREVIEW,
    thinkingConfig: { thinkingBudget: 2000 }
  }
);
```

2. **Choosing Between Pro and Flash**: 
   - Use Pro Preview for the highest quality results on complex tasks
   - Use Flash Preview for faster responses and more cost-effective processing of large volumes

3. **Context Window Management**: Even though these models can handle up to 2M tokens, only send what's necessary to minimize costs.

## Advanced Usage

### Multimodal Analysis with Thinking

```typescript
// Upload an image
const imageFile = await gemini.files.upload({
  file: "path/to/complex-diagram.jpg",
  config: { mimeType: "image/jpeg" }
});

const processedImageFile = await gemini.files.waitForFileState(imageFile.name);
const imagePart = gemini.files.createPartFromUri(processedImageFile.uri, processedImageFile.mimeType);

// Generate detailed analysis with thinking
const userContent = gemini.files.createUserContent([
  imagePart,
  "Analyze this technical diagram in detail. Explain how each component works and how they interact with each other."
]);

const response = await gemini.models.generateContent({
  model: "gemini-2.5-flash-preview-04-17",
  contents: userContent,
  generationConfig: {
    temperature: 0.2,
    thinkingConfig: { thinkingBudget: 3000 }
  }
});
```

### Structured Output with Gemini 2.5

```typescript
// Generate structured data with Gemini 2.5 Pro Preview
const schema = {
  type: "object",
  properties: {
    analysis: {
      type: "object",
      properties: {
        main_topics: { type: "array", items: { type: "string" } },
        key_findings: { type: "array", items: { type: "string" } },
        sentiment: { type: "string", enum: ["positive", "neutral", "negative"] }
      },
      required: ["main_topics", "key_findings", "sentiment"]
    },
    recommendations: { type: "array", items: { type: "string" } }
  },
  required: ["analysis", "recommendations"]
};

const structuredResponse = await gemini.structuredOutput.generate(
  "Analyze the following quarterly financial report and provide key findings and recommendations: [financial report text]",
  schema,
  { 
    model: GeminiModel.PRO_25_PREVIEW,
    temperature: 0.1
  }
);
```

## Rate Limits and Quotas

Be aware of the rate limits for these preview models:

- Gemini 2.5 Pro Preview: 150 RPM (5 RPM / 25 requests per day on free tier)
- Gemini 2.5 Flash Preview: 1000 RPM (10 RPM / 500 requests per day on free tier)

For high-volume production applications, consider implementing retry logic with exponential backoff.

## Future Updates

As these are preview models, they will be updated regularly with improvements. Check the official Google AI documentation for the latest capabilities and best practices. 