# Test Migration Status

This file shows the current status of test migration to the new Google Generative AI SDK.

Last updated: 2025-05-07T16:01:58.342Z

## Tests Temporarily Skipped

### services/textGeneration.test.ts

- [ ] should generate text with default settings
- [ ] should generate text with custom model and settings
- [ ] should handle errors
- [ ] should generate text with system instructions
- [ ] should generate with system instructions and custom settings
- [ ] should handle errors
- [ ] should stream text generation responses
- [ ] should handle errors in stream

### services/chat.test.ts

- [ ] should create a chat session with default settings
- [ ] should create a chat session with custom model and settings
- [ ] should create a chat session with initial history
- [ ] should send a message to the chat session
- [ ] should handle errors
- [ ] should stream chat responses
- [ ] should handle stream errors
- [ ] should return the chat history
- [ ] should send a message without creating a permanent chat session
- [ ] should send a message with history
- [ ] should send a message with custom settings
- [ ] should handle errors

### services/multimodal.test.ts

- [ ] should process multimodal content with default settings
- [ ] should process multimodal content with custom model and settings
- [ ] should handle text and image inputs
- [ ] should handle text and video inputs
- [ ] should handle text and audio inputs
- [ ] should handle errors

### services/fileService.test.ts

- [ ] should upload a file
- [ ] should get file info
- [ ] should list files
- [ ] should delete a file
- [ ] should handle errors

### services/tokenCounter.test.ts

- [ ] should count tokens in text with default model
- [ ] should count tokens with a specified model
- [ ] should handle errors
- [ ] should count tokens in multimodal content
- [ ] should handle errors
- [ ] should count tokens in chat history
- [ ] should handle errors
- [ ] should extract usage metadata from a response

## Migration Plan

See `test-migration-plan.md` for details on the migration plan.
