# Test Coverage Improvement Plan

## Current Status

As of v0.1.0-alpha.4, the overall test coverage is low:
- Statements: 15.06%
- Branches: 1.71%
- Functions: 17.74%
- Lines: 15.28%

Most service implementations have minimal test coverage, with the exception of the main client class (94.73% statements).

## Improvement Strategy

### Phase 1: Critical Paths (Target: v0.1.0-beta.1)

Focus on testing the most commonly used paths in these core services:

1. **TextGenerationService**
   - Basic text generation (`generate`)
   - Streaming text generation (`streamGenerate`)
   - System instructions (`generateWithSystemInstructions`)

2. **ChatService**
   - Creating chat sessions (`createChat`)
   - Sending messages (`sendMessage`)
   - History management (`getHistory`)

3. **MultimodalService**
   - Image processing (`generateFromImage`)
   - URL-based image processing (`generateFromImageUrl`)

4. **TokenCounterService**
   - Complete test coverage for all methods

### Phase 2: Expand Core Coverage (Target: v0.1.0-beta.2)

Add tests for the following services:

1. **FileService**
   - File upload and handling
   - File deletion

2. **StructuredOutputService**
   - Schema validation
   - Error handling for malformed schemas

3. **FunctionCallingService**
   - Function registration
   - Function invocation
   - Parameter validation

4. **SearchGroundingService**
   - Basic grounding tests
   - Search metadata handling

### Phase 3: Complete Coverage (Target: v0.1.0-rc.1)

Add tests for remaining services and edge cases:

1. **ImageGeneration** and **VideoGeneration**
2. **DocumentUnderstanding**, **AudioUnderstanding**, and **VideoUnderstanding**
3. **CodeExecution** and **Thinking**
4. Edge cases and error handling

### Phase 4: Integration Tests (Target: v1.0.0)

Add integration tests that verify multiple services working together:

1. Multimodal + structured output
2. Chat + function calling
3. File service + document understanding

## Test Implementation Guidelines

1. **Unit Tests**
   - Test each method in isolation
   - Mock all external dependencies
   - Test happy paths and error paths
   - Verify parameter validation

2. **Integration Tests**
   - Test services working together
   - Mock only external API calls
   - Verify correct data flow between services

3. **Mocking Strategy**
   - Use the mock implementations in `__tests__/utils/mocks.ts`
   - Update mocks as needed for each service
   - Add specific response mocks for complex scenarios

## Coverage Goals

| Version       | Statement | Branch | Function | Line   |
|---------------|-----------|--------|----------|--------|
| v0.1.0-beta.1 | 40%       | 25%    | 40%      | 40%    |
| v0.1.0-beta.2 | 60%       | 40%    | 60%      | 60%    |
| v0.1.0-rc.1   | 80%       | 60%    | 80%      | 80%    |
| v1.0.0        | 90%+      | 80%+   | 90%+     | 90%+   |

## Implementation Tasks

### Immediate Tasks

1. Fix the failing test in `__tests__/utils/mocks.ts` ✅
2. Add basic test for utils and config
3. Expand TextGenerationService tests to cover all methods
4. Add proper test fixtures for common scenarios

### Phase 1 Tasks

1. Improve TextGenerationService tests
   - Test all parameters
   - Test error handling
   - Test streaming
   
2. Add ChatService tests
   - Test session creation with options
   - Test message sending and response handling
   - Test history management

3. Add MultimodalService tests
   - Test image processing
   - Test error handling for invalid inputs
   - Test multiple content types

4. Complete TokenCounterService tests
   - Test all estimation methods
   - Test edge cases

### Ongoing Process

1. Add tests for each new feature before implementation
2. Run coverage reports after each significant change
3. Update this plan based on SDK evolution
4. Consider introducing test automation in CI/CD pipeline 