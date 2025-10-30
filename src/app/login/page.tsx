'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TeacherLogin from '@/components/auth/TeacherLogin';
import TeacherRegister from '@/components/auth/TeacherRegister';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, GraduationCap } from 'lucide-react';

type AuthMode = 'teacher-login' | 'teacher-register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('teacher-login');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center text-white">
          <Sparkles className="w-6 h-6 animate-spin mr-3" />
          <span className="text-lg">Memuat...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:text-blue-300 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Main Content - Clean Split Layout */}
      <div className="min-h-screen flex relative z-10">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white/5 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              
              

              {/* Mode Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
                <button
                  onClick={() => setMode('teacher-login')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'teacher-login'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🔑 Login
                </button>
                <button
                  onClick={() => setMode('teacher-register')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    mode === 'teacher-register'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  ✨ Daftar
                </button>
              </div>

              {/* Forms */}
              {mode === 'teacher-login' && (
                <TeacherLogin
                  onSwitchToRegister={() => setMode('teacher-register')}
                />
              )}
              
              {mode === 'teacher-register' && (
                <TeacherRegister
                  onSwitchToLogin={() => setMode('teacher-login')}
                />
              )}

              
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Selamat Datang, Guru! 👨‍🏫
              </h1>
              <p className="text-blue-200/80 text-lg">
                Platform Manajemen Pembelajaran CIRVIA
              </p>
            </div>
            
            {/* Illustration */}
            <div className="relative w-96 h-96 mx-auto mb-8">
              <Image
                src="/fotoguru.png"
                alt="Teacher Illustration"
                fill
                className="object-contain"
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                <span>Kelola data siswa dan kelas</span>
              </div>
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                <span>Monitor progress pembelajaran</span>
              </div>
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                <span>Buat dan kelola soal test</span>
              </div>
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-4"></span>
                <span>Import data Excel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}