"use client";

import { useState } from 'react';

interface ChatMessage {
  role: string;
  parts: { text: string }[];
}

export function ChatAutoPanel({ apiKey }: { apiKey: string }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }
    setLoading(true);
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, message, history }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.text) {
      setHistory([
        ...history,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: data.text }] },
      ]);
      setMessage('');
    }
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.chat.createChat().sendMessage(message)</code>
      </div>
      <div className="mb-2 h-48 overflow-y-auto bg-gray-50 p-2 rounded border">
        {history.length === 0 && <div className="text-gray-400">No messages yet.</div>}
        {history.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.role === 'user' ? 'font-bold text-blue-600' : 'font-bold text-green-600'}>
              {msg.role === 'user' ? 'You' : 'Gemini'}:
            </span>{' '}
            {msg.parts.map((p, j) => <span key={j}>{p.text}</span>)}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
} 