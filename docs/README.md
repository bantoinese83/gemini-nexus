# Gemini API SDK Documentation

Welcome to the Gemini API SDK documentation. This directory contains comprehensive guides and references to help you get the most out of the SDK.

## Current Implementation Status

> **Note**: This SDK is currently in alpha (v0.1.0-alpha.1). Many features are implemented as stubs and will be completed in future versions.

## Installation

```bash
npm install gemini-nexus
```

## Model Documentation

- [Models Overview](models.md) - Detailed information about all available Gemini models, their capabilities, and use cases
- [Gemini 2.5 Models Guide](gemini-2.5-models.md) - Comprehensive guide to using the latest Gemini 2.5 models
- [Token Counter](token-counter.md) - Understanding and working with token counting for cost management

## Feature Documentation

- [File API](file-api.md) - Guide to using the File API for uploading and managing files
- [Search Grounding](search-grounding.md) - Using Google Search for grounding AI responses in factual information

## Implementation Notes

This SDK is designed as a wrapper around Google's official `@google/generative-ai` package, providing:

- A more intuitive and consistent API surface
- Comprehensive TypeScript typings
- Additional utilities and helper methods
- Extensive documentation

## Examples

The SDK includes numerous examples to help you get started. Check the `/examples` directory for comprehensive examples, including:

- `basic-usage.ts` - Simple text generation and chat examples
- `thinking.ts` - Examples of using the thinking capabilities with various models
- `gemini-2.5-flash.ts` - Focused examples for the Gemini 2.5 Flash Preview model
- `fileApi.ts` - Examples of using the File API
- `tokenCounter.ts` - Examples of counting tokens and monitoring usage
- `functionCalling.ts` - Examples of using function calling for agentic use cases
- `imageUnderstanding.ts` - Examples of image analysis and processing
- `videoUnderstanding.ts` - Examples of video analysis and processing
- `audioUnderstanding.ts` - Examples of audio analysis and transcription
- `documentUnderstanding.ts` - Examples of document processing and analysis
- `searchGrounding.ts` - Examples of using Google Search for grounding
- `structuredOutput.ts` - Examples of generating structured data with Gemini

## Contributing

Contributions to improving the SDK and documentation are welcome. Please refer to the project README for contribution guidelines.

## Getting Help

If you encounter any issues or have questions, please:

1. Check the [GitHub repository](https://github.com/bantoinese83/gemini-nexus) for the latest updates
2. Open an issue for bug reports or feature requests
3. Refer to the [official Google AI documentation](https://ai.google.dev/) for the latest information on the Gemini API 