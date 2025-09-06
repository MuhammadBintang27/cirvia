'use client'

import Link from 'next/link'
import ModuleCard from '@/components/ModuleCard'
import Navbar from '@/components/Navbar'
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
      title: 'Materi 1: Pengenalan Arus Searah & Hukum Ohm',
      subtitle: 'Arus listrik searah, rangkaian, dan hukum Ohm',
      description: 'Pelajari konsep arus searah, komponen rangkaian listrik, dan penerapan hukum Ohm secara kontekstual.',
      gradientColors: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'module-2',
      title: 'Materi 2: Rangkaian Listrik Seri',
      subtitle: 'Komponen tersusun berurutan dalam satu jalur',
      description: 'Pahami ciri-ciri, rumus, dan contoh rangkaian listrik seri beserta penerapannya dalam kehidupan sehari-hari.',
      gradientColors: 'from-green-500 to-blue-500'
    },
    {
      id: 'module-3',
      title: 'Materi 3: Rangkaian Listrik Paralel',
      subtitle: 'Komponen tersusun bercabang dan arus terbagi',
      description: 'Pelajari konsep, rumus, dan contoh rangkaian listrik paralel serta penerapannya di rumah dan lingkungan sekitar.',
      gradientColors: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
              <span className="text-3xl">🔌</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Rangkaian Listrik
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Pelajari konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami. 
              Klik setiap kartu untuk mempelajari materinya secara detail!
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <OverallProgress 
                totalProgress={progress.totalProgress}
                completedModules={progress.completedModules.length}
                totalModules={3}
              />
            </div>
          </div>

          {/* Learning Modules Cards */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {modulesData.map((module, index) => (
              <div key={module.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ModuleCard
                  id={module.id}
                  title={module.title}
                  subtitle={module.subtitle}
                  description={module.description}
                  gradientColors={module.gradientColors}
                  isCompleted={isModuleCompleted(module.id)}
                  onMarkComplete={() => markModuleComplete(module.id)}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Siap untuk Praktik Langsung?</h3>
            <p className="text-lg mb-6 opacity-90">
              Setelah mempelajari teori, saatnya mencoba simulator rangkaian listrik dengan kontrol gesture!
            </p>
            <Link 
              href="/practicum" 
              className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <span>🚀</span>
              <span>Mulai Praktikum</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
