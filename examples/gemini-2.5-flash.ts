/**
 * Gemini 2.5 Flash Preview examples
 * 
 * Run with: ts-node examples/gemini-2.5-flash.ts
 * 
 * This example demonstrates the capabilities of the Gemini 2.5 Flash Preview model,
 * including thinking mode, large document processing, and tool use.
 */

import GeminiClient, { FunctionCallingMode } from '../src';
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
 * Create or ensure a test file exists
 */
function ensureTestFile(filename: string, content: string): string {
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

async function main() {
  try {
    // Example 1: Basic usage with thinking mode
    console.log("\n=== Example 1: Basic usage with thinking mode ===");
    
    const thinkingResponse = await gemini.textGeneration.generate(
      "Solve the following quadratic equation and show all steps: 3x^2 - 14x + 8 = 0",
      {
        model: "gemini-2.5-flash-preview-04-17",
        thinkingConfig: { thinkingBudget: 1000 },
        temperature: 0.2
      }
    );
    
    console.log(thinkingResponse.text);
    
    // Extract and display token usage
    const thinkingUsage = gemini.tokenCounter.getUsageFromResponse(thinkingResponse);
    if (thinkingUsage) {
      console.log("\nToken Usage:");
      console.log(`  Total tokens: ${thinkingUsage.totalTokenCount}`);
      console.log(`  Prompt tokens: ${thinkingUsage.promptTokenCount}`);
      console.log(`  Response tokens: ${thinkingUsage.candidatesTokenCount}`);
    }
    
    await waitForConfirmation('Example 1 completed.');

    // Example 2: Complex reasoning without thinking mode
    console.log("\n=== Example 2: Complex reasoning without thinking mode ===");
    
    const nonThinkingResponse = await gemini.textGeneration.generate(
      "Solve the following quadratic equation and show all steps: 2x^2 - 7x + 3 = 0",
      {
        model: "gemini-2.5-flash-preview-04-17",
        temperature: 0.2
      }
    );
    
    console.log(nonThinkingResponse.text);
    
    // Extract and display token usage
    const nonThinkingUsage = gemini.tokenCounter.getUsageFromResponse(nonThinkingResponse);
    if (nonThinkingUsage) {
      console.log("\nToken Usage:");
      console.log(`  Total tokens: ${nonThinkingUsage.totalTokenCount}`);
      console.log(`  Prompt tokens: ${nonThinkingUsage.promptTokenCount}`);
      console.log(`  Response tokens: ${nonThinkingUsage.candidatesTokenCount}`);
    }
    
    await waitForConfirmation('Example 2 completed.');

    // Example 3: Function calling with thinking mode
    console.log("\n=== Example 3: Function calling with thinking mode ===");
    
    // Define a weather function
    const weatherFunction = {
      name: "getWeather",
      description: "Get the current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g., San Francisco, CA"
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature"
          }
        },
        required: ["location"]
      }
    };
    
    const functionResponse = await gemini.functionCalling.generateWithMode(
      "I'm planning a trip this weekend. What's the weather going to be like in Miami and Seattle? Which city should I visit?",
      [weatherFunction],
      FunctionCallingMode.ANY,
      undefined,
      { 
        model: "gemini-2.5-flash-preview-04-17",
        thinkingConfig: { thinkingBudget: 800 }
      }
    );
    
    console.log("Response Text:");
    console.log(functionResponse.text);
    
    if (functionResponse.functionCalls && functionResponse.functionCalls.length > 0) {
      console.log("\nFunction Calls:");
      for (const call of functionResponse.functionCalls) {
        console.log(`  Function: ${call.name}`);
        console.log(`  Arguments: ${JSON.stringify(call.args, null, 2)}`);
      }
    }
    
    await waitForConfirmation('Example 3 completed.');

    // Example 4: Structured output with thinking
    console.log("\n=== Example 4: Structured output with thinking ===");
    
    const schema = {
      type: "object",
      properties: {
        cities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              country: { type: "string" },
              population: { type: "integer" },
              landmarks: { type: "array", items: { type: "string" } },
              climate: { type: "string" }
            },
            required: ["name", "country", "landmarks"]
          }
        },
        recommended_visit_time: { type: "string" }
      },
      required: ["cities", "recommended_visit_time"]
    };
    
    const structuredResponse = await gemini.structuredOutput.generate(
      "Create a travel guide for the top 3 cities to visit in Japan with their major landmarks",
      schema,
      { 
        model: "gemini-2.5-flash-preview-04-17",
        thinkingConfig: { thinkingBudget: 1500 }
      }
    );
    
    console.log("Structured Output:");
    console.log(JSON.stringify(structuredResponse.data, null, 2));
    
    await waitForConfirmation('Example 4 completed.');

    // Example 5: Text file processing with thinking
    console.log("\n=== Example 5: Text file processing with thinking ===");
    
    // Create a sample text file if needed
    const sampleText = `
    # Machine Learning Overview

    Machine learning is a branch of artificial intelligence (AI) focused on building applications that learn from data and improve their accuracy over time without being programmed to do so.

    ## Types of Machine Learning

    1. **Supervised Learning**: Training a model on labeled data.
    2. **Unsupervised Learning**: Finding patterns in unlabeled data.
    3. **Reinforcement Learning**: Training agents through reward/punishment.

    ## Common Algorithms

    - Linear Regression
    - Decision Trees
    - Neural Networks
    - K-means Clustering
    - Support Vector Machines

    ## Challenges

    - Overfitting
    - Underfitting
    - Data quality issues
    - Interpretability vs. accuracy tradeoffs
    `;
    
    const textFilePath = ensureTestFile('ml-overview.txt', sampleText);
    
    // Upload the file
    const textFile = await gemini.files.upload({
      file: textFilePath,
      config: { 
        mimeType: 'text/plain',
        displayName: 'Machine Learning Overview'
      }
    });
    
    // Wait for processing
    const processedFile = await gemini.files.waitForFileState(textFile.name);
    const filePart = gemini.files.createPartFromUri(processedFile.uri, processedFile.mimeType);
    
    // Create user content
    const userContent = gemini.files.createUserContent([
      filePart,
      "Create a comprehensive study guide based on this text. Include key concepts, examples, and practice questions."
    ]);
    
    // Generate response
    const fileResponse = await gemini.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: userContent,
      generationConfig: {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });
    
    console.log("File Processing Response:");
    console.log(fileResponse.response.text());
    
    await waitForConfirmation('Example 5 completed.');

    console.log("\nAll examples completed successfully!");
    
  } catch (error) {
    console.error("Error running examples:", error.message);
  }
}

// Start the examples
console.log("Gemini 2.5 Flash Preview Examples");
console.log("================================");
console.log("This example demonstrates the capabilities of the Gemini 2.5 Flash Preview model.");

main(); 