/**
 * Code execution auto example for Gemini Nexus
 * Demonstrates using codeExecution.executeAuto for code generation and execution.
 *
 * Run with: ts-node examples/code-execution-auto.ts
 *
 * @example
 * // Generate and execute Python code
 * await gemini.codeExecution.executeAuto('Write a Python function to check if a number is prime.');
 */

import { GeminiClient } from '../src/services/client';

/**
 * Runs the code execution auto example.
 * @returns {Promise<void>}
 */
async function codeExecutionAutoExample() {
  const gemini = new GeminiClient(process.env.GEMINI_API_KEY || 'YOUR_API_KEY', true);
  const prompt = 'Write a Python function to check if a number is prime.';

  try {
    const response = await gemini.codeExecution.executeAuto(prompt);
    console.log('Code execution auto response:', response.text);
    if (response.generatedCode) {
      console.log('Generated code:', response.generatedCode);
    }
    if (response.executionResult) {
      console.log('Execution result:', response.executionResult);
    }
  } catch (error) {
    console.error('Error in code execution auto example:', error);
  }
}

codeExecutionAutoExample(); 