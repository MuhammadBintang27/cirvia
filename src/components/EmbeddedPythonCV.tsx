'use client'

import { useState, useEffect } from 'react'

export default function EmbeddedPythonCV() {
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [serverUrl, setServerUrl] = useState('http://localhost:5000')
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const startPythonCV = async () => {
    setStatus('starting')
    setErrorMessage('')
    setIframeLoaded(false) // Reset iframe loaded state

    try {
      // Check if server is already running
      const healthCheck = await fetch('http://localhost:5000', { method: 'HEAD' }).catch(() => null)
      
      if (healthCheck && healthCheck.ok) {
        // Server already running, skip starting
        console.log('Flask server already running, using existing instance')
        setStatus('running')
        return
      }

      // Start the Python Flask server
      const response = await fetch('/api/start-python-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Wait a moment for server to fully start
        setTimeout(() => {
          setStatus('running')
        }, 3000)
      } else if (response.status === 409) {
        // Server already running
        console.log('Server already running (409), switching to running state')
        setStatus('running')
      } else {
        const error = await response.text()
        setStatus('error')
        setErrorMessage(error || 'Failed to start Python CV server')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Error starting Python CV: ' + (error as Error).message)
    }
  }

  const stopPythonCV = async () => {
    try {
      await fetch('/api/stop-python-cv', {
        method: 'POST',
      })
      setStatus('idle')
      setIframeLoaded(false) // Reset iframe loaded state
    } catch (error) {
      console.error('Error stopping Python CV:', error)
    }
  }

  if (status === 'idle') {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Python Computer Vision Circuit Builder
            </h3>
            <p className="text-gray-600 mb-4">
              Aplikasi CV lengkap dengan gesture detection, embedded langsung di platform web!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6 text-left">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">🤖 AI Features</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Hand gesture recognition</li>
                <li>• Real-time pinch detection</li>
                <li>• MediaPipe integration</li>
                <li>• Advanced computer vision</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">⚡ Circuit Features</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Interactive component placement</li>
                <li>• Real-time calculations</li>
                <li>• Physics simulation</li>
                <li>• Educational interface</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">📋 Gesture Controls</h4>
            <div className="grid grid-cols-3 gap-4 text-sm text-yellow-700">
              <div className="text-center">
                <div className="text-lg mb-1">🤏</div>
                <div className="font-medium">Pinch</div>
                <div>Select & Drag</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">👆</div>
                <div className="font-medium">Point</div>
                <div>Navigate</div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-1">✋</div>
                <div className="font-medium">Open</div>
                <div>Release</div>
              </div>
            </div>
          </div>

          <button
            onClick={startPythonCV}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
          >
            🚀 Launch Python CV Application
          </button>
        </div>
      </div>
    )
  }

  if (status === 'starting') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Starting Python CV Server...</h3>
          <p className="text-gray-600 mb-4">
            Initializing camera, loading AI models, and starting web interface...
          </p>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Loading OpenCV and MediaPipe...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <span>Initializing camera feed...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                <span>Starting Flask web server...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Start</h3>
          <p className="text-red-600 mb-4">{errorMessage}</p>
          
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-left">
            <h4 className="font-bold text-red-800 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Make sure Python and all dependencies are installed</li>
              <li>• Check if your camera is not being used by another application</li>
              <li>• Ensure port 5000 is not occupied by another service</li>
              <li>• Try running the setup script again</li>
            </ul>
          </div>
          
          <div className="flex space-x-3 justify-center">
            <button
              onClick={startPythonCV}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => setStatus('idle')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Running state - show embedded iframe
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold">Python CV Circuit Builder - LIVE</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm opacity-75">localhost:5000</span>
            <button
              onClick={stopPythonCV}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Python CV Application */}
      <div className="relative">
        <iframe
          src={serverUrl}
          className="w-full h-[700px] border-0"
          title="Python CV Circuit Builder"
          onLoad={() => {
            console.log('Python CV application loaded successfully')
            setIframeLoaded(true)
          }}
          onError={() => setErrorMessage('Failed to load Python CV application')}
        />
        
        {/* Loading overlay - only show when iframe not loaded */}
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Python CV Application...</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with instructions */}
      <div className="bg-gray-50 p-4">
        <div className="grid md:grid-cols-4 gap-4 text-center text-sm">
          <div className="text-blue-600">
            <div className="font-bold">🤏 Pinch</div>
            <div>Select & drag components</div>
          </div>
          <div className="text-green-600">
            <div className="font-bold">👆 Point</div>
            <div>Navigate interface</div>
          </div>
          <div className="text-yellow-600">
            <div className="font-bold">✋ Open</div>
            <div>Release components</div>
          </div>
          <div className="text-purple-600">
            <div className="font-bold">📊 Live</div>
            <div>Real-time calculations</div>
          </div>
        </div>
      </div>
    </div>
  )
}
