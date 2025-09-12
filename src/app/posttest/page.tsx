'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Star, Sparkles, ArrowRight, CheckCircle, XCircle, Clock, Target, Award } from 'lucide-react'
import Navbar from '@/components/Navbar'

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
    question: "Pada rangkaian seri, jika salah satu lampu padam maka …",
    options: [
      "Lampu lain tetap menyala",
      "Semua lampu padam",
      "Arus bertambah besar",
      "Tegangan sumber menjadi nol"
    ],
    correct: 1,
    explanation: "Pada rangkaian seri, jika satu lampu padam maka semua lampu padam karena arus terputus."
  },
  {
    id: 2,
    question: "Pada rangkaian paralel, besarnya tegangan pada setiap resistor adalah …",
    options: [
      "Sama dengan tegangan sumber",
      "Lebih kecil pada resistor besar",
      "Lebih besar pada resistor kecil",
      "Jumlahnya sama dengan tegangan sumber"
    ],
    correct: 0,
    explanation: "Pada rangkaian paralel, tegangan pada setiap resistor sama dengan tegangan sumber."
  },
  {
    id: 3,
    question: "Suatu rangkaian seri diberi tegangan 12 V dengan R1 = 4 Ω dan R2 = 2 Ω. Berapakah tegangan pada R1?",
    options: [
      "2 V",
      "4 V",
      "6 V",
      "8 V"
    ],
    correct: 2,
    explanation: "Tegangan pada R1: V1 = I × R1. Rtotal = 4 + 2 = 6Ω, I = 12/6 = 2A, V1 = 2A × 4Ω = 8V."
  },
  {
    id: 4,
    question: "Suatu rangkaian paralel terdiri dari dua resistor, R1 = 10 Ω dan R2 = 20 Ω, dihubungkan dengan baterai 12 V. Berapakah arus yang mengalir melalui R2?",
    options: [
      "0,2 A",
      "0,4 A",
      "0,6 A",
      "1,2 A"
    ],
    correct: 1,
    explanation: "I2 = V/R2 = 12V/20Ω = 0,6A. Jawaban yang benar adalah 0,6A."
  },
  {
    id: 5,
    question: "Instalasi listrik rumah menggunakan rangkaian paralel, tujuannya adalah …",
    options: [
      "Agar arus lebih kecil",
      "Agar lampu lebih redup",
      "Agar setiap alat mendapat tegangan penuh",
      "Agar lebih hemat energi"
    ],
    correct: 2,
    explanation: "Rangkaian paralel memastikan setiap alat mendapat tegangan penuh dari sumber."
  }
]

