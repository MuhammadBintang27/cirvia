'use client';
import { Ico } from "@/components/ui/Ico";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentLoginContent: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const testType = searchParams.get('testType') as 'pretest' | 'posttest' | 'learning-style' | null;
  const router = useRouter();
  const { login, user, isStudent } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    nis: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isStudent()) {
      router.push(redirectTo);
    }
  }, [user, isStudent, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login({
        name: formData.name,
        nis: formData.nis,
        userType: 'student'
      });

      if (response.success) {
        router.push(redirectTo);
      } else {
        setError(response.message || 'Login gagal. Periksa nama dan NIS Anda.');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const getTestInfo = () => {
    if (testType === 'pretest') {
      return { title: 'Pre-Test', icon: 'file', color: 'bg-brand' };
    } else if (testType === 'posttest') {
      return { title: 'Post-Test', icon: 'check', color: 'bg-purple-500' };
    } else if (testType === 'learning-style') {
      return { title: 'Tes Gaya Belajar', icon: 'brain', color: 'bg-purple-500' };
    }
    return { title: 'Dashboard', icon: 'graduation', color: 'bg-mint' };
  };

  const testInfo = getTestInfo();

  return (
    <div className="bg-grid min-h-screen px-5 py-20">
      {/* Back Button */}
      <div className="absolute left-5 top-5">
        <Link href="/" className="btn btn-sm !shadow-key-sm">
          <ArrowLeft className="h-4 w-4" />
          Beranda
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[440px]">

        {/* Form Card */}
        <div className="card p-6 md:p-8">

          {/* Form Header */}
          <header className="mb-6 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-ink">
                Login Siswa
              </h1>
            </div>
            <p className="text-sm text-muted ml-13">
              {testType ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-soft border-2 border-ink rounded-lg">
                  <span><Ico n={testInfo.icon} /></span>
                  <span className="font-medium text-brand">{testInfo.title}</span>
                </span>
              ) : (
                'Masuk untuk melanjutkan pembelajaran'
              )}
            </p>
          </header>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="group">
              <label htmlFor="name" className="block text-sm font-semibold text-ink mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-brand transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  aria-invalid={error ? 'true' : 'false'}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ink/20 rounded-xl text-ink placeholder-muted focus:border-ink focus:outline-none focus:ring-4 focus:ring-brand/25 transition-all bg-paper"
                  required
                />
              </div>
            </div>

            {/* NIS Field */}
            <div className="group">
              <label htmlFor="nis" className="block text-sm font-semibold text-ink mb-2">
                NIS (Nomor Induk Siswa)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-brand transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="nis"
                  type="text"
                  name="nis"
                  value={formData.nis}
                  onChange={handleInputChange}
                  placeholder="Masukkan NIS Anda"
                  aria-invalid={error ? 'true' : 'false'}
                  className="w-full pl-10 pr-4 py-3 border-2 border-ink/20 rounded-xl text-ink placeholder-muted focus:border-ink focus:outline-none focus:ring-4 focus:ring-brand/25 transition-all bg-paper"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-coral-soft border-2 border-ink rounded-xl p-3 flex items-start animate-shake" role="alert">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.nis.trim()}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Button Shine Effect */}
              <span className="absolute inset-0 w-full h-full -translate-x-full transition-transform duration-700"></span>
              
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {testType ? `Mulai ${testInfo.title}` : 'Masuk'}
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-ink/20 text-center">
            <p className="text-sm text-muted">
              Belum punya akun?{' '}
              <Link 
                href="/login" 
                className="text-ink font-bold transition-all inline-flex items-center gap-1 group"
              >
                Login Guru
                <svg className="w-4 h-4 text-brand transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentLoginPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex items-center text-ink">
          <Sparkles className="w-6 h-6 animate-spin mr-3" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <StudentLoginContent />
    </Suspense>
  );
};

export default StudentLoginPage;