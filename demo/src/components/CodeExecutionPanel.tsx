"use client";

import { useState } from 'react';

export function CodeExecutionPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('Write a Python function to check if a number is prime.');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    const res = await fetch('/api/gemini/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, prompt }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResponse(data);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.codeExecution.executeAuto(prompt)</code>
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
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {response && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Code Output:</div>
          <div className="mb-2 whitespace-pre-wrap">{response.text}</div>
          {response.generatedCode && (
            <div>
              <div className="font-bold">Generated Code:</div>
              <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{response.generatedCode}</pre>
            </div>
          )}
          {response.executionResult && (
            <div>
              <div className="font-bold">Execution Result:</div>
              <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(response.executionResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 