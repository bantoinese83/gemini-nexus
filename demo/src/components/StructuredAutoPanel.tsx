"use client";

import { useState } from 'react';

const defaultSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Language name' },
      year_created: { type: 'integer', description: 'Year created' }
    },
    required: ['name', 'year_created']
  }
};

export function StructuredAutoPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState('List three popular programming languages as an array of objects with name and year_created.');
  const [schema, setSchema] = useState(JSON.stringify(defaultSchema, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    let parsedSchema;
    try {
      parsedSchema = JSON.parse(schema);
    } catch (e) {
      setError('Invalid JSON for schema');
      setLoading(false);
      return;
    }
    const res = await fetch('/api/gemini/structured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, prompt, schema: parsedSchema }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResponse(data);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.structuredOutput.generateAuto(prompt, schema)</code>
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Output Schema (JSON):</label>
        <textarea
          className="w-full border rounded p-2 font-mono text-xs"
          rows={7}
          value={schema}
          onChange={e => setSchema(e.target.value)}
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
          <div className="font-bold mb-1">Structured Output:</div>
          <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(response.data ?? response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 