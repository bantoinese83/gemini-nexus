export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, prompt, schema } = await req.json();
  if (!apiKey || !prompt || !schema) {
    return NextResponse.json({ error: 'Missing apiKey, prompt, or schema' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const result = await gemini.structuredOutput.generateAuto(prompt, schema);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 