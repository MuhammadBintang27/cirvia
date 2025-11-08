'use client';

import React, { useState } from 'react';
import { Question, CircuitQuestion, ConceptualQuestion, CircuitAnalysisQuestion, CircuitOrderingQuestion } from '@/lib/questions';

// Form components untuk setiap tipe soal
import CircuitQuestionForm from '@/components/forms/CircuitQuestionForm';
import ConceptualQuestionForm from '@/components/forms/ConceptualQuestionForm';
import CircuitAnalysisQuestionForm from '@/components/forms/CircuitAnalysisQuestionForm';
import CircuitOrderingQuestionForm from '@/components/forms/CircuitOrderingQuestionForm';

type QuestionType = 'circuit' | 'conceptual' | 'circuitAnalysis' | 'circuitOrdering';

const QUESTION_TYPES = [
  {
    value: 'circuit' as QuestionType,
    label: 'Soal Konstruksi Rangkaian',
    description: 'Siswa membangun rangkaian untuk mencapai target arus/tegangan tertentu',
    icon: '🔧'
  },
  {
    value: 'conceptual' as QuestionType,
    label: 'Soal Konseptual',
    description: 'Soal pilihan ganda tentang konsep dasar rangkaian listrik',
    icon: '💡'
  },
  {
    value: 'circuitAnalysis' as QuestionType,
    label: 'Soal Analisis Rangkaian',
    description: 'Menganalisis efek kerusakan komponen dalam rangkaian',
    icon: '🔍'
  },
  {
    value: 'circuitOrdering' as QuestionType,
    label: 'Soal Pengurutan Rangkaian',
    description: 'Mengurutkan rangkaian berdasarkan kriteria tertentu (kecerahan, arus, dll)',
    icon: '📊'
  }
];

interface TeacherQuestionFormProps {
  onSubmit: (question: Question) => void;
  onCancel: () => void;
  initialData?: Question;
}

