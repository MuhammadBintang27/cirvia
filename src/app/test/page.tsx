
'use client'

import React from 'react';
import { ChevronRight, Trophy, Target, Brain, Zap, Sparkles, Star, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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

  {/* Glassmorphism Navbar as Component */}
  <Navbar />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30 backdrop-blur-sm mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">Premium Assessment Suite</span>
              <Sparkles className="w-4 h-4 text-yellow-400 ml-2" />
            </div>

            {/* Main Icon */}
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <span className="text-6xl relative z-10">📝</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Test &
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Evaluasi
              </span>
            </h1>
            
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Uji kemampuan Anda dengan sistem evaluasi berstandar internasional yang dirancang khusus untuk mengasah pemahaman rangkaian listrik
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-blue-300 text-sm">Soal Berkualitas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-blue-300 text-sm">Tingkat Akurasi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-300 text-sm">Akses Unlimited</div>
              </div>
            </div>
          </div>

          {/* Premium Test Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Pre-test */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-indigo-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                <div className="absolute top-6 right-6">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-10 h-10 text-blue-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Tes Diagnostik</h3>
                <p className="text-blue-200/80 mb-8 text-lg leading-relaxed">
                  Evaluasi komprehensif untuk mengukur baseline knowledge Anda dengan teknologi adaptive testing
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span>25 Pertanyaan Teradaptasi</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span>Durasi Fleksibel 30-45 Menit</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span>Analisis Detail Realtime</span>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center group"
                  onClick={() => window.location.href = '/pretest'}
                >
                  Mulai Tes Diagnostik
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Post-test */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-teal-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                <div className="absolute top-6 right-6">
                  <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-400/30">
                    <span className="text-emerald-400 text-sm font-medium">Advanced</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-emerald-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Tes Sumatif</h3>
                <p className="text-blue-200/80 mb-8 text-lg leading-relaxed">
                  Validasi pencapaian learning outcomes dengan standar internasional dan sertifikasi digital
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-emerald-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Comprehensive Evaluation</span>
                  </div>
                  <div className="flex items-center text-emerald-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Performance Analytics</span>
                  </div>
                  <div className="flex items-center text-emerald-300">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span>Digital Certificate</span>
                  </div>
                </div>
                
                <button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center group"
                  onClick={() => window.location.href = '/posttest'}
                >
                  Mulai Tes Sumatif
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Features Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Quiz */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-purple-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Interactive Quiz</h3>
                <p className="text-blue-200/80 mb-8 text-lg">
                  Gamified learning dengan sistem poin, leaderboard, dan achievements untuk motivasi maksimal
                </p>
                
                <button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center group"
                  onClick={() => window.location.href = '/quiz'}
                >
                  Launch Quiz Platform
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Practice Exercises */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 to-red-600/50 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 hover:border-white/30 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-orange-400" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">Practice Lab</h3>
                <p className="text-blue-200/80 mb-8 text-lg">
                  Laboratorium virtual dengan simulasi circuit yang realistis dan feedback instan
                </p>
                
                <button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center group"
                  onClick={() => window.location.href = '/practicum'}
                >
                  Enter Practice Lab
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Features Banner */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full mb-8 mx-auto">
                <Sparkles className="w-12 h-12 text-cyan-400" />
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-4">Coming Soon: AI-Powered Features</h3>
              <p className="text-blue-200/90 text-xl max-w-3xl mx-auto mb-8">
                Bersiaplah untuk pengalaman pembelajaran yang revolusioner dengan teknologi AI terdepan, 
                personalized learning paths, dan virtual tutor yang akan mengubah cara Anda memahami rangkaian listrik
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-cyan-300">AI Tutor</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-blue-300">Smart Analytics</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-indigo-300">Adaptive Learning</span>
                </div>
              </div>
              
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
                <span className="text-cyan-400 font-medium">Beta Launch: Q2 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;