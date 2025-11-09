'use client'

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  SkipForward,
  Trophy,
  Target,
  Zap,
  RotateCcw
} from 'lucide-react';
import UnifiedCircuitCard, { CircuitConfiguration } from '@/components/componentSoal/UnifiedCircuitCard';
import DropSlot from '@/components/componentSoal/DropSlot';
import { CircuitOrderingQuestion } from '@/lib/questions';

interface TipeSoal2Props {
  question: CircuitOrderingQuestion;
  onAnswerSubmit: (userOrder: string[] | boolean, isCorrect?: boolean) => void;
  onNextQuestion: () => void;
  showResult: boolean;
  isLastQuestion: boolean;
  disabled?: boolean;
}

interface DragDropState {
  draggedCircuit: string | null;
  dragOverSlot: number | null;
  slotAssignments: (string | null)[]; // Dynamic array based on circuits count
  showHint: boolean;
}

const TipeSoal2: React.FC<TipeSoal2Props> = ({
  question,
  onAnswerSubmit,
  onNextQuestion,
  showResult,
  isLastQuestion,
  disabled = false
}) => {
  const [state, setState] = useState<DragDropState>({
    draggedCircuit: null,
    dragOverSlot: null,
    slotAssignments: [], // Will be initialized after circuits are determined
    showHint: false
  });

  // Convert circuit format to UnifiedCircuitCard format
  const convertLegacyCircuit = (circuit: any): CircuitConfiguration => {
    // If it's already a CircuitConfiguration, return as-is
    if (circuit.template && circuit.battery && circuit.resistors && circuit.lamps) {
      return circuit as CircuitConfiguration;
    }
    
    // Handle new array-based format
    if (circuit.template && circuit.voltage && circuit.resistors && circuit.lamps) {
      return {
        id: circuit.id,
        name: circuit.name,
        template: circuit.template,
        battery: {
          type: 'battery',
          voltage: circuit.voltage
        },
        resistors: circuit.resistors.map((r: any) => ({
          type: 'resistor',
          id: r.id,
          value: r.value,
          color: r.color || 'blue'
        })),
        lamps: circuit.lamps.map((l: any) => ({
          type: 'lamp',
          id: l.id,
          power: l.power,
          voltage: circuit.voltage
        })),
        description: circuit.description || circuit.name,
        brightnessLevel: circuit.brightnessLevel
      };
    }
    
    // Convert old legacy format to new format (fallback)
    return {
      id: circuit.id,
      name: circuit.name,
      template: circuit.circuitType || 'simple',
      battery: {
        type: 'battery',
        voltage: circuit.sourceVoltage || circuit.resistorValue ? 12 : circuit.voltage || 12
      },
      resistors: [{
        type: 'resistor',
        id: 'R1',
        value: circuit.resistorValue || 100,
        color: 'blue'
      }],
      lamps: [{
        type: 'lamp',
        id: 'L1',
        power: circuit.totalPower || 12,
        voltage: circuit.sourceVoltage || circuit.voltage || 12
      }],
      description: circuit.description || circuit.name,
      brightnessLevel: circuit.brightnessLevel
    };
  };

  // Get current circuits (static only, no generator)
  const currentCircuits = question.circuits.map(convertLegacyCircuit);
  const currentCorrectOrder = question.correctOrder;
  const currentExplanation = question.explanation;

  // Debug log
  console.log('TipeSoal2 Debug:', {
    questionId: question.id,
    questionCircuits: question.circuits,
    currentCircuits: currentCircuits,
    slotAssignments: state.slotAssignments
  });

  // Initialize slot assignments when circuits are available
  useEffect(() => {
    if (currentCircuits.length > 0 && state.slotAssignments.length !== currentCircuits.length) {
      setState(prev => ({
        ...prev,
        slotAssignments: new Array(currentCircuits.length).fill(null)
      }));
    }
  }, [currentCircuits.length, state.slotAssignments.length]);

  // Reset state when question changes
  useEffect(() => {
    const circuitsCount = currentCircuits.length;
    if (circuitsCount > 0) {
      setState({
        draggedCircuit: null,
        dragOverSlot: null,
        slotAssignments: new Array(circuitsCount).fill(null),
        showHint: false
      });
    }
  }, [question.id, currentCircuits.length]);

  // Get circuits that are not assigned to any slot
  const getAvailableCircuits = () => {
    return currentCircuits.filter(circuit => 
      !state.slotAssignments.includes(circuit.id)
    );
  };

  // Get circuit data by ID
  const getCircuitById = (id: string | null) => {
    if (!id) return null;
    return currentCircuits.find(circuit => circuit.id === id) || null;
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, circuitId: string) => {
    setState(prev => ({ ...prev, draggedCircuit: circuitId }));
    e.dataTransfer.setData('text/plain', circuitId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over slot
  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragOverSlot: slotIndex }));
  };

  // Handle drag leave slot
  const handleDragLeave = () => {
    setState(prev => ({ ...prev, dragOverSlot: null }));
  };

  // Handle drop on slot
  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const droppedCircuitId = e.dataTransfer.getData('text/plain');
    
    console.log('Drop Debug:', {
      droppedCircuitId,
      targetSlotIndex: slotIndex,
      currentSlotAssignments: state.slotAssignments
    });
    
    if (!droppedCircuitId) return;

    setState(prev => {
      const newAssignments = [...prev.slotAssignments];
      
      // Remove circuit from its current slot if it's already assigned
      const currentSlotIndex = newAssignments.indexOf(droppedCircuitId);
      console.log('Current slot index of dragged circuit:', currentSlotIndex);
      
      if (currentSlotIndex !== -1) {
        newAssignments[currentSlotIndex] = null;
      }
      
      // If target slot is occupied, we need to decide what to do
      const targetCircuit = newAssignments[slotIndex];
      console.log('Target slot occupied by:', targetCircuit);
      
      if (targetCircuit && currentSlotIndex !== -1) {
        // Swap: move target circuit to the slot where dragged circuit was
        newAssignments[currentSlotIndex] = targetCircuit;
        console.log('Swapping circuits');
      }
      // If target slot is occupied and dragged circuit wasn't in any slot,
      // the occupied circuit will be displaced (goes back to available)
      
      // Assign dragged circuit to target slot
      newAssignments[slotIndex] = droppedCircuitId;
      
      console.log('Final assignments:', newAssignments);

      return {
        ...prev,
        slotAssignments: newAssignments,
        draggedCircuit: null,
        dragOverSlot: null
      };
    });
  };

  // Handle remove circuit from slot
  const handleRemoveFromSlot = (slotIndex: number) => {
    setState(prev => {
      const newAssignments = [...prev.slotAssignments];
      newAssignments[slotIndex] = null;
      return { ...prev, slotAssignments: newAssignments };
    });
  };

  // Handle submit answer
  const handleSubmitAnswer = () => {
    const userOrder = state.slotAssignments.filter(id => id !== null) as string[];
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentCorrectOrder);
    // Send actual user order, not just boolean
    onAnswerSubmit(userOrder, isCorrect);
  };

  // Check if answer can be submitted
  const canSubmit = () => {
    const totalCircuits = currentCircuits.length;
    const filledSlots = state.slotAssignments.filter(slot => slot !== null).length;
    return filledSlots === totalCircuits && !showResult && !disabled;
  };

  // Get result info
  const getResultInfo = () => {
    const userOrder = state.slotAssignments.filter(id => id !== null) as string[];
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentCorrectOrder);
    return { isCorrect, userOrder };
  };

  // Reset ordering
  const handleReset = () => {
    const circuitsCount = currentCircuits.length;
    setState(prev => ({
      ...prev,
      slotAssignments: new Array(circuitsCount).fill(null)
    }));
  };

  // Keyboard support
  const handleCircuitKeyDown = (e: React.KeyboardEvent, circuitId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Find first empty slot
      const emptySlotIndex = state.slotAssignments.findIndex(slot => slot === null);
      if (emptySlotIndex !== -1) {
        handleDrop({
          dataTransfer: { getData: () => circuitId }
        } as any, emptySlotIndex);
      }
    }
  };

  const handleSlotKeyDown = (e: React.KeyboardEvent, slotIndex: number) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && state.slotAssignments[slotIndex]) {
      e.preventDefault();
      handleRemoveFromSlot(slotIndex);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question Info */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            question.difficulty === 'easy' ? 'bg-green-400' : 
            question.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className="text-white/70 text-sm font-medium uppercase">
            {question.difficulty === 'easy' ? 'Mudah' : 
             question.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">{question.title}</h2>
        <p className="text-blue-200/90 text-lg mb-4">{question.description}</p>
        
        
        {/* Question Text */}
        {question.question && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 mb-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
                <span className="text-lg">❓</span>
              </div>
              <div className="flex-1">
                <p className="text-blue-200/90 font-medium text-sm mb-1">Pertanyaan:</p>
                <p className="text-blue-100 leading-relaxed">
                  {question.question}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instruction */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30 mb-6">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-cyan-400 mr-2" />
            <span className="text-cyan-300 font-bold">Instruksi:</span>
          </div>
          <div className="text-white font-semibold">
            {question.instruction}
          </div>
        </div>

        {/* Hint Button */}
        <button
          onClick={() => setState(prev => ({ ...prev, showHint: !prev.showHint }))}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-all"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {state.showHint ? 'Sembunyikan Hint' : 'Tampilkan Hint'}
        </button>

        {state.showHint && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-400/30">
            <p className="text-yellow-200">{question.hint}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      {currentCircuits.length > 0 ? (
        <div className="grid grid-cols-3 gap-8 min-h-[600px]">
          {/* Left Panel - Circuit Display (2/3 width) */}
          <div className="col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-cyan-400" />
              Rangkaian Tersedia
            </h3>
            
            <div className="space-y-6">
              {getAvailableCircuits().map((circuit) => (
                <UnifiedCircuitCard
                  key={circuit.id}
                  circuit={circuit}
                  isDragging={state.draggedCircuit === circuit.id}
                  showBrightness={showResult}
                  onDragStart={handleDragStart}
                  onKeyDown={handleCircuitKeyDown}
                  className="full-size transform-gpu"
                />
              ))}
            </div>
          </div>

          {/* Right Panel - Drop Slots (1/3 width) */}
          <div className="col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-400" />
                Urutan
              </h3>
              
              {state.slotAssignments.some(slot => slot !== null) && !showResult && (
                <button
                  onClick={handleReset}
                  className="flex items-center px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 text-red-300 text-xs transition-all"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {currentCircuits.length > 0 && state.slotAssignments.length === currentCircuits.length && 
               state.slotAssignments.map((assignedCircuitId, slotIndex) => {
                const assignedCircuit = getCircuitById(assignedCircuitId);
                
                return (
                  <DropSlot
                    key={slotIndex}
                    slotNumber={slotIndex + 1}
                    circuitId={assignedCircuitId}
                    isDragOver={state.dragOverSlot === slotIndex}
                    onDrop={handleDrop}
                    onDragOver={(e) => handleDragOver(e, slotIndex)}
                    onDragLeave={handleDragLeave}
                    onRemove={handleRemoveFromSlot}
                    onKeyDown={handleSlotKeyDown}
                    className="min-h-[80px]"
                  >
                    {assignedCircuit && (
                      <div className="w-full">
                        <UnifiedCircuitCard
                          circuit={assignedCircuit}
                          showBrightness={showResult}
                          onDragStart={handleDragStart}
                          onKeyDown={handleCircuitKeyDown}
                          className="compact-mode scale-75 transform-gpu"
                        />
                      </div>
                    )}
                  </DropSlot>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Memuat rangkaian...</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!showResult && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmitAnswer}
            disabled={!canSubmit()}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Jawaban
          </button>
        </div>
      )}

      {/* Result Display */}
      {showResult && (() => {
        const result = getResultInfo();
        
        return (
          <div className="space-y-6">
            {/* Result Status */}
            <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-8 border ${
              result.isCorrect 
                ? 'from-green-500/10 to-emerald-500/10 border-green-400/30' 
                : 'from-red-500/10 to-pink-500/10 border-red-400/30'
            }`}>
              <div className="flex items-center mb-4">
                {result.isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 mr-3" />
                )}
                <h3 className="text-2xl font-bold text-white">
                  {result.isCorrect ? 'Benar!' : 'Kurang Tepat'}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white mb-2">
                    <strong>Jawaban Anda:</strong> {result.userOrder.join(' → ')}
                  </p>
                  <p className="text-white mb-4">
                    <strong>Jawaban Benar:</strong> {currentCorrectOrder.join(' → ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-white font-bold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                💡 Penjelasan Lengkap:
              </h4>
              <p className="text-blue-200/80 leading-relaxed whitespace-pre-line">
                {currentExplanation}
              </p>
            </div>

            {/* Navigation Button */}
            <div className="flex justify-center">
              <button
                onClick={onNextQuestion}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                {isLastQuestion ? (
                  <>
                    Selesai
                    <Trophy className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Soal Berikutnya
                    <SkipForward className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default TipeSoal2;