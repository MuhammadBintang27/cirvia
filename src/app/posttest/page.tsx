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
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { useAuth } from '@/contexts/AuthContext';
import { getDefaultPosttestPackage, calculateQuizScore, Question } from '@/lib/questions';
import { useStudentQuestions } from '@/lib/student-question-service';
import { SupabaseTestService, TestAnswerInput } from '@/lib/supabase-test-service';
import { useToast } from '@/components/Toast';
import QuestionRenderer from '@/components/tipesoal/QuestionRenderer';
import PostTestAIFeedback from '@/components/fiturAi/PostTestAIFeedback';
import { extractAnswer, calculateScore } from '@/lib/answer-tracking';

interface QuizState {
  currentQuestionIndex: number;
  answers: (number | null | string[] | number[] | { [key: string]: string })[];  // Support all question types
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
  
  // State untuk default questions dari database
  const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
  const [loadingDefaults, setLoadingDefaults] = useState(true);
  
  // Get questions based on student's class assignment
  const studentClass = user && user.role === 'student' ? String(user.class) : 'X-IPA-1';
  
  // Fetch default questions dari database saat komponen mount
  useEffect(() => {
    const fetchDefaultQuestions = async () => {
      try {
        console.log('📦 [POSTTEST] Fetching default questions from database...');
        const questions = await getDefaultPosttestPackage();
        console.log('✅ [POSTTEST] Loaded default questions from database:', questions.length);
        setDefaultQuestions(questions);
      } catch (error) {
        console.error('❌ [POSTTEST] Error fetching default questions:', error);
        setDefaultQuestions([]); // Empty fallback
      } finally {
        setLoadingDefaults(false);
      }
    };
    
    fetchDefaultQuestions();
  }, []);
  
  const { questions, loading: questionsLoading, error: questionsError } = useStudentQuestions(
    user?.id || null,
    studentClass,
    (user?.role === 'student' ? (user as any).teacherId : null),
    'posttest',
    defaultQuestions // Use database-fetched default questions
  );
  
  // 🐛 Debug logging untuk questions
  useEffect(() => {
    console.log('🔍 [POSTTEST DEBUG] Questions state:', {
      questionsLength: questions.length,
      questionsLoading,
      questionsError,
      defaultQuestionsLength: defaultQuestions.length,
      loadingDefaults,
      firstQuestion: questions[0] ? {
        id: questions[0].id,
        questionType: questions[0].questionType,
        title: questions[0].title
      } : null
    });
  }, [questions, questionsLoading, questionsError, defaultQuestions, loadingDefaults]);
  
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

