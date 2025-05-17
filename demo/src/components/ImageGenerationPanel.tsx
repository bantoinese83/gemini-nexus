"use client";

import { useState } from 'react';

export function ImageGenerationPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('A futuristic city with flying cars and neon lights');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('vivid');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setImage(null);
    setDescription('');
    const res = await fetch('/api/gemini/image/generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, prompt, size, style }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else {
      setImage(data.base64);
      setDescription(data.description);
    }
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.imageGeneration.generate(prompt, &#123; size, style &#125;)</code>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Size (e.g. 1024x1024)"
          value={size}
          onChange={e => setSize(e.target.value)}
        />
        <input
          className="border rounded p-2 flex-1"
          placeholder="Style (e.g. vivid, natural)"
          value={style}
          onChange={e => setStyle(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {image && (
        <div className="mt-4 flex flex-col items-center">
          <img
            src={`data:image/png;base64,${image}`}
            alt="Generated"
            className="rounded shadow max-w-full max-h-96 border"
          />
          {description && <div className="mt-2 text-xs text-gray-600">{description}</div>}
        </div>
      )}
    </div>
  );
} 