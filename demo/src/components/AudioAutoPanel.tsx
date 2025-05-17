"use client";

import { useState, useEffect } from 'react';

export function AudioAutoPanel({ apiKey }: { apiKey: string }) {
  const [files, setFiles] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [prompt, setPrompt] = useState('Summarize the main topic of this audio clip.');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiKey) fetchFiles();
    // eslint-disable-next-line
  }, [apiKey]);

  const fetchFiles = async () => {
    setError('');
    try {
      const res = await fetch('/api/gemini/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, action: 'list' }),
      });
      const data = await res.json();
      setFiles(data.files || []);
      if (data.files && data.files.length > 0) setFileName(data.files[0].name);
    } catch (e: any) {
      setError(e.message || 'Failed to list files');
    }
  };

  const handleSend = async () => {
    if (!fileName) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    const res = await fetch('/api/gemini/audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, fileName, prompt }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) setError(data.error);
    else setResponse(data);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.audioUnderstanding.analyzeAudioAuto(filePart, prompt)</code>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500 mb-1">Select Uploaded Audio:</label>
        <select
          className="w-full border rounded p-2 mb-2"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          disabled={loading || files.length === 0}
        >
          {files.length === 0 && <option value="">No files found</option>}
          {files.map(f => (
            <option key={f.name} value={f.name}>{f.displayName || f.name}</option>
          ))}
        </select>
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
        disabled={loading || !fileName}
      >
        {loading ? 'Loading...' : 'Send'}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {response && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Audio Output:</div>
          <div className="whitespace-pre-wrap">{response.text}</div>
        </div>
      )}
    </div>
  );
} 