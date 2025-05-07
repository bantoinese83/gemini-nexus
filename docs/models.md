# Gemini Models

The Gemini API offers a range of models with different capabilities, context lengths, and pricing. This guide provides information about the available models and their characteristics.

## Available Models

### Gemini 2.5 Pro Preview (05-06)

**Model name:** `gemini-2.5-pro-preview-05-06`

**Capabilities:**
- Superior coding performance
- Advanced reasoning abilities
- Excellent multimodal understanding
- Massive context window (2 million tokens)

**Best for:**
- Complex coding tasks
- Advanced reasoning
- Multimodal understanding

**Use cases:**
- Reasoning over complex problems
- Tackling difficult code, math, and STEM problems
- Analyzing large datasets, codebases, or documents with the long context

**Pricing:**
- Input: $1.25 per 1M tokens (≤200K tokens)
- Input: $2.50 per 1M tokens (>200K tokens)
- Output: $10.00 per 1M tokens (≤200K tokens)
- Output: $15.00 per 1M tokens (>200K tokens)

**Limits:**
- Maximum tokens: 2,000,000
- Rate limit: 150 RPM
- Free tier: 5 RPM, 25 req/day
- Knowledge cutoff: January 2025

### Gemini 2.5 Flash Preview (04-17)

**Model name:** `gemini-2.5-flash-preview-04-17`

**Capabilities:**
- Fast processing of large datasets
- Visible thinking process
- Strong tool use abilities
- Massive context window (2 million tokens)
- Agentic capabilities

**Best for:**
- Large scale processing (e.g., multiple PDFs)
- Low latency, high volume tasks which require thinking
- Agentic use cases

**Use cases:**
- Reasoning over complex problems
- Showing the thinking process of the model
- Calling tools natively

**Pricing:**
- Input: $0.15 per 1M tokens (all context lengths)
- Output: $3.50 per 1M tokens (thinking mode)
- Output: $0.60 per 1M tokens (non-thinking mode)

**Limits:**
- Maximum tokens: 2,000,000
- Rate limit: 1000 RPM
- Free tier: 10 RPM, 500 req/day
- Knowledge cutoff: January 2025

### Gemini 2.0 Flash

**Model name:** `gemini-2.0-flash`

**Capabilities:**
- Fast response time
- Good multimodal understanding
- Realtime streaming
- Native tool usage

**Best for:**
- Multimodal understanding
- Realtime streaming
- Native tool use

**Use cases:**
- Processing up to 10,000 lines of code
- Calling tools natively, like Search
- Streaming images and video in realtime

**Pricing:**
- Input: $0.10 per 1M tokens
- Output: $0.40 per 1M tokens

**Limits:**
- Maximum tokens: 15,360
- Rate limit: 2000 RPM
- Free tier: 15 RPM, 1500 req/day
- Knowledge cutoff: August 2024

### Gemini 2.0 Flash-Lite

**Model name:** `gemini-2.0-flash-lite`

**Capabilities:**
- Long context handling
- Cost-effective
- Realtime streaming
- Native tool usage

**Best for:**
- Long context
- Realtime streaming
- Native tool use

**Use cases:**
- Processing up to 10,000 lines of code
- Calling tools natively
- Streaming images and video in realtime

**Pricing:**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Limits:**
- Maximum tokens: 15,360
- Rate limit: 4000 RPM
- Free tier: 30 RPM, 1500 req/day
- Knowledge cutoff: August 2024

### Gemini 2.0 Flash (Image Generation) - Experimental

**Model name:** `gemini-2.0-flash-exp-image-generation`

**Capabilities:**
- Multimodal understanding
- Multimodal generation
- Native tool usage

**Best for:**
- Multimodal understanding
- Multimodal generation
- Native tool use

**Use cases:**
- Processing up to 10,000 lines of code
- Calling tools natively, like Search
- Generating interleaved text and images

**Pricing:**
- Currently free during experimental phase

**Limits:**
- Rate limit: 10 RPM
- Free tier: 10 RPM, 1500 req/day
- Knowledge cutoff: August 2024

### Gemini 1.5 Pro

**Model name:** `gemini-1.5-pro`

**Capabilities:**
- Million-token context window
- Strong reasoning
- Math capabilities

**Best for:**
- Long context
- Complex reasoning
- Math reasoning

**Use cases:**
- Reasoning over 100k lines of code
- Synthesizing 400 podcast transcripts

**Pricing:**
- Input: $1.25 per 1M tokens (≤128K tokens)
- Input: $2.50 per 1M tokens (>128K tokens)
- Output: $5.00 per 1M tokens (≤128K tokens)
- Output: $10.00 per 1M tokens (>128K tokens)

