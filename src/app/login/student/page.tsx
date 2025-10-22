'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Lock, AlertCircle, CheckCircle, ArrowLeft, Lightbulb, Star, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudentLoginPage: React.FC = () => {
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

  // Redirect jika sudah login sebagai student
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
        // Redirect to intended page after login
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getTestInfo = () => {
    if (testType === 'pretest') {
      return {
        title: 'Pre-Test',
        description: 'Tes Diagnostik Awal',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-500/10 to-cyan-500/10',
        borderColor: 'border-blue-400/30',
        icon: '📝'
      };
    } else if (testType === 'posttest') {
      return {
        title: 'Post-Test', 
        description: 'Tes Evaluasi Akhir',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-500/10 to-pink-500/10',
        borderColor: 'border-purple-400/30',
        icon: '✅'
      };
    } else if (testType === 'learning-style') {
      return {
        title: 'Tes Gaya Belajar',
        description: 'Temukan Gaya Belajar Anda',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-500/10 to-indigo-500/10',
        borderColor: 'border-purple-400/30',
        icon: '🧠'
      };
    }
    return {
      title: 'Dashboard',
      description: 'Akses Learning Platform',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-400/30',
      icon: '🎓'
    };
  };

  const testInfo = getTestInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Homepage
            </Link>
          </div>

          {/* Main Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
              
              {/* Header */}
              <div className="p-8 text-center border-b border-white/10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-400/30">
                  <span className="text-4xl">{testInfo.icon}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Login Siswa</h1>
                <p className="text-blue-200/80">
                  {testType ? `Akses ${testInfo.title} - ${testInfo.description}` : 'Akses Dashboard CIRVIA'}
                </p>
              </div>

              {/* Test Info Banner */}
              {testType && (
                <div className={`bg-gradient-to-r ${testInfo.bgColor} border-b ${testInfo.borderColor} p-4`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-gradient-to-r ${testInfo.color} rounded-full flex items-center justify-center mr-3`}>
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{testInfo.title}</h3>
                      <p className="text-blue-200/70 text-sm">{testInfo.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Why Login Section */}
              <div className="p-6 border-b border-white/10">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-400/30">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="text-emerald-300 font-medium">Kenapa perlu login?</span>
                  </div>
                  <ul className="text-emerald-200/80 text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Menyimpan hasil tes dan progress belajar Anda
                    </li>
                    <li className="flex items-start">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Melacak peningkatan pemahaman materi
                    </li>
                    <li className="flex items-start">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Membandingkan skor pre-test dan post-test
                    </li>
                    <li className="flex items-start">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      Mendapatkan rekomendasi pembelajaran personal
                    </li>
                  </ul>
                </div>
              </div>

              {/* Login Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-blue-200 font-medium mb-3 text-sm">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap sesuai data siswa"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* NIS Field */}
                  <div>
                    <label className="block text-blue-200 font-medium mb-3 text-sm">
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
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                        required
                      />
                    </div>
                    <p className="text-blue-300/60 text-xs mt-2 flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      NIS digunakan sebagai password untuk keamanan
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 text-sm font-medium">Login Gagal</p>
                        <p className="text-red-200/80 text-xs mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Demo Credentials */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-400/30">
                    <div className="flex items-start">
                      <Star className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-300 text-sm font-medium mb-2">Demo Account untuk Testing:</p>
                        <div className="text-amber-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between bg-amber-500/10 p-2 rounded border border-amber-400/20">
                            <span>Nama: Ahmad Budi</span>
                            <span className="font-mono">NIS: 220001</span>
                          </div>
                          <div className="flex items-center justify-between bg-amber-500/10 p-2 rounded border border-amber-400/20">
                            <span>Nama: Siti Nurhaliza</span>
                            <span className="font-mono">NIS: 220002</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !formData.name.trim() || !formData.nis.trim()}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      testType 
                        ? `bg-gradient-to-r ${testInfo.color} text-white hover:shadow-lg hover:shadow-blue-500/25`
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Memproses...
                      </div>
                    ) : (
                      <>
                        {testType ? `🚀 Login & Mulai ${testInfo.title}` : '🎓 Login ke Dashboard'}
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-blue-300/60 text-sm mb-2">
                    Belum punya akun?
                  </p>
                  <p className="text-blue-200/80 text-xs">
                    Hubungi guru kelas untuk mendaftarkan Anda ke sistem CIRVIA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-blue-300/60 text-sm">
              Secure login powered by CIRVIA Educational Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;