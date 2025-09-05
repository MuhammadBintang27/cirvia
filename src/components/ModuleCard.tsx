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
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradientColors} text-white p-6 relative`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-90">{subtitle}</p>
          </div>
          
          {/* Status Icon */}
          <div className="ml-4">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-200" />
            ) : (
              <Circle className="w-6 h-6 text-white opacity-70" />
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400"></div>
        )}
      </div>

      {/* Content Preview */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        {/* Features Preview */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Volume2 className="w-4 h-4" />
            <span>Audio</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>Demo</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play className="w-4 h-4" />
            <span>Interaktif</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {isCompleted ? 'Materi telah selesai' : 'Mulai belajar'}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default ModuleCard
