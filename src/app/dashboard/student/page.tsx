'use client';
import { Ico } from "@/components/ui/Ico";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { SupabaseTestService, StudentProgressComplete } from '@/lib/supabase-test-service';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Clock,
  User,
  GraduationCap,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Star,
  Brain,
  Eye,
  Ear,
  Hand,
  ArrowUp,
  ArrowDown,
  LogOut,
  School,
  FileText
} from 'lucide-react';
import { Student } from '@/types/auth';
import Navbar from '@/components/Navbar';
import AIAssessmentButton from '@/components/fiturAi/AIAssessmentButton';

export default function StudentDashboard() {
  const { user, logout, isStudent } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  
  const [studentProgress, setStudentProgress] = useState<StudentProgressComplete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (user && isStudent()) {
        try {
          const progress = await SupabaseTestService.getStudentProgress(user.id);
          setStudentProgress(progress);
        } catch (error) {
          console.error('Error loading student progress:', error);
        }
      }
      setLoading(false);
    };

    loadStudentData();
  }, [user, isStudent]);

  if (!user || !isStudent()) {
    router.push('/login');
    return null;
  }

  const student = user as Student;

  const handleLogout = () => {
    logout(); // This will trigger loading state in AuthContext
  };

  if (loading) {
    return <LoadingOverlay isVisible={true} text="Memuat dashboard siswa..." />;
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-soft rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-soft rounded-full hidden animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header dengan Info Siswa */}
          <div className="relative mb-12">
            <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
            <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center mb-6 md:mb-0">
                  <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mr-6">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-ink mb-2">
                      Selamat datang, {student.name}! 
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-muted">
                        <School className="w-4 h-4 mr-2" />
                        <span>NIS: {student.nis}</span>
                      </div>
                      <div className="flex items-center text-muted">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>Kelas: {student.class}</span>
                      </div>
                      <div className="flex items-center text-muted">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Bergabung: {new Date(student.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-3 bg-coral-soft border-2 border-ink text-red-600 rounded-xl font-medium hover:bg-coral-soft transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {/* Welcome Message for New Students */}
            {!studentProgress?.preTestResult && !studentProgress?.postTestResult && (
              <div className="relative mb-12">
                <div className="absolute -inset-1 bg-mint-soft rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink text-center">
                  <div className="w-20 h-20 bg-mint-soft rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-emerald-700" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-ink mb-4">
                    Mari Mulai Perjalanan Belajar Anda! 
                  </h2>
                  
                  <p className="text-emerald-700 text-lg mb-8 max-w-2xl mx-auto">
                    Anda belum memulai pembelajaran. Mari mulai dengan mengerjakan 
                    pre-test untuk mengukur pemahaman awal tentang rangkaian listrik.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-paper rounded-xl p-4 border border-ink/20">
                      <div className="text-2xl mb-2"><Ico n="file" /></div>
                      <h4 className="text-ink font-bold mb-1">1. Pre-Test</h4>
                      <p className="text-emerald-700 text-sm">Tes diagnostik awal untuk mengukur pemahaman</p>
                    </div>
                    <div className="bg-paper rounded-xl p-4 border border-ink/20">
                      <div className="text-2xl mb-2"><Ico n="book" /></div>
                      <h4 className="text-ink font-bold mb-1">2. Pembelajaran</h4>
                      <p className="text-emerald-700 text-sm">Materi dan praktikum interaktif</p>
                    </div>
                    <div className="bg-paper rounded-xl p-4 border border-ink/20">
                      <div className="text-2xl mb-2"><Ico n="trophy" /></div>
                      <h4 className="text-ink font-bold mb-1">3. Post-Test</h4>
                      <p className="text-emerald-700 text-sm">Evaluasi akhir untuk mengukur kemajuan</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/pretest" 
                      className="inline-flex items-center px-8 py-4 bg-mint border-2 border-ink text-ink text-lg font-bold rounded-xl hover:bg-mint transition-all transform"
                    >
                      <Target className="w-5 h-5 mr-3" />
                      Mulai Pre-Test Sekarang
                    </Link>
                    
                    <Link 
                      href="/learning-style" 
                      className="inline-flex items-center px-6 py-3 bg-purple-500 border-2 border-ink text-white font-bold rounded-xl hover:bg-purple-500 transition-all transform"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Tes Gaya Belajar
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pre-Test Results */}
              <div className="relative">
                <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-brand-soft rounded-full flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ink">Pre-Test</h3>
                      <p className="text-muted">Tes Diagnostik Awal</p>
                    </div>
                  </div>

                  {studentProgress?.preTestResult ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-black text-brand mb-2">
                          {studentProgress.preTestResult.percentage}%
                        </div>
                        <div className="text-lg text-ink mb-2">
                          Grade: {studentProgress.preTestResult.grade}
                        </div>
                        <div className="text-sm text-muted">
                          {studentProgress.preTestResult.correct_answers}/{studentProgress.preTestResult.total_questions} benar
                        </div>
                      </div>
                      
                      <div className="bg-paper rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Waktu:</span>
                          <span className="text-ink">{Math.floor(studentProgress.preTestResult.time_spent / 60)}:{(studentProgress.preTestResult.time_spent % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Tanggal:</span>
                          <span className="text-ink">{new Date(studentProgress.preTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-muted mb-4">Belum mengerjakan</div>
                      <Link 
                        href="/pretest" 
                        className="inline-flex items-center px-6 py-3 bg-brand border-2 border-ink text-white rounded-xl font-bold hover:bg-brand transition-all"
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
                <div className="absolute -inset-1 bg-purple-100 rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Trophy className="w-6 h-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ink">Post-Test</h3>
                      <p className="text-muted">Tes Evaluasi Akhir</p>
                    </div>
                  </div>

                  {studentProgress?.postTestResult ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-black text-purple-700 mb-2">
                          {studentProgress.postTestResult.percentage}%
                        </div>
                        <div className="text-lg text-ink mb-2">
                          Grade: {studentProgress.postTestResult.grade}
                        </div>
                        <div className="text-sm text-muted">
                          {studentProgress.postTestResult.correct_answers}/{studentProgress.postTestResult.total_questions} benar
                        </div>
                      </div>
                      
                      <div className="bg-paper rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Waktu:</span>
                          <span className="text-ink">{Math.floor(studentProgress.postTestResult.time_spent / 60)}:{(studentProgress.postTestResult.time_spent % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Tanggal:</span>
                          <span className="text-ink">{new Date(studentProgress.postTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-muted mb-4">
                        {studentProgress?.preTestResult ? 'Belum mengerjakan' : 'Selesaikan Pre-Test terlebih dahulu'}
                      </div>
                      <Link 
                        href="/posttest" 
                        className={`inline-flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                          studentProgress?.preTestResult 
                            ? 'bg-purple-500 text-white hover:bg-purple-500' 
                            : 'bg-ink/20 text-muted cursor-not-allowed'
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

            {/* Learning Style Result */}
            {studentProgress?.learningStyleResult && (
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-purple-100 rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Brain className="w-6 h-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink">Gaya Belajar Anda</h3>
                      <p className="text-muted">Hasil analisis kepribadian dan preferensi belajar</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Primary Learning Style */}
                    <div className="bg-purple-100 rounded-xl p-6 border-2 border-ink">
                      <div className="flex items-center mb-4">
                        {studentProgress.learningStyleResult.primaryStyle === 'visual' && <Eye className="w-8 h-8 text-brand mr-3" />}
                        {studentProgress.learningStyleResult.primaryStyle === 'auditory' && <Ear className="w-8 h-8 text-purple-700 mr-3" />}
                        {studentProgress.learningStyleResult.primaryStyle === 'kinesthetic' && <Hand className="w-8 h-8 text-emerald-700 mr-3" />}
                        <div>
                          <h4 className="text-xl font-bold text-ink capitalize">
                            {studentProgress.learningStyleResult.primaryStyle} Learner
                          </h4>
                          <p className="text-muted text-sm">Gaya belajar dominan Anda</p>
                        </div>
                      </div>
                      
                      {/* Percentages */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-brand mr-2" />
                            <span className="text-muted text-sm">Visual</span>
                          </div>
                          <span className="text-ink font-bold">
                            {studentProgress.learningStyleResult.percentages.visual}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Ear className="w-4 h-4 text-purple-700 mr-2" />
                            <span className="text-muted text-sm">Auditory</span>
                          </div>
                          <span className="text-ink font-bold">
                            {studentProgress.learningStyleResult.percentages.auditory}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Hand className="w-4 h-4 text-emerald-700 mr-2" />
                            <span className="text-emerald-700 text-sm">Kinesthetic</span>
                          </div>
                          <span className="text-ink font-bold">
                            {studentProgress.learningStyleResult.percentages.kinesthetic}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Test Info */}
                    <div className="space-y-4">
                      <div className="bg-paper rounded-xl p-4 border border-ink/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted text-sm">Tanggal Tes:</span>
                          <span className="text-ink text-sm">
                            {new Date(studentProgress.learningStyleResult.createdAt || '').toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted text-sm">Waktu Pengerjaan:</span>
                          <span className="text-ink text-sm">
                            {Math.floor((studentProgress.learningStyleResult.timeSpent || 0) / 60)}:
                            {((studentProgress.learningStyleResult.timeSpent || 0) % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Link
                          href="/learning-style"
                          className="inline-flex items-center px-4 py-2 bg-purple-500 border-2 border-ink text-white text-sm font-medium rounded-xl hover:bg-purple-500 transition-all"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Ulangi Tes Gaya Belajar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Analysis */}
            {studentProgress?.improvement && (
              <div className="relative">
                <div className="absolute -inset-1 bg-mint-soft rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-mint-soft rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink">Analisis Kemajuan</h3>
                      <p className="text-emerald-700">Perbandingan Pre-Test vs Post-Test</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-3xl font-black mb-2 ${
                        studentProgress.improvement.scoreIncrease >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {studentProgress.improvement.scoreIncrease >= 0 ? '+' : ''}{studentProgress.improvement.scoreIncrease.toFixed(1)}%
                      </div>
                      <div className="text-ink font-medium mb-1">Peningkatan Skor</div>
                      <div className="flex items-center justify-center">
                        {studentProgress.improvement.scoreIncrease >= 0 ? (
                          <ArrowUp className="w-4 h-4 text-emerald-700 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className="text-emerald-700 text-sm">
                          {studentProgress.improvement.scoreIncrease >= 0 ? 'Meningkat' : 'Menurun'}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-black text-brand mb-2">
                        {Math.abs(studentProgress.improvement.percentageIncrease).toFixed(1)}%
                      </div>
                      <div className="text-ink font-medium mb-1">Persentase Kemajuan</div>
                      <div className="text-muted text-sm">
                        Relatif terhadap skor awal
                      </div>
                    </div>

                    <div className="text-center">
                      <div className={`text-3xl font-black mb-2 ${
                        studentProgress.improvement.timeImprovement >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {studentProgress.improvement.timeImprovement >= 0 ? '-' : '+'}{Math.abs(studentProgress.improvement.timeImprovement)}s
                      </div>
                      <div className="text-ink font-medium mb-1">Efisiensi Waktu</div>
                      <div className="text-muted text-sm">
                        {studentProgress.improvement.timeImprovement >= 0 ? 'Lebih cepat' : 'Lebih lama'}
                      </div>
                    </div>
                  </div>

                  {/* Achievement Badges */}
                  <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {studentProgress.improvement.scoreIncrease >= 20 && (
                      <div className="flex items-center px-4 py-2 bg-lamp-soft rounded-full border-2 border-ink">
                        <Star className="w-4 h-4 text-amber-700 mr-2" />
                        <span className="text-amber-700 text-sm font-medium">Peningkatan Luar Biasa</span>
                      </div>
                    )}
                    {studentProgress.improvement.scoreIncrease >= 10 && studentProgress.improvement.scoreIncrease < 20 && (
                      <div className="flex items-center px-4 py-2 bg-brand-soft rounded-full border-2 border-ink">
                        <TrendingUp className="w-4 h-4 text-brand mr-2" />
                        <span className="text-brand text-sm font-medium">Kemajuan Baik</span>
                      </div>
                    )}
                    {studentProgress.postTestResult?.grade === 'A' && (
                      <div className="flex items-center px-4 py-2 bg-purple-100 rounded-full border-2 border-ink">
                        <Award className="w-4 h-4 text-purple-700 mr-2" />
                        <span className="text-purple-700 text-sm font-medium">Prestasi Unggul</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Assessment Section */}
            {(studentProgress?.learningStyleResult || studentProgress?.preTestResult || studentProgress?.postTestResult) && (
              <div className="relative mb-8">
                <div className="absolute -inset-1 bg-purple-100 rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                      <Brain className="w-10 h-10 text-ink" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-lamp rounded-full animate-pulse"></div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-ink mb-4">
                      AI Personal Assessment
                    </h3>
                    
                    <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
                      Dapatkan analisis mendalam dan rekomendasi pembelajaran yang dipersonalisasi berdasarkan 
                      hasil tes gaya belajar, pre-test, dan post-test Anda menggunakan AI.
                    </p>

                    {/* Assessment Status */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <div className={`p-4 rounded-xl border ${
                        studentProgress?.learningStyleResult 
                          ? 'bg-mint-soft border-ink' 
                          : 'bg-ink/20 border-ink'
                      }`}>
                        <Brain className={`w-6 h-6 mx-auto mb-2 ${
                          studentProgress?.learningStyleResult ? 'text-emerald-700' : 'text-muted'
                        }`} />
                        <div className="text-sm font-medium text-ink">Gaya Belajar</div>
                        <div className={`text-xs ${
                          studentProgress?.learningStyleResult ? 'text-emerald-700' : 'text-muted'
                        }`}>
                          {studentProgress?.learningStyleResult ? '✓ Complete' : '○ Pending'}
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        studentProgress?.preTestResult 
                          ? 'bg-mint-soft border-ink' 
                          : 'bg-ink/20 border-ink'
                      }`}>
                        <Target className={`w-6 h-6 mx-auto mb-2 ${
                          studentProgress?.preTestResult ? 'text-emerald-700' : 'text-muted'
                        }`} />
                        <div className="text-sm font-medium text-ink">Pre-Test</div>
                        <div className={`text-xs ${
                          studentProgress?.preTestResult ? 'text-emerald-700' : 'text-muted'
                        }`}>
                          {studentProgress?.preTestResult ? '✓ Complete' : '○ Pending'}
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        studentProgress?.postTestResult 
                          ? 'bg-mint-soft border-ink' 
                          : 'bg-ink/20 border-ink'
                      }`}>
                        <Trophy className={`w-6 h-6 mx-auto mb-2 ${
                          studentProgress?.postTestResult ? 'text-emerald-700' : 'text-muted'
                        }`} />
                        <div className="text-sm font-medium text-ink">Post-Test</div>
                        <div className={`text-xs ${
                          studentProgress?.postTestResult ? 'text-emerald-700' : 'text-muted'
                        }`}>
                          {studentProgress?.postTestResult ? '✓ Complete' : '○ Pending'}
                        </div>
                      </div>
                    </div>

                    {/* AI Assessment Button */}
                    <AIAssessmentButton
                      variant="primary"
                      size="lg"
                      className="shadow-hard"
                    />

                    <p className="text-muted text-sm mt-4">
                      Analisis comprehensive menggunakan AI untuk memberikan insight mendalam tentang pembelajaran Anda
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-6">
              <Link href="/materials" className="group relative">
                <div className="absolute -inset-1 bg-brand-soft rounded-2xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink hover:border-ink transition-all duration-500 transform">
                  <div className="flex items-center mb-4">
                    <BookOpen className="w-8 h-8 text-brand mr-3" />
                    <h3 className="text-xl font-bold text-ink">Materi Pembelajaran</h3>
                  </div>
                  <p className="text-muted mb-4">Pelajari konsep rangkaian listrik dengan materi interaktif</p>
                  <div className="flex items-center text-brand font-medium">
                    <span>Mulai Belajar</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/practicum" className="group relative">
                <div className="absolute -inset-1 bg-mint-soft rounded-2xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink hover:border-ink transition-all duration-500 transform">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-700 mr-3" />
                    <h3 className="text-xl font-bold text-ink">Praktikum Virtual</h3>
                  </div>
                  <p className="text-emerald-700 mb-4">Simulasi rangkaian listrik dengan hand gesture detection</p>
                  <div className="flex items-center text-emerald-700 font-medium">
                    <span>Mulai Praktikum</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/student/lkpd-result" className="group relative">
                <div className="absolute -inset-1 bg-lamp-soft rounded-2xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink hover:border-ink transition-all duration-500 transform">
                  <div className="flex items-center mb-4">
                    <FileText className="w-8 h-8 text-amber-700 mr-3" />
                    <h3 className="text-xl font-bold text-ink">Hasil E-LKPD</h3>
                  </div>
                  <p className="text-amber-700 mb-4">Lihat hasil lembar kerja praktikum digital Anda</p>
                  <div className="flex items-center text-amber-700 font-medium">
                    <span>Lihat Hasil</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>

              <Link href="/test" className="group relative">
                <div className="absolute -inset-1 bg-purple-100 rounded-2xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-paper rounded-2xl p-6 border-2 border-ink hover:border-ink transition-all duration-500 transform">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-8 h-8 text-purple-700 mr-3" />
                    <h3 className="text-xl font-bold text-ink">Test & Evaluasi</h3>
                  </div>
                  <p className="text-muted mb-4">Pre-test, post-test, dan tes gaya belajar</p>
                  <div className="flex items-center text-purple-700 font-medium">
                    <span>Mulai Test</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}