'use client'

import { useState } from 'react'
import { Brain, Sparkles, TrendingUp } from 'lucide-react'
import AIAssessmentReport from './AIAssessmentReport'
import { useAuth } from '@/contexts/AuthContext'

interface AIAssessmentButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

const AIAssessmentButton: React.FC<AIAssessmentButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showLabel = true
}) => {
  const [showAssessment, setShowAssessment] = useState(false)
  const { user } = useAuth()

  if (!user || user.role !== 'student') {
    return null
  }

  const baseClasses = 'inline-flex items-center justify-center transition-all duration-300 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white',
    minimal: 'bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white backdrop-blur-sm'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <>
      <button
        onClick={() => setShowAssessment(true)}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <div className="relative">
          <Brain className={`${iconSizes[size]} ${showLabel ? 'mr-2' : ''}`} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        {showLabel && (
          <span className="flex items-center">
            AI Assessment
            <Sparkles className={`${iconSizes[size]} ml-1 text-yellow-300`} />
          </span>
        )}
      </button>

      {showAssessment && (
        <AIAssessmentReport
          studentId={user.id}
          studentName={user.name}
          studentClass={String(user.class)}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </>
  )
}

export default AIAssessmentButton