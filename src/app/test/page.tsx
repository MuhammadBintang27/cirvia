
'use client'
import { Ico } from "@/components/ui/Ico";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Target, Brain, Zap, Star, ArrowRight, CheckCircle, Clock, Award } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseTestService, TestResultWithAnswers, LearningStyleResult, AIFeedback } from '@/lib/supabase-test-service';
import { useToast } from '@/components/Toast';

const TestPage = () => {
  const { user, isStudent } = useAuth();
  const { addToast } = useToast();
  const [preTestResult, setPreTestResult] = useState<TestResultWithAnswers | null>(null);
  const [postTestResult, setPostTestResult] = useState<TestResultWithAnswers | null>(null);
  const [learningStyleResult, setLearningStyleResult] = useState<LearningStyleResult | null>(null);
  const [preTestFeedback, setPreTestFeedback] = useState<AIFeedback | null>(null);
  const [postTestFeedback, setPostTestFeedback] = useState<AIFeedback | null>(null);
  const [learningStyleFeedback, setLearningStyleFeedback] = useState<AIFeedback | null>(null);

  useEffect(() => {
    const loadTestResults = async () => {
      if (user && isStudent()) {
        const preResult = await SupabaseTestService.getLatestTestResult(user.id, 'pretest');
        const postResult = await SupabaseTestService.getLatestTestResult(user.id, 'posttest');
        const learningStyleResult = await SupabaseTestService.getLearningStyleResult(user.id);
        setPreTestResult(preResult);
        setPostTestResult(postResult);
        setLearningStyleResult(learningStyleResult);
        
        // Load AI feedback
        if (preResult) {
          const preFeedback = await SupabaseTestService.getAIFeedback(user.id, 'post_pretest', preResult.id);
          setPreTestFeedback(preFeedback);
        }
        if (postResult) {
          const postFeedback = await SupabaseTestService.getAIFeedback(user.id, 'post_posttest', postResult.id);
          setPostTestFeedback(postFeedback);
        }
        if (learningStyleResult) {
          const styleFeedback = await SupabaseTestService.getAIFeedback(user.id, 'post_learning_style', undefined, learningStyleResult.id);
          setLearningStyleFeedback(styleFeedback);
        }
      }
    }
    
    loadTestResults();
  }, [user, isStudent]);
  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-soft rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-soft rounded-full hidden animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-soft rounded-full hidden"
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

            {/* Main Icon */}
            <div className="relative mb-8">
              {/* Enhanced Logo with multiple layers */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-brand-soft border-2 border-ink shadow-hard relative">
                <div className="absolute inset-0 rounded-full bg-brand-soft hidden"></div>
                <div className="absolute inset-2 rounded-full bg-brand-soft hidden delay-500"></div>
                <div className="relative w-[80px] h-[80px] z-10">
                  <Image
                    src="/assets/illustrations/tesicon.png"
                    alt="Test Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="absolute -inset-4 bg-brand-soft rounded-full hidden animate-pulse"></div>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-black mb-6 leading-tight">
              <span className="text-ink">
                Test &
              </span>
              <br />
              <span className="text-ink">
                Evaluasi
              </span>
            </h1>
            
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed mb-8">
              Uji kemampuan Anda dengan sistem evaluasi berstandar internasional yang dirancang khusus untuk mengasah pemahaman rangkaian listrik
            </p>

          </div>

          {/* Premium Test Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Learning Style Test */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-purple-100 rounded-3xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-paper rounded-3xl p-10 border-2 border-ink hover:border-ink transition-all duration-500 transform h-full flex flex-col">
                <div className="absolute top-6 right-6">
                  {learningStyleResult ? (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-mint-soft rounded-full border-2 border-ink">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-700 text-sm font-medium">Selesai</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-purple-100 rounded-full border-2 border-ink">
                      <span className="text-purple-700 text-sm font-medium">Personality</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-2xl mb-6 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-purple-700" />
                </div>
                
                <h3 className="text-3xl font-bold text-ink mb-4">Tes Gaya Belajar</h3>
                <p className="text-muted mb-8 text-lg leading-relaxed">
                  Temukan gaya belajar terbaik Anda: Visual, Auditory, atau Kinesthetic untuk optimasi pembelajaran
                </p>

                {/* Show results if completed */}
                <div className="flex-grow">
                  {learningStyleResult ? (
                    <div className="space-y-4 mb-8">
                      {/* AI Feedback Title */}
                      {learningStyleFeedback && (
                        <div className="bg-lamp-soft rounded-xl p-4 border-2 border-ink mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-lamp-soft rounded-lg flex items-center justify-center">
                              <span className="text-lg"><Ico n="sparkles" /></span>
                            </div>
                            <div className="flex-1">
                              <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
                                Feedback CIRVIA AI
                              </p>
                              <p className="text-amber-700 text-sm font-medium leading-relaxed">
                                {learningStyleFeedback.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-purple-100 rounded-xl p-4 border-2 border-ink">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-700 font-medium">Gaya Belajar Anda:</span>
                          <span className="text-2xl font-bold text-ink capitalize">{learningStyleResult.primaryStyle}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted text-sm">Visual:</span>
                          <span className="text-ink">{learningStyleResult.percentages.visual}%</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted text-sm">Auditory:</span>
                          <span className="text-ink">{learningStyleResult.percentages.auditory}%</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted text-sm">Kinesthetic:</span>
                          <span className="text-ink">{learningStyleResult.percentages.kinesthetic}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted text-sm">Tanggal:</span>
                          <span className="text-ink text-sm">{learningStyleResult.createdAt ? new Date(learningStyleResult.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-purple-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span>20 Pertanyaan Psikologi</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span>Analisis Kepribadian Mendalam</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span>Rekomendasi Strategi Belajar</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all transform shadow-hard flex items-center justify-center group ${
                    learningStyleResult 
                      ? 'bg-purple-100 text-muted border-2 border-ink' 
                      : 'bg-purple-500 text-white hover:bg-purple-500'
                  }`}
                  onClick={() => window.location.href = '/learning-style'}
                >
                  {learningStyleResult ? 'Lihat Hasil / Ulangi' : 'Mulai Tes Gaya Belajar'}
                </button>
              </div>
            </div>

            {/* Pre-test */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-paper rounded-3xl p-10 border-2 border-ink hover:border-ink transition-all duration-500 transform h-full flex flex-col">
                <div className="absolute top-6 right-6">
                  {preTestResult ? (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-mint-soft rounded-full border-2 border-ink">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-700 text-sm font-medium">Selesai</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-amber-700 fill-current" />
                      <Star className="w-4 h-4 text-amber-700 fill-current" />
                      <Star className="w-4 h-4 text-amber-700 fill-current" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-brand-soft rounded-2xl mb-6 transition-transform duration-300">
                  <Trophy className="w-10 h-10 text-brand" />
                </div>
                
                <h3 className="text-3xl font-bold text-ink mb-4">Tes Diagnostik</h3>
                <p className="text-muted mb-8 text-lg leading-relaxed">
                  Evaluasi komprehensif untuk mengukur baseline knowledge Anda dengan teknologi adaptive testing
                </p>

                {/* Show results if completed */}
                <div className="flex-grow">
                  {preTestResult ? (
                    <div className="space-y-4 mb-8">
                      {/* AI Feedback Title */}
                      {preTestFeedback && (
                        <div className="bg-lamp-soft rounded-xl p-4 border-2 border-ink mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-lamp-soft rounded-lg flex items-center justify-center">
                              <span className="text-lg"><Ico n="sparkles" /></span>
                            </div>
                            <div className="flex-1">
                              <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
                                Feedback CIRVIA AI
                              </p>
                              <p className="text-amber-700 text-sm font-medium leading-relaxed">
                                {preTestFeedback.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-mint-soft rounded-xl p-4 border-2 border-ink">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-700 font-medium">Skor Anda:</span>
                          <span className="text-2xl font-bold text-ink">{preTestResult.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-700 text-sm">Benar:</span>
                          <span className="text-ink">{preTestResult.correct_answers}/{preTestResult.total_questions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-700 text-sm">Tanggal:</span>
                          <span className="text-ink text-sm">{new Date(preTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-brand">
                        <div className="w-2 h-2 bg-brand rounded-full mr-3"></div>
                        <span>5 Pertanyaan Pilihan Ganda</span>
                      </div>
                      <div className="flex items-center text-brand">
                        <div className="w-2 h-2 bg-brand rounded-full mr-3"></div>
                        <span>Durasi Fleksibel ~10 Menit</span>
                      </div>
                      <div className="flex items-center text-brand">
                        <div className="w-2 h-2 bg-brand rounded-full mr-3"></div>
                        <span>Analisis Detail Realtime</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {preTestResult ? (
                  // Pre-test sudah selesai - hanya tampilkan hasil, tidak bisa ulangi
                  <button 
                    className="w-full py-4 px-8 rounded-2xl font-bold text-lg bg-brand-soft text-muted border-2 border-ink cursor-default flex items-center justify-center group"
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Pre-Test Sudah Selesai',
                        message: 'Pre-test hanya bisa dikerjakan sekali. Hasil Anda sudah tercatat sebagai baseline untuk mengukur progress pembelajaran.',
                        duration: 4000
                      });
                    }}
                  >
                    Sudah Selesai
                    <CheckCircle className="w-5 h-5 ml-2 text-brand" />
                  </button>
                ) : (
                  // Belum mengerjakan pre-test
                  <button 
                    className="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all transform shadow-hard flex items-center justify-center group bg-brand border-2 border-ink text-white hover:bg-brand"
                    onClick={() => window.location.href = '/pretest'}
                  >
                    Mulai Tes Diagnostik
                  </button>
                )}
              </div>
            </div>

            {/* Post-test */}
            <div className="group relative h-full">
              <div className="absolute -inset-1 bg-mint-soft rounded-3xl hidden opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-paper rounded-3xl p-10 border-2 border-ink hover:border-ink transition-all duration-500 transform h-full flex flex-col">
                <div className="absolute top-6 right-6">
                  {postTestResult ? (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full border-2 border-ink">
                      <Award className="w-4 h-4 text-purple-700" />
                      <span className="text-purple-700 text-sm font-medium">Selesai</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-mint-soft rounded-full border-2 border-ink">
                      <span className="text-emerald-700 text-sm font-medium">Advanced</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center w-20 h-20 bg-mint-soft rounded-2xl mb-6 transition-transform duration-300">
                  <Target className="w-10 h-10 text-emerald-700" />
                </div>
                
                <h3 className="text-3xl font-bold text-ink mb-4">Tes Sumatif</h3>
                <p className="text-muted mb-8 text-lg leading-relaxed">
                  Validasi pencapaian learning outcomes dengan standar internasional dan sertifikasi digital 
                </p>

                {/* Show results if completed */}
                <div className="flex-grow">
                  {postTestResult ? (
                    <div className="space-y-4 mb-8">
                      {/* AI Feedback Title */}
                      {postTestFeedback && (
                        <div className="bg-lamp-soft rounded-xl p-4 border-2 border-ink mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-lamp-soft rounded-lg flex items-center justify-center">
                              <span className="text-lg"><Ico n="sparkles" /></span>
                            </div>
                            <div className="flex-1">
                              <p className="text-amber-700 text-xs font-semibold uppercase tracking-wider mb-1">
                                Feedback CIRVIA AI
                              </p>
                              <p className="text-amber-700 text-sm font-medium leading-relaxed">
                                {postTestFeedback.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-purple-100 rounded-xl p-4 border-2 border-ink">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-purple-700 font-medium">Skor Anda:</span>
                          <span className="text-2xl font-bold text-ink">{postTestResult.percentage}%</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-muted text-sm">Benar:</span>
                          <span className="text-ink">{postTestResult.correct_answers}/{postTestResult.total_questions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted text-sm">Tanggal:</span>
                          <span className="text-ink text-sm">{new Date(postTestResult.completed_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                
                    </div>
                  ) : (
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-emerald-700">
                        <div className="w-2 h-2 bg-mint rounded-full mr-3"></div>
                        <span>Analisis Rangkaian Interaktif</span>
                      </div>
                      <div className="flex items-center text-emerald-700">
                        <div className="w-2 h-2 bg-mint rounded-full mr-3"></div>
                        <span>Perhitungan I, V, R Real-time</span>
                      </div>
                      <div className="flex items-center text-emerald-700">
                        <div className="w-2 h-2 bg-mint rounded-full mr-3"></div>
                        <span>Progress Analytics</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all transform shadow-hard flex items-center justify-center group ${
                    !preTestResult
                      ? 'bg-ink/20 text-muted cursor-not-allowed border-2 border-ink'
                      : postTestResult 
                        ? 'bg-mint-soft text-emerald-700 border-2 border-ink' 
                        : 'bg-mint text-ink hover:bg-mint'
                  }`}
                  onClick={() => preTestResult && (window.location.href = '/posttest')}
                  disabled={!preTestResult}
                >
                  {!preTestResult ? 'Selesaikan Pre-Test Dulu' : 
                   postTestResult ? 'Lihat Hasil / Ulangi' : 'Mulai Tes Sumatif'}
                </button>
              </div>
            </div>

          </div>

          {/* Progress Summary for Students */}
          {user && isStudent() && (preTestResult || postTestResult || learningStyleResult) && (
            <div className="mb-16">
              <div className="relative">
                <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
                <div className="relative bg-paper rounded-3xl p-8 border-2 border-ink">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-ink mb-2">Progress Pembelajaran Anda</h3>
                    <p className="text-muted">Ringkasan kemajuan belajar dan pencapaian</p>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Brain className="w-8 h-8 text-purple-700" />
                      </div>
                      <div className="text-2xl font-bold text-ink mb-1 capitalize">
                        {learningStyleResult ? learningStyleResult.primaryStyle : '-'}
                      </div>
                      <div className="text-muted text-sm">Gaya Belajar</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-8 h-8 text-brand" />
                      </div>
                      <div className="text-2xl font-bold text-ink mb-1">
                        {preTestResult ? preTestResult.percentage : '-'}%
                      </div>
                      <div className="text-muted text-sm">Pre-Test Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-mint-soft rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target className="w-8 h-8 text-emerald-700" />
                      </div>
                      <div className="text-2xl font-bold text-ink mb-1">
                        {postTestResult ? postTestResult.percentage : '-'}%
                      </div>
                      <div className="text-emerald-700 text-sm">Post-Test Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-mint-soft rounded-full flex items-center justify-center mx-auto mb-3">
                        <ArrowRight className="w-8 h-8 text-emerald-700" />
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${
                        preTestResult && postTestResult 
                          ? postTestResult.percentage >= preTestResult.percentage ? 'text-emerald-700' : 'text-red-600'
                          : 'text-muted'
                      }`}>
                        {preTestResult && postTestResult 
                          ? `${postTestResult.percentage >= preTestResult.percentage ? '+' : ''}${(postTestResult.percentage - preTestResult.percentage).toFixed(1)}%`
                          : '-'
                        }
                      </div>
                      <div className="text-emerald-700 text-sm">Improvement</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => window.location.href = '/progress'}
                      className="inline-flex items-center px-6 py-3 bg-brand border-2 border-ink text-white rounded-xl font-bold hover:bg-brand transition-all transform"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Lihat Analisis Lengkap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information Section */}
          <div className="text-center mb-16">
            <div className="relative">
              <div className="absolute -inset-1 bg-brand-soft rounded-3xl hidden"></div>
              <div className="relative bg-paper rounded-3xl p-12 border-2 border-ink">
                <div className="flex items-center justify-center mb-8 mx-auto">
                  <div className="relative w-32 h-32">
                    <Image
                      src="/assets/illustrations/AI.png"
                      alt="AI"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <h3 className="text-4xl font-bold text-ink mb-4">Sistem Evaluasi Lengkap Berbasis AI</h3>
                <p className="text-muted text-xl max-w-3xl mx-auto mb-8">
                  CIRVIA menerapkan sistem evaluasi bertingkat berbasis AI untuk menilai pemahaman Anda secara menyeluruh, mulai dari Tes Diagnostik untuk memetakan kemampuan awal hingga Tes Sumatif yang memvalidasi hasil belajar melalui umpan balik personal dan analisis cerdas.                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center px-4 py-2 bg-paper rounded-full border-2 border-ink">
                    <div className="w-2 h-2 bg-brand rounded-full mr-2 animate-pulse"></div>
                    <span className="text-brand">AI-Powered Evaluation</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-paper rounded-full border-2 border-ink">
                    <div className="w-2 h-2 bg-brand rounded-full mr-2 animate-pulse"></div>
                    <span className="text-brand">Detailed Analytics</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-paper rounded-full border-2 border-ink">
                    <div className="w-2 h-2 bg-brand rounded-full mr-2 animate-pulse"></div>
                    <span className="text-brand">Personalized Feedback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default TestPage;