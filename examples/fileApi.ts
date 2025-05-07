/**
 * File API examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/fileApi.ts
 */

import GeminiClient from '../src';
import * as fs from 'fs';
import * as path from 'path';

// Set your API key
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

/**
 * Helper function to wait for user confirmation
 */
async function waitForConfirmation(message: string): Promise<void> {
  console.log(`\n${message}`);
  console.log('Press Enter to continue...');
  
  return new Promise(resolve => {
    process.stdin.once('data', () => {
      resolve();
    });
  });
}

/**
 * Helper function to create a test file if it doesn't exist
 */
function createTestFile(filename: string, content: string): string {
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created test file at ${filePath}`);
  }
  
  return filePath;
}

/**
 * Helper function to create a test image
 */
function createTestImage(): string {
  // This is a simple function to ensure we have an image to test with
  // In a real application, you would use your own images
  const dir = path.join(__dirname, 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, 'test-image.jpg');
  
  // If we don't have a test image, create a simple one with text
  if (!fs.existsSync(filePath)) {
    // This example doesn't actually create an image since that would require additional 
    // dependencies. In a real application, you would use your own images.
    console.log(`Please place a test image at ${filePath} to run this example.`);
    process.exit(1);
  }
  
  return filePath;
}

/**
 * Main function to run the examples
 */
async function main() {
  try {
    // Create test files to use in examples
    const textFilePath = createTestFile('sample.txt', 'This is a sample text file for testing the Gemini API.');
    const imagePath = createTestImage();
    
    // Example 1: Upload a file
    console.log("\n=== Example 1: Upload a Text File ===");
    
    const textFile = await gemini.files.upload({
      file: textFilePath,
      config: { 
        mimeType: 'text/plain',
        displayName: 'Sample Text File'
      }
    });
    
    console.log('File uploaded successfully:');
    console.log('  Name:', textFile.name);
    console.log('  URI:', textFile.uri);
    console.log('  MIME Type:', textFile.mimeType);
    console.log('  State:', textFile.state);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Upload an image file
    console.log("\n=== Example 2: Upload an Image File ===");
    
    const imageFile = await gemini.files.upload({
      file: imagePath,
      config: { mimeType: 'image/jpeg' }
    });
    
    console.log('Image file uploaded successfully:');
    console.log('  Name:', imageFile.name);
    console.log('  URI:', imageFile.uri);
    console.log('  MIME Type:', imageFile.mimeType);
    console.log('  State:', imageFile.state);
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Get file metadata
    console.log("\n=== Example 3: Get File Metadata ===");
    
    const retrievedFile = await gemini.files.get({
      name: textFile.name
    });
    
    console.log('Retrieved file metadata:');
    console.log('  Name:', retrievedFile.name);
    console.log('  URI:', retrievedFile.uri);
    console.log('  MIME Type:', retrievedFile.mimeType);
    console.log('  Display Name:', retrievedFile.displayName);
    console.log('  Size:', retrievedFile.sizeBytes, 'bytes');
    console.log('  State:', retrievedFile.state);
    console.log('  Create Time:', retrievedFile.createTime);
    console.log('  Expire Time:', retrievedFile.expireTime);
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: List files
    console.log("\n=== Example 4: List Files ===");
    
    const fileList = await gemini.files.list({
      config: { pageSize: 10 }
    });
    
    console.log(`Found ${fileList.files.length} files:`);
    for (const file of fileList.files) {
      console.log(`  ${file.name} (${file.mimeType})`);
    }
    
    await waitForConfirmation('Example 4 completed.');

    // Example 5: Use the file in a prompt
    console.log("\n=== Example 5: Use the Image File in a Prompt ===");
    
    // Wait for the image file to be fully processed if needed
    if (imageFile.state !== 'ACTIVE') {
      console.log('Waiting for image file to be processed...');
      const processedFile = await gemini.files.waitForFileState(
        imageFile.name, 
        'ACTIVE'
      );
      console.log('Image file is now ready:', processedFile.state);
    }
    
    // Create the multimodal prompt
    const userContent = gemini.files.createUserContent([
      gemini.files.createPartFromUri(imageFile.uri, imageFile.mimeType),
      "Describe this image in detail."
    ]);
    
    // Generate content with the multimodal prompt
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userContent
    });
    
    console.log('\nImage Description:');
    console.log(response.text);
    
    await waitForConfirmation('Example 5 completed.');

    // Example 6: Upload a file using Buffer
    console.log("\n=== Example 6: Upload File Using Buffer ===");
    
    // Read the file into a buffer
    const buffer = fs.readFileSync(textFilePath);
    
    // Upload the buffer
    const bufferFile = await gemini.files.upload({
      file: buffer,
      config: { 
        mimeType: 'text/plain',
        displayName: 'File From Buffer'
      }
    });
    
    console.log('File uploaded from buffer:');
    console.log('  Name:', bufferFile.name);
    console.log('  URI:', bufferFile.uri);
    console.log('  MIME Type:', bufferFile.mimeType);
    
    await waitForConfirmation('Example 6 completed.');

    // Example 7: Delete files
    console.log("\n=== Example 7: Delete Files ===");
    
    // Delete the text file
    await gemini.files.delete({
      name: textFile.name
    });
    console.log(`Deleted file: ${textFile.name}`);
    
    // Delete the buffer file
    await gemini.files.delete({
      name: bufferFile.name
    });
    console.log(`Deleted file: ${bufferFile.name}`);
    
    console.log('\nNote: Files are automatically deleted after 48 hours if not manually deleted.');
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("File API Examples");
console.log("================");
console.log("This example demonstrates how to use the Gemini Files API.");
console.log("The Files API lets you upload and manage files up to 20 GB per project, with a maximum file size of 2 GB.");
console.log("Files are stored for 48 hours and can be used in multimodal prompts.");

main(); 