/**
 * Structured Output Examples for Gemini API SDK
 * 
 * This file demonstrates how to use the StructuredOutput service to generate JSON 
 * and other structured data formats from natural language prompts.
 */

import GeminiClient from '../dist';

// Initialize the client with your API key
const API_KEY = process.env.GEMINI_API_KEY || 'your-api-key-here';
const gemini = new GeminiClient(API_KEY);

/**
 * Basic JSON Generation Example
 */
async function generateSimpleJSON() {
  console.log('\n--- Basic JSON Generation Example ---');
  
  const result = await gemini.structuredOutput.generateJSON({
    prompt: 'Generate a JSON object for a user profile with name, age, email, and a list of hobbies',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string' },
        hobbies: { 
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['name', 'email', 'hobbies']
    }
  });
  
  console.log('Generated JSON:');
  console.log(JSON.stringify(result.data, null, 2));
}

/**
 * Complex Nested Structure Example
 */
async function generateComplexStructure() {
  console.log('\n--- Complex Nested Structure Example ---');
  
  const result = await gemini.structuredOutput.generateJSON({
    prompt: 'Create a JSON representation of a small e-commerce store with 3 products, each having an id, name, price, category, and at least 2 customer reviews',
    schema: {
      type: 'object',
      properties: {
        storeName: { type: 'string' },
        storeId: { type: 'string' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              price: { type: 'number' },
              category: { type: 'string' },
              inStock: { type: 'boolean' },
              reviews: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    userName: { type: 'string' },
                    rating: { type: 'number' },
                    comment: { type: 'string' },
                    date: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  
  console.log('Generated Complex Structure:');
  console.log(JSON.stringify(result.data, null, 2));
}

/**
 * Data Extraction Example
 */
async function extractStructuredData() {
  console.log('\n--- Data Extraction Example ---');
  
  const text = `
    Company Name: TechGlobal Inc.
    Annual Report - Fiscal Year 2023
    
    Financial Highlights:
    - Revenue: $245.8 million (up 18% from previous year)
    - Net Income: $32.4 million
    - Earnings Per Share: $2.87
    
    Product Breakdown:
    1. Cloud Services: $125.3 million
    2. Software Licenses: $78.6 million
    3. Professional Services: $41.9 million
    
    Regional Performance:
    - North America: $142.5 million
    - Europe: $65.7 million
    - Asia-Pacific: $37.6 million
  `;
  
  const result = await gemini.structuredOutput.extractJSON({
    text,
    schema: {
      type: 'object',
      properties: {
        companyName: { type: 'string' },
        fiscalYear: { type: 'number' },
        financials: {
          type: 'object',
          properties: {
            revenue: { type: 'number' },
            netIncome: { type: 'number' },
            eps: { type: 'number' }
          }
        },
        productRevenue: {
          type: 'object',
          additionalProperties: { type: 'number' }
        },
        regionalRevenue: {
          type: 'object',
          additionalProperties: { type: 'number' }
        }
      }
    }
  });
  
  console.log('Extracted Structured Data:');
  console.log(JSON.stringify(result.data, null, 2));
}

/**
 * Custom Schema Validation Example
 */
async function customSchemaValidation() {
  console.log('\n--- Custom Schema Validation Example ---');
  
  const result = await gemini.structuredOutput.generateJSON({
    prompt: 'Generate a list of 5 valid email addresses',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        format: 'email'
      },
      minItems: 5,
      maxItems: 5
    },
    temperature: 0.2
  });
  
  console.log('Generated Email Addresses:');
  console.log(JSON.stringify(result.data, null, 2));
}

// Execute all examples
async function runAllExamples() {
  try {
    await generateSimpleJSON();
    await generateComplexStructure();
    await extractStructuredData();
    await customSchemaValidation();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

runAllExamples(); 