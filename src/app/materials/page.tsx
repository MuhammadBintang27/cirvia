'use client'

import Link from 'next/link'
import ModuleCard from '@/components/ModuleCard'
import { useProgressTracking, OverallProgress } from '@/hooks/useProgressTracking'

export default function MaterialsPage() {
  const { 
    progress, 
    markModuleComplete, 
    isModuleCompleted 
  } = useProgressTracking()

  const modulesData = [
    {
      id: 'module-1',
      title: 'Modul 1: Konsep Dasar Listrik',
      subtitle: 'Memahami arus, tegangan, dan resistansi',
      description: 'Pelajari dasar-dasar listrik dengan cara yang mudah dipahami',
      gradientColors: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'module-2',
      title: 'Modul 2: Rangkaian Seri',
      subtitle: 'Komponen tersusun berurutan',
      description: 'Pelajari bagaimana komponen listrik disusun berurutan',
      gradientColors: 'from-green-500 to-blue-500'
    },
    {
      id: 'module-3',
      title: 'Modul 3: Daya Listrik',
      subtitle: 'Energi yang digunakan peralatan listrik',
      description: 'Pelajari konsep daya listrik dan cara menghitungnya',
      gradientColors: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Materi Pembelajaran</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🔌 Rangkaian Listrik
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pelajari konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami. 
              Klik setiap kartu untuk mempelajari materinya!
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="mb-12">
            <OverallProgress 
              totalProgress={progress.totalProgress}
              completedModules={progress.completedModules.length}
              totalModules={3}
            />
          </div>

          {/* Learning Modules Cards */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {modulesData.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                subtitle={module.subtitle}
                description={module.description}
                gradientColors={module.gradientColors}
                isCompleted={isModuleCompleted(module.id)}
                onMarkComplete={() => markModuleComplete(module.id)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link 
              href="/practicum" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <span>🚀 Lanjut ke Praktikum</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
