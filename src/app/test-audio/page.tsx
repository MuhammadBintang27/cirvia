'use client';

import React, { useState, useRef } from 'react';

export default function TestAudioPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testAudioFiles = [
    '/audio/modul-pengantar.mp3',
    '/audio/modul-seri.mp3',
    '/audio/modul-paralel.mp3',
    '/audio/audio-konsep-dasar-listrik.mp3',
  ];

  const testFetch = async (url: string) => {
    addLog(`Testing fetch: ${url}`);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      addLog(`✅ Status: ${response.status} ${response.statusText}`);
      addLog(`   Content-Type: ${response.headers.get('content-type')}`);
      addLog(`   Content-Length: ${response.headers.get('content-length')} bytes`);
    } catch (error) {
      addLog(`❌ Fetch error: ${error}`);
    }
  };

  const testPlay = (url: string) => {
    addLog(`Testing play: ${url}`);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      
      addLog(`   readyState: ${audioRef.current.readyState}`);
      addLog(`   networkState: ${audioRef.current.networkState}`);
      
      audioRef.current.play()
        .then(() => addLog(`✅ Playing successfully`))
        .catch(err => addLog(`❌ Play error: ${err.name} - ${err.message}`));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔊 Audio Test Page</h1>

        {/* Environment Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>Location: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
            <div>Origin: {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</div>
            <div>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR'}</div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Test Controls</h2>
          <div className="space-y-4">
            {testAudioFiles.map(file => (
              <div key={file} className="flex gap-4 items-center">
                <code className="flex-1 text-sm bg-gray-700 px-3 py-2 rounded">
                  {file}
                </code>
                <button
                  onClick={() => testFetch(file)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Fetch Test
                </button>
                <button
                  onClick={() => testPlay(file)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  Play Test
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} controls className="w-full mb-6" />

        {/* Logs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Click buttons to test.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : 'text-gray-300'}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Direct Link Test */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Direct Link Test</h2>
          <p className="text-gray-400 mb-4">Try opening these links directly in a new tab:</p>
          <div className="space-y-2">
            {testAudioFiles.map(file => (
              <div key={file}>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-sm font-mono"
                >
                  {typeof window !== 'undefined' ? window.location.origin : ''}{file}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
