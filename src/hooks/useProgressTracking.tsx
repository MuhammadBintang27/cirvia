'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Trophy, Target, Zap, Star, Sparkles } from 'lucide-react'

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

  // Load progress from memory on mount (no localStorage in artifacts)
  useEffect(() => {
    // In a real app, this would load from localStorage or backend
    // For artifacts, we'll keep it in memory
    console.log('Progress tracking initialized')
  }, [])

  const markModuleComplete = (moduleId: string) => {
    setProgress(prev => {
      const newCompleted = [...prev.completedModules]
      if (!newCompleted.includes(moduleId)) {
        newCompleted.push(moduleId)
      }
      
      const totalModules = 3 // Total number of modules
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

// Enhanced Progress Indicator Component
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
    <div className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isCompleted 
                ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white transform scale-110' 
                : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-blue-400/50"></div>
              )}
            </div>
            <span className={`font-semibold transition-colors ${
              isCompleted ? 'text-emerald-300' : 'text-blue-200'
            }`}>
              {title}
            </span>
          </div>
          {!isCompleted && onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg border border-white/20"
            >
              Tandai Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Overall Progress Component
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
  const isComplete = completedModules === totalModules
  const progressColor = isComplete 
    ? 'from-emerald-400 to-green-400' 
    : 'from-blue-500 to-cyan-500'

  return (
    <div className="relative group">
      {/* Animated background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
      
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-white/20">
              {isComplete ? (
                <Trophy className="w-7 h-7 text-yellow-400" />
              ) : (
                <Target className="w-7 h-7 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Progress Belajar</h3>
              <p className="text-blue-200/80">Perjalanan pembelajaran Anda</p>
            </div>
          </div>
          
          {/* Achievement Badge */}
          {isComplete && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold">Selesai!</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          )}
        </div>

        {/* Main Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-lg font-semibold text-blue-200">Kemajuan Keseluruhan</span>
            <div className="text-right">
              <div className="text-3xl font-black text-white">{Math.round(totalProgress)}%</div>
              <div className="text-sm text-blue-300">dari target 100%</div>
            </div>
          </div>
          
          <div className="relative w-full bg-blue-900/30 rounded-full h-6 overflow-hidden shadow-inner">
            <div 
              className={`bg-gradient-to-r ${progressColor} h-6 rounded-full transition-all duration-2000 ease-out relative overflow-hidden`}
              style={{ width: `${totalProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-blue-200 font-medium">
              {isComplete 
                ? "Selamat! Semua modul telah diselesaikan! 🎉" 
                : `${totalModules - completedModules} modul tersisa - tetap semangat! 💪`
              }
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-400/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-400/30">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-300 mb-1">{completedModules}</div>
            <div className="text-sm text-emerald-200/80 font-medium">Modul Selesai</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-300 mb-1">{totalModules - completedModules}</div>
            <div className="text-sm text-blue-200/80 font-medium">Modul Tersisa</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-400/30">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-300 mb-1">{Math.round(totalProgress)}%</div>
            <div className="text-sm text-purple-200/80 font-medium">Progress Total</div>
          </div>
        </div>

        {/* Module Progress Dots */}
        <div className="flex items-center justify-center space-x-3">
          <span className="text-sm text-blue-200 font-medium">Modul:</span>
          {Array.from({ length: totalModules }).map((_, index) => (
            <div key={index} className="relative">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  index < completedModules
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg transform scale-125'
                    : 'bg-blue-900/40 border border-blue-400/30'
                }`}
              />
              {index < completedModules && (
                <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
              )}
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {!isComplete && (
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20">
            <p className="text-blue-200">
              💡 <strong>Tips:</strong> Selesaikan satu modul setiap hari untuk hasil optimal!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Custom keyframes for shimmer effect
const style = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = style
  document.head.appendChild(styleSheet)
}