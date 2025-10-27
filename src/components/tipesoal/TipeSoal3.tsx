'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { CheckCircle, RotateCcw, Target, X, Check } from 'lucide-react';
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
}

const TipeSoal3: React.FC<TipeSoal3Props> = ({ question, onAnswer }) => {
  const [state, setState] = useState<TipeSoal3State>({
    availableChoices: [...question.choices],
    selectedAnswers: [],
    showResult: false,
    isCorrect: false
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
    const isCorrect = selectedIds.length === question.correctAnswers.length &&
                     selectedIds.every(id => question.correctAnswers.includes(id));

    setState(prevState => ({
      ...prevState,
      showResult: true,
      isCorrect
    }));

    onAnswer(selectedIds, isCorrect);
  }, [state.selectedAnswers, question.correctAnswers, onAnswer]);

  const handleReset = useCallback(() => {
    setState({
      availableChoices: [...question.choices],
      selectedAnswers: [],
      showResult: false,
      isCorrect: false
    });
  }, [question.choices]);

  const canSubmit = state.selectedAnswers.length > 0 && !state.showResult;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Question Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white mb-2">
          Soal Konseptual
        </h2>
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
          <h3 className="text-xl font-semibold text-white mb-4">
            {question.question}
          </h3>
          {question.description && (
            <p className="text-blue-200/80 text-sm">
              {question.description}
            </p>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Available Choices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
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
                      ? 'border-blue-400 bg-blue-500/10'
                      : 'border-white/20 bg-white/5'
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
                          className={`bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-lg p-4 border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'scale-105 shadow-2xl border-blue-400/50 bg-blue-500/20'
                              : state.showResult && choice.isCorrect
                              ? 'border-green-400/60 bg-green-500/20'
                              : state.showResult && !choice.isCorrect && state.selectedAnswers.some(sa => sa.id === choice.id)
                              ? 'border-red-400/60 bg-red-500/20'
                              : 'border-white/20 hover:border-blue-400/40 hover:bg-blue-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium flex-1">
                              {choice.text}
                            </p>
                            {state.showResult && (
                              <div className="ml-3">
                                {choice.isCorrect ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <X className="w-5 h-5 text-red-400" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!state.showResult && (
                            <div className="mt-2 flex space-x-1 opacity-60">
                              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {state.availableChoices.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-white/40">
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
              <h3 className="text-xl font-bold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-400" />
                Jawaban yang Benar
              </h3>
              
              {state.selectedAnswers.length > 0 && !state.showResult && (
                <button
                  onClick={handleReset}
                  className="flex items-center px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-400/30 text-red-300 text-sm transition-all"
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
                      ? 'border-green-400 bg-green-500/10'
                      : state.showResult && state.isCorrect
                      ? 'border-green-400/60 bg-green-500/10'
                      : state.showResult && !state.isCorrect
                      ? 'border-red-400/60 bg-red-500/10'
                      : 'border-white/20 bg-white/5'
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
                          className={`bg-gradient-to-r backdrop-blur-xl rounded-lg p-4 border cursor-grab active:cursor-grabbing transition-all duration-200 ${
                            snapshot.isDragging
                              ? 'scale-105 shadow-2xl border-green-400/50 bg-green-500/20'
                              : state.showResult && answer.isCorrect
                              ? 'border-green-400/60 bg-green-500/20 from-green-500/10 to-green-600/5'
                              : state.showResult && !answer.isCorrect
                              ? 'border-red-400/60 bg-red-500/20 from-red-500/10 to-red-600/5'
                              : 'border-green-400/40 bg-green-500/10 from-green-500/10 to-green-600/5 hover:border-green-400/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium flex-1">
                              {answer.text}
                            </p>
                            {state.showResult && (
                              <div className="ml-3">
                                {answer.isCorrect ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <X className="w-5 h-5 text-red-400" />
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
                    <div className="flex flex-col items-center justify-center h-32 text-white/40">
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
            className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-8 border ${
            state.isCorrect 
              ? 'from-green-500/10 to-emerald-500/10 border-green-400/30' 
              : 'from-red-500/10 to-pink-500/10 border-red-400/30'
          }`}>
            <div className="flex items-center justify-center mb-6">
              {state.isCorrect ? (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-8 h-8 mr-3" />
                  <span className="text-2xl font-bold">Benar!</span>
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <X className="w-8 h-8 mr-3" />
                  <span className="text-2xl font-bold">Kurang Tepat</span>
                </div>
              )}
            </div>

            {/* Correct Answers Display */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="text-white font-semibold mb-3">Jawaban yang Benar:</h4>
              <div className="space-y-2">
                {question.choices
                  .filter(choice => choice.isCorrect)
                  .map((correctChoice, index) => (
                    <div key={correctChoice.id} className="flex items-center text-green-300">
                      <Check className="w-4 h-4 mr-2" />
                      <span>{correctChoice.text}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
                <h4 className="text-blue-300 font-semibold mb-2">Penjelasan:</h4>
                <p className="text-white/80">{question.explanation}</p>
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default TipeSoal3;