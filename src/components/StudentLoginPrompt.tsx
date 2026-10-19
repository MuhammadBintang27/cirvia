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
        bg: 'bg-brand-soft',
        text: 'text-brand',
        textSecondary: 'text-muted',
        gradient: 'bg-brand-soft'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-700', 
        textSecondary: 'text-muted',
        gradient: 'bg-purple-100'
      },
      emerald: {
        bg: 'bg-mint-soft',
        text: 'text-emerald-700',
        textSecondary: 'text-emerald-700', 
        gradient: 'bg-mint-soft'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section for Login Prompt */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-brand-soft rounded-full border-2 border-ink mb-8">
            <BarChart3 className="w-4 h-4 text-brand mr-2" />
            <span className="text-brand text-sm font-medium">Progress Pembelajaran</span>
          </div>

          <h1 className="text-6xl font-black mb-8 leading-tight">
            <span className="text-ink">
              {title}
            </span>
          </h1>

          <p className="text-xl text-muted mb-12 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>

          <div className="relative">
            <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
            <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink max-w-md mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-2xl font-bold text-ink mb-2">Login Siswa</h3>
                  <p className="text-muted text-sm mb-6">
                    Masuk dengan nama dan NIS untuk melihat progress pembelajaran Anda
                  </p>
                </div>

                <Link 
                  href="/login/student" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-brand border-2 border-ink text-white text-lg font-bold rounded-xl hover:bg-brand transition-all transform"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Login Sebagai Siswa
                </Link>

                <div className="text-center">
                  <div className="text-muted text-sm mb-3">atau</div>
                  <Link 
                    href="/login" 
                    className="text-brand hover:text-brand text-sm font-medium"
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
                  <div className={`absolute -inset-1 ${colorClasses.gradient} rounded-2xl hidden opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative bg-paper to-white/[0.02] rounded-2xl p-6 border border-ink/20 hover:border-ink transition-colors">
                    <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                    </div>
                    <h4 className="text-lg font-bold text-ink mb-2">{feature.title}</h4>
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