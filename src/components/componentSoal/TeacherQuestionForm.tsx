'use client';
import { Ico } from "@/components/ui/Ico";

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
    icon: 'wrench'
  },
  {
    value: 'conceptual' as QuestionType,
    label: 'Soal Konseptual',
    description: 'Soal pilihan ganda tentang konsep dasar rangkaian listrik',
    icon: 'lightbulb'
  },
  {
    value: 'circuitAnalysis' as QuestionType,
    label: 'Soal Analisis Rangkaian',
    description: 'Menganalisis efek kerusakan komponen dalam rangkaian',
    icon: 'search'
  },
  {
    value: 'circuitOrdering' as QuestionType,
    label: 'Soal Pengurutan Rangkaian',
    description: 'Mengurutkan rangkaian berdasarkan kriteria tertentu (kecerahan, arus, dll)',
    icon: 'chart'
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
        <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl border-2 border-ink">
                <span className="text-2xl"><Ico n="eye" /></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink">Preview Soal</h1>
                <p className="text-muted">Tampilan yang akan dilihat siswa</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToEdit}
                className="px-5 py-2.5 bg-paper border-2 border-ink text-ink rounded-xl hover:bg-lamp-soft transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <span>←</span>
                <span>Kembali Edit</span>
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 bg-mint border-2 border-ink text-ink rounded-xl hover:bg-mint transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <span>✓</span>
                <span>Simpan Soal</span>
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 bg-coral-soft border-2 border-ink text-red-600 hover:text-ink hover:bg-coral-soft rounded-xl transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-brand-soft rounded-xl border-l-4 border-ink">
            <div className="flex items-start space-x-3">
              <span className="text-brand text-lg">ℹ</span>
              <div>
                <p className="text-sm text-brand font-medium">Preview Mode</p>
                <p className="text-sm text-muted">
                  Periksa semua detail soal dengan teliti. Pastikan soal mudah dipahami siswa dan jawaban sudah benar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="bg-paper rounded-2xl p-8 border-2 border-ink">
          <QuestionPreview question={previewQuestion} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-xl border-2 border-ink">
              <span className="text-2xl">{initialData ? <Ico n="pencil" /> : <Ico n="plus" />}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">
                {initialData ? 'Edit Soal' : 'Buat Soal Baru'}
              </h1>
              <p className="text-muted">
                {initialData 
                  ? 'Perbarui informasi soal sesuai kebutuhan' 
                  : 'Pilih tipe soal dan isi form sesuai kebutuhan pembelajaran'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-coral-soft border-2 border-ink text-red-600 hover:text-ink hover:bg-coral-soft rounded-xl transition-all duration-200 font-medium"
          >
            Batal
          </button>
        </div>
      </div>

    {!selectedType ? (
      <div className="bg-paper rounded-2xl p-8 border-2 border-ink">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-ink mb-2">Pilih Tipe Soal</h3>
          <p className="text-muted">Pilih jenis soal yang ingin Anda buat untuk siswa</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUESTION_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeSelect(type.value)}
              className="p-8 border-2 border-ink rounded-2xl hover:border-ink hover:bg-purple-100 transition-all duration-300 text-left group transform"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 group-hover:bg-purple-100 rounded-xl transition-all duration-300 border-2 border-ink">
                  <span className="text-3xl"><Ico n={type.icon} /></span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-ink group-hover:text-purple-700 transition-colors duration-300 mb-2">
                    {type.label}
                  </h4>
                  <p className="text-sm text-muted group-hover:text-muted transition-colors duration-300 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="mt-4 flex items-center text-purple-700 group-hover:text-purple-700 font-medium">
                    <span className="text-sm">Pilih tipe ini</span>
                    <span className="ml-2 transform transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-paper rounded-2xl border-2 border-ink">
        {/* Selected Type Header */}
        <div className="p-6 border-b border-ink/20 bg-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl border-2 border-ink">
                <span className="text-2xl">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.icon}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.label}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {QUESTION_TYPES.find(t => t.value === selectedType)?.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedType(null)}
              className="px-4 py-2 text-sm bg-paper border-2 border-ink text-ink rounded-xl hover:bg-lamp-soft transition-all duration-200 font-medium"
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
      <div className="border-b-2 border-ink/20 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm bg-purple-100 border-2 border-ink text-purple-700 px-4 py-2 rounded-full font-semibold">
              {question.questionType.toUpperCase()}
            </span>
            <span className={`text-sm px-4 py-2 rounded-full font-semibold border ${
              question.difficulty === 'easy' ? 'bg-mint-soft text-emerald-700 border-ink' :
              question.difficulty === 'medium' ? 'bg-lamp-soft text-amber-700 border-ink' :
              'bg-coral-soft text-red-600 border-ink'
            }`}>
              {question.difficulty === 'easy' ? 'MUDAH' : 
               question.difficulty === 'medium' ? 'SEDANG' : 'SULIT'}
            </span>
          </div>
          <div className="text-sm text-muted bg-paper px-3 py-1 rounded-full border border-ink/20">
            ID: {question.id}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-ink mb-3">{question.title}</h3>
        <p className="text-muted text-lg leading-relaxed">{question.description}</p>
      </div>

      {/* Content berdasarkan tipe soal */}
      {question.questionType === 'conceptual' && (
        <div className="bg-brand-soft rounded-2xl p-6 border-2 border-ink">
          <h4 className="font-bold text-lg text-ink mb-4">Pertanyaan:</h4>
          <p className="text-muted mb-6 text-lg">{(question as ConceptualQuestion).question}</p>
          
          <h4 className="font-bold text-lg text-ink mb-4">Pilihan Jawaban:</h4>
          <div className="space-y-3">
            {(question as ConceptualQuestion).choices.map((choice, index) => (
              <div key={choice.id} className={`p-4 rounded-xl border-2 transition-all ${
                choice.isCorrect ? 'border-ink bg-mint-soft' : 'border-ink bg-paper'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    choice.isCorrect ? 'bg-mint text-ink' : 'bg-paper text-muted'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg ${choice.isCorrect ? 'text-emerald-700 font-semibold' : 'text-muted'}`}>
                    {choice.text}
                    {choice.isCorrect && <span className="ml-3 text-emerald-700 font-bold">✓ BENAR</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {question.questionType === 'circuit' && (
        <div className="bg-brand-soft rounded-2xl p-6 border-2 border-ink">
          <h4 className="font-bold text-lg text-ink mb-4">Spesifikasi Rangkaian:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-paper p-4 rounded-xl border-2 border-ink">
              <div className="text-sm text-muted mb-1">Tipe Rangkaian</div>
              <div className="text-lg font-semibold text-ink">
                {(question as CircuitQuestion).circuitType === 'series' ? 'Seri' : 'Paralel'}
              </div>
            </div>
            <div className="bg-paper p-4 rounded-xl border-2 border-ink">
              <div className="text-sm text-muted mb-1">Tegangan Sumber</div>
              <div className="text-lg font-semibold text-ink">
                {(question as CircuitQuestion).voltage} Volt
              </div>
            </div>
            {(question as CircuitQuestion).targetCurrent && (
              <div className="bg-mint-soft p-4 rounded-xl border-2 border-ink">
                <div className="text-sm text-emerald-700 mb-1">Target Arus</div>
                <div className="text-lg font-semibold text-emerald-700">
                  {(question as CircuitQuestion).targetCurrent} Ampere
                </div>
              </div>
            )}
            {(question as CircuitQuestion).targetVoltage && (
              <div className="bg-mint-soft p-4 rounded-xl border-2 border-ink">
                <div className="text-sm text-emerald-700 mb-1">Target Tegangan</div>
                <div className="text-lg font-semibold text-emerald-700">
                  {(question as CircuitQuestion).targetVoltage} Volt
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-paper p-4 rounded-xl border-2 border-ink">
            <div className="text-sm text-muted mb-1">Jumlah Slot Resistor</div>
            <div className="text-lg font-semibold text-ink">
              {(question as CircuitQuestion).resistorSlots} slot
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitAnalysis' && (
        <div className="bg-brand-soft rounded-2xl p-6 border-2 border-ink">
          <h4 className="font-bold text-lg text-ink mb-4">Skenario Analisis:</h4>
          <p className="text-muted mb-4 text-lg">{(question as CircuitAnalysisQuestion).question}</p>
          
          <div className="bg-paper p-4 rounded-xl border-2 border-ink">
            <div className="text-sm text-muted mb-1">Template Rangkaian</div>
            <div className="text-lg font-semibold text-ink">
              {typeof (question as CircuitAnalysisQuestion).circuit === 'string' 
                ? String((question as CircuitAnalysisQuestion).circuit)
                : 'Custom Circuit'}
            </div>
          </div>
        </div>
      )}

      {question.questionType === 'circuitOrdering' && (
        <div className="bg-brand-soft rounded-2xl p-6 border-2 border-ink">
          <h4 className="font-bold text-lg text-ink mb-4">Instruksi Pengurutan:</h4>
          <p className="text-muted mb-4 text-lg">{(question as CircuitOrderingQuestion).instruction}</p>
          
          <div className="bg-paper p-4 rounded-xl border-2 border-ink">
            <div className="text-sm text-muted mb-1">Jumlah Rangkaian</div>
            <div className="text-lg font-semibold text-ink">
              {(question as CircuitOrderingQuestion).circuits.length} rangkaian
            </div>
          </div>
        </div>
      )}

      {/* Footer dengan hint dan penjelasan */}
      <div className="border-t-2 border-ink/20 pt-6 space-y-4">
        <div className="bg-brand-soft p-4 rounded-xl border-l-4 border-ink">
          <h4 className="font-bold text-brand mb-2">Hint untuk Siswa:</h4>
          <p className="text-muted">{question.hint}</p>
        </div>
        
        <div className="bg-mint-soft p-4 rounded-xl border-l-4 border-ink">
          <h4 className="font-bold text-emerald-700 mb-2">Penjelasan Jawaban:</h4>
          <p className="text-emerald-700">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}