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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex items-center text-ink">
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
    <div className="bg-grid min-h-screen px-5 py-20">
      {/* Back Button */}
      <div className="absolute left-5 top-5">
        <Link href="/" className="btn btn-sm !shadow-key-sm">
          <ArrowLeft className="h-4 w-4" />
          Beranda
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[460px]">

        {/* Form Card */}
        <div className="card p-6 md:p-8">

          {/* Mode Toggle */}
          <div className="mb-6 flex gap-1 rounded-xl border-2 border-ink bg-cream p-1">
            <button
              onClick={() => setMode('teacher-login')}
              className={`flex-1 rounded-lg py-2.5 px-3 text-sm font-bold transition-all ${
                mode === 'teacher-login' ? 'bg-brand text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('teacher-register')}
              className={`flex-1 rounded-lg py-2.5 px-3 text-sm font-bold transition-all ${
                mode === 'teacher-register' ? 'bg-brand text-white' : 'text-muted hover:text-ink'
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
          <div className="mt-6 border-t-2 border-ink/10 pt-5 text-center">
            <p className="text-sm text-muted">
              Anda seorang siswa?{' '}
              <Link href="/login/student" className="font-bold text-brand underline-offset-2 hover:underline">
                Login Siswa
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}