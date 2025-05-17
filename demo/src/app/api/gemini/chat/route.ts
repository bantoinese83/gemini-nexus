export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { apiKey, message, history } = await req.json();
  if (!apiKey || !message) {
    return NextResponse.json({ error: 'Missing apiKey or message' }, { status: 400 });
  }
  try {
    const gemini = new GeminiClient(apiKey);
    // Use the new createChat signature with options for history
    const chat = gemini.chat.createChat(undefined, { history });
    const reply = await chat.sendMessage(message);
    return NextResponse.json({ text: reply.text, history: chat.getHistory() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 