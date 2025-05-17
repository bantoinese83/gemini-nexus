import { useState } from 'react';

export function TextAutoPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse('');
    const res = await fetch('/api/gemini/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, prompt }),
    });
    const data = await res.json();
    setLoading(false);
    setResponse(data.text || data.error || 'No response');
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.textGeneration.generateAuto(prompt)</code>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
      <div className="mt-4 bg-gray-100 p-2 rounded min-h-[60px]">
        {response}
      </div>
    </div>
  );
} 