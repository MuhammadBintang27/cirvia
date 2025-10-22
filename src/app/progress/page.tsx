'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SupabaseTestService, StudentProgressComplete, TestResultWithAnswers } from '@/lib/supabase-test-service'
import Navbar from '@/components/Navbar'
import StudentLoginPrompt from '@/components/StudentLoginPrompt'
import { 
  Trophy, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  Award,
  BookOpen,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function ProgressPage() {
  const { user, isStudent, isTeacher } = useAuth()
  const [studentProgress, setStudentProgress] = useState<StudentProgressComplete | null>(null)
  const [classStats, setClassStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        if (isStudent()) {
          // Load student's own progress
          const progress = await SupabaseTestService.getStudentProgress(user.id)
          setStudentProgress(progress)
        } else if (isTeacher()) {
          // Load class statistics for teacher
          const stats = await SupabaseTestService.getClassStatistics(user.id)
          setClassStats(stats)
        }
        setLoading(false)
      }
    }
    
    loadData()
  }, [user, isStudent, isTeacher])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <StudentLoginPrompt 
          title="Pantau Progress Pembelajaran Anda"
          description="Login sebagai siswa untuk melihat progress belajar, hasil pre-test, post-test, dan analisis kemajuan pembelajaran Anda secara detail."
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
              <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">
                {isStudent() ? 'Progress Pembelajaran' : 'Dashboard Kelas'}
              </span>
            </div>

            <h1 className="text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                {isStudent() ? 'Progress Anda' : 'Statistik Kelas'}
              </span>
            </h1>
          </div>

          {/* Student View */}
          {isStudent() && (
            <div className="space-y-8">
              {/* Welcome Message for Students */}
              {!studentProgress?.preTestResult && !studentProgress?.postTestResult && (
                <div className="relative mb-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-blue-400" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Selamat datang, {user.name}! 👋
                    </h2>
                    
                    <p className="text-blue-200/80 text-lg mb-8 max-w-2xl mx-auto">
                      Anda belum memulai perjalanan pembelajaran. Mari mulai dengan mengerjakan 
                      pre-test untuk mengukur pemahaman awal Anda tentang rangkaian listrik.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl mb-2">📝</div>
                        <h4 className="text-white font-bold mb-1">1. Pre-Test</h4>
                        <p className="text-blue-200/60 text-sm">Tes diagnostik awal untuk mengukur pemahaman</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl mb-2">🧪</div>
                        <h4 className="text-white font-bold mb-1">2. Praktikum</h4>
                        <p className="text-blue-200/60 text-sm">Simulasi rangkaian listrik interaktif</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl mb-2">🏆</div>
                        <h4 className="text-white font-bold mb-1">3. Post-Test</h4>
                        <p className="text-blue-200/60 text-sm">Evaluasi akhir untuk mengukur kemajuan</p>
                      </div>
                    </div>

                    <Link 
                      href="/pretest" 
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
                    >
                      <Target className="w-5 h-5 mr-3" />
                      Mulai Pre-Test Sekarang
                    </Link>
                  </div>
                </div>
              )}

              {/* Progress Overview */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pre-Test Results */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Pre-Test</h3>
                        <p className="text-blue-200/70">Tes Diagnostik Awal</p>
                      </div>
                    </div>

                    {studentProgress?.preTestResult ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-black text-blue-400 mb-2">
                            {studentProgress.preTestResult.percentage}%
                          </div>
                          <div className="text-lg text-white mb-2">
                            Grade: {studentProgress.preTestResult.grade}
                          </div>
                          <div className="text-sm text-blue-200/70">
                            {studentProgress.preTestResult.correct_answers}/{studentProgress.preTestResult.total_questions} benar
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-200/70">Waktu:</span>
                            <span className="text-white">{Math.floor(studentProgress.preTestResult.time_spent / 60)}:{(studentProgress.preTestResult.time_spent % 60).toString().padStart(2, '0')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-200/70">Tanggal:</span>
                            <span className="text-white">{new Date(studentProgress.preTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-gray-400 mb-4">Belum mengerjakan</div>
                        <Link 
                          href="/pretest" 
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Mulai Pre-Test
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post-Test Results */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                        <Trophy className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Post-Test</h3>
                        <p className="text-purple-200/70">Tes Evaluasi Akhir</p>
                      </div>
                    </div>

                    {studentProgress?.postTestResult ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-black text-purple-400 mb-2">
                            {studentProgress.postTestResult.percentage}%
                          </div>
                          <div className="text-lg text-white mb-2">
                            Grade: {studentProgress.postTestResult.grade}
                          </div>
                          <div className="text-sm text-purple-200/70">
                            {studentProgress.postTestResult.correct_answers}/{studentProgress.postTestResult.total_questions} benar
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-200/70">Waktu:</span>
                            <span className="text-white">{Math.floor(studentProgress.postTestResult.time_spent / 60)}:{(studentProgress.postTestResult.time_spent % 60).toString().padStart(2, '0')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-200/70">Tanggal:</span>
                            <span className="text-white">{new Date(studentProgress.postTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-gray-400 mb-4">
                          {studentProgress?.preTestResult ? 'Belum mengerjakan' : 'Selesaikan Pre-Test terlebih dahulu'}
                        </div>
                        <Link 
                          href="/posttest" 
                          className={`inline-flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                            studentProgress?.preTestResult 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Trophy className="w-4 h-4 mr-2" />
                          Mulai Post-Test
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Improvement Analysis */}
              {studentProgress?.improvement && (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Analisis Kemajuan</h3>
                        <p className="text-emerald-200/70">Perbandingan Pre-Test vs Post-Test</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className={`text-3xl font-black mb-2 ${
                          studentProgress.improvement.scoreIncrease >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {studentProgress.improvement.scoreIncrease >= 0 ? '+' : ''}{studentProgress.improvement.scoreIncrease.toFixed(1)}%
                        </div>
                        <div className="text-white font-medium mb-1">Peningkatan Skor</div>
                        <div className="flex items-center justify-center">
                          {studentProgress.improvement.scoreIncrease >= 0 ? (
                            <ArrowUp className="w-4 h-4 text-emerald-400 mr-1" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
                          )}
                          <span className="text-emerald-200/70 text-sm">
                            {studentProgress.improvement.scoreIncrease >= 0 ? 'Meningkat' : 'Menurun'}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-black text-cyan-400 mb-2">
                          {Math.abs(studentProgress.improvement.percentageIncrease).toFixed(1)}%
                        </div>
                        <div className="text-white font-medium mb-1">Persentase Kemajuan</div>
                        <div className="text-cyan-200/70 text-sm">
                          Relatif terhadap skor awal
                        </div>
                      </div>

                      <div className="text-center">
                        <div className={`text-3xl font-black mb-2 ${
                          studentProgress.improvement.timeImprovement >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {studentProgress.improvement.timeImprovement >= 0 ? '-' : '+'}{Math.abs(studentProgress.improvement.timeImprovement)}s
                        </div>
                        <div className="text-white font-medium mb-1">Efisiensi Waktu</div>
                        <div className="text-blue-200/70 text-sm">
                          {studentProgress.improvement.timeImprovement >= 0 ? 'Lebih cepat' : 'Lebih lama'}
                        </div>
                      </div>
                    </div>

                    {/* Achievement Badges */}
                    <div className="mt-8 flex flex-wrap gap-3 justify-center">
                      {studentProgress.improvement.scoreIncrease >= 20 && (
                        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-400/30">
                          <Star className="w-4 h-4 text-yellow-400 mr-2" />
                          <span className="text-yellow-300 text-sm font-medium">Peningkatan Luar Biasa</span>
                        </div>
                      )}
                      {studentProgress.improvement.scoreIncrease >= 10 && studentProgress.improvement.scoreIncrease < 20 && (
                        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30">
                          <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-blue-300 text-sm font-medium">Kemajuan Baik</span>
                        </div>
                      )}
                      {studentProgress.postTestResult?.grade === 'A' && (
                        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                          <Award className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-purple-300 text-sm font-medium">Prestasi Unggul</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Teacher View */}
          {isTeacher() && classStats && (
            <div className="space-y-8">
              {/* Class Overview */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-2xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{classStats.totalStudents}</div>
                    <div className="text-blue-200/70 text-sm">Total Siswa</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-600/30 rounded-2xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{classStats.completedPreTest}</div>
                    <div className="text-green-200/70 text-sm">Pre-Test Selesai</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-2xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{classStats.completedPostTest}</div>
                    <div className="text-purple-200/70 text-sm">Post-Test Selesai</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-orange-600/30 rounded-2xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {classStats.averageImprovement > 0 ? '+' : ''}{classStats.averageImprovement.toFixed(1)}%
                    </div>
                    <div className="text-yellow-200/70 text-sm">Rata-rata Peningkatan</div>
                  </div>
                </div>
              </div>

              {/* Average Scores */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Rata-rata Skor Pre-Test</h3>
                    <div className="text-center">
                      <div className="text-5xl font-black text-blue-400 mb-4">
                        {classStats.averagePreTestScore.toFixed(1)}%
                      </div>
                      <div className="text-blue-200/70">
                        Dari {classStats.completedPreTest} siswa yang mengerjakan
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <h3 className="text-2xl font-bold text-white mb-6">Rata-rata Skor Post-Test</h3>
                    <div className="text-center">
                      <div className="text-5xl font-black text-purple-400 mb-4">
                        {classStats.averagePostTestScore.toFixed(1)}%
                      </div>
                      <div className="text-purple-200/70">
                        Dari {classStats.completedPostTest} siswa yang mengerjakan
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performers and Struggling Students */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-amber-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <Award className="w-8 h-8 text-yellow-400 mr-3" />
                      <h3 className="text-2xl font-bold text-white">Siswa Berprestasi</h3>
                    </div>
                    <div className="space-y-3">
                      {classStats.topPerformers.slice(0, 5).map((studentData: any, index: number) => {
                        return (
                          <div key={studentData.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                                index === 0 ? 'bg-yellow-500 text-white' : 
                                index === 1 ? 'bg-gray-400 text-white' : 
                                index === 2 ? 'bg-orange-500 text-white' : 
                                'bg-blue-500 text-white'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-white font-medium">{studentData?.name || 'Unknown'}</div>
                                <div className="text-gray-300 text-xs">{studentData?.nis}</div>
                              </div>
                            </div>
                            <div className="text-yellow-300 font-bold">{studentData.postScore?.toFixed(1) || '0'}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-orange-600/30 rounded-3xl blur"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center mb-6">
                      <Target className="w-8 h-8 text-red-400 mr-3" />
                      <h3 className="text-2xl font-bold text-white">Perlu Bimbingan</h3>
                    </div>
                    <div className="space-y-3">
                      {classStats.strugglingStudents.slice(0, 5).map((studentData: any) => {
                        return (
                          <div key={studentData.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div>
                              <div className="text-white font-medium">{studentData?.name || 'Unknown'}</div>
                              <div className="text-gray-300 text-xs">{studentData?.nis}</div>
                            </div>
                            <div className="text-red-300 font-bold">{studentData.postScore?.toFixed(1) || '0'}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}