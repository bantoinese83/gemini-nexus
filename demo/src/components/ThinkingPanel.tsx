"use client";

import { useState } from 'react';

export function ThinkingPanel({ apiKey }: { apiKey: string }) {
  const [prompt, setPrompt] = useState("What would happen if gravity suddenly became twice as strong?");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    const res = await fetch("/api/gemini/thinking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        Method: <code>gemini.thinking.generateWithVisibleThinking(prompt)</code>
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
        {loading ? "Thinking..." : "Send"}
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {response && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Thinking Process:</div>
          <div className="mb-2 whitespace-pre-wrap">{response.thinkingProcess || response.text}</div>
          {response.finalAnswer && (
            <div>
              <div className="font-bold">Final Answer:</div>
              <div className="whitespace-pre-wrap">{response.finalAnswer}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 