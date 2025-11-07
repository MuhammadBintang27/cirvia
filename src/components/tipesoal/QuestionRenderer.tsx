'use client'

import React from 'react';
import TipeSoal1 from './TipeSoal1';
import TipeSoal2 from './TipeSoal2';
import TipeSoal3 from './TipeSoal3';
import TipeSoal4 from './TipeSoal4';
import { Question } from '@/lib/questions';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (selectedIndexOrCorrect: number | boolean, isCorrect?: boolean) => void;
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
    
    case 'conceptual':
      return (
        <div className="space-y-6">
          <TipeSoal3
            question={question}
            onAnswer={(selectedChoices, isCorrect) => {
              // ✨ FIX: Convert choice ID to index
              // selectedChoices is array of IDs like ["choice1"]
              // We need to find the index of the first selected choice
              if (Array.isArray(selectedChoices) && selectedChoices.length > 0) {
                const selectedId = selectedChoices[0];
                const selectedIndex = question.choices.findIndex(choice => choice.id === selectedId);
                console.log('🔍 [QuestionRenderer] Converting choice ID to index:', { selectedId, selectedIndex });
                onAnswer(selectedIndex >= 0 ? selectedIndex : 0, isCorrect);
              } else {
                onAnswer(0, isCorrect);
              }
            }}
          />
          {showResult && (
            <div className="flex justify-center">
              <button
                onClick={onNextQuestion}
                disabled={disabled}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            onAnswer={(isCorrect) => {
              onAnswer(isCorrect);
            }}
          />
          {showResult && (
            <div className="flex justify-center">
              <button
                onClick={onNextQuestion}
                disabled={disabled}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLastQuestion ? 'Selesai Test' : 'Soal Berikutnya'}
              </button>
            </div>
          )}
        </div>
      );
    

    default:
      return (
        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-400/30">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error: Unknown Question Type</h2>
          <p className="text-red-200/90">
            Question type &quot;{(question as any).questionType}&quot; is not supported.
          </p>
        </div>
      );
  }
};

export default QuestionRenderer;