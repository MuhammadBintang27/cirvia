'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, Play, Volume2, Zap, CheckCircle, Circle } from 'lucide-react'

interface ModuleCardProps {
  id: string
  title: string
  subtitle: string
  description: string
  gradientColors: string
  isCompleted: boolean
  onMarkComplete: () => void
}

// Slug mapping untuk URL
const getSlugFromId = (id: string) => {
  const slugMap = {
    'module-1': 'konsep-dasar-listrik',
    'module-2': 'rangkaian-seri', 
    'module-3': 'daya-listrik'
  }
  return slugMap[id as keyof typeof slugMap] || id
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  title,
  subtitle,
  description,
  gradientColors,
  isCompleted,
  onMarkComplete
}) => {
  const router = useRouter()
  
  const handleCardClick = () => {
    const slug = getSlugFromId(id)
    router.push(`/materials/${slug}`)
  }

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer border border-gray-100"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradientColors} text-white p-6 relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">{title}</h3>
              <p className="text-sm opacity-90">{subtitle}</p>
            </div>
            
            {/* Status Icon with animation */}
            <div className={`transition-all duration-300 ${isCompleted ? 'scale-110' : 'group-hover:scale-110'}`}>
              {isCompleted ? (
                <div className="bg-green-400 bg-opacity-30 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-100" />
                </div>
              ) : (
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Circle className="w-6 h-6 text-white opacity-70" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-700"></div>
        
        {/* Progress indicator */}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
        )}
      </div>

      {/* Content Preview */}
      <div className="p-6">
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{description}</p>
        
        {/* Features Preview */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1 group-hover:text-blue-500 transition-colors">
            <Volume2 className="w-4 h-4" />
            <span>Audio</span>
          </div>
          <div className="flex items-center space-x-1 group-hover:text-purple-500 transition-colors">
            <Zap className="w-4 h-4" />
            <span>Demo</span>
          </div>
          <div className="flex items-center space-x-1 group-hover:text-green-500 transition-colors">
            <Play className="w-4 h-4" />
            <span>Interaktif</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
          <span className="text-sm font-medium text-gray-700">
            {isCompleted ? (
              <span className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Materi selesai</span>
              </span>
            ) : (
              'Mulai belajar'
            )}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
