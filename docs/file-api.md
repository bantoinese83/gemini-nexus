# Working with Files in the Gemini API SDK

The Gemini API supports working with various types of files including images, audio, video, and documents. This guide explains how to use the File API in our SDK to upload, manage, and use files with Gemini models.

## Overview

The Files API allows you to:

- Upload files up to 2 GB in size
- Store up to 20 GB of files per project
- Use files in multimodal prompts with Gemini models
- Get file metadata
- List and delete uploaded files

Files are stored for 48 hours and automatically deleted after that period.

## Basic Usage

### Upload a File

You can upload a file to the Gemini API using the `files.upload()` method. The file can be provided as a file path, a Buffer, or a Blob:

```typescript
// Upload using a file path
const audioFile = await gemini.files.upload({
  file: "path/to/sample.mp3",
  config: { mimeType: "audio/mpeg" }
});

// Upload using a Buffer
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const imageFile = await gemini.files.upload({
  file: imageBuffer,
  config: { mimeType: "image/jpeg" }
});
```

### Get File Metadata

You can retrieve metadata for an uploaded file using the `files.get()` method:

```typescript
const file = await gemini.files.get({ 
  name: "files/abc123" 
});

console.log(file.name);       // Unique file name
console.log(file.uri);        // URI for accessing the file
console.log(file.mimeType);   // MIME type of the file
console.log(file.state);      // Current state of the file
console.log(file.expireTime); // When the file will be deleted
```

### List Files

You can get a list of all uploaded files using the `files.list()` method:

```typescript
const fileList = await gemini.files.list({
  config: { pageSize: 10 }
});

for (const file of fileList.files) {
  console.log(`${file.name} (${file.mimeType})`);
}

// If there are more files, you can use the nextPageToken
if (fileList.nextPageToken) {
  const nextPage = await gemini.files.list({
    config: { 
      pageSize: 10,
      pageToken: fileList.nextPageToken
    }
  });
}
```

### Delete a File

You can manually delete a file using the `files.delete()` method:

```typescript
await gemini.files.delete({ 
  name: "files/abc123" 
});
```

## Using Files in Prompts

Once you've uploaded a file, you can use it in multimodal prompts with Gemini models:

```typescript
// Upload an image
const imageFile = await gemini.files.upload({
  file: "path/to/image.jpg",
  config: { mimeType: "image/jpeg" }
});

// Wait for the image file to be fully processed
const processedFile = await gemini.files.waitForFileState(
  imageFile.name, 
  'ACTIVE'
);

// Create a multimodal prompt with the image
const userContent = gemini.files.createUserContent([
  gemini.files.createPartFromUri(imageFile.uri, imageFile.mimeType),
  "Describe this image in detail."
]);

// Generate content with the multimodal prompt
const response = await gemini.models.generateContent({
  model: "gemini-2.0-flash",
  contents: userContent
});

console.log(response.text);
```

### Working with Different File Types

The Gemini API supports various file types:

- **Images** (JPEG, PNG, WEBP, HEIC, HEIF)
- **Documents** (PDF, DOCX, PPTX, TXT)
- **Audio** (MP3, WAV, FLAC, OGG)
- **Video** (MP4, MOV, WEBM)

The appropriate file handlers in our SDK make it easy to work with all these file types.

### File States

Files go through different states during processing:

- `PROCESSING`: File is being processed by the API
- `ACTIVE`: File is ready to be used in prompts
- `FAILED`: File processing has failed

You can check the state of a file using the `file.state` property:

```typescript
const file = await gemini.files.get({ name: "files/abc123" });

if (file.state === 'ACTIVE') {
  // File is ready to use
} else if (file.state === 'PROCESSING') {
  // File is still being processed
}
```

The SDK includes a helper method to wait for a file to reach a specific state:

```typescript
// Wait for a file to be ready (ACTIVE state)
const readyFile = await gemini.files.waitForFileState(
  file.name, 
  'ACTIVE',
  30,      // Maximum 30 attempts
  5000     // 5 seconds between attempts
);
```

## Helper Methods

The SDK includes several helper methods to make working with files easier:

### Create Content from URI

```typescript
const part = gemini.files.createPartFromUri(
  file.uri,
  file.mimeType
);
```

### Create Content from Base64 Data

```typescript
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const base64Data = imageBuffer.toString('base64');

const part = gemini.files.createPartFromBase64(
  base64Data,
  "image/jpeg"
);
```

### Create User Content for Multimodal Prompts

```typescript
const userContent = gemini.files.createUserContent([
  gemini.files.createPartFromUri(file.uri, file.mimeType),
  "Analyze this image"
]);
```

## Limitations and Considerations

- Files are automatically deleted after 48 hours
- Maximum file size is 2 GB
- Maximum storage per project is 20 GB
- You can only use the file content in prompts (you cannot download the file content back)
- For large files like videos, make sure to wait for the file to be fully processed (ACTIVE state) before using it in a prompt

## Usage Examples

For complete working examples, see [examples/fileApi.ts](../examples/fileApi.ts) in the SDK repository. 