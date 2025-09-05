'use client'

import { useState, useEffect } from 'react'

export default function CVPracticumLauncher() {
  const [isLaunching, setIsLaunching] = useState(false)
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const launchCVApp = async () => {
    setIsLaunching(true)
    setStatus('starting')
    setErrorMessage('')

    try {
      // Attempt to launch the Python CV application
      const response = await fetch('/api/launch-cv-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setStatus('running')
        // Optionally, you could poll for status updates
      } else {
        const error = await response.text()
        setStatus('error')
        setErrorMessage(error || 'Failed to launch CV application')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Error launching CV application: ' + (error as Error).message)
    } finally {
      setIsLaunching(false)
    }
  }

  const stopCVApp = async () => {
    try {
      await fetch('/api/stop-cv-app', {
        method: 'POST',
      })
      setStatus('idle')
    } catch (error) {
      console.error('Error stopping CV application:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Praktikum Computer Vision
      </h3>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Aplikasi praktikum menggunakan deteksi gesture tangan untuk membangun rangkaian listrik.
        </p>
        
        <div className="text-sm text-gray-500 mb-2">
          <strong>Fitur:</strong>
          <ul className="list-disc list-inside ml-2">
            <li>Deteksi gesture pinch untuk interaksi</li>
            <li>Komponen resistor, baterai, dan kabel</li>
            <li>Kalkulasi otomatis nilai rangkaian</li>
            <li>Interface visual interaktif</li>
          </ul>
        </div>
      </div>

      {status === 'idle' && (
        <button
          onClick={launchCVApp}
          disabled={isLaunching}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isLaunching
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLaunching ? 'Memulai...' : 'Mulai Praktikum CV'}
        </button>
      )}

      {status === 'starting' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memulai aplikasi CV...</p>
        </div>
      )}

      {status === 'running' && (
        <div className="text-center">
          <div className="mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-green-600 font-medium">Aplikasi CV berjalan</p>
            <p className="text-sm text-gray-600">Periksa jendela aplikasi yang terbuka</p>
          </div>
          <button
            onClick={stopCVApp}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
          >
            Hentikan Praktikum
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-md">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
          <button
            onClick={launchCVApp}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-700">
          <strong>Catatan:</strong> Pastikan kamera dan Python dengan library yang diperlukan telah terinstal.
        </p>
      </div>
    </div>
  )
}
