'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  FlaskConical, 
  ClipboardCheck, 
  Trophy, 
  LogOut, 
  Play,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  User,
  Calendar,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { Student } from '@/types/auth';
import { StudentRoute } from '@/components/ProtectedRoute';

const StudentDashboard = () => {
  const { user, logout, isStudent } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const student = user as Student;

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [isStudent, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate progress
  const progress = {
    materialsCompleted: student?.progress?.completedMaterials?.length || 0,
    totalMaterials: 8, // Estimated total materials
    preTestScore: student?.progress?.preTestScore,
    postTestScore: student?.progress?.postTestScore,
    practiceHours: student?.progress?.practiceHistory?.reduce((acc, session) => acc + session.timeSpent, 0) || 0,
  };

  const completionPercentage = Math.round((progress.materialsCompleted / progress.totalMaterials) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl border border-emerald-400/30">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard Siswa</h1>
                <p className="text-emerald-200/80 text-sm">Selamat datang, {student?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-emerald-200/80 text-sm">Kelas</p>
                <p className="text-white font-medium">{student?.class}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl text-red-300 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Selamat Datang di CIRVIA! 🚀
                </h2>
                <p className="text-blue-200/80 text-lg">
                  Mari belajar rangkaian listrik dengan cara yang interaktif dan menyenangkan
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full mb-2">
                  <Trophy className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-emerald-300 font-bold">Level Beginner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{progress.materialsCompleted}/{progress.totalMaterials}</span>
            </div>
            <p className="text-blue-200 font-medium">Materi Selesai</p>
            <div className="mt-2 bg-blue-900/30 rounded-full h-2">
              <div 
                className="bg-blue-400 rounded-full h-2 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/30">
            <div className="flex items-center justify-between mb-4">
              <ClipboardCheck className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold text-white">{progress.preTestScore || '-'}</span>
            </div>
            <p className="text-emerald-200 font-medium">Skor Pre-Test</p>
            <p className="text-emerald-300/70 text-sm mt-1">
              {progress.preTestScore ? 'Selesai' : 'Belum dikerjakan'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{progress.postTestScore || '-'}</span>
            </div>
            <p className="text-purple-200 font-medium">Skor Post-Test</p>
            <p className="text-purple-300/70 text-sm mt-1">
              {progress.postTestScore ? 'Selesai' : 'Belum dikerjakan'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{Math.round(progress.practiceHours / 60)}h</span>
            </div>
            <p className="text-yellow-200 font-medium">Waktu Belajar</p>
            <p className="text-yellow-300/70 text-sm mt-1">Total jam praktik</p>
          </div>
        </div>

        {/* Learning Path */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Learning Activities */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Jalur Pembelajaran</h3>
            
            {/* Pre-Test */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    progress.preTestScore ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-blue-500/20 border-blue-400/30'
                  } border`}>
                    {progress.preTestScore ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Target className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Pre-Test (Tes Diagnostik)</h4>
                    <p className="text-blue-200/80">Evaluasi pemahaman awal tentang rangkaian listrik</p>
                  </div>
                </div>
                <Link href="/pretest">
                  <button className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    progress.preTestScore 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30'
                  }`}>
                    {progress.preTestScore ? 'Lihat Hasil' : 'Mulai Tes'}
                  </button>
                </Link>
              </div>
              {progress.preTestScore && (
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/30">
                  <p className="text-emerald-300 font-medium">Skor: {progress.preTestScore}%</p>
                  <p className="text-emerald-200/80 text-sm">Bagus! Anda sudah memiliki pemahaman dasar yang baik.</p>
                </div>
              )}
            </div>

            {/* Learning Materials */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center border border-blue-400/30">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Materi Pembelajaran</h4>
                    <p className="text-blue-200/80">Pelajari konsep-konsep dasar rangkaian listrik</p>
                  </div>
                </div>
                <Link href="/materials">
                  <button className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl text-blue-300 hover:text-white font-medium transition-all">
                    Belajar
                  </button>
                </Link>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-blue-300 font-medium">Progress: {completionPercentage}%</p>
                  <p className="text-blue-200/80 text-sm">{progress.materialsCompleted}/{progress.totalMaterials} selesai</p>
                </div>
                <div className="bg-blue-900/30 rounded-full h-2">
                  <div 
                    className="bg-blue-400 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Practicum */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center border border-purple-400/30">
                    <FlaskConical className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Praktikum Virtual</h4>
                    <p className="text-blue-200/80">Simulasi interaktif dengan computer vision</p>
                  </div>
                </div>
                <Link href="/practicum">
                  <button className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-xl text-purple-300 hover:text-white font-medium transition-all">
                    Praktik
                  </button>
                </Link>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-400/30">
                <p className="text-purple-300 font-medium">Hand Gesture Control</p>
                <p className="text-purple-200/80 text-sm">Bangun rangkaian menggunakan gerakan tangan</p>
              </div>
            </div>

            {/* Post-Test */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    progress.postTestScore ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-yellow-500/20 border-yellow-400/30'
                  } border`}>
                    {progress.postTestScore ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Post-Test (Tes Sumatif)</h4>
                    <p className="text-blue-200/80">Evaluasi akhir dengan circuit builder interaktif</p>
                  </div>
                </div>
                <Link href="/posttest">
                  <button 
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      progress.postTestScore 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                        : completionPercentage >= 70
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-400/30 cursor-not-allowed'
                    }`}
                    disabled={completionPercentage < 70 && !progress.postTestScore}
                  >
                    {progress.postTestScore ? 'Lihat Hasil' : completionPercentage >= 70 ? 'Mulai Tes' : 'Terkunci'}
                  </button>
                </Link>
              </div>
              {progress.postTestScore ? (
                <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-400/30">
                  <p className="text-emerald-300 font-medium">Skor: {progress.postTestScore}%</p>
                  <p className="text-emerald-200/80 text-sm">Selamat! Anda telah menyelesaikan semua pembelajaran.</p>
                </div>
              ) : completionPercentage < 70 ? (
                <div className="bg-gray-500/10 rounded-xl p-4 border border-gray-400/30">
                  <p className="text-gray-300 font-medium">Persyaratan: Selesaikan minimal 70% materi</p>
                  <p className="text-gray-200/80 text-sm">Progress saat ini: {completionPercentage}%</p>
                </div>
              ) : (
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-400/30">
                  <p className="text-yellow-300 font-medium">Siap untuk tes akhir!</p>
                  <p className="text-yellow-200/80 text-sm">Buktikan kemampuan Anda dengan circuit builder interaktif.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-bold text-white mb-4">Informasi Siswa</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-blue-200/70 text-sm">Nama Lengkap</p>
                  <p className="text-white font-medium">{student?.name}</p>
                </div>
                <div>
                  <p className="text-blue-200/70 text-sm">NIS</p>
                  <p className="text-white font-medium">{student?.nis}</p>
                </div>
                <div>
                  <p className="text-blue-200/70 text-sm">Kelas</p>
                  <p className="text-white font-medium">{student?.class}</p>
                </div>
                {student?.email && (
                  <div>
                    <p className="text-blue-200/70 text-sm">Email</p>
                    <p className="text-white font-medium">{student.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-bold text-white mb-4">Statistik Cepat</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200/80 text-sm">Total Sesi</span>
                  </div>
                  <span className="text-white font-medium">{student?.progress?.practiceHistory?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-blue-200/80 text-sm">Waktu Belajar</span>
                  </div>
                  <span className="text-white font-medium">{Math.round(progress.practiceHours / 60)}h {progress.practiceHours % 60}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-blue-200/80 text-sm">Progress</span>
                  </div>
                  <span className="text-white font-medium">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-bold text-white mb-4">Pencapaian</h4>
              <div className="space-y-3">
                {progress.preTestScore && (
                  <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-400/30">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-emerald-300 font-medium text-sm">First Steps</p>
                      <p className="text-emerald-200/80 text-xs">Selesai Pre-Test</p>
                    </div>
                  </div>
                )}
                {completionPercentage >= 50 && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-xl border border-blue-400/30">
                    <Star className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-300 font-medium text-sm">Half Way</p>
                      <p className="text-blue-200/80 text-xs">50% Materi Selesai</p>
                    </div>
                  </div>
                )}
                {progress.postTestScore && (
                  <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-xl border border-purple-400/30">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-purple-300 font-medium text-sm">Graduate</p>
                      <p className="text-purple-200/80 text-xs">Selesai Post-Test</p>
                    </div>
                  </div>
                )}
                {!progress.preTestScore && !completionPercentage && !progress.postTestScore && (
                  <p className="text-blue-200/70 text-sm text-center py-4">
                    Mulai belajar untuk mendapatkan pencapaian pertama! 🏆
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentDashboardPage() {
  return (
    <StudentRoute>
      <StudentDashboard />
    </StudentRoute>
  );
}