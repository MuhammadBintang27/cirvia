'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'

interface GestureControlProps {
  onGestureDetected: (gesture: string, confidence: number) => void
  isActive: boolean
}

const GestureControl: React.FC<GestureControlProps> = ({
  onGestureDetected,
  isActive
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  
  const [cameraStatus, setCameraStatus] = useState<'inactive' | 'starting' | 'active' | 'error'>('inactive')
  const [currentGesture, setCurrentGesture] = useState<string>('none')
  const [error, setError] = useState<string>('')

  // Process video frames
  const startProcessing = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isActive) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const processFrame = () => {
      if (!isActive || cameraStatus !== 'active') return

      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, 640, 480)
        
        // Simple gesture simulation based on time (for demo)
        const time = Date.now()
        const cycle = Math.floor(time / 3000) % 4 // Change gesture every 3 seconds
        
        let gesture = 'none'
        switch (cycle) {
          case 0:
            gesture = 'point'
            break
          case 1:
            gesture = 'open_palm'
            break
          case 2:
            gesture = 'fist'
            break
          case 3:
            gesture = 'wave'
            break
        }

        if (gesture !== currentGesture) {
          setCurrentGesture(gesture)
          onGestureDetected(gesture, 0.8)
        }

        // Draw simple overlay
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
        ctx.fillRect(10, 10, 100, 30)
        ctx.fillStyle = 'white'
        ctx.font = '16px Arial'
        ctx.fillText('Tracking...', 15, 30)

      } catch (err) {
        console.error('Processing error:', err)
      }

      animationRef.current = requestAnimationFrame(processFrame)
    }

    processFrame()
  }, [isActive, cameraStatus, currentGesture, onGestureDetected])

  // Initialize camera
  const initCamera = useCallback(async () => {
    if (!isActive) return

    try {
      setCameraStatus('starting')
      setError('')
      
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setCameraStatus('active')
              startProcessing()
            }).catch(err => {
              console.error('Error playing video:', err)
              setCameraStatus('error')
              setError('Failed to start video playback')
            })
          }
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraStatus('error')
      setError('Camera access denied. Please allow camera permission and refresh the page.')
    }
  }, [isActive, startProcessing])

  // Cleanup function
  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setCameraStatus('inactive')
    setCurrentGesture('none')
  }

  useEffect(() => {
    if (isActive) {
      initCamera()
    } else {
      cleanup()
    }

    return cleanup
  }, [isActive, initCamera])

  // Manual gesture triggers for testing
  const triggerGesture = (gesture: string) => {
    setCurrentGesture(gesture)
    onGestureDetected(gesture, 0.9)
    
    setTimeout(() => {
      setCurrentGesture('none')
      onGestureDetected('none', 0)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Camera Status */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Camera Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            cameraStatus === 'active' ? 'bg-green-100 text-green-800' :
            cameraStatus === 'starting' ? 'bg-yellow-100 text-yellow-800' :
            cameraStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {cameraStatus === 'active' && '🟢 Active'}
            {cameraStatus === 'starting' && '🟡 Starting...'}
            {cameraStatus === 'error' && '🔴 Error'}
            {cameraStatus === 'inactive' && '⚫ Inactive'}
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm mb-2">{error}</div>
        )}
        
        <div className="text-sm text-gray-600">
          Current Gesture: <span className="font-semibold text-blue-600">{currentGesture}</span>
        </div>
      </div>

      {/* Video Display */}
      <div className="bg-black rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          className="hidden"
          width={640}
          height={480}
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-auto"
        />
        
        {cameraStatus === 'starting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initializing camera...</p>
            </div>
          </div>
        )}

        {cameraStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
            <div className="text-white text-center p-4">
              <p className="mb-4">Camera Error</p>
              <button
                onClick={initCamera}
                className="bg-white text-red-900 px-4 py-2 rounded hover:bg-gray-100"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Controls for Testing */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Manual Gesture Test</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => triggerGesture('point')}
            className={`p-3 rounded transition-all text-sm font-medium ${
              currentGesture === 'point' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            👆 Point
          </button>
          <button
            onClick={() => triggerGesture('open_palm')}
            className={`p-3 rounded transition-all text-sm font-medium ${
              currentGesture === 'open_palm' 
                ? 'bg-green-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✋ Open Palm
          </button>
          <button
            onClick={() => triggerGesture('fist')}
            className={`p-3 rounded transition-all text-sm font-medium ${
              currentGesture === 'fist' 
                ? 'bg-red-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✊ Fist
          </button>
          <button
            onClick={() => triggerGesture('wave')}
            className={`p-3 rounded transition-all text-sm font-medium ${
              currentGesture === 'wave' 
                ? 'bg-purple-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            👋 Wave
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Use manual buttons to test gesture commands while camera is being set up
        </p>
      </div>

      {/* Gesture Commands Guide */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-semibold mb-3">Gesture Commands</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>👆 Point</span>
            <span className="text-gray-600">Select circuit element</span>
          </div>
          <div className="flex justify-between">
            <span>✋ Open Palm</span>
            <span className="text-gray-600">Add resistor</span>
          </div>
          <div className="flex justify-between">
            <span>✊ Fist</span>
            <span className="text-gray-600">Delete element</span>
          </div>
          <div className="flex justify-between">
            <span>👋 Wave</span>
            <span className="text-gray-600">Reset circuit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestureControl
