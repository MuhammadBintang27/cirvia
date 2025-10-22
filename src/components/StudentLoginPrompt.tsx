'use client'

import Link from 'next/link'
import { BookOpen, Users, Target, TrendingUp, Award, BarChart3 } from 'lucide-react'

interface StudentLoginPromptProps {
  title?: string
  description?: string
  features?: Array<{
    icon: React.ComponentType<any>
    title: string
    description: string
    color: string
  }>
}

export default function StudentLoginPrompt({ 
  title = "Pantau Progress Pembelajaran Anda",
  description = "Login sebagai siswa untuk melihat progress belajar, hasil pre-test, post-test, dan analisis kemajuan pembelajaran Anda secara detail.",
  features = [
    {
      icon: Target,
      title: "Hasil Test",
      description: "Lihat skor pre-test dan post-test dengan analisis detail jawaban",
      color: "blue"
    },
    {
      icon: TrendingUp,
      title: "Analisis Kemajuan", 
      description: "Tracking peningkatan skor dan efisiensi waktu pembelajaran",
      color: "purple"
    },
    {
      icon: Award,
      title: "Achievement",
      description: "Dapatkan badge dan penghargaan berdasarkan prestasi belajar",
      color: "emerald"
    }
  ]
}: StudentLoginPromptProps) {
  
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        textSecondary: 'text-blue-200/60',
        gradient: 'from-blue-500/20 to-cyan-600/20'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400', 
        textSecondary: 'text-purple-200/60',
        gradient: 'from-purple-500/20 to-pink-600/20'
      },
      emerald: {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        textSecondary: 'text-emerald-200/60', 
        gradient: 'from-emerald-500/20 to-teal-600/20'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section for Login Prompt */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
            <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-medium">Progress Pembelajaran</span>
          </div>

          <h1 className="text-6xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
              {title}
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Login Siswa</h3>
                  <p className="text-blue-200/70 text-sm mb-6">
                    Masuk dengan nama dan NIS untuk melihat progress pembelajaran Anda
                  </p>
                </div>

                <Link 
                  href="/login/student" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Login Sebagai Siswa
                </Link>

                <div className="text-center">
                  <div className="text-blue-200/50 text-sm mb-3">atau</div>
                  <Link 
                    href="/login" 
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Login sebagai Guru →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color)
              const IconComponent = feature.icon
              
              return (
                <div key={index} className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${colorClasses.gradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                    <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className={`${colorClasses.textSecondary} text-sm`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}