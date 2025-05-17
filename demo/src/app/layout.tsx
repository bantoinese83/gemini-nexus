import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <header className="w-full py-8 bg-white shadow text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700">Gemini Nexus Demo</h1>
            <p className="text-gray-500 mt-2">Showcasing all major features of the gemini-nexus SDK</p>
          </header>
          <main className="w-full max-w-2xl bg-white rounded-lg shadow p-6 mb-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
