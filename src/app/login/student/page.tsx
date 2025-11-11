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
      <main className="md:col-span-5 flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Circuit Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-blue-400" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            </svg>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60" style={{ animationDelay: '3s' }}></div>
          
          {/* Gradient Orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          {/* Form Card with Glassmorphism */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl p-8 border border-white/20 relative">
            {/* Decorative Corner Elements */}
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-2xl"></div>
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-br-2xl"></div>
          
          {/* Form Header */}
          <header className="mb-6 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Login Siswa
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-13">
              {testType ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <span>{testInfo.icon}</span>
                  <span className="font-medium text-blue-900">{testInfo.title}</span>
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
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all bg-white/50 backdrop-blur-sm hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* NIS Field */}
            <div className="group">
              <label htmlFor="nis" className="block text-sm font-semibold text-gray-700 mb-2">
                NIS (Nomor Induk Siswa)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all bg-white/50 backdrop-blur-sm hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-3 flex items-start animate-shake" role="alert">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.nis.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-indigo-500/50 relative overflow-hidden group"
            >
              {/* Button Shine Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
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
          <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link 
                href="/login" 
                className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-bold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center gap-1 group"
              >
                Login Guru
                <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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