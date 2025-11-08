'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, Star, Sparkles, ArrowRight, CheckCircle, Clock, Target, Eye, Ear, Hand } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useStudentAuth } from '@/hooks/useStudentAuth'
import { useAuth } from '@/contexts/AuthContext'
import { SupabaseTestService } from '@/lib/supabase-test-service'
import { learningStyleQuestions, calculateLearningStyle, getLearningStyleDescription, LearningStyleQuestion } from '@/lib/learning-style-questions'
import StudentLoginPrompt from '@/components/StudentLoginPrompt'
import PostTestAIFeedback from '@/components/fiturAi/PostTestAIFeedback'

export default function LearningStyleTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(new Array(learningStyleQuestions.length).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [testStarted, setTestStarted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [results, setResults] = useState<any>(null)
  
  const { requireStudentLogin, isLoggedInStudent } = useStudentAuth()
  const { user } = useAuth()

  // Auto-start test if logged in as student (same as pretest)
  useEffect(() => {
    if (isLoggedInStudent) {
      setTestStarted(true)
      setStartTime(Date.now())
    }
  }, [isLoggedInStudent])

  // Show login prompt if not logged in
  if (!user) {
    return (
      <>
        <Navbar />
        <StudentLoginPrompt 
          title="Tes Gaya Belajar"
          description="Login sebagai siswa untuk mengikuti tes gaya belajar dan mengetahui cara belajar terbaik untuk Anda."
          features={[
            {
              icon: Eye,
              title: "Visual Learner",
              description: "Belajar terbaik melalui gambar, diagram, dan representasi visual",
              color: "blue"
            },
            {
              icon: Ear,
              title: "Auditory Learner", 
              description: "Belajar terbaik melalui mendengar dan diskusi verbal",
              color: "purple"
            },
            {
              icon: Hand,
              title: "Kinesthetic Learner",
              description: "Belajar terbaik melalui praktik langsung dan pengalaman fisik",
              color: "emerald"
            }
          ]}
        />
      </>
    )
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const nextQuestion = () => {
    if (selectedAnswer === '') return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    if (currentQuestion < learningStyleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1] || '')
    } else {
      finishTest(newAnswers)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] || '')
    }
  }

  const finishTest = async (finalAnswers: string[]) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    // Calculate results
    const rawResults = calculateLearningStyle(finalAnswers)
    const description = getLearningStyleDescription(rawResults)
    
    setResults({
      ...rawResults,
      ...description,
      timeSpent
    })

    // Save to database if student is logged in
    if (user && user.role === 'student') {
      await SupabaseTestService.saveLearningStyleResult({
        studentId: user.id,
        studentName: user.name,
        studentNis: user.nis,
        visual: rawResults.visual,
        auditory: rawResults.auditory,
        kinesthetic: rawResults.kinesthetic,
        primaryStyle: description.primary as 'visual' | 'auditory' | 'kinesthetic',
        percentages: description.percentages,
        timeSpent,
        answers: finalAnswers
      })
    }

    setShowResults(true)
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(learningStyleQuestions.length).fill(''))
    setSelectedAnswer('')
    setShowResults(false)
    setResults(null)
    setStartTime(Date.now())
  }

  const progress = ((currentQuestion + 1) / learningStyleQuestions.length) * 100

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-8">
              <Brain className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-400 text-sm font-medium">Tes Gaya Belajar</span>
            </div>

            <h1 className="text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Temukan Gaya Belajar Anda
              </span>
            </h1>

            <p className="text-xl text-purple-100/80 mb-12 leading-relaxed max-w-3xl mx-auto">
              Ikuti tes ini untuk mengetahui apakah Anda lebih cocok belajar secara <strong>Visual</strong>, 
              <strong> Auditory</strong>, atau <strong>Kinesthetic</strong>. Hasil tes akan membantu Anda 
              memoptimalkan cara belajar yang paling efektif.
            </p>

            {/* Learning Style Preview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Visual Learner</h3>
                  <p className="text-blue-200/70 text-sm">
                    Belajar terbaik melalui gambar, diagram, grafik, dan representasi visual lainnya
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ear className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Auditory Learner</h3>
                  <p className="text-purple-200/70 text-sm">
                    Belajar terbaik melalui mendengar, diskusi, penjelasan verbal, dan ceramah
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Hand className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Kinesthetic Learner</h3>
                  <p className="text-emerald-200/70 text-sm">
                    Belajar terbaik melalui praktek langsung, percobaan, dan pengalaman fisik
                  </p>
                </div>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="relative mb-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Instruksi Tes</h2>
                <div className="text-left space-y-4 text-white/90">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-300 text-sm font-bold">1</span>
                    </div>
                    <p>Tes terdiri dari <strong>20 pertanyaan</strong> tentang preferensi belajar Anda</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-300 text-sm font-bold">2</span>
                    </div>
                    <p>Pilih jawaban yang <strong>paling sesuai</strong> dengan diri Anda</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-300 text-sm font-bold">3</span>
                    </div>
                    <p>Jawab dengan <strong>jujur</strong> dan berdasarkan pengalaman sehari-hari</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-300 text-sm font-bold">4</span>
                    </div>
                    <p>Tidak ada jawaban yang benar atau salah</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => requireStudentLogin('learning-style', '/learning-style')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xl font-bold rounded-2xl hover:from-purple-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Brain className="w-6 h-6 mr-3" />
              Mulai Tes Gaya Belajar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showResults && results) {
    const { recommendation } = results
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Navbar />
        
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-8">
                <Brain className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-purple-400 text-sm font-medium">Hasil Tes Gaya Belajar</span>
              </div>

              <h1 className="text-5xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Gaya Belajar Anda
                </span>
              </h1>
            </div>

            {/* Primary Learning Style Result */}
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-indigo-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {results.primary === 'visual' && <Eye className="w-10 h-10 text-blue-400" />}
                  {results.primary === 'auditory' && <Ear className="w-10 h-10 text-purple-400" />}
                  {results.primary === 'kinesthetic' && <Hand className="w-10 h-10 text-emerald-400" />}
                </div>
                
                <h2 className="text-4xl font-black text-white mb-4">{recommendation.title}</h2>
                <p className="text-xl text-purple-100/80 mb-8 leading-relaxed">
                  {recommendation.description}
                </p>

                {/* Percentage Breakdown */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`p-4 rounded-xl border ${
                    results.primary === 'visual' 
                      ? 'bg-blue-500/20 border-blue-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{results.percentages.visual}%</div>
                    <div className="text-blue-200/70 text-sm">Visual</div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    results.primary === 'auditory' 
                      ? 'bg-purple-500/20 border-purple-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <Ear className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{results.percentages.auditory}%</div>
                    <div className="text-purple-200/70 text-sm">Auditory</div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    results.primary === 'kinesthetic' 
                      ? 'bg-emerald-500/20 border-emerald-400/30' 
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <Hand className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{results.percentages.kinesthetic}%</div>
                    <div className="text-emerald-200/70 text-sm">Kinesthetic</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
                    Karakteristik Anda
                  </h3>
                  <ul className="space-y-3">
                    {recommendation.characteristics.map((char: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-blue-100/90">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-emerald-400" />
                    Tips Belajar untuk Anda
                  </h3>
                  <ul className="space-y-3">
                    {recommendation.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-emerald-100/90">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="mb-8">
              <PostTestAIFeedback
                studentId={user.id}
                testType="learning_style"
              />
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartTest}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all"
                >
                  Ulangi Tes
                </button>
                
                <Link
                  href="/test"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  Kembali ke Menu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              <div className="text-purple-200/60 text-sm">
                Waktu penyelesaian: {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full border border-purple-400/30 backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-400 text-sm font-medium">
                Pertanyaan {currentQuestion + 1} dari {learningStyleQuestions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-purple-200/70 text-sm mt-2">{Math.round(progress)}% selesai</p>
            </div>
          </div>

          {/* Question Card */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-indigo-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                {learningStyleQuestions[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {Object.entries(learningStyleQuestions[currentQuestion].options).map(([key, option]) => (
                  <div
                    key={key}
                    className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedAnswer === key
                        ? 'bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                    }`}
                    onClick={() => handleAnswerSelect(key)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === key 
                          ? 'border-purple-400 bg-purple-500' 
                          : 'border-white/40'
                      }`}>
                        {selectedAnswer === key && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium mb-1 ${
                          selectedAnswer === key ? 'text-purple-200' : 'text-white/60'
                        }`}>
                          Opsi {key.toUpperCase()}
                        </div>
                        <div className={`${
                          selectedAnswer === key ? 'text-white' : 'text-white/80'
                        }`}>
                          {option}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                currentQuestion === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              Sebelumnya
            </button>

            <div className="text-center">
              <div className="text-white/60 text-sm">
                {answers.filter(a => a !== '').length} dari {learningStyleQuestions.length} terjawab
              </div>
            </div>

            <button
              onClick={nextQuestion}
              disabled={selectedAnswer === ''}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${
                selectedAnswer === ''
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
              }`}
            >
              {currentQuestion === learningStyleQuestions.length - 1 ? 'Selesai' : 'Selanjutnya'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}