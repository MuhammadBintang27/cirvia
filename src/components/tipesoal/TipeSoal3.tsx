'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { CheckCircle, RotateCcw, Target, X, Check, Lightbulb } from 'lucide-react';
import { ConceptualQuestion } from '@/lib/questions';

interface TipeSoal3Props {
  question: ConceptualQuestion;
  onAnswer: (selectedChoices: string[], isCorrect: boolean) => void;
}

interface TipeSoal3State {
  availableChoices: ConceptualQuestion['choices'];
  selectedAnswers: ConceptualQuestion['choices'];
  showResult: boolean;
  isCorrect: boolean;
  showHint: boolean;
}

const TipeSoal3: React.FC<TipeSoal3Props> = ({ question, onAnswer }) => {
  const [state, setState] = useState<TipeSoal3State>({
    availableChoices: [...question.choices],
    selectedAnswers: [],
    showResult: false,
    isCorrect: false,
    showHint: false
  });

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || state.showResult) return;

    const { source, destination } = result;

    setState(prevState => {
      // Create deep copies of arrays to avoid mutation
      const newAvailableChoices = [...prevState.availableChoices];
      const newSelectedAnswers = [...prevState.selectedAnswers];

      if (source.droppableId === 'choices' && destination.droppableId === 'answers') {
        // Move from choices to answers
        const [removed] = newAvailableChoices.splice(source.index, 1);
        newSelectedAnswers.splice(destination.index, 0, removed);
      } else if (source.droppableId === 'answers' && destination.droppableId === 'choices') {
        // Move from answers back to choices
        const [removed] = newSelectedAnswers.splice(source.index, 1);
        newAvailableChoices.splice(destination.index, 0, removed);
      } else if (source.droppableId === 'answers' && destination.droppableId === 'answers') {
        // Reorder within answers
        const [removed] = newSelectedAnswers.splice(source.index, 1);
        newSelectedAnswers.splice(destination.index, 0, removed);
      } else if (source.droppableId === 'choices' && destination.droppableId === 'choices') {
        // Reorder within choices
        const [removed] = newAvailableChoices.splice(source.index, 1);
        newAvailableChoices.splice(destination.index, 0, removed);
      }

      return {
        ...prevState,
        availableChoices: newAvailableChoices,
        selectedAnswers: newSelectedAnswers
      };
    });
  }, [state.showResult]);

  const handleSubmit = useCallback(() => {
    const selectedIds = state.selectedAnswers.map(answer => answer.id);
    
    // ✅ VALIDASI KETAT: Tidak boleh kosong dan harus exact match dengan correctAnswers
    const isCorrect = 
      selectedIds.length > 0 && // WAJIB: Minimal harus pilih 1 jawaban
      selectedIds.length === question.correctAnswers.length && // Jumlah harus sama
      selectedIds.every(id => question.correctAnswers.includes(id)) && // ✅ Semua pilihan harus benar
      question.correctAnswers.every(id => selectedIds.includes(id)); // ✅ Semua jawaban benar harus dipilih

    console.log('🔍 [TipeSoal3] Validation:', {
      selectedIds,
      correctAnswers: question.correctAnswers,
      selectedCount: selectedIds.length,
      correctCount: question.correctAnswers.length,
      allSelectedAreCorrect: selectedIds.every(id => question.correctAnswers.includes(id)),
      allCorrectAreSelected: question.correctAnswers.every(id => selectedIds.includes(id)),
      finalIsCorrect: isCorrect
    });

    setState(prevState => ({
      ...prevState,
      showResult: true,
      isCorrect
    }));

    // ✅ Kirim selectedIds (array of choice IDs) dan isCorrect boolean
    // QuestionRenderer akan convert ke format yang sesuai
    onAnswer(selectedIds, isCorrect);
  }, [state.selectedAnswers, question.correctAnswers, onAnswer]);

  const handleReset = useCallback(() => {
    setState({
      availableChoices: [...question.choices],
      selectedAnswers: [],
      showResult: false,
      isCorrect: false,
      showHint: false
    });
  }, [question.choices]);

  const canSubmit = state.selectedAnswers.length > 0 && !state.showResult;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Question Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-ink mb-2">
          Soal Konseptual
        </h2>
        <div className="bg-brand-soft rounded-2xl p-6 border-2 border-ink">
          <h3 className="text-xl font-semibold text-ink mb-4">
            {question.question}
          </h3>
          {question.description && (
            <p className="text-muted text-sm mb-4">
              {question.description}
            </p>
          )}

          {/* Hint Button */}
          <button
            onClick={() => setState(prev => ({ ...prev, showHint: !prev.showHint }))}
            className="flex items-center px-4 py-2 bg-lamp-soft rounded-xl border-2 border-ink text-amber-700 hover:bg-lamp-soft transition-all"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {state.showHint ? 'Sembunyikan Hint' : 'Tampilkan Hint'}
          </button>

          {state.showHint && question.hint && (
            <div className="mt-4 p-4 bg-lamp-soft rounded-xl border-2 border-ink">
              <p className="text-amber-700">{question.hint}</p>
            </div>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Available Choices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink flex items-center">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  ?
                </div>
                Pilihan Jawaban
              </h3>
            </div>

            <Droppable droppableId="choices" direction="vertical">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 p-4 rounded-xl border-2 border-dashed transition-colors min-h-[400px] ${
                    snapshot.isDraggingOver
                      ? 'border-ink bg-brand-soft'
                      : 'border-ink bg-paper'
                  }`}
                >
                  {state.availableChoices.map((choice, index) => (
                    <Draggable
                      key={choice.id}
                      draggableId={choice.id}
                      index={index}
                      isDragDisabled={state.showResult}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-paper rounded-lg p-4 border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'scale-105 shadow-hard border-ink bg-brand-soft'
                              : state.showResult && choice.isCorrect
                              ? 'border-ink bg-mint-soft'
                              : state.showResult && !choice.isCorrect && state.selectedAnswers.some(sa => sa.id === choice.id)
                              ? 'border-ink bg-coral-soft'
                              : 'border-ink hover:border-ink hover:bg-brand-soft'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-ink font-medium flex-1">
                              {choice.text}
                            </p>
                            {state.showResult && (
                              <div className="ml-3">
                                {choice.isCorrect ? (
                                  <Check className="w-5 h-5 text-emerald-700" />
                                ) : (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!state.showResult && (
                            <div className="mt-2 flex space-x-1 opacity-60">
                              <div className="w-1 h-1 bg-paper rounded-full"></div>
                              <div className="w-1 h-1 bg-paper rounded-full"></div>
                              <div className="w-1 h-1 bg-paper rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {state.availableChoices.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-muted">
                      <p>Semua pilihan telah dipindahkan</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>

          {/* Right Panel - Answer Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink flex items-center">
                <Target className="w-5 h-5 mr-2 text-emerald-700" />
                Jawaban yang Benar
              </h3>
              
              {state.selectedAnswers.length > 0 && !state.showResult && (
                <button
                  onClick={handleReset}
                  className="flex items-center px-3 py-1 bg-coral-soft hover:bg-coral-soft rounded-lg border-2 border-ink text-red-600 text-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              )}
            </div>

            <Droppable droppableId="answers" direction="vertical">
              {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 p-4 rounded-xl border-2 border-dashed transition-colors min-h-[400px] ${
                    snapshot.isDraggingOver
                      ? 'border-ink bg-mint-soft'
                      : state.showResult && state.isCorrect
                      ? 'border-ink bg-mint-soft'
                      : state.showResult && !state.isCorrect
                      ? 'border-ink bg-coral-soft'
                      : 'border-ink bg-paper'
                  }`}
                >
                  {state.selectedAnswers.map((answer, index) => (
                    <Draggable
                      key={answer.id}
                      draggableId={answer.id}
                      index={index}
                      isDragDisabled={state.showResult}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`rounded-lg p-4 border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'scale-105 shadow-hard border-ink bg-mint-soft'
                              : state.showResult && answer.isCorrect
                              ? 'border-ink bg-mint-soft bg-mint-soft'
                              : state.showResult && !answer.isCorrect
                              ? 'border-ink bg-coral-soft bg-coral-soft'
                              : 'border-ink bg-mint-soft bg-mint-soft hover:border-ink'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-ink font-medium flex-1">
                              {answer.text}
                            </p>
                            {state.showResult && (
                              <div className="ml-3">
                                {answer.isCorrect ? (
                                  <Check className="w-5 h-5 text-emerald-700" />
                                ) : (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {state.selectedAnswers.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted">
                      <Target className="w-8 h-8 mb-2" />
                      <p>Seret pilihan jawaban yang benar ke sini</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Submit Button */}
      {!state.showResult && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center px-8 py-4 bg-purple-500 border-2 border-ink text-white rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all transform shadow-hard disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Submit Jawaban
          </button>
        </div>
      )}

      {/* Result Display */}
      {state.showResult && (
        <div className="space-y-6">
          {/* Result Status */}
          <div className={`rounded-2xl p-8 border ${
            state.isCorrect 
              ? 'bg-mint-soft border-ink' 
              : 'bg-coral-soft border-ink'
          }`}>
            <div className="flex items-center justify-center mb-6">
              {state.isCorrect ? (
                <div className="flex items-center text-emerald-700">
                  <CheckCircle className="w-8 h-8 mr-3" />
                  <span className="text-2xl font-bold">Benar!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="w-8 h-8 mr-3" />
                  <span className="text-2xl font-bold">Kurang Tepat</span>
                </div>
              )}
            </div>

            {/* Correct Answers Display */}
            <div className="bg-paper rounded-lg p-4 mb-4">
              <h4 className="text-ink font-semibold mb-3">Jawaban yang Benar:</h4>
              <div className="space-y-2">
                {question.choices
                  .filter(choice => choice.isCorrect)
                  .map((correctChoice, index) => (
                    <div key={correctChoice.id} className="flex items-center text-emerald-700">
                      <Check className="w-4 h-4 mr-2" />
                      <span>{correctChoice.text}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="bg-brand-soft rounded-lg p-4 border-2 border-ink">
                <h4 className="text-brand font-semibold mb-2">Penjelasan:</h4>
                <p className="text-ink">{question.explanation}</p>
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default TipeSoal3;