declare module '@google/generative-ai' {
  export class GoogleGenAI {
    constructor(apiKey: string, options?: any);
    
    readonly genAI: any;
    readonly files: any;
    readonly models: any;
    
    generateText(options: any): Promise<any>;
    chat(options: any): any;
    countTokens(options: any): Promise<any>;
    getModels(): Promise<any>;
  }
} 