'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, AlertCircle, ArrowLeft, Star, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/"
          className="inline-flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:text-blue-300 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Homepage
        </Link>
      </div>

      {/* Main Content - Clean Split Layout */}
      <div className="min-h-screen flex relative z-10">
        {/* Left Side - Illustration */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Selamat Datang, Siswa! 🎓
              </h1>
              <p className="text-blue-200/80 text-lg">
                Platform Pembelajaran Rangkaian Listrik
              </p>
            </div>
            
            {/* Illustration */}
            <div className="relative w-96 h-96 mx-auto mb-8">
              <Image
                src="/fotosiswa.png"
                alt="Student Illustration"
                fill
                className="object-contain"
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></span>
                <span>Akses materi pembelajaran interaktif</span>
              </div>
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></span>
                <span>Praktikum dengan hand gesture detection</span>
              </div>
              <div className="flex items-center justify-start text-blue-200/90">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-4"></span>
                <span>Track progress belajar secara real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white/5 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Login Siswa</h2>
                <p className="text-blue-200/80">
                  {testType ? `${testInfo.icon} ${testInfo.title}` : 'Akses Dashboard CIRVIA'}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-blue-200 font-medium mb-2 text-sm">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* NIS Field */}
                <div>
                  <label className="block text-blue-200 font-medium mb-2 text-sm">
                    NIS (Nomor Induk Siswa)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="text"
                      name="nis"
                      value={formData.nis}
                      onChange={handleInputChange}
                      placeholder="Masukkan NIS Anda"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3 flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.name.trim() || !formData.nis.trim()}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    testType 
                      ? `bg-gradient-to-r ${testInfo.color} text-white`
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    <>
                      {testType ? `🚀 Mulai ${testInfo.title}` : '🎓 Login ke Dashboard'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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