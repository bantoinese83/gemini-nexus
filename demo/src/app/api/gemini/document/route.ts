export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, fileName, prompt } = await req.json();
  if (!apiKey || !fileName || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey, fileName, or prompt' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    const file = await gemini.files.get(fileName);
    if (!file || !file.uri || !file.mimeType) {
      return NextResponse.json({ error: 'File not found or incomplete metadata' }, { status: 400 });
    }
    const filePart = gemini.files.createPartFromUri(file.uri, file.mimeType);
    const result = await gemini.documentUnderstanding.processDocumentAuto(prompt, filePart);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 