'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TeacherLogin from '@/components/auth/TeacherLogin';
import TeacherRegister from '@/components/auth/TeacherRegister';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen grid md:grid-cols-12">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center px-3 py-2 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-all text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Left Side - Video Illustration (Desktop) */}
      <aside className="hidden md:flex md:col-span-7 items-center justify-center bg-gradient-to-br from-[#0A2E4D] to-[#1A4D6E] relative overflow-hidden">
        {/* Video Background */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src="/assets/illustrations/videoLogin_register.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-pink-900/40"></div>
        
        {/* Text content over video */}
        <div className="relative z-10 max-w-2xl px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Selamat Datang, Guru! 👨‍🏫
          </h1>
          <p className="text-blue-100 text-lg drop-shadow">
            {mode === 'teacher-register' 
              ? 'Buat akun guru untuk mengelola kelas dan evaluasi' 
              : 'Masuk untuk mengelola pembelajaran dan siswa Anda'}
          </p>
        </div>
      </aside>

      {/* Mobile Video (Above Form) */}
      <div className="md:hidden relative h-64 bg-gradient-to-br from-[#0A2E4D] to-[#1A4D6E] overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src="/assets/illustrations/videoLogin_register.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-pink-900/40"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {mode === 'teacher-register' ? 'Daftar Guru 👨‍🏫' : 'Login Guru 👨‍🏫'}
            </h1>
            <p className="text-blue-100 text-sm drop-shadow">Kelola pembelajaran CIRVIA</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <main className="md:col-span-5 flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[480px]">
          {/* Form Card */}
          <div className="rounded-2xl bg-white shadow-xl p-6 border border-gray-200">
          
          {/* Mode Toggle */}
          <div className="flex bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-1 mb-6 border border-gray-200">
            <button
              onClick={() => setMode('teacher-login')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                mode === 'teacher-login'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('teacher-register')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                mode === 'teacher-register'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Daftar
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

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Anda seorang siswa?{' '}
              <Link href="/login/student" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Login Siswa
              </Link>
            </p>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}