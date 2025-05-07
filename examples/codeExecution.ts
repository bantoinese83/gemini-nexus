/**
 * Code Execution examples for the Gemini API SDK
 * 
 * Run with: ts-node examples/codeExecution.ts
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
 * Main function to run the examples
 */
async function main() {
  try {
    // Example 1: Basic code execution
    console.log("\n=== Example 1: Basic Code Execution ===");
    
    console.log("Prompt: What is the sum of the first 50 prime numbers? Generate and run code for the calculation.");
    const response = await gemini.codeExecution.execute(
      "What is the sum of the first 50 prime numbers? Generate and run code for the calculation, and make sure you get all 50.",
      { temperature: 0.2 }
    );
    
    console.log('\nExplanation:');
    console.log(response.text);
    
    console.log('\nGenerated Code:');
    console.log(response.generatedCode);
    
    console.log('\nExecution Result:');
    console.log(response.executionResult);
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Visualization with matplotlib
    console.log("\n=== Example 2: Visualization with Matplotlib ===");
    
    console.log("Prompt: Generate a visualization of the first 50 prime numbers. Plot them on a scatter plot with their index on the x-axis.");
    const visualizationResponse = await gemini.codeExecution.execute(
      "Generate a visualization of the first 50 prime numbers. Plot them on a scatter plot with their index on the x-axis. Make the plot visually appealing with a title, labels, and grid.",
      { temperature: 0.2 }
    );
    
    console.log('\nExplanation:');
    console.log(visualizationResponse.text);
    
    console.log('\nGenerated Code:');
    console.log(visualizationResponse.generatedCode);
    
    console.log('\nExecution Result:');
    console.log(visualizationResponse.executionResult);
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Code execution with file input
    console.log("\n=== Example 3: Code Execution with File Input ===");
    
    // Create a simple CSV file for testing
    const csvPath = path.join(__dirname, 'data/sample.csv');
    const csvDir = path.dirname(csvPath);
    
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }
    
    if (!fs.existsSync(csvPath)) {
      const csvContent = 
        "name,age,score\n" +
        "Alice,28,92\n" +
        "Bob,35,78\n" +
        "Charlie,42,85\n" +
        "Diana,31,95\n" +
        "Evan,25,88\n";
      
      fs.writeFileSync(csvPath, csvContent);
      console.log(`Created sample CSV file at ${csvPath}`);
    }
    
    // Read the CSV file as base64
    const csvData = fs.readFileSync(csvPath, { encoding: 'base64' });
    
    console.log("Prompt: Analyze this CSV file and calculate basic statistics about the 'score' column.");
    const fileResponse = await gemini.codeExecution.executeWithFileInput(
      "Analyze this CSV file and calculate basic statistics (mean, median, min, max) about the 'score' column. Also generate a bar chart showing each person's score.",
      csvData,
      "text/csv",
      { temperature: 0.2 }
    );
    
    console.log('\nAnalysis:');
    console.log(fileResponse.text);
    
    console.log('\nGenerated Code:');
    console.log(fileResponse.generatedCode);
    
    console.log('\nExecution Result:');
    console.log(fileResponse.executionResult);
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Code execution in a chat session
    console.log("\n=== Example 4: Code Execution in Chat ===");
    
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: 'I have some programming questions for you.' }]
      },
      {
        role: 'model',
        parts: [{ text: 'Great! I\'d be happy to help with your programming questions. What would you like to know?' }]
      }
    ];
    
    console.log("Chat prompt: Can you show me how to calculate the factorial of a number recursively in Python?");
    const chatResponse = await gemini.codeExecution.executeInChat(
      chatHistory,
      "Can you show me how to calculate the factorial of a number recursively in Python? Test it with n=5.",
      { temperature: 0.2 }
    );
    
    console.log('\nChat Response:');
    console.log(chatResponse.text);
    
    console.log('\nGenerated Code:');
    console.log(chatResponse.generatedCode);
    
    console.log('\nExecution Result:');
    console.log(chatResponse.executionResult);
    
    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Code Execution Examples");
console.log("=======================");
console.log("This example demonstrates code execution capabilities with the Gemini API.");

main(); 