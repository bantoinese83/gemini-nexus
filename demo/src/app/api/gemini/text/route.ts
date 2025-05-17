import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from 'gemini-nexus';

export async function POST(req: NextRequest) {
  const { apiKey, prompt } = await req.json();
  if (!apiKey || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const result = await gemini.textGeneration.generateAuto(prompt);
    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 