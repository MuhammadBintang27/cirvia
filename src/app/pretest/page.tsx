'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Star, Sparkles, ArrowRight, CheckCircle, XCircle, Clock, Target } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useStudentAuth } from '@/hooks/useStudentAuth'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "Apa yang dimaksud dengan arus listrik?",
    options: [
      "Aliran elektron melalui penghantar",
      "Beda potensial antara dua titik",
      "Hambatan terhadap aliran listrik",
      "Energi yang digunakan per detik"
    ],
    correct: 0,
    explanation: "Arus listrik adalah aliran muatan listrik (elektron) yang mengalir melalui penghantar."
  },
  {
    id: 2,
    question: "Satuan untuk tegangan listrik adalah?",
    options: ["Ampere", "Ohm", "Volt", "Watt"],
    correct: 2,
    explanation: "Tegangan listrik diukur dalam satuan Volt (V)."
  },
  {
    id: 3,
    question: "Dalam rangkaian seri, bagaimana arus listrik mengalir?",
    options: [
      "Berbeda di setiap komponen",
      "Sama di semua komponen",
      "Terbagi rata",
      "Tidak dapat ditentukan"
    ],
    correct: 1,
    explanation: "Dalam rangkaian seri, arus yang mengalir sama di semua komponen karena hanya ada satu jalur."
  },
  {
    id: 4,
    question: "Rumus hukum Ohm adalah?",
    options: ["P = V × I", "V = I × R", "I = P / V", "R = P / I"],
    correct: 1,
    explanation: "Hukum Ohm menyatakan bahwa V = I × R, dimana V adalah tegangan, I adalah arus, dan R adalah resistansi."
  },
  {
    id: 5,
    question: "Dalam rangkaian seri dengan dua resistor R₁ = 50Ω dan R₂ = 100Ω, resistansi total adalah?",
    options: ["50Ω", "100Ω", "150Ω", "75Ω"],
    correct: 2,
    explanation: "Dalam rangkaian seri, resistansi total = R₁ + R₂ = 50Ω + 100Ω = 150Ω."
  }
]

