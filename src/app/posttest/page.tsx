'use client'

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Trophy, 
  RotateCcw, 
  Sparkles,
  ArrowRight,
  SkipForward
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { useAuth } from '@/contexts/AuthContext';
import { DEFAULT_POSTTEST_PACKAGE, calculateQuizScore } from '@/lib/questions';
import { useStudentQuestions } from '@/lib/student-question-service';
import { SupabaseTestService, TestAnswerInput } from '@/lib/supabase-test-service';
import { useToast } from '@/components/Toast';
import QuestionRenderer from '@/components/tipesoal/QuestionRenderer';

interface QuizState {
  currentQuestionIndex: number;
  answers: boolean[];
  showResult: boolean;
  quizCompleted: boolean;
  startTime: number;
  score: number;
}

const PostTestPage = () => {
  const [testStarted, setTestStarted] = useState(false);
  const { requireStudentLogin, isLoggedInStudent } = useStudentAuth();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Get questions based on student's class assignment
  const studentClass = user && user.role === 'student' ? String(user.class) : 'X-IPA-1';
  const { questions, loading: questionsLoading, error: questionsError } = useStudentQuestions(
    user?.id || null,
    studentClass,
    'posttest',
    DEFAULT_POSTTEST_PACKAGE // Use default posttest package as fallback
  );
  
  // Auto-start test jika sudah login sebagai student
  useEffect(() => {
    if (isLoggedInStudent) {
      setTestStarted(true);
    }
  }, [isLoggedInStudent]);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    showResult: false,
    quizCompleted: false,
    startTime: Date.now(),
    score: 0
  });

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizState.startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.startTime]);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = isCorrect;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showResult: true
    }));
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showResult: false
      }));
    } else {
      // Quiz completed
      const correctAnswers = quizState.answers.filter(Boolean).length;
      const scoreData = calculateQuizScore(correctAnswers, questions.length);
      
      // Save test result if user is logged in as student
      if (user && user.role === 'student') {
        const totalTimeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
        
        // Create test answers array for detailed tracking
        console.log('Questions data for test answers:', questions.map(q => ({ id: q.id, type: typeof q.id, title: q.title })));
        
        const testAnswers: TestAnswerInput[] = questions.map((question, index) => {
          // Convert question ID to string, support both integer and UUID
          const questionId = String(question.id || (index + 1)); // Fallback to index-based ID
          console.log(`Processing question ${index}: id=${question.id}, converted=${questionId}`);
          
          return {
            questionId: questionId,
            selectedAnswer: quizState.answers[index] ? 1 : 0, // 1 for correct, 0 for incorrect
            correctAnswer: 1, // Always 1 for correct
            isCorrect: quizState.answers[index],
            questionText: question.title || (question as any).question || question.description || '',
            selectedText: quizState.answers[index] ? 'Benar' : 'Salah',
            correctText: 'Benar',
            explanation: question.explanation || question.hint || ''
          };
        });

        const percentage = Math.round(scoreData.score);
        const grade = SupabaseTestService.calculateGrade(percentage);

        // Save to Supabase with detailed logging
        console.log('Attempting to save posttest result:', {
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'posttest',
          score: correctAnswers,
          totalQuestions: questions.length,
          percentage,
          testAnswersCount: testAnswers.length
        });

        SupabaseTestService.saveTestResult({
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'posttest',
          score: correctAnswers,
          totalQuestions: questions.length,
          correctAnswers,
          percentage,
          timeSpent: totalTimeSpent,
          answers: testAnswers,
          grade
        }).then(result => {
          if (result) {
            console.log('Posttest result saved successfully:', result.id);
            addToast({
              type: 'success',
              title: 'Post-Test Tersimpan!',
              message: 'Hasil post-test Anda berhasil disimpan. Lihat peningkatan dari pre-test!',
              duration: 4000
            });
          } else {
            console.error('Failed to save posttest result: No result returned');
            addToast({
              type: 'error',
              title: 'Gagal Menyimpan',
              message: 'Hasil post-test tidak berhasil disimpan. Silakan hubungi admin.',
              duration: 5000
            });
          }
        }).catch(error => {
          console.error('Error saving posttest result:', error);
          addToast({
            type: 'error',
            title: 'Kesalahan Sistem',
            message: 'Terjadi kesalahan saat menyimpan hasil post-test. Silakan coba lagi atau hubungi admin.',
            duration: 5000
          });
        });
      }
      
      setQuizState(prev => ({
        ...prev,
        quizCompleted: true,
        score: scoreData.score
      }));
    }
  };

  const handleResetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      showResult: false,
      quizCompleted: false,
      startTime: Date.now(),
      score: 0
    });
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state while fetching questions
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="text-white">Memuat soal post-test...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if questions failed to load
  if (questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Gagal Memuat Soal</h3>
          <p className="text-gray-300 mb-4">Terjadi kesalahan saat memuat soal post-test. Silakan coba lagi.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (quizState.quizCompleted) {
    const correctAnswers = quizState.answers.filter(Boolean).length;
    const scoreData = calculateQuizScore(correctAnswers, questions.length);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Completion Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30 backdrop-blur-sm mb-8">
              <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
              <span className="text-yellow-400 text-lg font-bold">Post-Test Selesai!</span>
              <Sparkles className="w-6 h-6 text-yellow-400 ml-3" />
            </div>

            {/* Score Display */}
            <div className="relative mb-12">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-2">{Math.round(scoreData.score)}%</div>
                  <div className="text-lg font-bold text-purple-300">{scoreData.grade}</div>
                </div>
              </div>
            </div>

            {/* Results */}
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
              {scoreData.message}
            </h1>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{correctAnswers}/{questions.length}</div>
                <div className="text-purple-300">Jawaban Benar</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{formatTime(timeElapsed)}</div>
                <div className="text-purple-300">Waktu Total</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{Math.round(timeElapsed / questions.length)}s</div>
                <div className="text-purple-300">Rata-rata/Soal</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{scoreData.grade}</div>
                <div className="text-purple-300">Grade</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleResetQuiz}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Ulangi Post-Test
              </button>
              <button
                onClick={() => window.location.href = '/test'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Kembali ke Menu
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pre-test start screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-6">
                <Brain className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-purple-400 text-sm font-medium">Post-Test Evaluasi Akhir</span>
                <Zap className="w-5 h-5 text-pink-400 ml-2" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Post-Test
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Rangkaian Listrik
                </span>
              </h1>

              <p className="text-xl text-blue-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Evaluasi akhir untuk mengukur pemahaman Anda tentang rangkaian listrik setelah mengikuti pembelajaran. 
                Bandingkan hasil dengan pre-test untuk melihat progress Anda!
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Evaluasi Akhir</h3>
                  </div>
                  <div>
                    <h4 className="text-emerald-300 font-medium mb-2">Fitur Post-Test:</h4>
                    <ul className="text-emerald-200/80 text-sm space-y-1">
                      <li>• Simulasi rangkaian listrik interaktif dengan drag & drop</li>
                      <li>• Perhitungan otomatis nilai I (Arus), V (Tegangan), R (Resistansi)</li>
                      <li>• Bandingkan hasil dengan pre-test untuk melihat progress</li>
                      <li>• Feedback detail untuk setiap jawaban yang diberikan</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Progress Tracking</h3>
                  </div>
                  <div>
                    <h4 className="text-purple-300 font-medium mb-2">Yang akan diukur:</h4>
                    <ul className="text-purple-200/80 text-sm space-y-1">
                      <li>• Pemahaman konsep rangkaian seri dan paralel</li>
                      <li>• Kemampuan menghitung nilai resistansi total</li>
                      <li>• Analisis arus dan tegangan dalam rangkaian</li>
                      <li>• Peningkatan dari hasil pre-test sebelumnya</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => requireStudentLogin('posttest', '/posttest')}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center mx-auto"
                >
                  🚀 Mulai Post-Test
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-purple-300/60 text-sm mt-4">
                  Klik tombol di atas untuk memulai evaluasi akhir pembelajaran
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <Navbar />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-6">
              <Brain className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-purple-400 text-sm font-medium">Interactive Circuit Post-Test</span>
              <Zap className="w-5 h-5 text-pink-400 ml-2" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                Post-Test Rangkaian
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Listrik
              </span>
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <div className="text-white font-bold">
                  Soal {quizState.currentQuestionIndex + 1} dari {questions.length}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-cyan-300 font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-purple-300">
                    Benar: {quizState.answers.filter(Boolean).length}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Section */}
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            showResult={quizState.showResult}
            isLastQuestion={quizState.currentQuestionIndex >= questions.length - 1}
          />


        </div>
      </div>
    </div>
  );
};

export default PostTestPage;