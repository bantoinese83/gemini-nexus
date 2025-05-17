export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, prompt } = await req.json();
  if (!apiKey || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const result = await gemini.thinking.generate(prompt, 1024);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 