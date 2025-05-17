"use client";

import { useState } from 'react';

const defaultFunction = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a city.',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' }
      },
      required: ['city']
    }
  }
];

export function FunctionAutoPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('What is the weather in Paris?');
  const [functions, setFunctions] = useState(JSON.stringify(defaultFunction, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    let parsedFns;
    try {
      parsedFns = JSON.parse(functions);
    } catch (e) {
      setError('Invalid JSON for functions');
      setLoading(false);
      return;
    }
    const res = await fetch('/api/gemini/function', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, prompt, functions: parsedFns }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResponse(data);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.functionCalling.generateAuto(prompt, functions)</code>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Function Schema (JSON):</label>
        <textarea
          className="w-full border rounded p-2 font-mono text-xs"
          rows={7}
          value={functions}
          onChange={e => setFunctions(e.target.value)}
        />
      </div>
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
          <div className="font-bold mb-1">Model Output:</div>
          <div className="mb-2 whitespace-pre-wrap">{response.text}</div>
          {response.functionCalls && (
            <div>
              <div className="font-bold">Function Calls:</div>
              <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(response.functionCalls, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 