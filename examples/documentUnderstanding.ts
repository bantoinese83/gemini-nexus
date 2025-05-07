import GeminiClient from '../src';
import * as fs from 'fs';

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

async function main() {
  try {
    // EXAMPLE 1: Process a small PDF document using inline data
    console.log("\n=== Example 1: Process a Small PDF Document (Inline Data) ===");
    
    // For this example, you need to have a small PDF file (<20MB) in the examples/data directory
    // Replace 'examples/data/sample.pdf' with your actual file path
    const filePath = 'examples/data/sample.pdf';
    console.log(`Reading PDF file from: ${filePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      console.log('Please place a sample PDF file at this location to run this example.');
      return;
    }
    
    // Read the PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(filePath);
    const base64Data = Buffer.from(pdfBuffer).toString('base64');
    
    // Create PDF part
    const pdfPart = gemini.documentUnderstanding.createPdfPart(base64Data);
    
    // Process the document
    console.log('Processing PDF with prompt: "Summarize this document"');
    const inlineResponse = await gemini.documentUnderstanding.processDocument(
      "Summarize this document",
      pdfPart,
      { temperature: 0.2 }
    );
    
    console.log('Response:');
    console.log(inlineResponse.text);

    await waitForConfirmation('Example 1 completed.');

    // EXAMPLE 2: Process a larger PDF using the File API
    console.log("\n=== Example 2: Process a Larger PDF Document (File API) ===");
    
    // Upload the file
    console.log(`Uploading the same PDF file via the File API...`);
    const fileMetadata = await gemini.files.upload({
      file: filePath,
      config: {
        displayName: 'Sample Document'
      }
    });
    
    console.log(`File uploaded successfully: ${fileMetadata.name}`);
    console.log(`Current file state: ${fileMetadata.state}`);
    
    // Wait for file processing to complete
    console.log('Waiting for the file to be processed...');
    const processedFile = await gemini.files.waitForProcessing(fileMetadata.name);
    console.log(`File processed successfully, state: ${processedFile.state}`);
    
    // Create a file part for the processed file
    const filePart = gemini.files.createPartFromUri(
      processedFile.uri,
      processedFile.mimeType
    );
    
    // Process the document with advanced options
    console.log('Processing PDF with specific document options...');
    const fileResponse = await gemini.documentUnderstanding.processDocumentWithOptions(
      "Extract all tables from this document and format them as markdown",
      filePart,
      {
        extractText: true,
        preserveLayout: true,
        includeImages: true
      },
      { temperature: 0.2 }
    );
    
    console.log('Response:');
    console.log(fileResponse.text);

    await waitForConfirmation('Example 2 completed.');

    // EXAMPLE 3: Upload and process multiple documents
    // For this example, you would need two different PDF files
    const filePath2 = 'examples/data/sample2.pdf';
    
    // Check if the second file exists
    if (!fs.existsSync(filePath2)) {
      console.log(`Second file not found: ${filePath2}`);
      console.log('Skipping Example 3 (multiple document processing)');
      return;
    }
    
    console.log("\n=== Example 3: Process Multiple Documents Together ===");
    
    // Upload both files
    console.log('Uploading two documents...');
    const file1 = await gemini.files.upload({
      file: filePath,
      config: { displayName: 'Document 1' }
    });
    
    const file2 = await gemini.files.upload({
      file: filePath2,
      config: { displayName: 'Document 2' }
    });
    
    // Wait for both files to be processed
    console.log('Waiting for both files to be processed...');
    const processed1 = await gemini.files.waitForProcessing(file1.name);
    const processed2 = await gemini.files.waitForProcessing(file2.name);
    
    // Create file parts
    const filePart1 = gemini.files.createPartFromUri(processed1.uri, processed1.mimeType);
    const filePart2 = gemini.files.createPartFromUri(processed2.uri, processed2.mimeType);
    
    // Process both documents together
    console.log('Processing both documents with prompt: "Compare and contrast these two documents"');
    const multiDocResponse = await gemini.documentUnderstanding.processMultipleDocuments(
      "Compare and contrast these two documents. Highlight key similarities and differences.",
      [filePart1, filePart2],
      { temperature: 0.2, maxOutputTokens: 2048 }
    );
    
    console.log('Response:');
    console.log(multiDocResponse.text);

    console.log("\nAll examples completed successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Start the example
console.log("Document Understanding Examples");
console.log("==============================");
console.log("This example demonstrates document processing capabilities with the Gemini API.");
console.log("It requires sample PDF files in the examples/data directory.");
console.log("\nNote: These examples use the Gemini File API, which stores uploaded files for 48 hours.");

main(); 