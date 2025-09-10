'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Apa satuan dari tegangan listrik?",
    options: ["Ampere", "Volt", "Ohm", "Watt"],
    correct: 1,
    explanation: "Volt adalah satuan untuk tegangan listrik (V)"
  },
  {
    id: 2,
    question: "Hukum Ohm menyatakan bahwa V = I × R. Apa arti dari I?",
    options: ["Intensitas", "Arus listrik", "Impedansi", "Induktansi"],
    correct: 1,
    explanation: "I adalah simbol untuk arus listrik (Current) dalam satuan Ampere"
  },
  {
    id: 3,
    question: "Jika tegangan 12V dan hambatan 4Ω, berapa arus yang mengalir?",
    options: ["2A", "3A", "4A", "6A"],
    correct: 1,
    explanation: "I = V / R = 12V / 4Ω = 3A"
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer]
      setAnswers(newAnswers)
      
      if (selectedAnswer === quizQuestions[currentQuestion].correct) {
        setScore(score + 1)
      }

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">
              {score >= quizQuestions.length * 0.8 ? '🎉' : score >= quizQuestions.length * 0.6 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Selesai!</h2>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {score}/{quizQuestions.length}
            </div>
            <p className="text-gray-600 mb-8">
              Kamu berhasil menjawab {score} dari {quizQuestions.length} pertanyaan dengan benar!
            </p>
            
            <div className="space-y-4 mb-8">
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="text-left bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                      answers[index] === question.correct ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {answers[index] === question.correct ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                      <p className="text-sm text-gray-600">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              🔄 Ulangi Quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Skor: {score}/{currentQuestion}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {quizQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-blue-300 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className={`font-bold py-3 px-8 rounded-lg transition-colors ${
                  selectedAnswer !== null
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Selesai' : 'Selanjutnya'} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}