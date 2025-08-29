'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SimpleHandTrackerProps {
  onGestureDetected: (gesture: string, confidence: number) => void
  isActive: boolean
  width?: number
  height?: number
}

const SimpleHandTracker: React.FC<SimpleHandTrackerProps> = ({
  onGestureDetected,
  isActive,
  width = 640,
  height = 480
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentGesture, setCurrentGesture] = useState<string>('none')
  const [motionDetected, setMotionDetected] = useState(false)
  const [lastFrame, setLastFrame] = useState<ImageData | null>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user'
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
      setIsLoading(false)
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Camera access denied. Please allow camera permission.')
      setIsLoading(false)
    }
  }, [width, height])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  // Simple motion detection
  const detectMotion = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    
    // Draw current frame
    ctx.drawImage(videoRef.current, 0, 0, width, height)
    const currentImageData = ctx.getImageData(0, 0, width, height)

    if (lastFrame) {
      let diffSum = 0
      const threshold = 50
      let motionPixels = 0

      // Compare with previous frame
      for (let i = 0; i < currentImageData.data.length; i += 4) {
        const rDiff = Math.abs(currentImageData.data[i] - lastFrame.data[i])
        const gDiff = Math.abs(currentImageData.data[i + 1] - lastFrame.data[i + 1])
        const bDiff = Math.abs(currentImageData.data[i + 2] - lastFrame.data[i + 2])
        
        const totalDiff = (rDiff + gDiff + bDiff) / 3
        
        if (totalDiff > threshold) {
          motionPixels++
          // Highlight motion areas
          currentImageData.data[i] = 255     // Red
          currentImageData.data[i + 1] = 0   // Green
          currentImageData.data[i + 2] = 0   // Blue
        }
        
        diffSum += totalDiff
      }

      // Draw the processed frame
      ctx.putImageData(currentImageData, 0, 0)

      const motionPercentage = (motionPixels / (width * height)) * 100
      const avgDiff = diffSum / (width * height)

      // Simple gesture recognition based on motion patterns
      let detectedGesture = 'none'
      let confidence = 0

      if (motionPercentage > 15) {
        if (avgDiff > 40) {
          detectedGesture = 'wave'
          confidence = Math.min(avgDiff / 80, 1)
        } else if (motionPercentage > 25) {
          detectedGesture = 'large_motion'
          confidence = Math.min(motionPercentage / 50, 1)
        } else {
          detectedGesture = 'small_motion'
          confidence = Math.min(motionPercentage / 30, 1)
        }
        setMotionDetected(true)
      } else {
        setMotionDetected(false)
      }

      // Update gesture if changed
      if (detectedGesture !== currentGesture) {
        setCurrentGesture(detectedGesture)
        onGestureDetected(detectedGesture, confidence)
      }
    }

    setLastFrame(currentImageData)
  }, [lastFrame, currentGesture, onGestureDetected, width, height])

  // Animation loop for motion detection
  useEffect(() => {
    let animationFrame: number

    const loop = () => {
      if (isActive && videoRef.current) {
        detectMotion()
      }
      animationFrame = requestAnimationFrame(loop)
    }

    if (isActive) {
      loop()
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isActive, detectMotion])

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive, startCamera, stopCamera])

  // Simulate gesture detection based on clicks for demo purposes
  const simulateGesture = (gesture: string) => {
    setCurrentGesture(gesture)
    onGestureDetected(gesture, 0.9)
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCurrentGesture('none')
      onGestureDetected('none', 0)
    }, 2000)
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Starting camera...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Camera Error:</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={startCamera}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Video and Canvas */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="hidden"
            width={width}
            height={height}
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-auto"
          />
          
          {/* Overlay Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded">
            <div className="text-sm space-y-1">
              <div>Status: {isActive ? '🟢 Active' : '🔴 Inactive'}</div>
              <div>Motion: {motionDetected ? '🟡 Detected' : '🔵 Still'}</div>
              <div>Gesture: <span className="font-bold text-green-400">{currentGesture}</span></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded">
            <p className="text-sm text-center">
              💡 Move your hand in front of the camera to trigger gesture detection
            </p>
          </div>
        </div>

        {/* Manual Gesture Simulator (for testing) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Manual Gesture Test (Development Mode):</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => simulateGesture('point')}
              className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              👆 Point
            </button>
            <button
              onClick={() => simulateGesture('open_palm')}
              className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors"
            >
              ✋ Open Palm
            </button>
            <button
              onClick={() => simulateGesture('fist')}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
            >
              ✊ Fist
            </button>
            <button
              onClick={() => simulateGesture('wave')}
              className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 transition-colors"
            >
              👋 Wave
            </button>
          </div>
        </div>

        {/* Gesture Guide */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Gesture Commands:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className={`p-3 rounded-lg border-2 transition-all ${currentGesture === 'point' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
              <div className="font-medium text-blue-600">👆 Point / Small Motion</div>
              <div className="text-gray-600">Select circuit element</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all ${currentGesture === 'open_palm' ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
              <div className="font-medium text-green-600">✋ Open Palm / Large Motion</div>
              <div className="text-gray-600">Add new resistor</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all ${currentGesture === 'fist' ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
              <div className="font-medium text-red-600">✊ Fist</div>
              <div className="text-gray-600">Delete selected element</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all ${currentGesture === 'wave' ? 'border-purple-400 bg-purple-50' : 'border-gray-200'}`}>
              <div className="font-medium text-purple-600">👋 Wave / Fast Motion</div>
              <div className="text-gray-600">Reset circuit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleHandTracker
