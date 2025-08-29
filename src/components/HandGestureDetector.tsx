'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface HandLandmark {
  x: number
  y: number
  z: number
}

interface HandDetection {
  landmarks: HandLandmark[]
  handedness: string
  score: number
}

interface HandGestureProps {
  onGestureDetected: (gesture: string, confidence: number) => void
  isActive: boolean
  width?: number
  height?: number
}

const HandGestureDetector: React.FC<HandGestureProps> = ({
  onGestureDetected,
  isActive,
  width = 640,
  height = 480
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hands, setHands] = useState<any>(null)
  const [camera, setCamera] = useState<any>(null)
  const [currentGesture, setCurrentGesture] = useState<string>('none')
  const [confidence, setConfidence] = useState<number>(0)

  // Initialize MediaPipe Hands
  const initializeHands = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Dynamic import to avoid SSR issues
      const { Hands } = await import('@mediapipe/hands')
      const { Camera } = await import('@mediapipe/camera_utils')
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils')

      const handsInstance = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        }
      })

      handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      handsInstance.onResults((results) => {
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')!
          
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

          if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
              // Draw hand connections and landmarks
              drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 })
              // Draw connections between landmarks
              const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
                [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
                [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
                [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
                [5, 9], [9, 13], [13, 17] // Palm
              ]
              
              ctx.strokeStyle = '#00FF00'
              ctx.lineWidth = 2
              for (const [start, end] of connections) {
                if (landmarks[start] && landmarks[end]) {
                  ctx.beginPath()
                  ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height)
                  ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height)
                  ctx.stroke()
                }
              }
            }

            // Detect gestures
            const gesture = detectGesture(results.multiHandLandmarks[0])
            if (gesture.name !== currentGesture) {
              setCurrentGesture(gesture.name)
              setConfidence(gesture.confidence)
              onGestureDetected(gesture.name, gesture.confidence)
            }
          }
          ctx.restore()
        }
      })

      setHands(handsInstance)

      if (videoRef.current) {
        const cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await handsInstance.send({ image: videoRef.current })
            }
          },
          width,
          height
        })
        setCamera(cameraInstance)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Error initializing hands:', err)
      setError('Failed to initialize hand tracking. Please check your camera permissions.')
      setIsLoading(false)
    }
  }, [onGestureDetected, currentGesture, width, height])

  // Gesture detection logic
  const detectGesture = (landmarks: HandLandmark[]): { name: string, confidence: number } => {
    if (!landmarks || landmarks.length < 21) {
      return { name: 'none', confidence: 0 }
    }

    // Convert landmarks to more usable format
    const points = landmarks.map(landmark => ({
      x: landmark.x,
      y: landmark.y,
      z: landmark.z
    }))

    // Finger tip and pip landmarks
    const fingerTips = [4, 8, 12, 16, 20] // Thumb, Index, Middle, Ring, Pinky tips
    const fingerPips = [3, 6, 10, 14, 18] // Finger PIP joints

    // Check if fingers are extended
    const fingersUp = fingerTips.map((tipIndex, i) => {
      if (i === 0) { // Thumb (special case)
        return points[tipIndex].x > points[fingerPips[i]].x
      } else { // Other fingers
        return points[tipIndex].y < points[fingerPips[i]].y
      }
    })

    const extendedFingers = fingersUp.filter(Boolean).length

    // Gesture detection logic
    if (extendedFingers === 0) {
      return { name: 'fist', confidence: 0.9 }
    } else if (extendedFingers === 1 && fingersUp[1]) {
      return { name: 'point', confidence: 0.8 }
    } else if (extendedFingers === 2 && fingersUp[1] && fingersUp[2]) {
      return { name: 'peace', confidence: 0.8 }
    } else if (extendedFingers === 5) {
      return { name: 'open_palm', confidence: 0.9 }
    } else if (extendedFingers === 3 && fingersUp[1] && fingersUp[2] && fingersUp[3]) {
      return { name: 'three', confidence: 0.7 }
    } else if (extendedFingers === 4 && !fingersUp[0]) {
      return { name: 'four', confidence: 0.7 }
    }

    return { name: 'unknown', confidence: 0.3 }
  }

  // Start camera
  const startCamera = useCallback(async () => {
    if (camera && isActive) {
      try {
        await camera.start()
      } catch (err) {
        console.error('Error starting camera:', err)
        setError('Failed to access camera. Please check permissions.')
      }
    }
  }, [camera, isActive])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (camera) {
      camera.stop()
    }
  }, [camera])

  useEffect(() => {
    if (isActive) {
      initializeHands()
    }
    
    return () => {
      stopCamera()
    }
  }, [isActive, initializeHands, stopCamera])

  useEffect(() => {
    if (isActive && camera) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [isActive, camera, startCamera, stopCamera])

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Initializing hand tracking...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
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
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
            <div className="text-sm">
              <div>Status: {isActive ? '🟢 Active' : '🔴 Inactive'}</div>
              <div>Gesture: <span className="font-bold text-green-400">{currentGesture}</span></div>
              <div>Confidence: <span className="font-bold text-blue-400">{Math.round(confidence * 100)}%</span></div>
            </div>
          </div>
        </div>

        {/* Gesture Guide */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Gesture Commands:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className={`p-2 rounded ${currentGesture === 'point' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">👆 Point</div>
              <div className="text-gray-600">Select element</div>
            </div>
            <div className={`p-2 rounded ${currentGesture === 'open_palm' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">✋ Open Palm</div>
              <div className="text-gray-600">Add resistor</div>
            </div>
            <div className={`p-2 rounded ${currentGesture === 'fist' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">✊ Fist</div>
              <div className="text-gray-600">Delete element</div>
            </div>
            <div className={`p-2 rounded ${currentGesture === 'peace' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">✌️ Peace</div>
              <div className="text-gray-600">Reset circuit</div>
            </div>
            <div className={`p-2 rounded ${currentGesture === 'three' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">🤟 Three</div>
              <div className="text-gray-600">Increase value</div>
            </div>
            <div className={`p-2 rounded ${currentGesture === 'four' ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'} border`}>
              <div className="font-medium">🖖 Four</div>
              <div className="text-gray-600">Decrease value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HandGestureDetector
