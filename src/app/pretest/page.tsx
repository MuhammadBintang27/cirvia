'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trophy, Star, Sparkles, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useStudentAuth } from '@/hooks/useStudentAuth'
import { useAuth } from '@/contexts/AuthContext'
import { SupabaseTestService, TestAnswerInput } from '@/lib/supabase-test-service'
import { DEFAULT_PRETEST_PACKAGE, calculateQuizScore } from '@/lib/questions'
import { useStudentQuestions } from '@/lib/student-question-service'
import { useToast } from '@/components/Toast'
import QuestionRenderer from '@/components/tipesoal/QuestionRenderer'

// Debug: Log package lengths
console.log('DEFAULT_PRETEST_PACKAGE length:', DEFAULT_PRETEST_PACKAGE?.length)
console.log('DEFAULT_PRETEST_PACKAGE preview:', DEFAULT_PRETEST_PACKAGE?.slice(0, 3).map(q => ({ id: q.id, title: q.title, type: q.questionType })))

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
  const [hasCompletedPretest, setHasCompletedPretest] = useState(false);
  const [checkingPreviousAttempt, setCheckingPreviousAttempt] = useState(true);
  const { requireStudentLogin, isLoggedInStudent } = useStudentAuth();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Get questions based on student's class assignment
  const studentClass = user && user.role === 'student' ? String(user.class) : 'X-IPA-1';
  
  // Debug log to see what class the student belongs to
  console.log('🔍 [DEBUG] Student:', user?.name, 'Class:', studentClass, 'Teacher ID:', (user as any)?.teacherId, 'Role:', user?.role);
  
  // Memoize the fallback questions to prevent unnecessary re-renders
  const memoizedFallbackQuestions = useMemo(() => {
    console.log('[PreTest] Memoizing fallback questions, length:', DEFAULT_PRETEST_PACKAGE?.length);
    return DEFAULT_PRETEST_PACKAGE;
  }, []);
  
  const { questions, loading: questionsLoading, error: questionsError } = useStudentQuestions(
    user?.id || null,
    studentClass,
    (user?.role === 'student' ? (user as any).teacherId : null),
    'pretest',
    memoizedFallbackQuestions // Use memoized default pretest package as fallback
  );
  
  // Check if student has already completed pretest
  useEffect(() => {
    const checkPreviousAttempt = async () => {
      if (user && user.role === 'student') {
        try {
          const previousResult = await SupabaseTestService.getLatestTestResult(user.id, 'pretest');
          if (previousResult) {
            setHasCompletedPretest(true);
          }
        } catch (error) {
          console.error('Error checking previous pretest attempt:', error);
        }
      }
      setCheckingPreviousAttempt(false);
    };

    checkPreviousAttempt();
  }, [user]);
  
  // Auto-start test jika sudah login sebagai student dan belum pernah mengerjakan
  useEffect(() => {
    if (isLoggedInStudent && !hasCompletedPretest && !checkingPreviousAttempt) {
      setTestStarted(true);
    }
  }, [isLoggedInStudent, hasCompletedPretest, checkingPreviousAttempt]);
  
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
        console.log('Attempting to save pretest result:', {
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'pretest',
          score: correctAnswers,
          totalQuestions: questions.length,
          percentage,
          testAnswersCount: testAnswers.length
        });

        SupabaseTestService.saveTestResult({
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'pretest',
          score: correctAnswers,
          totalQuestions: questions.length,
          correctAnswers,
          percentage,
          timeSpent: totalTimeSpent,
          answers: testAnswers,
          grade
        }).then(result => {
          if (result) {
            console.log('Pretest result saved successfully:', result.id);
            addToast({
              type: 'success',
              title: 'Pre-Test Tersimpan!',
              message: 'Hasil pre-test Anda berhasil disimpan sebagai baseline pembelajaran.',
              duration: 4000
            });
          } else {
            console.error('Failed to save pretest result: No result returned');
            addToast({
              type: 'error',
              title: 'Gagal Menyimpan',
              message: 'Hasil pre-test tidak berhasil disimpan. Silakan hubungi admin.',
              duration: 5000
            });
          }
        }).catch(error => {
          console.error('Error saving pretest result:', error);
          addToast({
            type: 'error',
            title: 'Kesalahan Sistem',
            message: 'Terjadi kesalahan saat menyimpan hasil pre-test. Silakan coba lagi atau hubungi admin.',
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

  // handleResetQuiz removed - pretest cannot be retaken

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show message if student has already completed pretest
  if (hasCompletedPretest && !checkingPreviousAttempt) {
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
            {/* Already Completed Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
              <CheckCircle className="w-6 h-6 text-blue-400 mr-3" />
              <span className="text-blue-400 text-lg font-bold">Pre-Test Sudah Selesai</span>
              <Sparkles className="w-6 h-6 text-blue-400 ml-3" />
            </div>

            {/* Info Message */}
            <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent">
              Anda Sudah Mengerjakan Pre-Test
            </h1>

            <p className="text-xl text-blue-200/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Pre-test hanya bisa dikerjakan sekali untuk memastikan evaluasi awal yang akurat. 
              Anda sudah menyelesaikan pre-test sebelumnya.
            </p>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Langkah Selanjutnya</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="text-cyan-300 font-medium">Yang bisa Anda lakukan:</h4>
                  <ul className="text-cyan-200/80 text-sm space-y-1">
                    <li>• Mulai pembelajaran materi rangkaian listrik</li>
                    <li>• Kerjakan praktikum interaktif</li>
                    <li>• Lihat progress pembelajaran Anda</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-green-300 font-medium">Setelah belajar:</h4>
                  <ul className="text-green-200/80 text-sm space-y-1">
                    <li>• Kerjakan post-test untuk melihat peningkatan</li>
                    <li>• Bandingkan hasil dengan pre-test</li>
                    <li>• Dapatkan sertifikat pembelajaran</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/materials'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Mulai Pembelajaran
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/student'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Lihat Progress
                <Trophy className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
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
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
              {scoreData.message}
            </h1>

            {/* Pre-test completion notice */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <p className="text-blue-200 text-center">
                <strong>Pre-test Anda sudah tercatat!</strong> Hasil ini menjadi baseline untuk mengukur progress pembelajaran. 
                Sekarang Anda bisa mulai pembelajaran dan nanti mengerjakan post-test.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{correctAnswers}/{questions.length}</div>
                <div className="text-green-300">Jawaban Benar</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{formatTime(timeElapsed)}</div>
                <div className="text-green-300">Waktu Total</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{Math.round(timeElapsed / questions.length)}s</div>
                <div className="text-green-300">Rata-rata/Soal</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{scoreData.grade}</div>
                <div className="text-green-300">Grade</div>
              </div>
            </div>

            {/* Action Buttons - No retry button for pretest */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/materials'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Mulai Pembelajaran
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/student'}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Lihat Progress
                <Trophy className="w-5 h-5 ml-2" />
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

              <p className="text-xl text-blue-200/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Evaluasi awal untuk mengukur pemahaman Anda tentang rangkaian listrik sebelum memulai pembelajaran. 
                Hasil ini akan menjadi baseline untuk mengukur progress Anda!
              </p>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-6 mb-12 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                  <h3 className="text-amber-300 font-bold text-lg">Penting!</h3>
                </div>
                <p className="text-amber-200 text-center">
                  <strong>Pre-test hanya bisa dikerjakan sekali</strong> untuk memastikan evaluasi awal yang akurat. 
                  Pastikan Anda dalam kondisi siap sebelum memulai.
                </p>
              </div>

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
                  Soal {quizState.currentQuestionIndex + 1} dari {questions.length}
                  {/* Debug: {JSON.stringify({ questionsLength: questions.length, questionIds: questions.slice(0, 3).map(q => q.id) })} */}
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
                  style={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Section */}
          {/* Loading state */}
          {checkingPreviousAttempt || questionsLoading ? (
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-white">
                {checkingPreviousAttempt ? 'Memeriksa riwayat pre-test...' : `Memuat soal untuk kelas ${studentClass}...`}
              </p>
            </div>
          ) : questionsError ? (
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6 text-center">
              <p className="text-red-300 mb-2">⚠️ Gagal memuat soal assignment</p>
              <p className="text-red-200 text-sm">Menggunakan soal default sebagai fallback</p>
            </div>
          ) : null}

          {/* Question Renderer */}
          {!checkingPreviousAttempt && !questionsLoading && currentQuestion && !hasCompletedPretest && (
            <QuestionRenderer
              question={currentQuestion}
              onAnswer={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
              showResult={quizState.showResult}
              isLastQuestion={quizState.currentQuestionIndex >= questions.length - 1}
            />
          )}
        </div>
      </div>
    </div>
  );
}