**Limits:**
- Maximum tokens: 1,048,576
- Rate limit: 1000 RPM
- Free tier: 2 RPM, 50 req/day
- Knowledge cutoff: August 2024

### Gemini 1.5 Flash

**Model name:** `gemini-1.5-flash`

**Capabilities:**
- Strong multimodal understanding
- Long context window
- Fast response time

**Best for:**
- Image understanding
- Video understanding
- Audio understanding

**Use cases:**
- Processing 3,000 images at a time
- Analyzing 1-hour long videos
- Listening to hours of audio

**Pricing:**
- Input: $0.075 per 1M tokens (≤128K tokens)
- Input: $0.15 per 1M tokens (>128K tokens)
- Output: $0.30 per 1M tokens (≤128K tokens)
- Output: $0.60 per 1M tokens (>128K tokens)

**Limits:**
- Maximum tokens: 1,048,576
- Rate limit: 2000 RPM
- Free tier: 15 RPM, 1500 req/day
- Knowledge cutoff: August 2024

### Gemini 1.5 Flash-8B

**Model name:** `gemini-1.5-flash-8b`

**Capabilities:**
- Very low latency
- Excellent multilingual support
- Cost-effective

**Best for:**
- Low latency operations
- Multilingual tasks
- Summarization

**Use cases:**
- Realtime data transformation
- Realtime translation
- Summarizing large amounts of text (equivalent to 8 average English novels)

**Pricing:**
- Input: $0.0375 per 1M tokens (≤128K tokens)
- Input: $0.075 per 1M tokens (>128K tokens)
- Output: $0.15 per 1M tokens (≤128K tokens)
- Output: $0.30 per 1M tokens (>128K tokens)

**Limits:**
- Maximum tokens: 1,048,576
- Rate limit: 4000 RPM
- Free tier: 15 RPM, 1500 req/day
- Knowledge cutoff: August 2024

## Choosing the Right Model

When selecting a model for your application, consider these factors:

1. **Task Complexity:** For complex tasks requiring advanced reasoning, coding, or multimodal understanding, choose Gemini 2.5 Pro Preview or Gemini 1.5 Pro.

2. **Response Speed:** For applications requiring fast responses, consider Gemini 2.0 Flash, Gemini 2.0 Flash-Lite, or Gemini 1.5 Flash-8B.

3. **Cost Considerations:** For cost-sensitive applications, Gemini 1.5 Flash-8B and Gemini 2.0 Flash-Lite offer the most economical options.

4. **Context Length Needs:** If you need to process large amounts of text or code, models with longer context windows like Gemini 2.5 Pro Preview, Gemini 2.5 Flash Preview, or Gemini 1.5 Pro/Flash (1M+ tokens) are appropriate.

5. **Multimodal Requirements:** For applications that need to understand images, audio, or video, Gemini 2.5 Pro Preview, Gemini 2.5 Flash Preview, Gemini 2.0 Flash, or Gemini 1.5 Flash/Pro offer strong multimodal capabilities.

6. **Thinking Process:** If you need to see the model's thinking process or want it to "think through" complex problems, use Gemini 2.5 Flash Preview or Gemini 2.5 Pro Preview with thinking mode.

7. **Budget and Usage Pattern:** Consider the balance between the free tier allowances, pricing tiers, and your expected usage volumes.

## Using Models in the SDK

You can specify the model when making API calls:

```typescript
// Using Gemini 2.5 Pro Preview
const response = await gemini.textGeneration.generate(
  "Explain quantum computing in simple terms",
  { model: "gemini-2.5-pro-preview-05-06" }
);

// Or use the enum from the SDK
const response = await gemini.textGeneration.generate(
  "Explain quantum computing in simple terms",
  { model: GeminiModel.PRO_25_PREVIEW }
);

// Using a model with thinking enabled
const responseWithThinking = await gemini.textGeneration.generate(
  "Solve this complex math problem step by step: Find all values of x such that x^4 - 5x^2 + 4 = 0",
  { 
    model: GeminiModel.FLASH_25_PREVIEW,
    thinkingConfig: { thinkingBudget: 1000 } // Allocate tokens for thinking
  }
);
```

## Monitoring Usage

Use the token counter service to track your token usage:

```typescript
const text = "Your prompt or content here";
const result = await gemini.tokenCounter.countTokensInText(text);
console.log(`This will use approximately ${result.totalTokens} input tokens`);
```

## Model Updates

Google frequently updates and improves their models. The information in this guide is current as of the last update, but check the official Google documentation for the latest model capabilities, pricing, and availability. 