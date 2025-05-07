# Understanding and Counting Tokens in the Gemini API

Gemini models process text and other content at a granularity called a token. This guide explains what tokens are, why they matter, and how to use our SDK to count them.

## What are Tokens?

Tokens are the units of text that models process. A token can be a single character, a part of a word, or a whole word. For Gemini models:

- A token is approximately 4 characters of English text
- 100 tokens is roughly equivalent to 60-80 English words
- Tokens vary by language - languages with non-Latin alphabets may use more tokens per word

Understanding token counts is important for:

1. **Managing API costs**: Charges are based on the number of input and output tokens
2. **Staying within model limits**: Each model has maximum token limits
3. **Optimizing prompt engineering**: Knowing token counts helps optimize prompt designs

## Token Counter Features

Our SDK provides a `tokenCounter` service with these methods:

- `countTokensInText()` - Count tokens in text-only content
- `countTokensInContent()` - Count tokens in multimodal content
- `countTokensInChatHistory()` - Count tokens in chat conversations
- `getUsageFromResponse()` - Extract token usage from API responses

## Basic Usage

### Counting Tokens in Text

```typescript
const result = await gemini.tokenCounter.countTokensInText(
  "The quick brown fox jumps over the lazy dog."
);

console.log("Total tokens:", result.totalTokens);
```

### Counting Tokens in Multimodal Content

```typescript
// Count tokens in content with text and image
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const base64Image = imageBuffer.toString('base64');

const content = [
  { text: "Describe this image:" },
  { 
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg"
    }
  }
];

const result = await gemini.tokenCounter.countTokensInContent(content);
console.log("Total tokens:", result.totalTokens);
```

### Counting Tokens in Chat History

```typescript
const history = [
  { role: "user", parts: [{ text: "Hi my name is Bob" }] },
  { role: "model", parts: [{ text: "Hi Bob!" }] }
];

const result = await gemini.tokenCounter.countTokensInChatHistory(history);
console.log("Total tokens:", result.totalTokens);
```

### Getting Token Usage from a Response

```typescript
const response = await gemini.textGeneration.generate("Hello, world!");

const usage = gemini.tokenCounter.getUsageFromResponse(response);
console.log("Total tokens:", usage?.totalTokenCount);
console.log("Prompt tokens:", usage?.promptTokenCount);
console.log("Output tokens:", usage?.candidatesTokenCount);
```

## Understanding Multimodal Token Counting

The Gemini API counts tokens for different content types in specific ways:

### Images

- With Gemini 2.0, images ≤384 pixels in both dimensions count as 258 tokens
- Larger images are cropped and scaled into 768x768 pixel tiles, each counting as 258 tokens
- Prior to Gemini 2.0, images used a fixed 258 tokens regardless of size

### Video and Audio

- Video files: 263 tokens per second
- Audio files: 32 tokens per second

## Token Limits

Each Gemini model has different token limits for the combined input and output:

| Model | Maximum Total Tokens | 
|-------|---------------------|
| gemini-2.5-pro-preview-05-06 | 2,000,000 |
| gemini-2.5-flash-preview-04-17 | 2,000,000 |
| gemini-2.0-pro | 32,768 |
| gemini-2.0-flash | 15,360 |
| gemini-2.0-flash-lite | 15,360 |
| gemini-1.5-pro | 1,048,576 |
| gemini-1.5-flash | 1,048,576 |
| gemini-1.5-flash-8b | 1,048,576 |

When working with these models, it's important to ensure your requests (including inputs and expected outputs) remain within these limits.

## Cost Considerations

Token counting is essential for understanding and managing API costs. Pricing for the Gemini API is structured as:

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Length/Mode |
|-------|----------------------|-------------------------|----------------|
| gemini-2.5-pro-preview-05-06 | $1.25 | $10.00 | ≤200K tokens |
| gemini-2.5-pro-preview-05-06 | $2.50 | $15.00 | >200K tokens |
| gemini-2.5-flash-preview-04-17 | $0.15 | $3.50 | Thinking mode |
| gemini-2.5-flash-preview-04-17 | $0.15 | $0.60 | Non-thinking mode |
| gemini-2.0-flash | $0.10 | $0.40 | All |
| gemini-2.0-flash-lite | $0.075 | $0.30 | All |
| gemini-1.5-pro | $1.25 | $5.00 | ≤128K tokens |
| gemini-1.5-pro | $2.50 | $10.00 | >128K tokens |
| gemini-1.5-flash | $0.075 | $0.30 | ≤128K tokens | 
| gemini-1.5-flash | $0.15 | $0.60 | >128K tokens |
| gemini-1.5-flash-8b | $0.0375 | $0.15 | ≤128K tokens |
| gemini-1.5-flash-8b | $0.075 | $0.30 | >128K tokens |

These rates are subject to change. Refer to Google's official pricing documentation for the most up-to-date information.

## Rate Limits

Each model has different rate limits:

| Model | Rate Limit (RPM) | Free Tier |
|-------|-----------------|-----------|
| gemini-2.5-pro-preview-05-06 | 150 | 5 RPM, 25 req/day |
| gemini-2.5-flash-preview-04-17 | 1000 | 10 RPM, 500 req/day |
| gemini-2.0-flash | 2000 | 15 RPM, 1500 req/day |
| gemini-2.0-flash-lite | 4000 | 30 RPM, 1500 req/day |
| gemini-1.5-pro | 1000 | 2 RPM, 50 req/day |
| gemini-1.5-flash | 2000 | 15 RPM, 1500 req/day |
| gemini-1.5-flash-8b | 4000 | 15 RPM, 1500 req/day |

RPM = Requests Per Minute

## Best Practices

- Count tokens before sending large requests to avoid exceeding model limits
- For chat applications, monitor the accumulated token count of the conversation 
- For multimodal inputs, remember that images, audio, and video add significantly to the token count
- Consider token costs when designing prompts and applications
- For cost-sensitive applications, consider using the more affordable models like gemini-1.5-flash-8b or gemini-2.0-flash-lite
- For applications requiring the highest capabilities, use gemini-2.5-pro-preview-05-06

## Example

For a complete working example, see [examples/tokenCounter.ts](../examples/tokenCounter.ts) in the SDK repository. 