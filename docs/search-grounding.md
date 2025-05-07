# Search Grounding with Google

The Gemini API SDK provides access to Google Search grounding, which improves the accuracy and recency of responses from Gemini models by grounding them in Google Search results.

## Key Features

- **More factual responses**: Gemini grounds its answers in up-to-date information from the web
- **Grounding sources**: Get inline supporting links to the sources used to generate the response
- **Search suggestions**: Display recommended search queries to help users find more information

## Requirements

- A valid Gemini API key with Google Search grounding enabled
- If using the paid tier, you get 1,500 grounding queries per day for free, with additional queries billed at $35 per 1,000 queries

## Usage

### Using Google Search as a Tool (Gemini 2.0+)

For Gemini 2.0 models, Google Search is available as a tool that the model can decide when to use:

```typescript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

const response = await gemini.searchGrounding.generate(
  "Who individually won the most bronze medals during the Paris olympics in 2024?"
);

console.log(response.text);

// Get the search suggestions HTML for display
if (response.groundingMetadata) {
  const searchSuggestionsHTML = response.groundingMetadata.searchEntryPoint.renderedContent;
  // Render this HTML in your application
}
```

### Using Google Search Retrieval (Gemini 1.5 Only)

For Gemini 1.5 models, you can use Google Search retrieval:

```typescript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

const response = await gemini.searchGrounding.generateWithRetrieval(
  "Who individually won the most silver medals during the Paris olympics in 2024?",
  { model: "gemini-1.5-flash" }
);

console.log(response.text);

// Get the search suggestions HTML for display
if (response.groundingMetadata) {
  const searchSuggestionsHTML = response.groundingMetadata.searchEntryPoint.renderedContent;
  // Render this HTML in your application
}
```

### Using Dynamic Retrieval (Gemini 1.5 Flash Only)

For Gemini 1.5 Flash model, you can use dynamic retrieval to control when grounding is applied based on a confidence threshold:

```typescript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

// Set threshold to 0.5 (higher = less likely to use grounding)
const response = await gemini.searchGrounding.generateWithDynamicRetrieval(
  "Who individually won the most gold medals during the Paris olympics in 2024?",
  0.5, // threshold value between 0.0 and 1.0
  { model: "gemini-1.5-flash" }
);

console.log(response.text);
```

### Using Search Grounding in Chat Conversations

You can also use Google Search grounding in multi-turn chat conversations:

```typescript
import GeminiClient from 'gemini-nexus';

const gemini = new GeminiClient('YOUR_API_KEY');

const chatHistory = [
  {
    role: 'user',
    parts: [{ text: 'I have some questions about recent events.' }]
  },
  {
    role: 'model',
    parts: [{ text: 'Sure, I\'d be happy to help with recent events.' }]
  }
];

const response = await gemini.searchGrounding.generateInChat(
  chatHistory,
  "Who won the most recent Formula 1 Grand Prix?"
);

console.log(response.text);
```

## Displaying Google Search Suggestions

When using Grounding with Google Search, you must display Google Search Suggestions to comply with Google's requirements. The SDK provides helper methods to make this easy:

```typescript
// Get the HTML for rendering search suggestions
const suggestionsHTML = gemini.searchGrounding.getSearchSuggestionsHTML(response);
if (suggestionsHTML) {
  // Render this HTML in your application
  document.getElementById('search-suggestions').innerHTML = suggestionsHTML;
}

// Get the search queries used for grounding
const searchQueries = gemini.searchGrounding.getWebSearchQueries(response);
console.log("Search queries used:", searchQueries);
```

### Requirements for Google Search Suggestions

- Display the Search Suggestion exactly as provided without any modifications
- Take users directly to the Google Search results page when they interact with the Search Suggestion
- Do not include any interstitial screens or additional steps between the user's tap and the display of the search results
- Do not display any other search results or suggestions alongside the Search Suggestion

## Response Metadata

A grounded response includes additional metadata:

```typescript
// Example response structure
{
  text: "Answer text...",
  groundingMetadata: {
    searchEntryPoint: {
      renderedContent: "<HTML/CSS for rendering search suggestions>"
    },
    groundingChunks: [
      {
        web: {
          uri: "https://vertexaisearch.cloud.google.com/...",
          title: "example.com"
        }
      }
    ],
    groundingSupports: [
      {
        segment: {
          startIndex: 0,
          endIndex: 100,
          text: "Part of the answer..."
        },
        groundingChunkIndices: [0, 1],
        confidenceScores: [0.95, 0.92]
      }
    ],
    webSearchQueries: ["search query used"]
  }
}
```

## Dynamic Retrieval Explained

The dynamic retrieval feature gives you additional control over when to use Grounding with Google Search:

- **Prediction score**: Gemini assigns a score (0-1) to determine if a prompt can benefit from grounding
- **Threshold**: You can set a threshold (0-1) for when to use grounding:
  - If prediction score ≥ threshold: Response is grounded with Google Search
  - If prediction score < threshold: Response is generated without grounding
  - Default threshold: 0.3
  - Setting threshold to 0: Always ground responses
  - Setting threshold to 1: Never ground responses

## Using Grounded Results

The URIs provided in the grounding metadata contain the `vertexaisearch` subdomain and are directly accessible by end users for 30 days after the grounded result is generated.

**Important**: The provided URIs must be directly accessible by end users and must not be queried programmatically through automated means. 