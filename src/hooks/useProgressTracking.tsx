'use client'

import { useEffect, useState } from 'react'

interface ProgressData {
  completedModules: string[]
  audioProgress: { [key: string]: number }
  lastAccessed: string
  totalProgress: number
}

export const useProgressTracking = () => {
  const [progress, setProgress] = useState<ProgressData>({
    completedModules: [],
    audioProgress: {},
    lastAccessed: new Date().toISOString(),
    totalProgress: 0
  })

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('cirvia_progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setProgress(parsed)
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cirvia_progress', JSON.stringify(progress))
    
    // TODO: Sync with backend for cross-device continuity
    // syncProgressWithBackend(progress)
  }, [progress])

  const markModuleComplete = (moduleId: string) => {
    setProgress(prev => {
      const newCompleted = [...prev.completedModules]
      if (!newCompleted.includes(moduleId)) {
        newCompleted.push(moduleId)
      }
      
      const totalModules = 3 // Total number of modules (updated to 3)
      const newTotalProgress = (newCompleted.length / totalModules) * 100
      
      return {
        ...prev,
        completedModules: newCompleted,
        lastAccessed: new Date().toISOString(),
        totalProgress: newTotalProgress
      }
    })
  }

  const updateAudioProgress = (audioId: string, currentTime: number, duration: number) => {
    const progressPercentage = (currentTime / duration) * 100
    
    setProgress(prev => ({
      ...prev,
      audioProgress: {
        ...prev.audioProgress,
        [audioId]: progressPercentage
      },
      lastAccessed: new Date().toISOString()
    }))
  }

  const resetProgress = () => {
    setProgress({
      completedModules: [],
      audioProgress: {},
      lastAccessed: new Date().toISOString(),
      totalProgress: 0
    })
  }

  const isModuleCompleted = (moduleId: string) => {
    return progress.completedModules.includes(moduleId)
  }

  const getAudioProgress = (audioId: string) => {
    return progress.audioProgress[audioId] || 0
  }

  return {
    progress,
    markModuleComplete,
    updateAudioProgress,
    resetProgress,
    isModuleCompleted,
    getAudioProgress
  }
}

// Progress Indicator Component
interface ProgressIndicatorProps {
  moduleId: string
  title: string
  isCompleted?: boolean
  onMarkComplete?: () => void
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  moduleId, 
  title, 
  isCompleted = false,
  onMarkComplete 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300'
        }`}>
          {isCompleted ? '✓' : '○'}
        </div>
        <span className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
          {title}
        </span>
      </div>
      
      {!isCompleted && onMarkComplete && (
        <button
          onClick={onMarkComplete}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Tandai Selesai
        </button>
      )}
    </div>
  )
}

// Overall Progress Component
interface OverallProgressProps {
  totalProgress: number
  completedModules: number
  totalModules: number
}

export const OverallProgress: React.FC<OverallProgressProps> = ({ 
  totalProgress, 
  completedModules, 
  totalModules 
}) => {
  const progressText = completedModules === totalModules ? 'Selamat! Semua modul selesai! 🎉' : 'Tetap semangat belajar! 💪'
  const progressColor = completedModules === totalModules ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-cyan-500'
  
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Progress Belajar Anda</h3>
        <div className="text-2xl">
          {completedModules === totalModules ? '🏆' : '📚'}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Main Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-700 mb-3">
            <span className="font-medium">Kemajuan Keseluruhan</span>
            <span className="font-bold text-blue-600">{Math.round(totalProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${progressColor} h-4 rounded-full transition-all duration-1000 ease-out shadow-sm`}
              style={{ width: `${totalProgress}%` }}
            >
              <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-medium">
            {progressText}
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{completedModules}</div>
            <div className="text-xs text-blue-600 font-medium">Selesai</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{totalModules - completedModules}</div>
            <div className="text-xs text-orange-600 font-medium">Tersisa</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-600">{Math.round(totalProgress)}%</div>
            <div className="text-xs text-green-600 font-medium">Total</div>
          </div>
        </div>
        
        {/* Module Status */}
        <div className="flex items-center justify-center space-x-2">
          {Array.from({ length: totalModules }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < completedModules
                  ? 'bg-green-500 scale-110'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