export default function PostTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(-1)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedAnswer !== -1) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(answers[currentQuestion + 1])
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
    if (percentage >= 90) return { message: "Outstanding! Anda telah menguasai konsep rangkaian listrik dengan sangat baik.", color: "text-green-400", icon: "🏆" }
    if (percentage >= 80) return { message: "Excellent! Pemahaman Anda terhadap rangkaian listrik sudah sangat baik.", color: "text-green-400", icon: "🌟" }
    if (percentage >= 70) return { message: "Good! Anda memiliki pemahaman yang baik tentang rangkaian listrik.", color: "text-blue-400", icon: "👍" }
    if (percentage >= 60) return { message: "Fair. Anda perlu meninjau kembali beberapa konsep rangkaian listrik.", color: "text-yellow-400", icon: "📚" }
    return { message: "Needs Improvement. Silakan pelajari kembali materi rangkaian listrik secara menyeluruh.", color: "text-red-400", icon: "📖" }
  }

  if (showResults) {
    const score = calculateScore()
    const scoreMessage = getScoreMessage(score)
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
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
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full border border-emerald-400/30 backdrop-blur-sm mb-8">
                <Award className="w-4 h-4 text-emerald-400 mr-2" />
                <span className="text-emerald-400 text-sm font-medium">Tes Sumatif Results</span>
                <Sparkles className="w-4 h-4 text-emerald-400 ml-2" />
              </div>

              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-600/10 animate-pulse"></div>
                  <span className="text-6xl relative z-10">{scoreMessage.icon}</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl"></div>
              </div>

              <h1 className="text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Tes Sumatif
                </span>
                <br />
                <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                  Complete!
                </span>
              </h1>
            </div>

            {/* Results Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-600/30 rounded-3xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full mb-8 mx-auto">
                  <Trophy className="w-12 h-12 text-emerald-400" />
                </div>
                
                <h2 className="text-4xl font-bold text-white mb-6">Selamat! Assessment Selesai</h2>
                
                <div className="text-7xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-4">
                  {score}/{questions.length}
                </div>
                
                <div className="text-2xl text-emerald-200 mb-6">
                  Final Score: {percentage}%
                </div>
                
                <p className={`text-lg mb-8 max-w-2xl mx-auto ${scoreMessage.color}`}>
                  {scoreMessage.message}
                </p>

                {/* Achievement Badge */}
                {percentage >= 80 && (
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full border border-yellow-400/30 backdrop-blur-sm mb-8">
                    <Award className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-yellow-400 font-medium">Achievement Unlocked: Circuit Master!</span>
                    <Sparkles className="w-5 h-5 text-yellow-400 ml-2" />
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                  <Link 
                    href="/materials" 
                    className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                  >
                    📚 Review Materi
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link 
                    href="/practicum" 
                    className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                  >
                    🔬 Practice More
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link 
                    href="/quiz" 
                    className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
                  >
                    🎯 Try Quiz
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <details className="text-left max-w-4xl mx-auto">
                  <summary className="cursor-pointer text-emerald-300 hover:text-emerald-100 font-medium mb-6 text-center">
                    📋 Lihat Review Jawaban Lengkap
                  </summary>
                  
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h4 className="font-medium text-white mb-3">
                          {index + 1}. {question.question}
                        </h4>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <span className="text-sm text-emerald-200">Jawaban Anda:</span>
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
                            <span className="text-emerald-200">Jawaban yang benar:</span>
                            <span className="text-green-400 font-medium ml-2">
                              {question.options[question.correct]}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-sm text-emerald-200/80 italic bg-emerald-500/10 p-3 rounded-lg">
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-ping"
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
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full border border-emerald-400/30 backdrop-blur-sm mb-8">
              <Target className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-emerald-400 text-sm font-medium">Tes Sumatif</span>
              <span className="text-emerald-300 text-sm ml-2">
                Pertanyaan {currentQuestion + 1} dari {questions.length}
              </span>
            </div>

            <h1 className="text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent drop-shadow-2xl">
                Tes Sumatif
              </span>
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-emerald-200 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-emerald-900/30 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-600/30 rounded-3xl blur"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {currentQuestion + 1}
                  </div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                  {questions[currentQuestion].question}
                  {/* Show image for question 3 and 4 */}
                  {currentQuestion === 2 && (
                    <img src="/soal/soal3.png" alt="Soal 3" className="mt-4 rounded-lg mx-auto max-w-xs shadow-lg" />
                  )}
                  {currentQuestion === 3 && (
                    <img src="/soal/soal4.png" alt="Soal 4" className="mt-4 rounded-lg mx-auto max-w-xs shadow-lg" />
                  )}
                </h2>
              </div>

              <div className="space-y-4 mb-10">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                      selectedAnswer === index
                        ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-lg shadow-emerald-500/25'
                        : 'border-white/20 hover:border-white/30 text-emerald-100 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all ${
                        selectedAnswer === index
                          ? 'border-emerald-400 bg-emerald-500 text-white'
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
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/25'
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
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full border border-teal-400/30 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-teal-400 mr-2" />
              <span className="text-teal-300 font-medium">
                💡 Jawab semua pertanyaan untuk menyelesaikan Tes Sumatif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
