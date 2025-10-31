'use client'

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  SkipForward,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import ImprovedCircuitDiagram from '@/components/componentSoal/ImprovedCircuitDiagram';
import DragDropResistorSelector from '@/components/componentSoal/DragDropResistorSelector';
import { Resistor, CircuitQuestion } from '@/lib/questions';
import { calculateCircuit, checkAnswer, generateSolutionSteps } from '@/lib/circuitCalculations';

interface TipeSoal1Props {
  question: CircuitQuestion;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  showResult: boolean;
  isLastQuestion: boolean;
  disabled?: boolean;
}

interface QuizState {
  selectedResistors: (number | null)[];
  activeSlot: number | null;
  selectedResistor: Resistor | null;
  showHint: boolean;
}

const TipeSoal1: React.FC<TipeSoal1Props> = ({
  question,
  onAnswerSubmit,
  onNextQuestion,
  showResult,
  isLastQuestion,
  disabled = false
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    selectedResistors: [],
    activeSlot: null,
    selectedResistor: null,
    showHint: false
  });

  // Initialize resistor slots when question changes
  useEffect(() => {
    if (question) {
      console.log('🔍 [DEBUG] TipeSoal1 received question:', {
        id: question.id,
        title: question.title,
        availableResistors: (question as any).availableResistors,
        resistorSlots: question.resistorSlots
      });
      
      setQuizState(prev => ({
        ...prev,
        selectedResistors: new Array(question.resistorSlots).fill(null),
        activeSlot: null,
        selectedResistor: null,
        showHint: false
      }));
    }
  }, [question]);

  const handleSlotClick = (slotIndex: number) => {
    if (disabled || showResult) return;
    
    setQuizState(prev => ({
      ...prev,
      activeSlot: slotIndex,
      selectedResistor: null
    }));
  };

  const handleResistorSelect = (resistor: Resistor) => {
    if (disabled || showResult) return;

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

  const handleSlotDrop = (slotIndex: number, resistor: Resistor) => {
    if (disabled || showResult) return;

    const newSelectedResistors = [...quizState.selectedResistors];
    newSelectedResistors[slotIndex] = resistor.value;
    
    setQuizState(prev => ({
      ...prev,
      selectedResistors: newSelectedResistors,
      selectedResistor: resistor,
      activeSlot: null
    }));
  };

  const handleResistorDrag = (resistor: Resistor) => {
    setQuizState(prev => ({
      ...prev,
      selectedResistor: resistor
    }));
  };

  const handleSubmitAnswer = () => {
    if (disabled || showResult) return;

    const filledSlots = quizState.selectedResistors.filter(r => r !== null);
    
    if (filledSlots.length !== question.resistorSlots) {
      alert('Silakan lengkapi semua slot resistor terlebih dahulu!');
      return;
    }

    const resistorValues = quizState.selectedResistors as number[];
    const result = calculateCircuit(question.circuitType, question.voltage, resistorValues);
    const answerCheck = checkAnswer(result, question.targetCurrent, question.targetVoltage);

    onAnswerSubmit(answerCheck.isCorrect);
  };

  const getCurrentResult = () => {
    const filledSlots = quizState.selectedResistors.filter(r => r !== null);
    if (filledSlots.length === question.resistorSlots) {
      const resistorValues = quizState.selectedResistors as number[];
      return calculateCircuit(question.circuitType, question.voltage, resistorValues);
    }
    return null;
  };

  const getAnswerCheckResult = () => {
    const result = getCurrentResult();
    if (result) {
      return checkAnswer(result, question.targetCurrent, question.targetVoltage);
    }
    return null;
  };

  return (
    <>
      {/* Question Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Question Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            
            
            <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
            <p className="text-blue-200/90 text-lg mb-6">{question.description}</p>
            
    

            {/* Hint Button */}
            <button
              onClick={() => setQuizState(prev => ({ ...prev, showHint: !prev.showHint }))}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-all"
              disabled={disabled}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {quizState.showHint ? 'Sembunyikan Hint' : 'Tampilkan Hint'}
            </button>

            {quizState.showHint && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-400/30">
                <p className="text-yellow-200">{question.hint}</p>
              </div>
            )}
          </div>

          {/* Drag & Drop Resistor Selector */}
          <DragDropResistorSelector
            availableResistors={(question as any).availableResistors || []}
            onResistorDrag={handleResistorDrag}
            disabled={disabled || showResult}
          />
        </div>

        {/* Improved Circuit Diagram */}
        <div className="space-y-6">
          <ImprovedCircuitDiagram
            circuitType={question.circuitType}
            voltage={question.voltage}
            resistorValues={quizState.selectedResistors}
            resistorSlots={question.resistorSlots}
            onSlotClick={handleSlotClick}
            onSlotDrop={handleSlotDrop}
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
        {!showResult ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={disabled || quizState.selectedResistors.includes(null)}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Jawaban
          </button>
        ) : (
          <button
            onClick={onNextQuestion}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
          >
            {isLastQuestion ? (
              <>
                Selesai Post-Test
                <Trophy className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Soal Berikutnya
                <SkipForward className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Result Display */}
      {showResult && (() => {
        const result = getCurrentResult()!;
        const answerCheck = getAnswerCheckResult()!;
        
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
                    question.circuitType,
                    question.voltage,
                    quizState.selectedResistors as number[],
                    result
                  ).map((step, index) => (
                    <div key={index} className="text-blue-200/80 text-sm font-mono">
                      {step}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-cyan-200 text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default TipeSoal1;