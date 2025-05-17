export const runtime = "nodejs";
import GeminiClient from 'gemini-nexus';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await req.formData();
      const apiKey = formData.get('apiKey');
      const file = formData.get('file');
      if (!apiKey || !file) {
        return NextResponse.json({ error: 'Missing apiKey or file' }, { status: 400 });
      }
      const gemini = new GeminiClient(apiKey.toString());
      // file is a File object (from FormData)
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Uploaded value is not a file' }, { status: 400 });
      }
      const uploadResult = await gemini.files.uploadAndWait({ file, config: { mimeType: file.type } });
      return NextResponse.json(uploadResult);
    } else {
      // JSON body for listing
      const { apiKey, action } = await req.json();
      if (!apiKey || action !== 'list') {
        return NextResponse.json({ error: 'Missing apiKey or invalid action' }, { status: 400 });
      }
      const gemini = new GeminiClient(apiKey);
      const files = await gemini.files.list();
      return NextResponse.json(files);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
} 