  // Timer effect - stop when quiz is completed
  useEffect(() => {
    if (quizState.quizCompleted) {
      // Don't run timer if quiz is completed
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizState.startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.startTime, quizState.quizCompleted]);

  const handleAnswerSubmit = (
    selectedData: number | boolean | string[] | number[] | { [key: string]: string }, 
    isCorrectParam?: boolean
  ) => {
    const newAnswers = [...quizState.answers];
    const index = quizState.currentQuestionIndex;
    const currentQuestion = questions[index];
    
    console.log('🔍 [Posttest] handleAnswerSubmit:', {
      questionType: currentQuestion?.questionType,
      selectedData,
      isCorrectParam
    });
    
    // ✅ Handle different question types
    if (Array.isArray(selectedData)) {
      // Conceptual (string[]) or Circuit (number[]) or Ordering (string[])
      // Store the actual selection
      newAnswers[index] = selectedData;
    } else if (typeof selectedData === 'object' && selectedData !== null) {
      // Circuit Analysis (lamp states object)
      // Store the lamp states object
      newAnswers[index] = selectedData;
    } else if (typeof selectedData === 'boolean') {
      // Old signature: just boolean (backward compatibility)
      // We don't know what was selected, mark as 0 if correct, null if wrong
      newAnswers[index] = selectedData ? 0 : null;
    } else if (typeof selectedData === 'number') {
      // Index-based answer or old format
      newAnswers[index] = selectedData === -1 ? null : selectedData;
    }

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
      // Quiz completed - use new answer tracking system
      console.log('🔍 [POSTTEST - ANSWER TRACKING] Processing quiz completion with new system');
      
      // Cast questions to proper Question type
      const typedQuestions = questions as Question[];
      
      // Extract all answers with metadata using new system
      const answerResults = typedQuestions.map((q, index) => {
        const userAnswer = quizState.answers[index];
        console.log(`🔍 [POSTTEST - Q${index + 1}] Extracting answer for type: ${q.questionType}`, userAnswer);
        return extractAnswer(q as any, userAnswer);
      });
      
      console.log('✅ [POSTTEST - ANSWER TRACKING] Extracted results:', answerResults.map(r => ({
        type: r.questionType,
        correct: r.isCorrect,
        selected: r.selectedText,
        metadata: r.metadata
      })));
      
      // Calculate score using new utility function
      const { correct, total, percentage } = calculateScore(answerResults);
      
      console.log(`📊 [POSTTEST - SCORE] Correct: ${correct}/${total} = ${percentage}%`);
      
      // Save test result if user is logged in as student
      if (user && user.role === 'student') {
        const totalTimeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
        
        // Create test answers array with new metadata support
        const testAnswers: TestAnswerInput[] = answerResults.map(result => ({
          questionId: result.questionId,
          selectedAnswer: result.selectedAnswer,
          correctAnswer: result.correctAnswer,
          isCorrect: result.isCorrect,
          questionText: result.questionText,
          selectedText: result.selectedText,
          correctText: result.correctText,
          explanation: result.explanation,
          questionType: result.questionType as 'conceptual' | 'circuit' | 'circuitAnalysis' | 'simulation', // NEW: Question type tracking
          metadata: result.metadata // NEW: Type-specific metadata
        }));

        const grade = SupabaseTestService.calculateGrade(percentage);

        // Save to Supabase with detailed logging
        console.log('💾 [POSTTEST - SAVE] Attempting to save posttest with new metadata:', {
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'posttest',
          score: correct,
          totalQuestions: total,
          percentage,
          testAnswersWithMetadata: testAnswers.map(a => ({
            questionType: a.questionType,
            hasMetadata: !!a.metadata
          }))
        });

        SupabaseTestService.saveTestResult({
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'posttest',
          score: correct,
          totalQuestions: total,
          correctAnswers: correct,
          percentage,
          timeSpent: totalTimeSpent,
          answers: testAnswers,
          grade
        }).then(result => {
          if (result) {
            console.log('✅ [POSTTEST - SAVE] Posttest result saved successfully:', result.id);
            addToast({
              type: 'success',
              title: 'Post-Test Tersimpan!',
              message: 'Hasil post-test Anda berhasil disimpan dengan detail jawaban lengkap. Lihat peningkatan dari pre-test!',
              duration: 4000
            });
          } else {
            console.error('❌ [POSTTEST - SAVE] Failed to save posttest result: No result returned');
            addToast({
              type: 'error',
              title: 'Gagal Menyimpan',
              message: 'Hasil post-test tidak berhasil disimpan. Silakan hubungi admin.',
              duration: 5000
            });
          }
        }).catch(error => {
          console.error('❌ [POSTTEST - SAVE] Error saving posttest result:', error);
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
        score: percentage
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
  if (questionsLoading || loadingDefaults) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="bg-paper rounded-2xl p-8 border-2 border-ink">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
            <span className="text-ink">
              {loadingDefaults 
                ? 'Memuat soal default dari database...'
                : 'Memuat soal post-test...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if questions failed to load
  if (questionsError) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="bg-paper rounded-2xl p-8 border-2 border-ink text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">Gagal Memuat Soal</h3>
          <p className="text-muted mb-4">Terjadi kesalahan saat memuat soal post-test. Silakan coba lagi.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 border-2 border-ink text-white px-6 py-2 rounded-lg hover:bg-purple-500 transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (quizState.quizCompleted) {
    // Use the score from state (already calculated as percentage)
    const percentage = quizState.score;
    const correctAnswers = Math.round((percentage / 100) * questions.length);
    const scoreData = calculateQuizScore(correctAnswers, questions.length);
    
    return (
      <div className="min-h-screen bg-transparent relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full hidden animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-100 rounded-full hidden animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Completion Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-lamp-soft rounded-full border-2 border-ink mb-8">
              <Trophy className="w-6 h-6 text-amber-700 mr-3" />
              <span className="text-amber-700 text-lg font-bold">Post-Test Selesai!</span>
              <Sparkles className="w-6 h-6 text-amber-700 ml-3" />
            </div>

            {/* Score Display */}
            <div className="relative mb-12">
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-purple-100 border-2 border-ink shadow-hard">
                <div className="text-center">
                  <div className="text-6xl font-black text-ink">{Math.round(scoreData.score)}%</div>
                </div>
              </div>
            </div>

            {/* Results */}
            <h1 className="text-5xl font-black mb-6 text-ink">
              {scoreData.message}
            </h1>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
                <div className="text-2xl font-bold text-ink mb-2">{correctAnswers}/{questions.length}</div>
                <div className="text-purple-700">Jawaban Benar</div>
              </div>
              <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
                <div className="text-2xl font-bold text-ink mb-2">{formatTime(timeElapsed)}</div>
                <div className="text-purple-700">Waktu Total</div>
              </div>
              <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
                <div className="text-2xl font-bold text-ink mb-2">{Math.round(timeElapsed / questions.length)}s</div>
                <div className="text-purple-700">Rata-rata/Soal</div>
              </div>
            </div>

            {/* AI Assessment Feedback with Progress Analysis */}
            {user && (
              <div className="mb-8">
                <PostTestAIFeedback
                  studentId={user.id}
                  studentName={user.name}
                  testType="posttest"
                  score={Math.round(scoreData.score)}
                  improvement={undefined} // Will be calculated by the service
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleResetQuiz}
                className="flex items-center justify-center px-8 py-4 bg-purple-500 border-2 border-ink text-white rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all transform shadow-hard"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Ulangi Post-Test
              </button>
              <button
                onClick={() => window.location.href = '/test'}
                className="flex items-center justify-center px-8 py-4 bg-brand border-2 border-ink text-white rounded-2xl font-bold text-lg hover:bg-brand transition-all transform shadow-hard"
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
      <div className="min-h-screen bg-transparent relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full hidden animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-100 rounded-full hidden animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>
        </div>

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full border-2 border-ink mb-6">
                <Brain className="w-5 h-5 text-purple-700 mr-2" />
                <span className="text-purple-700 text-sm font-medium">Post-Test Evaluasi Akhir</span>
                <Zap className="w-5 h-5 text-purple-700 ml-2" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-ink">
                  Post-Test
                </span>
                <br />
                <span className="text-ink">
                  Rangkaian Listrik
                </span>
              </h1>

              <p className="text-xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed">
                Evaluasi akhir untuk mengukur pemahaman Anda tentang rangkaian listrik setelah mengikuti pembelajaran. 
                Bandingkan hasil dengan pre-test untuk melihat progress Anda!
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-paper rounded-2xl p-8 border-2 border-ink text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-mint rounded-xl flex items-center justify-center mr-4">
                      <Trophy className="w-6 h-6 text-ink" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink">Evaluasi Akhir</h3>
                  </div>
                  <div>
                    <h4 className="text-emerald-700 font-medium mb-2">Fitur Post-Test:</h4>
                    <ul className="text-emerald-700 text-sm space-y-1">
                      <li>• Simulasi rangkaian listrik interaktif dengan drag & drop</li>
                      <li>• Perhitungan otomatis nilai I (Arus), V (Tegangan), R (Resistansi)</li>
                      <li>• Bandingkan hasil dengan pre-test untuk melihat progress</li>
                      <li>• Feedback detail untuk setiap jawaban yang diberikan</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-paper rounded-2xl p-8 border-2 border-ink text-left">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink">Progress Tracking</h3>
                  </div>
                  <div>
                    <h4 className="text-purple-700 font-medium mb-2">Yang akan diukur:</h4>
                    <ul className="text-muted text-sm space-y-1">
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
                  className="group bg-purple-500 border-2 border-ink text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-purple-500 transition-all transform shadow-hard flex items-center justify-center mx-auto"
                >
                  Mulai Post-Test
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform" />
                </button>
                <p className="text-purple-700 text-sm mt-4">
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
    <div className="min-h-screen bg-transparent relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-100 rounded-full hidden animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-100 rounded-full hidden"
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
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full border-2 border-ink mb-6">
              <Brain className="w-5 h-5 text-purple-700 mr-2" />
              <span className="text-purple-700 text-sm font-medium">Interactive Circuit Post-Test</span>
              <Zap className="w-5 h-5 text-purple-700 ml-2" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              <span className="text-ink">
                Post-Test Rangkaian
              </span>
              <br />
              <span className="text-ink">
                Listrik
              </span>
            </h1>
          </div>

          {/* Progress Bar */}
          {!loadingDefaults && !questionsLoading && questions.length > 0 && (
            <div className="mb-8">
              <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-ink font-bold">
                    Soal {quizState.currentQuestionIndex + 1} dari {questions.length}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-brand font-bold">{formatTime(timeElapsed)}</div>
                    <div className="text-purple-700">
                      Benar: {quizState.answers.filter(Boolean).length}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-paper rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Question Section */}
          {loadingDefaults || questionsLoading ? (
            <LoadingOverlay 
              isVisible={true} 
              text={
                loadingDefaults 
                  ? 'Memuat soal dari database...'
                  : `Memuat soal untuk kelas ${studentClass}...`
              }
            />
          ) : questionsError ? (
            <div className="bg-coral-soft rounded-2xl p-12 border-2 border-ink text-center">
              <p className="text-red-600 text-xl font-bold mb-4">Gagal memuat soal</p>
              <p className="text-red-600 mb-6">{questionsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-coral-soft hover:bg-coral-soft border-2 border-ink rounded-xl text-ink font-medium transition-all"
              >
                Muat Ulang Halaman
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-lamp-soft rounded-2xl p-12 border-2 border-ink text-center">
              <p className="text-amber-700 text-xl font-bold mb-4">Tidak ada soal</p>
              <p className="text-amber-700">Belum ada soal post-test yang tersedia. Hubungi guru Anda.</p>
            </div>
          ) : !currentQuestion ? (
            <div className="bg-coral-soft rounded-2xl p-12 border-2 border-ink text-center">
              <p className="text-red-600 text-xl font-bold mb-4">Soal tidak ditemukan</p>
              <p className="text-red-600">
                Soal nomor {quizState.currentQuestionIndex + 1} tidak dapat dimuat.
              </p>
              <p className="text-red-600 text-sm mt-2">
                Debug: questions.length = {questions.length}, currentIndex = {quizState.currentQuestionIndex}
              </p>
            </div>
          ) : (
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
};

export default PostTestPage;