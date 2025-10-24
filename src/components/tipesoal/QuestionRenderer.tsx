'use client'

import React from 'react';
import TipeSoal1 from './TipeSoal1';
import TipeSoal2 from './TipeSoal2';
// Import komponen tipe soal lain ketika sudah dibuat
// import TipeSoal3 from './TipeSoal3';  
// import TipeSoal4 from './TipeSoal4';
import { Question } from '@/lib/questions';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  showResult: boolean;
  isLastQuestion: boolean;
  disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  onNextQuestion,
  showResult,
  isLastQuestion,
  disabled = false
}) => {
  // Render komponen berdasarkan tipe soal
  switch (question.questionType) {
    case 'circuit':
      return (
        <TipeSoal1
          question={question}
          onAnswerSubmit={onAnswer}
          onNextQuestion={onNextQuestion}
          showResult={showResult}
          isLastQuestion={isLastQuestion}
          disabled={disabled}
        />
      );
    
    case 'circuitOrdering':
      return (
        <TipeSoal2
          question={question}
          onAnswerSubmit={onAnswer}
          onNextQuestion={onNextQuestion}
          showResult={showResult}
          isLastQuestion={isLastQuestion}
          disabled={disabled}
        />
      );
    
    case 'multipleChoice':
      // TODO: Buat TipeSoal3 untuk multiple choice
      return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
          <p className="text-blue-200/90 text-lg mb-6">{question.description}</p>
          <p className="text-yellow-300 text-lg">🚧 TipeSoal3 (Multiple Choice) belum tersedia</p>
          <p className="text-white/70 mt-2">Question: {question.question}</p>
          <div className="mt-4">
            {question.options.map(option => (
              <div key={option.id} className="text-white/60 mb-2">
                {option.id.toUpperCase()}. {option.text}
              </div>
            ))}
          </div>
          {showResult && (
            <button
              onClick={onNextQuestion}
              className="mt-6 flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
            </button>
          )}
        </div>
      );
      
    case 'trueFalse':
      // TODO: Buat TipeSoal3 untuk true/false
      return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
          <p className="text-blue-200/90 text-lg mb-6">{question.description}</p>
          <p className="text-yellow-300 text-lg">🚧 TipeSoal3 (True/False) belum tersedia</p>
          <p className="text-white/70 mt-2">Statement: {question.statement}</p>
          <p className="text-white/60 mt-2">Correct Answer: {question.correctAnswer ? 'True' : 'False'}</p>
          {showResult && (
            <button
              onClick={onNextQuestion}
              className="mt-6 flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
            </button>
          )}
        </div>
      );
      
    case 'fillBlank':
      // TODO: Buat TipeSoal4 untuk fill in the blank
      return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
          <p className="text-blue-200/90 text-lg mb-6">{question.description}</p>
          <p className="text-yellow-300 text-lg">🚧 TipeSoal4 (Fill in the Blank) belum tersedia</p>
          <p className="text-white/70 mt-2">Question: {question.questionText}</p>
          <div className="mt-4">
            {question.blanks.map(blank => (
              <div key={blank.id} className="text-white/60 mb-2">
                Blank {blank.id}: {blank.correctAnswer} {blank.unit || ''}
              </div>
            ))}
          </div>
          {showResult && (
            <button
              onClick={onNextQuestion}
              className="mt-6 flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
            >
              {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
            </button>
          )}
        </div>
      );
      
    default:
      return (
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-400/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error: Unknown Question Type</h2>
          <p className="text-red-200/90">
            Question type "{(question as any).questionType}" is not supported.
          </p>
        </div>
      );
  }
};

export default QuestionRenderer;