export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, prompt, functions } = await req.json();
  if (!apiKey || !prompt || !functions) {
    return NextResponse.json({ error: 'Missing apiKey, prompt, or functions' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const result = await gemini.functionCalling.generateAuto(prompt, functions);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 