'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface SimpleGestureProps {
  onGestureCommand?: (command: string) => void
  onGestureDetected?: (gesture: string, confidence: number) => void
  isActive?: boolean
}

const SimpleGestureDemo: React.FC<SimpleGestureProps> = ({
  onGestureDetected,
  onGestureCommand,
  isActive = true
}) => {
  const [currentGesture, setCurrentGesture] = useState<string>('none')
  const [demoMode, setDemoMode] = useState<'manual' | 'auto'>('manual')
  const [autoGestureTimer, setAutoGestureTimer] = useState<NodeJS.Timeout | null>(null)

  // Helper function to trigger gesture callbacks
  const triggerGesture = useCallback((gesture: string, confidence: number = 0.9) => {
    setCurrentGesture(gesture)
    if (onGestureDetected) {
      onGestureDetected(gesture, confidence)
    }
    if (onGestureCommand) {
      // Map gestures to commands
      const gestureToCommand: { [key: string]: string } = {
        'point': 'show_stats',
        'open_palm': 'add_resistor', 
        'fist': 'clear_circuit',
        'wave': 'add_battery'
      }
      const command = gestureToCommand[gesture]
      if (command) {
        onGestureCommand(command)
      }
    }
  }, [onGestureDetected, onGestureCommand])

  // Auto demo cycle through gestures
  useEffect(() => {
    if (demoMode === 'auto' && isActive) {
      const gestures = ['point', 'open_palm', 'fist', 'wave']
      let currentIndex = 0

      const cycleGestures = () => {
        const gesture = gestures[currentIndex]
        triggerGesture(gesture, 0.9)
        
        currentIndex = (currentIndex + 1) % gestures.length
        
        const timer = setTimeout(cycleGestures, 3000) // Change every 3 seconds
        setAutoGestureTimer(timer)
      }

      // Start the cycle
      cycleGestures()

      return () => {
        if (autoGestureTimer) {
          clearTimeout(autoGestureTimer)
        }
      }
    } else {
      if (autoGestureTimer) {
        clearTimeout(autoGestureTimer)
        setAutoGestureTimer(null)
      }
    }
  }, [demoMode, isActive, triggerGesture, autoGestureTimer])

  // Manual gesture trigger
  const manualTriggerGesture = (gesture: string) => {
    triggerGesture(gesture, 0.9)
    
    // Reset after 2 seconds
    setTimeout(() => {
      if (demoMode === 'manual') {
        triggerGesture('none', 0)
      }
    }, 2000)
  }

  // Stop auto mode
  const stopAuto = () => {
    setDemoMode('manual')
    triggerGesture('none', 0)
  }

  return (
    <div className="space-y-6">
      {/* Status Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">🤖 AI Gesture Control</h3>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isActive ? '🟢 Active' : '⚫ Inactive'}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Current Gesture:</span>
            <div className="font-bold text-lg text-blue-600">{currentGesture}</div>
          </div>
          <div>
            <span className="text-gray-600">Mode:</span>
            <div className="font-bold text-lg text-purple-600 capitalize">{demoMode}</div>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <div className="font-bold text-lg text-green-600">
              {isActive ? 'Ready' : 'Standby'}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Simulation Display */}
      <div className="bg-black rounded-xl overflow-hidden relative">
        <div className="aspect-video flex items-center justify-center text-white relative">
          {/* Simulated camera view */}
          <div className="text-center">
            <div className="text-6xl mb-4">
              {currentGesture === 'point' && '👆'}
              {currentGesture === 'open_palm' && '✋'}
              {currentGesture === 'fist' && '✊'}
              {currentGesture === 'wave' && '👋'}
              {currentGesture === 'none' && '👤'}
            </div>
            <p className="text-xl font-semibold">{currentGesture.replace('_', ' ').toUpperCase()}</p>
          </div>

          {/* Overlay Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded">
            <div className="text-sm space-y-1">
              <div>Mode: {demoMode === 'auto' ? '🔄 Auto Demo' : '🎮 Manual'}</div>
              <div>Gesture: <span className="text-cyan-400">{currentGesture}</span></div>
            </div>
          </div>

          {/* Demo indicator */}
          {demoMode === 'auto' && (
            <div className="absolute bottom-4 left-4 right-4 bg-blue-600 bg-opacity-80 text-white p-3 rounded text-center">
              <div className="animate-pulse">🔄 Auto Demo Mode - Cycling through gestures...</div>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Control Panel</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setDemoMode(demoMode === 'auto' ? 'manual' : 'auto')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                demoMode === 'auto'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {demoMode === 'auto' ? '⏹️ Stop Auto' : '▶️ Start Auto Demo'}
            </button>
          </div>
        </div>

        {/* Manual Gesture Buttons */}
        {demoMode === 'manual' && (
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Manual Gesture Commands:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => manualTriggerGesture('point')}
                disabled={!isActive}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${
                  currentGesture === 'point'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-1">👆</div>
                <div className="text-sm">Point</div>
                <div className="text-xs text-gray-500">Show Stats</div>
              </button>

              <button
                onClick={() => manualTriggerGesture('open_palm')}
                disabled={!isActive}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${
                  currentGesture === 'open_palm'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-1">✋</div>
                <div className="text-sm">Open Palm</div>
                <div className="text-xs text-gray-500">Add Resistor</div>
              </button>

              <button
                onClick={() => manualTriggerGesture('fist')}
                disabled={!isActive}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${
                  currentGesture === 'fist'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-1">✊</div>
                <div className="text-sm">Fist</div>
                <div className="text-xs text-gray-500">Clear Circuit</div>
              </button>

              <button
                onClick={() => manualTriggerGesture('wave')}
                disabled={!isActive}
                className={`p-4 rounded-lg border-2 transition-all font-medium ${
                  currentGesture === 'wave'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                } ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-1">👋</div>
                <div className="text-sm">Wave</div>
                <div className="text-xs text-gray-500">Add Battery</div>
              </button>
            </div>
          </div>
        )}

        {/* Auto Mode Info */}
        {demoMode === 'auto' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">🔄 Auto Demo Mode</h5>
            <p className="text-sm text-blue-700 mb-3">
              Automatically cycling through all gesture commands every 3 seconds to demonstrate the functionality.
            </p>
            <button
              onClick={stopAuto}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Switch to Manual Control
            </button>
          </div>
        )}
      </div>

      {/* Gesture Guide */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">📋 Gesture Commands Reference</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <span className="text-2xl">👆</span>
              <div>
                <div className="font-medium text-blue-600">Point</div>
                <div className="text-sm text-gray-600">Select circuit element</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <span className="text-2xl">✋</span>
              <div>
                <div className="font-medium text-green-600">Open Palm</div>
                <div className="text-sm text-gray-600">Add new resistor</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <span className="text-2xl">✊</span>
              <div>
                <div className="font-medium text-red-600">Fist</div>
                <div className="text-sm text-gray-600">Delete selected element</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              <span className="text-2xl">👋</span>
              <div>
                <div className="font-medium text-purple-600">Wave</div>
                <div className="text-sm text-gray-600">Reset circuit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleGestureDemo
