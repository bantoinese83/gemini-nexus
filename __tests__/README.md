# Gemini API SDK Test Suite

This directory contains tests for the Gemini API SDK.

## Test Structure

- `__tests__/client.test.ts` - Tests for the main client initialization and basic functionality
- `__tests__/services/` - Tests for individual services
- `__tests__/utils/` - Test utilities and mocks

## Current Status

The test suite is in the process of being updated to use the `@google/generative-ai` package instead of `@google/genai`. During this transition, some tests may be failing or marked as skipped.

### Current Test Status

- ✅ Client tests - Fully working
- 🔄 Token counter tests - In progress
- ❌ Text generation tests - Not yet updated
- ❌ Chat tests - Not yet updated
- ❌ File service tests - Not yet updated
- ❌ Multimodal tests - Not yet updated

## Test Implementation Strategy

For the alpha release, we're using a tiered approach to testing:

1. **Stub Implementations** - Basic implementation tests that focus on API contracts
2. **Minimal Coverage** - Ensuring critical paths are tested without requiring high coverage
3. **Isolated Tests** - Each service is tested independently to avoid cross-contamination

## Mock Implementation

We're using Jest's mocking capabilities to mock the Google Generative AI SDK:

```typescript
// Mock implementation for @google/generative-ai
jest.mock('@google/generative-ai', () => {
  return {
    GenerativeModel: jest.fn().mockImplementation(() => ({
      generateContent: jest.fn().mockResolvedValue({
        response: { /* mock response */ },
        text: () => 'Mock generated text'
      })
    })),
    genAI: {
      countTokens: jest.fn().mockResolvedValue({ totalTokens: 42 })
    },
    __esModule: true
  };
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm run test:client
npm run test:text
npm run test:chat
npm run test:multimodal
npm run test:file
npm run test:token

# Run tests with watch mode
npm run test:watch
```

## Writing Tests

When writing or updating tests:

1. Follow the patterns in the updated client.test.ts file
2. Use stub implementations for now rather than trying to perfectly mock the API
3. Focus on testing the interface contract, not the internal implementation

## Test Migration Plan

See the `test-migration-plan.md` file in the root directory for details on the plan to update all tests. 