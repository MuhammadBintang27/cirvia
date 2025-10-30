'use client';

import React, { useState } from 'react';
import { ConceptualQuestion } from '@/lib/questions';

interface ConceptualQuestionFormProps {
  onSubmit: (question: ConceptualQuestion) => void;
  initialData?: ConceptualQuestion;
}

export default function ConceptualQuestionForm({ onSubmit, initialData }: ConceptualQuestionFormProps) {
  const [formData, setFormData] = useState<Partial<ConceptualQuestion>>({
    questionType: 'conceptual',
    title: '',
    description: '',
    explanation: '',
    hint: '',
    difficulty: 'easy',
    question: '',
    choices: [
      { id: 'choice-1', text: '', isCorrect: false },
      { id: 'choice-2', text: '', isCorrect: false },
      { id: 'choice-3', text: '', isCorrect: false },
      { id: 'choice-4', text: '', isCorrect: false },
    ],
    correctAnswers: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Judul soal harus diisi';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Deskripsi soal harus diisi';
    }

    if (!formData.question?.trim()) {
      newErrors.question = 'Pertanyaan harus diisi';
    }

    if (!formData.explanation?.trim()) {
      newErrors.explanation = 'Penjelasan harus diisi';
    }

    if (!formData.hint?.trim()) {
      newErrors.hint = 'Hint harus diisi';
    }

    // Validate choices
    const choices = formData.choices || [];
    if (choices.length < 2) {
      newErrors.choices = 'Minimal harus ada 2 pilihan jawaban';
    }

    let hasEmptyChoice = false;
    choices.forEach((choice, index) => {
      if (!choice.text?.trim()) {
        newErrors[`choice-${index}`] = `Pilihan ${index + 1} tidak boleh kosong`;
        hasEmptyChoice = true;
      }
    });

    if (hasEmptyChoice) {
      newErrors.choices = 'Semua pilihan jawaban harus diisi';
    }

    // Validate correct answers
    const correctCount = choices.filter(choice => choice.isCorrect).length;
    if (correctCount === 0) {
      newErrors.correctAnswers = 'Harus ada minimal 1 jawaban yang benar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const question: ConceptualQuestion = {
        id: initialData?.id || Date.now(),
        questionType: 'conceptual',
        title: formData.title!,
        description: formData.description!,
        explanation: formData.explanation!,
        hint: formData.hint!,
        difficulty: formData.difficulty!,
        question: formData.question!,
        choices: formData.choices!,
        correctAnswers: formData.choices!.filter(choice => choice.isCorrect).map(choice => choice.id),
      };

      onSubmit(question);
    }
  };

  const handleInputChange = (field: keyof ConceptualQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChoiceChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newChoices = [...(formData.choices || [])];
    newChoices[index] = { ...newChoices[index], [field]: value };
    handleInputChange('choices', newChoices);
    
    // Clear choice-specific errors
    if (errors[`choice-${index}`]) {
      setErrors(prev => ({ ...prev, [`choice-${index}`]: '' }));
    }
    if (errors.choices) {
      setErrors(prev => ({ ...prev, choices: '' }));
    }
    if (errors.correctAnswers) {
      setErrors(prev => ({ ...prev, correctAnswers: '' }));
    }
  };

  const addChoice = () => {
    const newChoices = [...(formData.choices || [])];
    const newId = `choice-${newChoices.length + 1}`;
    newChoices.push({ id: newId, text: '', isCorrect: false });
    handleInputChange('choices', newChoices);
  };

  const removeChoice = (index: number) => {
    if ((formData.choices || []).length > 2) {
      const newChoices = [...(formData.choices || [])];
      newChoices.splice(index, 1);
      // Re-assign IDs
      newChoices.forEach((choice, idx) => {
        choice.id = `choice-${idx + 1}`;
      });
      handleInputChange('choices', newChoices);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Informasi Dasar</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Soal *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="contoh: Konsep Dasar Rangkaian Seri"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tingkat Kesulitan
            </label>
            <select
              value={formData.difficulty || 'easy'}
              onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">Mudah</option>
              <option value="medium">Sedang</option>
              <option value="hard">Sulit</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Soal *
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Berikan konteks atau pengantar untuk soal ini..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hint untuk Siswa *
            </label>
            <textarea
              value={formData.hint || ''}
              onChange={(e) => handleInputChange('hint', e.target.value)}
              rows={3}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.hint ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Berikan petunjuk untuk membantu siswa..."
            />
            {errors.hint && <p className="text-red-500 text-sm mt-1">{errors.hint}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penjelasan Jawaban *
            </label>
            <textarea
              value={formData.explanation || ''}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              rows={3}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.explanation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jelaskan mengapa jawaban ini benar..."
            />
            {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Pertanyaan</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pertanyaan Utama *
          </label>
          <textarea
            value={formData.question || ''}
            onChange={(e) => handleInputChange('question', e.target.value)}
            rows={3}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tuliskan pertanyaan yang akan dijawab siswa..."
          />
          {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
        </div>
      </div>

      {/* Answer Choices */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">Pilihan Jawaban</h4>
          <button
            type="button"
            onClick={addChoice}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            + Tambah Pilihan
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Buat pilihan jawaban dan centang yang benar. Bisa multiple choice (beberapa jawaban benar).
        </p>

        <div className="space-y-3">
          {(formData.choices || []).map((choice, index) => (
            <div key={choice.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-600 w-8">
                {String.fromCharCode(65 + index)}.
              </span>
              
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[`choice-${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
              />
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={choice.isCorrect}
                  onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Benar</span>
              </label>
              
              {(formData.choices || []).length > 2 && (
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.choices && <p className="text-red-500 text-sm mt-2">{errors.choices}</p>}
        {errors.correctAnswers && <p className="text-red-500 text-sm mt-2">{errors.correctAnswers}</p>}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Ringkasan</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>Jumlah pilihan: {(formData.choices || []).length}</p>
          <p>Jawaban benar: {(formData.choices || []).filter(c => c.isCorrect).length}</p>
          <p>Tipe: {(formData.choices || []).filter(c => c.isCorrect).length > 1 ? 'Multiple Choice (banyak jawaban benar)' : 'Single Choice (satu jawaban benar)'}</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Preview Soal
        </button>
      </div>
    </form>
  );
}