export default function PretestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(-1)
  const [testStarted, setTestStarted] = useState(false)
  
  const { requireStudentLogin, isLoggedInStudent } = useStudentAuth()

  // Auto-start test jika sudah login sebagai student
  useEffect(() => {
    if (isLoggedInStudent) {
      setTestStarted(true);
    }
  }, [isLoggedInStudent])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const startTest = () => {
    setTestStarted(true)
  }

  const handleNext = () => {
    if (selectedAnswer !== -1) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)
      setSelectedAnswer(-1)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0)
    }, 0)
  }

  const getScoreMessage = (score: number) => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return { message: "Excellent! Anda sudah memahami konsep dasar dengan baik.", color: "text-green-600" }
    if (percentage >= 60) return { message: "Good! Anda memiliki pemahaman yang cukup baik.", color: "text-blue-600" }
    if (percentage >= 40) return { message: "Fair. Anda perlu mempelajari materi lebih lanjut.", color: "text-yellow-600" }
    return { message: "Needs Improvement. Silakan pelajari materi dasar terlebih dahulu.", color: "text-red-600" }
  }

  // Welcome Screen - belum mulai test
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
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

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
                <Trophy className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-400 text-sm font-medium">Tes Diagnostik Awal</span>
                <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
              </div>

              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                  <span className="text-6xl relative z-10">📝</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
              </div>

              <h1 className="text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Pre-Test
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent text-3xl">
                  Tes Diagnostik Awal
                </span>
              </h1>

              <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed mb-8">
                Uji pemahaman awal Anda tentang konsep rangkaian listrik sebelum memulai pembelajaran. 
                Hasil tes ini akan membantu mengukur progress belajar Anda.
              </p>
            </div>

            {/* Info Card */}
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-200 mb-2">5 Soal</h3>
                    <p className="text-blue-300/80 text-sm">Pertanyaan pilihan ganda</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-200 mb-2">~10 Menit</h3>
                    <p className="text-emerald-300/80 text-sm">Waktu perkiraan</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-200 mb-2">Tersimpan</h3>
                    <p className="text-purple-300/80 text-sm">Hasil otomatis disimpan</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-400/30 mb-8">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-amber-400 text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="text-amber-300 font-medium mb-2">Penting untuk diketahui:</h4>
                      <ul className="text-amber-200/80 text-sm space-y-1">
                        <li>• Login diperlukan untuk menyimpan hasil tes Anda</li>
                        <li>• Jawab semua pertanyaan dengan jujur sesuai pemahaman Anda</li>
                        <li>• Tidak ada nilai "salah" - ini untuk mengukur kemajuan belajar</li>
                        <li>• Hasil akan dibandingkan dengan post-test nanti</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => requireStudentLogin('pretest', '/pretest')}
                    className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center mx-auto"
                  >
                    🚀 Mulai Pre-Test
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-blue-300/60 text-sm mt-4">
                    Klik tombol di atas untuk memulai tes diagnostik awal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const scoreMessage = getScoreMessage(score)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
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

        <Navbar />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
                <Trophy className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-400 text-sm font-medium">Tes Diagnostik Results</span>
                <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
              </div>

              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                  <span className="text-6xl relative z-10">📊</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
              </div>

              <h1 className="text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Hasil
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Tes Diagnostik
                </span>
              </h1>
            </div>

            {/* Results Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full mb-8 mx-auto">
                  <Trophy className="w-12 h-12 text-blue-400" />
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-6">Tes Diagnostik Selesai!</h2>
                
                <div className="text-7xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">
                  {score}/{questions.length}
                </div>
                
                <div className="text-2xl text-blue-200 mb-6">
                  Skor: {Math.round((score / questions.length) * 100)}%
                </div>
                
                <p className="text-lg text-blue-200/90 mb-8 max-w-2xl mx-auto">
                  {scoreMessage.message}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                  <Link 
                    href="/materials" 
                    className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                  >
                    📚 Pelajari Materi
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link 
                    href="/practicum" 
                    className="group bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                  >
                    🔬 Mulai Praktikum
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <details className="text-left max-w-4xl mx-auto">
                  <summary className="cursor-pointer text-blue-300 hover:text-blue-100 font-medium mb-6 text-center">
                    📋 Lihat Review Jawaban Lengkap
                  </summary>
                  
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h4 className="font-medium text-white mb-3">
                          {index + 1}. {question.question}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-sm text-blue-200">Jawaban Anda:</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${
                              answers[index] === question.correct ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {answers[index] !== -1 ? question.options[answers[index]] : 'Tidak dijawab'}
                            </span>
                            {answers[index] === question.correct ? 
                              <CheckCircle className="w-5 h-5 text-green-400" /> : 
                              <XCircle className="w-5 h-5 text-red-400" />
                            }
                          </div>
                        </div>
                        
                        {answers[index] !== question.correct && (
                          <div className="text-sm mb-3">
                            <span className="text-blue-200">Jawaban yang benar:</span>
                            <span className="text-green-400 font-medium ml-2">
                              {question.options[question.correct]}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-sm text-blue-200/80 italic bg-blue-500/10 p-3 rounded-lg">
                          💡 {question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
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

      <Navbar />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-8">
              <Trophy className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Tes Diagnostik</span>
              <span className="text-blue-300 text-sm ml-2">
                Pertanyaan {currentQuestion + 1} dari {questions.length}
              </span>
            </div>

            <h1 className="text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Tes Diagnostik
              </span>
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-blue-200 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-900/30 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {currentQuestion + 1}
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-4 mb-10">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                      selectedAnswer === index
                        ? 'border-blue-400 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25'
                        : 'border-white/20 hover:border-white/30 text-blue-100 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-400 bg-blue-500 text-white'
                          : 'border-white/30 text-white/70'
                      }`}>
                        {selectedAnswer === index ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                        )}
                      </div>
                      <span className="font-medium text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                    currentQuestion === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
                  }`}
                >
                  ← Sebelumnya
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswer === -1}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center ${
                    selectedAnswer === -1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25'
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="text-cyan-300 font-medium">
                💡 Pilih salah satu jawaban yang paling tepat untuk setiap pertanyaan
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
