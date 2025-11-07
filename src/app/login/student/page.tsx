'use client';

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
      return { title: 'Pre-Test', icon: '📝', color: 'from-blue-500 to-cyan-500' };
    } else if (testType === 'posttest') {
      return { title: 'Post-Test', icon: '✅', color: 'from-purple-500 to-pink-500' };
    } else if (testType === 'learning-style') {
      return { title: 'Tes Gaya Belajar', icon: '🧠', color: 'from-purple-500 to-indigo-500' };
    }
    return { title: 'Dashboard', icon: '🎓', color: 'from-emerald-500 to-teal-500' };
  };

  const testInfo = getTestInfo();

  return (
    <div className="min-h-screen grid md:grid-cols-12">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/"
          className="inline-flex items-center px-3 py-2 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:text-blue-600 transition-all text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Homepage
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40"></div>
        
        {/* Text content over video */}
        <div className="relative z-10 max-w-2xl px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Selamat Datang, Siswa! 🎓
          </h1>
          <p className="text-blue-100 text-lg drop-shadow">
            Masuk untuk melanjutkan pembelajaran rangkaian listrik di CIRVIA
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Login Siswa 🎓</h1>
            <p className="text-blue-100 text-sm drop-shadow">Akses pembelajaran CIRVIA</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <main className="md:col-span-5 flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[420px]">
          {/* Form Card */}
          <div className="rounded-2xl bg-white shadow-xl p-8 border border-gray-200">
          
          {/* Form Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Login Siswa</h1>
            <p className="text-sm text-gray-600 mt-1">
              {testType ? `${testInfo.icon} ${testInfo.title}` : 'Masuk untuk melanjutkan'}
            </p>
          </header>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  aria-invalid={error ? 'true' : 'false'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* NIS Field */}
            <div>
              <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-2">
                NIS (Nomor Induk Siswa)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="nis"
                  type="text"
                  name="nis"
                  value={formData.nis}
                  onChange={handleInputChange}
                  placeholder="Masukkan NIS Anda"
                  aria-invalid={error ? 'true' : 'false'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start" role="alert">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.nis.trim()}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Memproses...
                </span>
              ) : (
                <span>{testType ? `Mulai ${testInfo.title}` : 'Masuk'}</span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Login Guru
              </Link>
            </p>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StudentLoginPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center text-white">
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