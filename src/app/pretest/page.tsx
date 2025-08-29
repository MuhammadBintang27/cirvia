'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    if (percentage >= 80) return { message: "Excellent! Anda sudah memahami konsep dasar dengan baik.", color: "text-green-600" }
    if (percentage >= 60) return { message: "Good! Anda memiliki pemahaman yang cukup baik.", color: "text-blue-600" }
    if (percentage >= 40) return { message: "Fair. Anda perlu mempelajari materi lebih lanjut.", color: "text-yellow-600" }
    return { message: "Needs Improvement. Silakan pelajari materi dasar terlebih dahulu.", color: "text-red-600" }
  }

  if (showResults) {
    const score = calculateScore()
    const scoreMessage = getScoreMessage(score)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <header className="bg-white shadow-lg border-b-4 border-blue-500">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Kembali ke Beranda
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Hasil Pre-Test</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">📊</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Pre-Test Selesai!</h2>
              
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              
              <div className="text-xl text-gray-600 mb-4">
                Skor: {Math.round((score / questions.length) * 100)}%
              </div>
              
              <p className={`text-lg font-medium mb-8 ${scoreMessage.color}`}>
                {scoreMessage.message}
              </p>

              <div className="space-y-4 mb-8">
                <Link 
                  href="/materials" 
                  className="block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  📚 Pelajari Materi
                </Link>
                
                <Link 
                  href="/practicum" 
                  className="block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  🔬 Mulai Praktikum
                </Link>
              </div>

              <details className="text-left">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4">
                  📋 Lihat Review Jawaban
                </summary>
                
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </h4>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm text-gray-600">Jawaban Anda:</span>
                        <span className={`font-medium ${
                          answers[index] === question.correct ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {answers[index] !== -1 ? question.options[answers[index]] : 'Tidak dijawab'}
                        </span>
                        {answers[index] === question.correct ? '✅' : '❌'}
                      </div>
                      
                      {answers[index] !== question.correct && (
                        <div className="text-sm">
                          <span className="text-gray-600">Jawaban yang benar:</span>
                          <span className="text-green-600 font-medium ml-2">
                            {question.options[question.correct]}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600 mt-2 italic">
                        {question.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Kembali ke Beranda
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Pre-Test</h1>
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
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
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya →'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-gray-600">
            💡 <strong>Petunjuk:</strong> Pilih salah satu jawaban yang paling tepat untuk setiap pertanyaan
          </div>
        </div>
      </div>
    </div>
  )
}
