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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                  <span className="text-2xl">👁️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Preview Soal</h1>
                  <p className="text-slate-600">Tampilan yang akan dilihat siswa</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBackToEdit}
                  className="px-5 py-2.5 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium flex items-center space-x-2 border border-slate-300"
                >
                  <span>←</span>
                  <span>Kembali Edit</span>
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>✓</span>
                  <span>Simpan Soal</span>
                </button>
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-l-4 border-emerald-400">
              <div className="flex items-start space-x-3">
                <span className="text-emerald-500 text-lg">ℹ️</span>
                <div>
                  <p className="text-sm text-emerald-800 font-medium">Preview Mode</p>
                  <p className="text-sm text-emerald-700">
                    Periksa semua detail soal dengan teliti. Pastikan soal mudah dipahami siswa dan jawaban sudah benar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-emerald-100">
            <QuestionPreview question={previewQuestion} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                <span className="text-2xl">{initialData ? '✏️' : '➕'}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  {initialData ? 'Edit Soal' : 'Buat Soal Baru'}
                </h1>
                <p className="text-slate-600">
                  {initialData 
                    ? 'Perbarui informasi soal sesuai kebutuhan' 
                    : 'Pilih tipe soal dan isi form sesuai kebutuhan pembelajaran'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Batal
            </button>
          </div>
        </div>

      {!selectedType ? (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-emerald-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">Pilih Tipe Soal</h3>
            <p className="text-slate-600">Pilih jenis soal yang ingin Anda buat untuk siswa</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeSelect(type.value)}
                className="p-8 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 text-left group transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200 rounded-lg transition-all duration-300 border border-emerald-200">
                    <span className="text-3xl">{type.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 mb-2">
                      {type.label}
                    </h4>
                    <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
                      {type.description}
                    </p>
                    <div className="mt-4 flex items-center text-emerald-600 group-hover:text-emerald-700 font-medium">
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
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100">
          {/* Selected Type Header */}
          <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl border border-emerald-200">
                  <span className="text-2xl">
                    {QUESTION_TYPES.find(t => t.value === selectedType)?.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                    {QUESTION_TYPES.find(t => t.value === selectedType)?.label}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {QUESTION_TYPES.find(t => t.value === selectedType)?.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedType(null)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium border border-slate-300"
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
    </div>
  );
}

// Component untuk preview soal
function QuestionPreview({ question }: { question: Question }) {
  return (
    <div className="space-y-6">
      {/* Header dengan badges */}
      <div className="border-b-2 border-emerald-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-4 py-2 rounded-full font-semibold border border-emerald-200">
              {question.questionType.toUpperCase()}
            </span>
            <span className={`text-sm px-4 py-2 rounded-full font-semibold border ${
              question.difficulty === 'easy' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200' :
              question.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200' :
              'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200'
            }`}>
              {question.difficulty === 'easy' ? 'MUDAH' : 
               question.difficulty === 'medium' ? 'SEDANG' : 'SULIT'}
            </span>
          </div>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border">
            ID: {question.id}
          </div>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">{question.title}</h3>
        <p className="text-slate-600 text-lg leading-relaxed">{question.description}</p>
      </div>

      {/* Content berdasarkan tipe soal */}
      {question.questionType === 'conceptual' && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          <h4 className="font-bold text-lg text-slate-800 mb-4">Pertanyaan:</h4>
          <p className="text-slate-700 mb-6 text-lg">{(question as ConceptualQuestion).question}</p>
          
          <h4 className="font-bold text-lg text-slate-800 mb-4">Pilihan Jawaban:</h4>
          <div className="space-y-3">
            {(question as ConceptualQuestion).choices.map((choice, index) => (
              <div key={choice.id} className={`p-4 rounded-lg border-2 transition-all ${
                choice.isCorrect ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    choice.isCorrect ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg ${choice.isCorrect ? 'text-emerald-800 font-semibold' : 'text-slate-700'}`}>
                    {choice.text}
                    {choice.isCorrect && <span className="ml-3 text-emerald-600 font-bold">✓ BENAR</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {question.questionType === 'circuit' && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          <h4 className="font-bold text-lg text-slate-800 mb-4">Spesifikasi Rangkaian:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Tipe Rangkaian</div>
              <div className="text-lg font-semibold text-slate-800">
                {(question as CircuitQuestion).circuitType === 'series' ? 'Seri' : 'Paralel'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-sm text-slate-600 mb-1">Tegangan Sumber</div>
              <div className="text-lg font-semibold text-slate-800">
                {(question as CircuitQuestion).voltage} Volt
              </div>
            </div>
            {(question as CircuitQuestion).targetCurrent && (
              <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">Target Arus</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {(question as CircuitQuestion).targetCurrent} Ampere
                </div>
              </div>
            )}
            {(question as CircuitQuestion).targetVoltage && (
              <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-sm">
                <div className="text-sm text-slate-600 mb-1">Target Tegangan</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {(question as CircuitQuestion).targetVoltage} Volt
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Jumlah Slot Resistor</div>
            <div className="text-lg font-semibold text-slate-800">
              {(question as CircuitQuestion).resistorSlots} slot
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitAnalysis' && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          <h4 className="font-bold text-lg text-slate-800 mb-4">Skenario Analisis:</h4>
          <p className="text-slate-700 mb-4 text-lg">{(question as CircuitAnalysisQuestion).question}</p>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Template Rangkaian</div>
            <div className="text-lg font-semibold text-slate-800">
              {typeof (question as CircuitAnalysisQuestion).circuit === 'string' 
                ? String((question as CircuitAnalysisQuestion).circuit)
                : 'Custom Circuit'}
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitOrdering' && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
          <h4 className="font-bold text-lg text-slate-800 mb-4">Instruksi Pengurutan:</h4>
          <p className="text-slate-700 mb-4 text-lg">{(question as CircuitOrderingQuestion).instruction}</p>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Jumlah Rangkaian</div>
            <div className="text-lg font-semibold text-slate-800">
              {(question as CircuitOrderingQuestion).circuits.length} rangkaian
            </div>
          </div>
        </div>
      )}

      {/* Footer dengan hint dan penjelasan */}
      <div className="border-t-2 border-emerald-200 pt-6 space-y-4">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-l-4 border-cyan-400">
          <h4 className="font-bold text-cyan-800 mb-2">💡 Hint untuk Siswa:</h4>
          <p className="text-cyan-700">{question.hint}</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-400">
          <h4 className="font-bold text-emerald-800 mb-2">📚 Penjelasan Jawaban:</h4>
          <p className="text-emerald-700">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}