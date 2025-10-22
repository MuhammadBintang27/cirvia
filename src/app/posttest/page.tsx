'use client'

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Target, 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Star,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CircuitDiagram from '@/components/CircuitDiagram';
import ResistorSelector from '@/components/ResistorSelector';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { useAuth } from '@/contexts/AuthContext';
import { circuitQuestions, calculateQuizScore, Resistor, CircuitQuestion } from '@/lib/questions';
import { calculateCircuit, checkAnswer, generateSolutionSteps } from '@/lib/circuitCalculations';
import { SupabaseTestService, TestAnswerInput } from '@/lib/supabase-test-service';

interface QuizState {
  currentQuestionIndex: number;
  selectedResistors: (number | null)[];
  activeSlot: number | null;
  selectedResistor: Resistor | null;
  answers: boolean[];
  showResult: boolean;
  showHint: boolean;
  quizCompleted: boolean;
  startTime: number;
  score: number;
}

const PostTestPage = () => {
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
    selectedResistors: [],
    activeSlot: null,
    selectedResistor: null,
    answers: [],
    showResult: false,
    showHint: false,
    quizCompleted: false,
    startTime: Date.now(),
    score: 0
  });

  const currentQuestion = circuitQuestions[quizState.currentQuestionIndex];
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizState.startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.startTime]);

  // Initialize resistor slots when question changes
  useEffect(() => {
    if (currentQuestion) {
      setQuizState(prev => ({
        ...prev,
        selectedResistors: new Array(currentQuestion.resistorSlots).fill(null),
        activeSlot: null,
        selectedResistor: null,
        showResult: false,
        showHint: false
      }));
    }
  }, [quizState.currentQuestionIndex, currentQuestion]);

  const handleSlotClick = (slotIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      activeSlot: slotIndex,
      selectedResistor: null
    }));
  };

  const handleResistorSelect = (resistor: Resistor) => {
    if (quizState.activeSlot !== null) {
      const newSelectedResistors = [...quizState.selectedResistors];
      newSelectedResistors[quizState.activeSlot] = resistor.value;
      
      setQuizState(prev => ({
        ...prev,
        selectedResistors: newSelectedResistors,
        selectedResistor: resistor,
        activeSlot: null
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        selectedResistor: resistor
      }));
    }
  };

  const handleSubmitAnswer = () => {
    const filledSlots = quizState.selectedResistors.filter(r => r !== null);
    
    if (filledSlots.length !== currentQuestion.resistorSlots) {
      alert('Silakan lengkapi semua slot resistor terlebih dahulu!');
      return;
    }

    const resistorValues = quizState.selectedResistors as number[];
    const result = calculateCircuit(currentQuestion.circuitType, currentQuestion.voltage, resistorValues);
    const answerCheck = checkAnswer(result, currentQuestion.targetCurrent, currentQuestion.targetVoltage);

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = answerCheck.isCorrect;

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
    if (quizState.currentQuestionIndex < circuitQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Quiz completed
      const correctAnswers = quizState.answers.filter(Boolean).length;
      const scoreData = calculateQuizScore(correctAnswers, circuitQuestions.length);
      
      // Save test result if user is logged in as student
      if (user && user.role === 'student') {
        const totalTimeSpent = Math.floor((Date.now() - quizState.startTime) / 1000);
        
        // Create test answers array for detailed tracking
        const testAnswers: TestAnswerInput[] = circuitQuestions.map((question, index) => ({
          questionId: question.id,
          selectedAnswer: quizState.answers[index] ? 1 : 0, // 1 for correct, 0 for incorrect
          correctAnswer: 1, // Always 1 for correct in circuit questions
          isCorrect: quizState.answers[index],
          questionText: question.title,
          selectedText: quizState.answers[index] ? 'Benar' : 'Salah',
          correctText: 'Benar',
          explanation: question.explanation || question.hint
        }));

        const percentage = Math.round(scoreData.score);
        const grade = SupabaseTestService.calculateGrade(percentage);

        // Save to Supabase
        SupabaseTestService.saveTestResult({
          studentId: user.id,
          studentName: user.name,
          studentNis: user.nis,
          testType: 'posttest',
          score: correctAnswers,
          totalQuestions: circuitQuestions.length,
          correctAnswers,
          percentage,
          timeSpent: totalTimeSpent,
          answers: testAnswers,
          grade
        }).catch(error => {
          console.error('Error saving posttest result:', error);
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
      selectedResistors: [],
      activeSlot: null,
      selectedResistor: null,
      answers: [],
      showResult: false,
      showHint: false,
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

  const getCurrentResult = () => {
    const filledSlots = quizState.selectedResistors.filter(r => r !== null);
    if (filledSlots.length === currentQuestion.resistorSlots) {
      const resistorValues = quizState.selectedResistors as number[];
      return calculateCircuit(currentQuestion.circuitType, currentQuestion.voltage, resistorValues);
    }
    return null;
  };

  if (quizState.quizCompleted) {
    const correctAnswers = quizState.answers.filter(Boolean).length;
    const scoreData = calculateQuizScore(correctAnswers, circuitQuestions.length);
    
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
                <div className="text-2xl font-bold text-white mb-2">{correctAnswers}/{circuitQuestions.length}</div>
                <div className="text-purple-300">Jawaban Benar</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{formatTime(timeElapsed)}</div>
                <div className="text-purple-300">Waktu Total</div>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold text-white mb-2">{Math.round(timeElapsed / circuitQuestions.length)}s</div>
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
    );
  }

  // Welcome Screen - belum mulai test
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {[...Array(20)].map((_, i) => (
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

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-8">
                <Trophy className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-purple-400 text-sm font-medium">Tes Evaluasi Akhir</span>
                <Sparkles className="w-4 h-4 text-purple-400 ml-2" />
              </div>

              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-600/10 animate-pulse"></div>
                  <span className="text-6xl relative z-10">✅</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
              </div>

              <h1 className="text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Post-Test
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent text-3xl">
                  Tes Evaluasi Akhir
                </span>
              </h1>

              <p className="text-xl text-purple-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
                Uji pemahaman Anda setelah mempelajari materi dan mengikuti praktikum rangkaian listrik. 
                Bandingkan kemajuan Anda dengan hasil pre-test sebelumnya.
              </p>
            </div>

            {/* Info Card */}
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-200 mb-2">Circuit Analysis</h3>
                    <p className="text-purple-300/80 text-sm">Analisis rangkaian interaktif</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold text-pink-200 mb-2">Real Calculation</h3>
                    <p className="text-pink-300/80 text-sm">Perhitungan I, V, R aktual</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-200 mb-2">Progress Tracking</h3>
                    <p className="text-indigo-300/80 text-sm">Monitor kemajuan belajar</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-400/30 mb-8">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">🎯</span>
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
                  Soal {quizState.currentQuestionIndex + 1} dari {circuitQuestions.length}
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
                  style={{ width: `${((quizState.currentQuestionIndex + 1) / circuitQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Question Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-3 ${currentQuestion.difficulty === 'easy' ? 'bg-green-400' : currentQuestion.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <span className="text-white/70 text-sm font-medium uppercase">
                    {currentQuestion.difficulty === 'easy' ? 'Mudah' : currentQuestion.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{currentQuestion.title}</h2>
                <p className="text-blue-200/90 text-lg mb-6">{currentQuestion.description}</p>
                
                {/* Target Info */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30 mb-6">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-cyan-400 mr-2" />
                    <span className="text-cyan-300 font-bold">Target:</span>
                  </div>
                  <div className="text-white">
                    {currentQuestion.targetCurrent && (
                      <div>Arus: <span className="font-bold text-cyan-300">{currentQuestion.targetCurrent}A</span></div>
                    )}
                    {currentQuestion.targetVoltage && (
                      <div>Tegangan: <span className="font-bold text-cyan-300">{currentQuestion.targetVoltage}V</span></div>
                    )}
                    <div>Sumber tegangan: <span className="font-bold text-yellow-300">{currentQuestion.voltage}V</span></div>
                  </div>
                </div>

                {/* Hint Button */}
                <button
                  onClick={() => setQuizState(prev => ({ ...prev, showHint: !prev.showHint }))}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-all"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {quizState.showHint ? 'Sembunyikan Hint' : 'Tampilkan Hint'}
                </button>

                {quizState.showHint && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-400/30">
                    <p className="text-yellow-200">{currentQuestion.hint}</p>
                  </div>
                )}
              </div>

              {/* Resistor Selector */}
              <ResistorSelector
                availableResistors={currentQuestion.availableResistors}
                onResistorSelect={handleResistorSelect}
                selectedResistor={quizState.selectedResistor}
                disabled={quizState.showResult}
              />
            </div>

            {/* Circuit Diagram */}
            <div className="space-y-6">
              <CircuitDiagram
                circuitType={currentQuestion.circuitType}
                voltage={currentQuestion.voltage}
                resistorValues={quizState.selectedResistors}
                resistorSlots={currentQuestion.resistorSlots}
                onSlotClick={handleSlotClick}
                activeSlot={quizState.activeSlot ?? undefined}
                showValues={true}
              />

              {/* Current Results Display */}
              {getCurrentResult() && (
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h4 className="text-white font-bold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Hasil Perhitungan
                  </h4>
                  {(() => {
                    const result = getCurrentResult()!;
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-200/70">Resistansi Total:</span>
                          <span className="text-white font-mono">{result.totalResistance.toFixed(2)}Ω</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200/70">Arus Total:</span>
                          <span className="text-white font-mono">{result.totalCurrent.toFixed(4)}A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200/70">Daya Total:</span>
                          <span className="text-white font-mono">{result.totalPower.toFixed(4)}W</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            {!quizState.showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={quizState.selectedResistors.includes(null)}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Jawaban
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                {quizState.currentQuestionIndex < circuitQuestions.length - 1 ? (
                  <>
                    Soal Berikutnya
                    <SkipForward className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Selesai Post-Test
                    <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result Display */}
          {quizState.showResult && (() => {
            const result = getCurrentResult()!;
            const answerCheck = checkAnswer(result, currentQuestion.targetCurrent, currentQuestion.targetVoltage);
            
            return (
              <div className="mb-8">
                <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-8 border ${
                  answerCheck.isCorrect 
                    ? 'from-green-500/10 to-emerald-500/10 border-green-400/30' 
                    : 'from-red-500/10 to-pink-500/10 border-red-400/30'
                }`}>
                  <div className="flex items-center mb-4">
                    {answerCheck.isCorrect ? (
                      <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-400 mr-3" />
                    )}
                    <h3 className="text-2xl font-bold text-white">
                      {answerCheck.isCorrect ? 'Benar!' : 'Kurang Tepat'}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-white mb-4">{answerCheck.message}</p>
                  <p className="text-blue-200/80 mb-6">{answerCheck.details}</p>
                  
                  {/* Solution Steps */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h4 className="text-white font-bold mb-4">💡 Penjelasan Lengkap:</h4>
                    <div className="space-y-2">
                      {generateSolutionSteps(
                        currentQuestion.circuitType,
                        currentQuestion.voltage,
                        quizState.selectedResistors as number[],
                        result
                      ).map((step, index) => (
                        <div key={index} className="text-blue-200/80 text-sm font-mono">
                          {step}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-cyan-200 text-sm">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
};

export default PostTestPage;
