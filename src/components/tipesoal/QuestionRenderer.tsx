'use client'

import React from 'react';
import TipeSoal1 from './TipeSoal1';
import TipeSoal2 from './TipeSoal2';
import TipeSoal3 from './TipeSoal3';
import TipeSoal4 from './TipeSoal4';
import { Question } from '@/lib/questions';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (selectedData: number | boolean | string[] | number[] | { [key: string]: string }, isCorrect?: boolean) => void;
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
  // 🛡️ Safety check: Pastikan question object valid
  if (!question) {
    console.error('❌ QuestionRenderer: question is null/undefined');
    return (
      <div className="bg-coral-soft border-2 border-ink rounded-xl p-6 text-center">
        <p className="text-red-600 font-bold text-lg">Error: Soal tidak ditemukan</p>
        <p className="text-red-600 text-sm mt-2">
          Data soal tidak valid atau tidak dapat dimuat dari database.
        </p>
      </div>
    );
  }

  if (!question.questionType) {
    console.error('❌ QuestionRenderer: questionType is missing', question);
    return (
      <div className="bg-coral-soft border-2 border-ink rounded-xl p-6 text-center">
        <p className="text-red-600 font-bold text-lg">Error: Tipe soal tidak diketahui</p>
        <p className="text-red-600 text-sm mt-2">
          Soal ID: {(question as any).id || 'unknown'} - questionType hilang
        </p>
      </div>
    );
  }

  // Render komponen berdasarkan tipe soal
  switch (question.questionType) {
    case 'circuit':
      return (
        <TipeSoal1
          question={question}
          onAnswerSubmit={(selectedResistors, isCorrect) => {
            // selectedResistors is number[] or boolean (for backwards compatibility)
            onAnswer(selectedResistors, isCorrect);
          }}
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
          onAnswerSubmit={(userOrder, isCorrect) => {
            // userOrder is string[] or boolean (for backwards compatibility)
            onAnswer(userOrder, isCorrect);
          }}
          onNextQuestion={onNextQuestion}
          showResult={showResult}
          isLastQuestion={isLastQuestion}
          disabled={disabled}
        />
      );
    
    case 'conceptual':
      return (
        <div className="space-y-6">
          <TipeSoal3
            question={question}
            onAnswer={(selectedChoices, isCorrect) => {
              // ✅ PERBAIKAN: Untuk conceptual questions, kirim array of choice IDs
              // selectedChoices adalah array seperti ['choice-1', 'choice-3']
              // Kita kirim ini langsung ke parent untuk tracking yang proper
              console.log('🔍 [QuestionRenderer-Conceptual] selectedChoices:', selectedChoices, 'isCorrect:', isCorrect);
              
              // ✅ Kirim selectedChoices (array) sebagai parameter pertama
              // Parent harus bisa handle array of strings untuk conceptual questions
              onAnswer(selectedChoices as any, isCorrect);
            }}
          />
          {showResult && (
            <div className="flex justify-center">
              <button
                onClick={onNextQuestion}
                disabled={disabled}
                className="flex items-center px-8 py-4 bg-brand border-2 border-ink text-white rounded-2xl font-bold text-lg hover:bg-brand transition-all transform shadow-hard disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
              </button>
            </div>
          )}
        </div>
      );
    
    case 'circuitAnalysis':
      return (
        <div className="space-y-6">
          <TipeSoal4
            question={question}
            onAnswer={(lampStates, isCorrect) => {
              // lampStates is object or boolean (for backwards compatibility)
              onAnswer(lampStates, isCorrect);
            }}
          />
          {showResult && (
            <div className="flex justify-center">
              <button
                onClick={onNextQuestion}
                disabled={disabled}
                className="flex items-center px-8 py-4 bg-brand border-2 border-ink text-white rounded-2xl font-bold text-lg hover:bg-brand transition-all transform shadow-hard disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
              </button>
            </div>
          )}
        </div>
      );
    

    default:
      return (
        <div className="bg-coral-soft rounded-2xl p-8 border-2 border-ink">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error: Unknown Question Type</h2>
          <p className="text-red-600">
            Question type &quot;{(question as any).questionType}&quot; is not supported.
          </p>
        </div>
      );
  }
};

export default QuestionRenderer;