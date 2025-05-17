export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, text } = await req.json();
  if (!apiKey || !text) {
    return NextResponse.json({ error: 'Missing apiKey or text' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const result = await gemini.tokenCounter.countTokensInText(text);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 