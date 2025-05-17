"use client";

import { useState } from 'react';

export function TokenCounterPanel({ apiKey }: { apiKey: string }) {
  const [text, setText] = useState('This is a sample text that I want to count tokens for.');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    const res = await fetch('/api/gemini/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, text }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResponse(data);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.tokenCounter.countTokens(text)</code>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter text..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Counting...' : 'Count Tokens'}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {response && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Token Count:</div>
          <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 