"use client";

import { useState, useRef } from 'react';

export function FileAutoPanel({ apiKey }: { apiKey: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('apiKey', apiKey);
      formData.append('file', file);
      const res = await fetch('/api/gemini/file', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
      if (!data.error) fetchFiles();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    }
    setLoading(false);
  };

  const fetchFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, action: 'list' }),
      });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e: any) {
      setError(e.message || 'Failed to list files');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-2 text-sm text-gray-500">
        Method: <code>gemini.files.uploadAndWait(file)</code> & <code>gemini.files.list()</code>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="mb-2"
        onChange={e => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      <button
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
        onClick={fetchFiles}
        disabled={loading}
      >
        List Files
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {uploadResult && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Upload Result:</div>
          <pre className="bg-gray-200 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <div className="font-bold mb-1">Uploaded Files:</div>
          <ul className="list-disc pl-5">
            {files.map((f, i) => (
              <li key={i} className="text-xs">
                <span className="font-mono">{f.name}</span> ({f.mimeType}, {f.sizeBytes} bytes, state: {f.state})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 