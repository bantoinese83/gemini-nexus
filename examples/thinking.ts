import GeminiClient from '../src';

// Set your API key
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY';

// Initialize the client
const gemini = new GeminiClient(API_KEY);

async function main() {
  try {
    // Example 1: Basic request with auto thinking
    console.log("\n=== Basic request with auto thinking ===");
    const basicResponse = await gemini.thinking.generateAuto(
      "Explain the concept of Occam's Razor and provide a simple, everyday example."
    );
    console.log(basicResponse.text);

    // Example 2: Set thinking budget
    console.log("\n=== Request with specific thinking budget ===");
    const budgetResponse = await gemini.thinking.generate(
      "Explain the Occam's Razor concept and provide everyday examples of it",
      1024 // Set thinking budget to 1024 tokens
    );
    console.log(budgetResponse.text);

    // Example 3: Complex problem solving with maximum thinking
    console.log("\n=== Complex problem with maximum thinking ===");
    const complexResponse = await gemini.thinking.generateWithMaxThinking(
      "Solve this math problem step-by-step: Find all values of x where 2^x = 3^(x-1)"
    );
    console.log(complexResponse.text);

    // Example 4: Simple task without thinking
    console.log("\n=== Simple task without thinking ===");
    const simpleResponse = await gemini.thinking.generateWithoutThinking(
      "What's the capital of Japan?"
    );
    console.log(simpleResponse.text);

    // Example 5: Using thinking with structured output
    console.log("\n=== Structured output with thinking ===");
    const structuredResponse = await gemini.structuredOutput.generateWithSchemaInPrompt(
      `List 5 examples of Occam's Razor in everyday life using this JSON schema:
       Example = {'situation': string, 'simpler_explanation': string, 'complex_explanation': string}
       Return: Array<Example>`,
      { 
        model: 'gemini-2.5-flash-preview-04-17',
        thinkingConfig: { thinkingBudget: 2048 }
      }
    );
    console.log(JSON.stringify(structuredResponse, null, 2));

    // Example 6: Using thinking with regular text generation
    console.log("\n=== Text generation with thinking config ===");
    const textResponse = await gemini.textGeneration.generate(
      "Write a concise explanation of how nuclear fusion works in stars.",
      {
        model: 'gemini-2.5-flash-preview-04-17',
        thinkingConfig: { thinkingBudget: 512 }
      }
    );
    console.log(textResponse.text);

    // Example 7: Using thinking with chat
    console.log("\n=== Chat with thinking ===");
    const chat = gemini.chat.createChat({
      model: 'gemini-2.5-flash-preview-04-17',
      thinkingConfig: { thinkingBudget: 1024 }
    });
    
    const chatResponse1 = await chat.sendMessage("I'm planning a trip to Japan. What should I know?");
    console.log("Response 1:", chatResponse1.text);
    
    const chatResponse2 = await chat.sendMessage("What about food recommendations?");
    console.log("Response 2:", chatResponse2.text);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main(); 