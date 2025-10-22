'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TeacherLogin from '@/components/auth/TeacherLogin';
import TeacherRegister from '@/components/auth/TeacherRegister';
import Link from 'next/link';
import { ArrowLeft, Sparkles, GraduationCap, UserCheck } from 'lucide-react';

type AuthMode = 'teacher-login' | 'teacher-register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('teacher-login');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      // Redirect hanya teacher ke dashboard
      if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <p className="text-white text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:text-blue-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                CIRVIA
              </h1>
              <p className="text-blue-200/70 text-sm">Teacher Portal</p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          {/* Login Container */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-3xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Portal Guru</h2>
                <p className="text-blue-200/80">Akses sistem manajemen pembelajaran CIRVIA</p>
              </div>

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

          {/* Mode Indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200 text-sm font-medium">
                {mode === 'teacher-login' ? 'Login Guru' : 'Registrasi Guru'}
              </span>
            </div>
          </div>

          {/* Info untuk Siswa */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-400/30">
              <h4 className="text-emerald-300 font-medium mb-2">�‍🎓 Untuk Siswa</h4>
              <p className="text-emerald-200/80 text-sm leading-relaxed mb-3">
                Siswa dapat langsung mengakses materi pembelajaran dan praktikum tanpa login.
                Login hanya diperlukan saat mengerjakan Pre-Test dan Post-Test.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 rounded-lg text-emerald-300 hover:text-white text-sm transition-all"
              >
                🏠 Kembali ke Homepage
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-400/30">
              <h4 className="text-blue-300 font-medium mb-2">🎯 Portal Guru CIRVIA</h4>
              <p className="text-blue-200/80 text-sm leading-relaxed">
                Kelola siswa, monitor progress pembelajaran, dan import data siswa secara massal melalui Excel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}