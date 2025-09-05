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
      
      const totalModules = 5 // Total number of modules
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
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Progress Belajar Anda</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Kemajuan Keseluruhan</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Modul Selesai:</span>
          <span className="font-semibold text-blue-600">
            {completedModules} dari {totalModules}
          </span>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedModules}</div>
              <div className="text-xs text-blue-600">Modul Selesai</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(totalProgress)}%</div>
              <div className="text-xs text-green-600">Progress Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
