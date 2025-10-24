'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Sparkles, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useStudentAuth } from '@/hooks/useStudentAuth'
import { useAuth } from '@/contexts/AuthContext'
import { SupabaseTestService, TestAnswerInput } from '@/lib/supabase-test-service'
import { mixedQuestions, calculateQuizScore } from '@/lib/questions'
import QuestionRenderer from '@/components/tipesoal/QuestionRenderer'

interface QuizState {
  currentQuestionIndex: number;
  answers: boolean[];
  showResult: boolean;
  quizCompleted: boolean;
  startTime: number;
  score: number;
}

export default function PretestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const { requireStudentLogin, isLoggedInStudent } = useStudentAuth();
  const { user } = useAuth();
  
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

  const currentQuestion = mixedQuestions[quizState.currentQuestionIndex];
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
    if (quizState.currentQuestionIndex < mixedQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showResult: false
      }));
    } else {
      // Quiz completed
      const correctAnswers = quizState.answers.filter(Boolean).length;
      const scoreData = calculateQuizScore(correctAnswers, mixedQuestions.length);
      
      // Save test result if user is logged in as student
      if (user && user.role === 'student') {
        const totalTimeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
        
        // Create test answers array for detailed tracking
        const testAnswers: TestAnswerInput[] = mixedQuestions.map((question, index) => ({
          questionId: question.id,
          selectedAnswer: quizState.answers[index] ? 1 : 0, // 1 for correct, 0 for incorrect
          correctAnswer: 1, // Always 1 for correct
          isCorrect: quizState.answers[index],
          questionText: (question as any).title || (question as any).question || (question as any).statement || '',
          selectedText: quizState.answers[index] ? 'Benar' : 'Salah',
          correctText: 'Benar',
          explanation: question.explanation || question.hint || ''
        }));

        const percentage = Math.round(scoreData.score);
        const grade = SupabaseTestService.calculateGrade(percentage);

        // Save to Supabase
        SupabaseTestService.saveTestResult({
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'pretest',
          score: correctAnswers,
          totalQuestions: mixedQuestions.length,
          correctAnswers,
          percentage,
          timeSpent: totalTimeSpent,
          answers: testAnswers,
          grade
        }).catch(error => {
          console.error('Error saving pretest result:', error);
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

  if (quizState.quizCompleted) {
    const correctAnswers = quizState.answers.filter(Boolean).length;
    const scoreData = calculateQuizScore(correctAnswers, mixedQuestions.length);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Completion Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full border border-green-400/30 backdrop-blur-sm mb-8">
              <Trophy className="w-6 h-6 text-green-400 mr-3" />
              <span className="text-green-400 text-lg font-bold">Pre-Test Selesai!</span>
              <Sparkles className="w-6 h-6 text-green-400 ml-3" />
            </div>

            {/* Score Display */}
            <div className="relative mb-12">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="text-center">
                  <div className="text-5xl font-black text-white mb-2">{Math.round(scoreData.score)}%</div>
                  <div className="text-lg font-bold text-green-300">{scoreData.grade}</div>
                </div>
              </div>
            </div>

            {/* Results */}
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
              {scoreData.message}
            </h1>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{correctAnswers}/{mixedQuestions.length}</div>
                <div className="text-green-300">Jawaban Benar</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{formatTime(timeElapsed)}</div>
                <div className="text-green-300">Waktu Total</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{Math.round(timeElapsed / mixedQuestions.length)}s</div>
                <div className="text-green-300">Rata-rata/Soal</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{scoreData.grade}</div>
                <div className="text-green-300">Grade</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleResetQuiz}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Ulangi Pre-Test
              </button>
              <button
                onClick={() => window.location.href = '/test'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Lanjut ke Pembelajaran
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
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full border border-green-400/30 backdrop-blur-sm mb-6">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-green-400 text-sm font-medium">Pre-Test Evaluasi Awal</span>
                <Star className="w-5 h-5 text-emerald-400 ml-2" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Pre-Test
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  Rangkaian Listrik
                </span>
              </h1>

              <p className="text-xl text-blue-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Evaluasi awal untuk mengukur pemahaman Anda tentang rangkaian listrik sebelum memulai pembelajaran. 
                Hasil ini akan menjadi baseline untuk mengukur progress Anda!
              </p>

              <div className="text-center">
                <button
                  onClick={() => requireStudentLogin('pretest', '/pretest')}
                  className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center mx-auto"
                >
                  🚀 Mulai Pre-Test
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-green-300/60 text-sm mt-4">
                  Klik tombol di atas untuk memulai evaluasi awal pembelajaran
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full animate-ping"
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
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full border border-green-400/30 backdrop-blur-sm mb-6">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">Interactive Pre-Test</span>
              <Star className="w-5 h-5 text-emerald-400 ml-2" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl">
                Pre-Test Rangkaian
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 bg-clip-text text-transparent">
                Listrik
              </span>
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <div className="text-white font-bold">
                  Soal {quizState.currentQuestionIndex + 1} dari {mixedQuestions.length}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-cyan-300 font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-green-300">
                    Benar: {quizState.answers.filter(Boolean).length}
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((quizState.currentQuestionIndex + 1) / mixedQuestions.length) * 100}%` }}
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
            isLastQuestion={quizState.currentQuestionIndex >= mixedQuestions.length - 1}
          />
        </div>
      </div>
    </div>
  );
}