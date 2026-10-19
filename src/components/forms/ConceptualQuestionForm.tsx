'use client';
import { Ico } from "@/components/ui/Ico";

import React, { useState } from 'react';
import { ConceptualQuestion } from '@/lib/questions';
import { HelpCircle, Lightbulb, CheckCircle2, XCircle, Eye, Edit } from 'lucide-react';

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
  const [showPreview, setShowPreview] = useState(false);

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
    <div className="space-y-8">
      {/* Toggle Preview/Edit */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-ink flex items-center">
          <HelpCircle className="w-7 h-7 mr-3 text-purple-700" />
          {showPreview ? 'Preview Soal Konseptual' : 'Form Soal Konseptual'}
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-5 py-2.5 bg-purple-100 border-2 border-ink rounded-xl text-purple-700 hover:text-ink hover:bg-purple-100 transition-all font-medium"
        >
          {showPreview ? (
            <>
              <Edit className="w-5 h-5 mr-2" />
              Edit Soal
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mr-2" />
              Preview Soal
            </>
          )}
        </button>
      </div>

      {showPreview ? (
        /* PREVIEW MODE - Sama persis dengan tampilan di pretest/posttest */
        <div className="space-y-8 animate-fadeIn">
          {/* Question Display */}
          <div className="bg-brand-soft rounded-2xl p-8 border-2 border-ink">
            <h3 className="text-2xl font-semibold text-ink mb-4">
              {formData.question || 'Pertanyaan akan muncul di sini...'}
            </h3>
            {formData.description && (
              <p className="text-muted text-base leading-relaxed">
                {formData.description}
              </p>
            )}
          </div>

          {/* Choices Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Available Choices */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-ink flex items-center">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  ?
                </div>
                Pilihan Jawaban
              </h4>
              
              <div className="space-y-3 p-4 rounded-xl border-2 border-dashed border-ink bg-paper min-h-[300px]">
                {(formData.choices || []).map((choice, index) => (
                  <div
                    key={choice.id}
                    className={`bg-paper rounded-lg p-4 border transition-all ${
                      choice.isCorrect
                        ? 'border-ink bg-mint-soft'
                        : 'border-ink'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-ink font-medium flex-1">
                        {choice.text || `Pilihan ${String.fromCharCode(65 + index)}`}
                      </p>
                      {choice.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 ml-3" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Info */}
            <div className="space-y-4">
              {/* Hint */}
              {formData.hint && (
                <div className="bg-lamp-soft rounded-xl p-4 border-2 border-ink">
                  <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-amber-700 mb-2">Petunjuk:</h5>
                      <p className="text-amber-700 text-sm">{formData.hint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation */}
              {formData.explanation && (
                <div className="bg-brand-soft rounded-xl p-4 border-2 border-ink">
                  <h5 className="font-bold text-brand mb-2">Penjelasan:</h5>
                  <p className="text-muted text-sm">{formData.explanation}</p>
                </div>
              )}

              {/* Summary */}
              <div className="bg-paper rounded-xl p-4 border-2 border-ink">
                <h5 className="font-bold text-ink mb-3">Info Soal:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Tipe:</span>
                    <span className="text-ink font-medium">Soal Konseptual</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tingkat:</span>
                    <span className={`font-medium ${
                      formData.difficulty === 'easy' ? 'text-emerald-700' :
                      formData.difficulty === 'medium' ? 'text-amber-700' :
                      'text-red-600'
                    }`}>
                      {formData.difficulty === 'easy' ? 'Mudah' :
                       formData.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Pilihan:</span>
                    <span className="text-ink font-medium">{(formData.choices || []).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Jawaban Benar:</span>
                    <span className="text-emerald-700 font-medium">
                      {(formData.choices || []).filter(c => c.isCorrect).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-ink/20">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-6 py-3 bg-paper border-2 border-ink text-ink rounded-xl hover:bg-lamp-soft transition-all font-medium"
            >
              Kembali Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-brand border-2 border-ink text-white rounded-xl hover:bg-brand transition-all font-medium"
            >
              Simpan Soal
            </button>
          </div>
        </div>
      ) : (
        /* EDIT MODE - Form dengan layout flat dan clean */
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Informasi Dasar - Inline tanpa box */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-ink flex items-center pb-3 border-b border-ink/20">
              <HelpCircle className="w-6 h-6 mr-3 text-purple-700" />
              Informasi Dasar
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Judul Soal *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all ${
                    errors.title ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                  }`}
                  placeholder="contoh: Konsep Dasar Rangkaian Seri"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1.5">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Tingkat Kesulitan
                </label>
                <select
                  value={formData.difficulty || 'easy'}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-3 bg-paper border-2 border-ink/20 hover:border-ink rounded-xl text-ink focus:outline-none focus:border-ink focus:bg-paper transition-all"
                >
                  <option value="easy" className="bg-paper">Mudah</option>
                  <option value="medium" className="bg-paper">Sedang</option>
                  <option value="hard" className="bg-paper">Sulit</option>
                </select>
              </div>
            </div>

            <div className="pl-9">
              <label className="block text-sm font-medium text-muted mb-2">
                Deskripsi Soal *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                  errors.description ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                }`}
                placeholder="Berikan konteks atau pengantar untuk soal ini..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1.5">{errors.description}</p>}
            </div>
          </div>

          {/* Pertanyaan - Inline */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-ink flex items-center pb-3 border-b border-ink/20">
              <HelpCircle className="w-6 h-6 mr-3 text-brand" />
              Pertanyaan
            </h4>
            
            <div className="pl-9">
              <label className="block text-sm font-medium text-muted mb-2">
                Pertanyaan Utama *
              </label>
              <textarea
                value={formData.question || ''}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                  errors.question ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                }`}
                placeholder="Tuliskan pertanyaan yang akan dijawab siswa..."
              />
              {errors.question && <p className="text-red-600 text-sm mt-1.5">{errors.question}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint untuk Siswa *
                </label>
                <textarea
                  value={formData.hint || ''}
                  onChange={(e) => handleInputChange('hint', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                    errors.hint ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                  }`}
                  placeholder="Berikan petunjuk untuk membantu siswa..."
                />
                {errors.hint && <p className="text-red-600 text-sm mt-1.5">{errors.hint}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Penjelasan Jawaban *
                </label>
                <textarea
                  value={formData.explanation || ''}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                    errors.explanation ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                  }`}
                  placeholder="Jelaskan mengapa jawaban ini benar..."
                />
                {errors.explanation && <p className="text-red-600 text-sm mt-1.5">{errors.explanation}</p>}
              </div>
            </div>
          </div>

          {/* Pilihan Jawaban - Inline */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-ink/20">
              <h4 className="text-xl font-bold text-ink flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-700" />
                Pilihan Jawaban
              </h4>
              <button
                type="button"
                onClick={addChoice}
                className="px-4 py-2 text-sm bg-mint-soft border-2 border-ink text-emerald-700 hover:bg-mint-soft hover:text-ink rounded-lg transition-all font-medium"
              >
                + Tambah Pilihan
              </button>
            </div>
            
            <p className="text-sm text-muted pl-9">
              Buat pilihan jawaban dan centang yang benar. Bisa multiple choice (beberapa jawaban benar).
            </p>

            <div className="space-y-3 pl-9">
              {(formData.choices || []).map((choice, index) => (
                <div key={choice.id} className="flex items-center space-x-3 p-4 border-2 rounded-xl bg-paper transition-all hover:bg-lamp-soft border-ink/20 hover:border-ink">
                  <span className="text-base font-bold text-purple-700 w-8 flex-shrink-0">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  
                  <input
                    type="text"
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                    className={`flex-1 px-4 py-2.5 bg-transparent border-0 text-ink placeholder-muted focus:outline-none ${
                      errors[`choice-${index}`] ? 'text-red-600' : ''
                    }`}
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                  />
                  
                  <label className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-mint-soft transition-colors">
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                      className="w-5 h-5 rounded border-ink bg-paper text-emerald-700 focus:ring-brand focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-emerald-700 font-medium whitespace-nowrap">Benar</span>
                  </label>
                  
                  {(formData.choices || []).length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      className="px-3 py-2 text-sm bg-coral-soft hover:bg-coral-soft border-2 border-ink hover:border-ink text-red-600 hover:text-red-600 rounded-lg transition-all"
                    >
                      <Ico n="x" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.choices && <p className="text-red-600 text-sm mt-3 pl-9">{errors.choices}</p>}
            {errors.correctAnswers && <p className="text-red-600 text-sm mt-3 pl-9">{errors.correctAnswers}</p>}
          </div>

          {/* Ringkasan - Compact */}
          <div className="flex items-center justify-between px-9 py-5 bg-brand-soft border-y border-ink/20">
            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted">Pilihan:</span>
                <span className="font-bold text-ink">{(formData.choices || []).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted">Jawaban Benar:</span>
                <span className="font-bold text-emerald-700">{(formData.choices || []).filter(c => c.isCorrect).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted">Tipe:</span>
                <span className="font-medium text-purple-700">{(formData.choices || []).filter(c => c.isCorrect).length > 1 ? 'Multiple' : 'Single'}</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 px-9">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-7 py-3.5 bg-purple-100 border-2 border-ink text-muted hover:text-ink hover:bg-purple-100 hover:border-ink rounded-xl transition-all font-medium flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview Soal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-3.5 bg-brand border-2 border-ink text-white rounded-xl hover:bg-brand transition-all font-medium"
            >
              Simpan Soal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}