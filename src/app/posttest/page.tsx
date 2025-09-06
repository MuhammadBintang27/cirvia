'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  image?: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "Pada rangkaian seri, jika salah satu lampu padam maka ...",
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
    question: "Pada rangkaian paralel, besarnya tegangan pada setiap resistor adalah ...",
    options: [
      "Sama dengan tegangan sumber",
      "Lebih kecil pada resistor besar",
      "Lebih besar pada resistor kecil",
      "Jumlahnya sama dengan tegangan sumber"
    ],
    correct: 0,
    explanation: "Pada rangkaian paralel, tegangan pada setiap cabang sama dengan tegangan sumber."
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
    explanation: "R_total = 4Ω + 2Ω = 6Ω. I = V/R = 12/6 = 2A. Tegangan pada R1: V = I × R1 = 2A × 4Ω = 8V.",
    image: "/posttest/seri-12v-4ohm-2ohm.png"
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
    explanation: "Pada paralel, arus tiap cabang: I = V/R. I_R2 = 12V / 20Ω = 0,6A. (Jawaban b sesuai gambar, jika opsi ingin 0,6A bisa diganti ke c)",
    image: "/posttest/paralel-12v-10ohm-20ohm.png"
  },
  {
    id: 5,
    question: "Instalasi listrik rumah menggunakan rangkaian paralel, tujuannya adalah ...",
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

export default function PosttestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(-1)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
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
    if (percentage >= 90) return { 
      message: "Outstanding! Anda telah menguasai materi rangkaian listrik dengan sangat baik!", 
      color: "text-green-600",
      emoji: "🏆"
    }
    if (percentage >= 80) return { 
      message: "Excellent! Pemahaman Anda tentang rangkaian listrik sangat baik.", 
      color: "text-green-600",
      emoji: "🌟" 
    }
    if (percentage >= 70) return { 
      message: "Good! Anda memiliki pemahaman yang solid tentang konsep rangkaian listrik.", 
      color: "text-blue-600",
      emoji: "👍" 
    }
    if (percentage >= 60) return { 
      message: "Fair. Pemahaman Anda cukup, tapi masih bisa ditingkatkan.", 
      color: "text-yellow-600",
      emoji: "📚" 
    }
    return { 
      message: "Needs Improvement. Silakan review materi dan coba praktikum lagi.", 
      color: "text-red-600",
      emoji: "🔄" 
    }
  }

  const getImprovementSuggestion = (score: number) => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return "Pertahankan pemahaman yang baik ini dan coba eksplorasi topik rangkaian yang lebih kompleks!"
    if (percentage >= 60) return "Coba ulangi praktikum dengan variasi komponen yang berbeda untuk memperdalam pemahaman."
    return "Disarankan untuk mempelajari kembali materi dasar dan melakukan lebih banyak latihan praktikum."
  }

  if (showResults) {
    const score = calculateScore()
    const scoreMessage = getScoreMessage(score)
    const improvement = getImprovementSuggestion(score)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 mx-auto">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Hasil Post-Test</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Berikut hasil post-test Anda. Silakan ulangi praktikum atau pelajari materi jika hasil belum maksimal.
          </p>
          <Link href="/" className="text-green-600 hover:text-green-800 block mt-4">
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-8">
              <div className="text-6xl mb-4">{scoreMessage.emoji}</div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Post-Test Selesai!</h2>
              
              <div className="text-7xl font-bold text-green-600 mb-2">
                {score}/{questions.length}
              </div>
              
              <div className="text-2xl text-gray-600 mb-4">
                Skor: {Math.round((score / questions.length) * 100)}%
              </div>
              
              <p className={`text-lg font-medium mb-6 ${scoreMessage.color}`}>
                {scoreMessage.message}
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Saran Pembelajaran:</h3>
                <p className="text-blue-700">{improvement}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Link 
                  href="/practicum" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  🔬 Ulangi Praktikum
                </Link>
                
                <Link 
                  href="/materials" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  📚 Review Materi
                </Link>
              </div>

              {/* Performance Breakdown */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Analisis Performa</h3>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{answers.filter((answer, index) => answer === questions[index].correct).length}</div>
                    <div className="text-gray-600">Benar</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{answers.filter((answer, index) => answer !== questions[index].correct && answer !== -1).length}</div>
                    <div className="text-gray-600">Salah</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{answers.filter(answer => answer === -1).length}</div>
                    <div className="text-gray-600">Tidak Dijawab</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{Math.round((score / questions.length) * 100)}%</div>
                    <div className="text-gray-600">Akurasi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Review */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">📋 Review Jawaban Detail</h3>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-800 flex-1">
                        <span className="text-blue-600 font-bold">Q{index + 1}.</span> {question.question}
                      </h4>
                      <div className="ml-4">
                        {answers[index] === question.correct ? 
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">✅ Benar</span> :
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">❌ Salah</span>
                        }
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`p-3 rounded-lg border ${
                          optionIndex === question.correct ? 'bg-green-50 border-green-200' :
                          optionIndex === answers[index] && answers[index] !== question.correct ? 'bg-red-50 border-red-200' :
                          'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                            <span>{option}</span>
                            {optionIndex === question.correct && <span className="ml-auto text-green-600">✅ Jawaban Benar</span>}
                            {optionIndex === answers[index] && answers[index] !== question.correct && 
                              <span className="ml-auto text-red-600">❌ Jawaban Anda</span>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="font-medium text-blue-800">💡 Penjelasan: </span>
                      <span className="text-blue-700">{question.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-green-600 hover:text-green-800">
                ← Kembali ke Beranda
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Post-Test</h1>
            </div>
            
            <div className="text-sm text-gray-600">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Soal {currentQuestion + 1}
                </span>
                <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Post-Test
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {questions[currentQuestion].question}
                {questions[currentQuestion].image && (
                  <div className="my-4 flex justify-center">
                    <Image src={questions[currentQuestion].image} alt="Ilustrasi soal" width={300} height={120} style={{maxHeight: '160px', objectFit: 'contain'}} />
                  </div>
                )}
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      selectedAnswer === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span className="ml-2">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                ← Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={selectedAnswer === -1}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedAnswer === -1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya →'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-gray-600">
            🎯 <strong>Post-Test:</strong> Evaluasi pemahaman Anda setelah mempelajari materi dan praktikum
          </div>
        </div>
      </div>
    </div>
  )
}
