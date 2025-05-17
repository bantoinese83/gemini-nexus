export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  const { apiKey, prompt, size, style } = await req.json();
  if (!apiKey || !prompt) {
    return NextResponse.json({ error: 'Missing apiKey or prompt' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);

    // Generate a unique output path in a temp directory
    const outputDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `image-${Date.now()}.png`);

    // Generate the image
    const result = await gemini.imageGeneration.generateAuto(prompt, outputPath);

    // Read the image file and encode as base64
    const imageBuffer = await fs.readFile(result.imagePath);
    const base64 = imageBuffer.toString('base64');

    // Optionally, clean up the file after reading
    // await fs.unlink(result.imagePath);

    return NextResponse.json({ base64, description: result.response?.text || '' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 