export default function TeacherQuestionForm({ onSubmit, onCancel, initialData }: TeacherQuestionFormProps) {
  const [selectedType, setSelectedType] = useState<QuestionType | null>(
    initialData?.questionType || null
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const handleTypeSelect = (type: QuestionType) => {
    setSelectedType(type);
    setIsPreviewMode(false);
    setPreviewQuestion(null);
  };

  const handleFormSubmit = (questionData: Question) => {
    setPreviewQuestion(questionData);
    setIsPreviewMode(true);
  };

  const handleFinalSubmit = () => {
    if (previewQuestion) {
      onSubmit(previewQuestion);
    }
  };

  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  if (isPreviewMode && previewQuestion) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Preview Soal</h1>
                <p className="text-blue-200/70">Tampilan yang akan dilihat siswa</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToEdit}
                className="px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <span>←</span>
                <span>Kembali Edit</span>
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
              >
                <span>✓</span>
                <span>Simpan Soal</span>
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 text-red-300 hover:text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border-l-4 border-blue-400">
            <div className="flex items-start space-x-3">
              <span className="text-blue-400 text-lg">ℹ️</span>
              <div>
                <p className="text-sm text-blue-300 font-medium">Preview Mode</p>
                <p className="text-sm text-blue-200/80">
                  Periksa semua detail soal dengan teliti. Pastikan soal mudah dipahami siswa dan jawaban sudah benar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <QuestionPreview question={previewQuestion} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
              <span className="text-2xl">{initialData ? '✏️' : '➕'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {initialData ? 'Edit Soal' : 'Buat Soal Baru'}
              </h1>
              <p className="text-blue-200/70">
                {initialData 
                  ? 'Perbarui informasi soal sesuai kebutuhan' 
                  : 'Pilih tipe soal dan isi form sesuai kebutuhan pembelajaran'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 text-red-300 hover:text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 font-medium shadow-lg"
          >
            Batal
          </button>
        </div>
      </div>

    {!selectedType ? (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Pilih Tipe Soal</h3>
          <p className="text-blue-200/70">Pilih jenis soal yang ingin Anda buat untuk siswa</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeSelect(type.value)}
              className="p-8 border-2 border-white/20 rounded-2xl hover:border-purple-400/50 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 backdrop-blur-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 rounded-xl transition-all duration-300 border border-purple-400/30">
                  <span className="text-3xl">{type.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-2">
                    {type.label}
                  </h4>
                  <p className="text-sm text-blue-200/70 group-hover:text-blue-200/90 transition-colors duration-300 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="mt-4 flex items-center text-purple-400 group-hover:text-purple-300 font-medium">
                    <span className="text-sm">Pilih tipe ini</span>
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20">
        {/* Selected Type Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                <span className="text-2xl">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.label}
                </h3>
                <p className="text-sm text-blue-200/70 mt-1">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedType(null)}
              className="px-4 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium"
            >
              ← Ganti Tipe
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Render form component berdasarkan tipe yang dipilih */}
          {selectedType === 'circuit' && (
            <CircuitQuestionForm
              onSubmit={handleFormSubmit}
              initialData={initialData as CircuitQuestion}
            />
          )}
          {selectedType === 'conceptual' && (
            <ConceptualQuestionForm
              onSubmit={handleFormSubmit}
              initialData={initialData as ConceptualQuestion}
            />
          )}
          {selectedType === 'circuitAnalysis' && (
            <CircuitAnalysisQuestionForm
              onSubmit={handleFormSubmit}
              initialData={initialData as CircuitAnalysisQuestion}
            />
          )}
          {selectedType === 'circuitOrdering' && (
            <CircuitOrderingQuestionForm
              onSubmit={handleFormSubmit}
              initialData={initialData as CircuitOrderingQuestion}
            />
          )}
        </div>
      </div>
    )}
    </div>
  );
}

// Component untuk preview soal
function QuestionPreview({ question }: { question: Question }) {
  return (
    <div className="space-y-6">
      {/* Header dengan badges */}
      <div className="border-b-2 border-white/10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 px-4 py-2 rounded-full font-semibold">
              {question.questionType.toUpperCase()}
            </span>
            <span className={`text-sm px-4 py-2 rounded-full font-semibold border ${
              question.difficulty === 'easy' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30' :
              question.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/30' :
              'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-400/30'
            }`}>
              {question.difficulty === 'easy' ? 'MUDAH' : 
               question.difficulty === 'medium' ? 'SEDANG' : 'SULIT'}
            </span>
          </div>
          <div className="text-sm text-blue-200/70 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            ID: {question.id}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{question.title}</h3>
        <p className="text-blue-200/80 text-lg leading-relaxed">{question.description}</p>
      </div>

      {/* Content berdasarkan tipe soal */}
      {question.questionType === 'conceptual' && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
          <h4 className="font-bold text-lg text-white mb-4">Pertanyaan:</h4>
          <p className="text-blue-200/90 mb-6 text-lg">{(question as ConceptualQuestion).question}</p>
          
          <h4 className="font-bold text-lg text-white mb-4">Pilihan Jawaban:</h4>
          <div className="space-y-3">
            {(question as ConceptualQuestion).choices.map((choice, index) => (
              <div key={choice.id} className={`p-4 rounded-xl border-2 transition-all ${
                choice.isCorrect ? 'border-green-400/60 bg-green-500/20' : 'border-white/20 bg-white/5'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    choice.isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-white/10 text-blue-200'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg ${choice.isCorrect ? 'text-green-300 font-semibold' : 'text-blue-200/80'}`}>
                    {choice.text}
                    {choice.isCorrect && <span className="ml-3 text-green-400 font-bold">✓ BENAR</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {question.questionType === 'circuit' && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
          <h4 className="font-bold text-lg text-white mb-4">Spesifikasi Rangkaian:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200/70 mb-1">Tipe Rangkaian</div>
              <div className="text-lg font-semibold text-white">
                {(question as CircuitQuestion).circuitType === 'series' ? 'Seri' : 'Paralel'}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20">
              <div className="text-sm text-blue-200/70 mb-1">Tegangan Sumber</div>
              <div className="text-lg font-semibold text-white">
                {(question as CircuitQuestion).voltage} Volt
              </div>
            </div>
            {(question as CircuitQuestion).targetCurrent && (
              <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-xl border border-green-400/30">
                <div className="text-sm text-green-200/70 mb-1">Target Arus</div>
                <div className="text-lg font-semibold text-green-300">
                  {(question as CircuitQuestion).targetCurrent} Ampere
                </div>
              </div>
            )}
            {(question as CircuitQuestion).targetVoltage && (
              <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-xl border border-green-400/30">
                <div className="text-sm text-green-200/70 mb-1">Target Tegangan</div>
                <div className="text-lg font-semibold text-green-300">
                  {(question as CircuitQuestion).targetVoltage} Volt
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-sm text-blue-200/70 mb-1">Jumlah Slot Resistor</div>
            <div className="text-lg font-semibold text-white">
              {(question as CircuitQuestion).resistorSlots} slot
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitAnalysis' && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
          <h4 className="font-bold text-lg text-white mb-4">Skenario Analisis:</h4>
          <p className="text-blue-200/90 mb-4 text-lg">{(question as CircuitAnalysisQuestion).question}</p>
          
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-sm text-blue-200/70 mb-1">Template Rangkaian</div>
            <div className="text-lg font-semibold text-white">
              {typeof (question as CircuitAnalysisQuestion).circuit === 'string' 
                ? String((question as CircuitAnalysisQuestion).circuit)
                : 'Custom Circuit'}
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitOrdering' && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30">
          <h4 className="font-bold text-lg text-white mb-4">Instruksi Pengurutan:</h4>
          <p className="text-blue-200/90 mb-4 text-lg">{(question as CircuitOrderingQuestion).instruction}</p>
          
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-sm text-blue-200/70 mb-1">Jumlah Rangkaian</div>
            <div className="text-lg font-semibold text-white">
              {(question as CircuitOrderingQuestion).circuits.length} rangkaian
            </div>
          </div>
        </div>
      )}

      {/* Footer dengan hint dan penjelasan */}
      <div className="border-t-2 border-white/10 pt-6 space-y-4">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-cyan-400">
          <h4 className="font-bold text-cyan-300 mb-2">💡 Hint untuk Siswa:</h4>
          <p className="text-cyan-200/80">{question.hint}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-green-400">
          <h4 className="font-bold text-green-300 mb-2">📚 Penjelasan Jawaban:</h4>
          <p className="text-green-200/80">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}