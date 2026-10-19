'use client';

import React, { useState } from 'react';
import { CircuitAnalysisQuestion, CIRCUIT_TEMPLATES, CircuitTemplateType } from '@/lib/questions';
import { Settings, Zap, Lightbulb, CheckCircle2, HelpCircle, Eye, Edit, Target, X, LightbulbOff } from 'lucide-react';

interface CircuitAnalysisQuestionFormProps {
  onSubmit: (question: CircuitAnalysisQuestion) => void;
  initialData?: CircuitAnalysisQuestion;
}

export default function CircuitAnalysisQuestionForm({ onSubmit, initialData }: CircuitAnalysisQuestionFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Partial<CircuitAnalysisQuestion>>({
    questionType: 'circuitAnalysis',
    title: '',
    description: '',
    explanation: '',
    hint: '',
    difficulty: 'easy',
    question: '',
    circuit: 'mixed-series-parallel',
    targetLamp: 'L1',
    correctStates: {},
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<CircuitTemplateType>(
    (typeof initialData?.circuit === 'string' ? initialData.circuit : 'mixed-series-parallel') as CircuitTemplateType
  );

  // Get available lamps from selected template
  const getAvailableLamps = (templateType: CircuitTemplateType) => {
    const template = CIRCUIT_TEMPLATES[templateType];
    return template.components.filter(comp => comp.type === 'lamp').map(comp => comp.id);
  };

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

    if (!formData.targetLamp?.trim()) {
      newErrors.targetLamp = 'Lampu target harus dipilih';
    }

    // Validate correct states
    const availableLamps = getAvailableLamps(selectedTemplate);
    const otherLamps = availableLamps.filter(lamp => lamp !== formData.targetLamp);
    
    if (otherLamps.length === 0) {
      newErrors.correctStates = 'Tidak ada lampu lain untuk dianalisis';
    } else {
      const statesSet = Object.keys(formData.correctStates || {}).length;
      if (statesSet === 0) {
        newErrors.correctStates = 'Status lampu lain harus ditentukan';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const question: CircuitAnalysisQuestion = {
        id: initialData?.id || Date.now(),
        questionType: 'circuitAnalysis',
        title: formData.title!,
        description: formData.description!,
        explanation: formData.explanation!,
        hint: formData.hint!,
        difficulty: formData.difficulty!,
        question: formData.question!,
        circuit: selectedTemplate,
        targetLamp: formData.targetLamp!,
        correctStates: formData.correctStates!,
      };

      onSubmit(question);
    }
  };

  const handleInputChange = (field: keyof CircuitAnalysisQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateChange = (template: CircuitTemplateType) => {
    setSelectedTemplate(template);
    handleInputChange('circuit', template);
    
    // Reset target lamp and states when template changes
    const availableLamps = getAvailableLamps(template);
    if (availableLamps.length > 0) {
      handleInputChange('targetLamp', availableLamps[0]);
      handleInputChange('correctStates', {});
    }
  };

  const handleLampStateChange = (lampId: string, state: 'on' | 'off') => {
    const newStates = { ...(formData.correctStates || {}) };
    newStates[lampId] = state;
    handleInputChange('correctStates', newStates);
    
    if (errors.correctStates) {
      setErrors(prev => ({ ...prev, correctStates: '' }));
    }
  };

  const availableLamps = getAvailableLamps(selectedTemplate);
  const otherLamps = availableLamps.filter(lamp => lamp !== formData.targetLamp);

  const TEMPLATE_DESCRIPTIONS = {
    'mixed-series-parallel': 'Rangkaian campuran dengan 2 jalur seri dan 1 jalur paralel independen',
    'multi-parallel-series': 'Rangkaian dengan 3 jalur paralel, masing-masing memiliki resistor seri',
    'nested-series-parallel': 'Rangkaian bertingkat dengan kombinasi seri-paralel yang kompleks'
  };

  return (
    <div className="space-y-10">
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-ink flex items-center">
          <Zap className="w-7 h-7 mr-3 text-brand" />
          Form Soal Analisis Rangkaian
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-5 py-2.5 bg-paper hover:bg-lamp-soft border-2 border-ink hover:border-ink text-ink rounded-xl transition-all flex items-center space-x-2"
        >
          {showPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {showPreview ? (
        /* Preview Mode - Match TipeSoal4 Display */
        <div className="space-y-8">
          {/* Question Header */}
          <div className="bg-paper rounded-2xl p-8 border-2 border-ink">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                formData.difficulty === 'easy' ? 'bg-mint' : 
                formData.difficulty === 'medium' ? 'bg-lamp' : 'bg-coral'
              }`}></div>
              <span className="text-muted text-sm font-medium uppercase">
                {formData.difficulty === 'easy' ? 'Mudah' : 
                 formData.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-ink mb-4">{formData.title || 'Judul Soal'}</h2>
            
            {/* Target Lamp Info */}
            <div className="p-4 bg-coral-soft border-2 border-ink rounded-lg mb-4">
              <div className="flex items-center space-x-3">
                <X className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-red-600 font-semibold">
                    Lampu {formData.targetLamp || '?'} PADAM
                  </p>
                  <p className="text-red-600 text-sm">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted text-lg">{formData.question}</p>
          </div>

          {/* Circuit Visualization */}
          <div className="bg-paper rounded-xl border border-ink/20 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-ink mb-2">
                Rangkaian Listrik
              </h3>
              <p className="text-muted text-sm">
                Template: <span className="text-brand font-medium">{selectedTemplate}</span>
              </p>
              <p className="text-muted text-sm">
                Klik lampu untuk memprediksi kondisi Nyala/Padam
              </p>
            </div>
            
            {/* Simplified Circuit Display */}
            <div className="w-full h-80 bg-paper rounded-lg border border-ink/20 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  {/* Battery Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-12 bg-mint-soft border-2 border-ink rounded-lg mb-2">
                    <span className="text-emerald-700 font-bold text-xs">+12V</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* Example lamps */}
                  {['L1', 'L2', 'L3'].map((lamp, idx) => (
                    <div key={lamp} className="flex flex-col items-center">
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                        formData.targetLamp === lamp 
                          ? 'bg-coral-soft border-ink' 
                          : 'bg-lamp-soft border-ink shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                      }`}>
                        {formData.targetLamp === lamp ? (
                          <X className="w-8 h-8 text-red-600" />
                        ) : (
                          <Lightbulb className="w-8 h-8 text-amber-700" />
                        )}
                      </div>
                      <span className="text-ink font-bold mt-2">{lamp}</span>
                      {formData.targetLamp !== lamp && (
                        <div className="mt-2 text-xs">
                          <button className="px-2 py-1 bg-brand-soft border-2 border-ink rounded text-brand text-xs">
                            Nyala
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-muted text-sm mt-6">
                  Preview diagram rangkaian (template: {selectedTemplate})
                </p>
              </div>
            </div>
          </div>

          {/* Lamp States Summary */}
          {formData.correctStates && Object.keys(formData.correctStates).length > 0 && (
            <div className="bg-paper rounded-2xl p-6 border-2 border-ink">
              <h4 className="text-xl font-bold text-ink mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-brand" />
                Status Lampu yang Benar
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.correctStates).map(([lampId, state]) => (
                  <div key={lampId} className="bg-paper rounded-lg p-4 border border-ink/20">
                    <div className="flex items-center justify-between">
                      <span className="text-ink font-bold">{lampId}</span>
                      <div className={`flex items-center px-3 py-1 rounded-full ${
                        state === 'on' 
                          ? 'bg-lamp-soft text-amber-700' 
                          : 'bg-ink/20 text-muted'
                      }`}>
                        {state === 'on' ? (
                          <>
                            <Lightbulb className="w-4 h-4 mr-1" />
                            Nyala
                          </>
                        ) : (
                          <>
                            <LightbulbOff className="w-4 h-4 mr-1" />
                            Padam
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hint & Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-lamp-soft border-2 border-ink rounded-xl p-6">
              <h4 className="text-lg font-bold text-amber-700 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Hint
              </h4>
              <p className="text-muted text-sm">{formData.hint || 'Belum diisi'}</p>
            </div>
            <div className="bg-mint-soft border-2 border-ink rounded-xl p-6">
              <h4 className="text-lg font-bold text-emerald-700 mb-3 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Penjelasan
              </h4>
              <p className="text-muted text-sm">{formData.explanation || 'Belum diisi'}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-7 py-3.5 bg-brand border-2 border-ink text-white rounded-xl hover:bg-brand transition-all font-medium"
            >
              Kembali ke Edit
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode - Form */
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Informasi Dasar */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-ink flex items-center pb-3 border-b border-ink/20">
              <Settings className="w-6 h-6 mr-3 text-brand" />
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
                  placeholder="contoh: Analisis Rangkaian Campuran - L3 Putus"
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
                rows={4}
                className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                  errors.description ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                }`}
                placeholder="Berikan konteks untuk skenario analisis rangkaian..."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1.5">{errors.description}</p>}
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
                  placeholder="Berikan petunjuk cara menganalisis rangkaian..."
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
                  placeholder="Jelaskan alur analisis dan alasan jawaban..."
                />
                {errors.explanation && <p className="text-red-600 text-sm mt-1.5">{errors.explanation}</p>}
              </div>
            </div>
          </div>

          {/* Konfigurasi Analisis Rangkaian */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-ink flex items-center pb-3 border-b border-ink/20">
              <Zap className="w-6 h-6 mr-3 text-amber-700" />
              Konfigurasi Analisis Rangkaian
            </h4>
            
            <div className="pl-9 space-y-4">
              <label className="block text-sm font-medium text-muted mb-3">
                Template Rangkaian
              </label>
              <div className="space-y-3">
                {Object.entries(CIRCUIT_TEMPLATES).map(([key, template]) => (
                  <label key={key} className="flex items-start space-x-3 p-4 bg-paper border-2 border-ink/20 hover:border-ink rounded-xl cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="circuitTemplate"
                      value={key}
                      checked={selectedTemplate === key}
                      onChange={() => handleTemplateChange(key as CircuitTemplateType)}
                      className="mt-1 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-ink">{key}</div>
                      <div className="text-sm text-muted mt-1">
                        {TEMPLATE_DESCRIPTIONS[key as CircuitTemplateType]}
                      </div>
                      <div className="text-xs text-brand mt-2">
                        Lampu: {template.components.filter(c => c.type === 'lamp').map(c => c.id).join(', ')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pl-9">
              <label className="block text-sm font-medium text-muted mb-2">
                Pertanyaan Analisis *
              </label>
              <textarea
                value={formData.question || ''}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink placeholder-muted focus:outline-none focus:border-ink focus:bg-paper transition-all resize-none ${
                  errors.question ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                }`}
                placeholder="contoh: Jika lampu L3 padam (putus), lampu mana yang ikut padam dan mana yang tetap menyala?"
              />
              {errors.question && <p className="text-red-600 text-sm mt-1.5">{errors.question}</p>}
            </div>
          </div>

          {/* Skenario Kerusakan */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-ink flex items-center pb-3 border-b border-ink/20">
              <Target className="w-6 h-6 mr-3 text-red-600" />
              Skenario Kerusakan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Lampu yang Rusak/Putus *
                </label>
                <select
                  value={formData.targetLamp || ''}
                  onChange={(e) => handleInputChange('targetLamp', e.target.value)}
                  className={`w-full px-4 py-3 bg-paper border-2 rounded-xl text-ink focus:outline-none focus:border-ink focus:bg-paper transition-all ${
                    errors.targetLamp ? 'border-ink bg-coral-soft' : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  <option value="" className="bg-paper">Pilih lampu yang rusak...</option>
                  {availableLamps.map(lamp => (
                    <option key={lamp} value={lamp} className="bg-paper">
                      {lamp}
                    </option>
                  ))}
                </select>
                {errors.targetLamp && <p className="text-red-600 text-sm mt-1.5">{errors.targetLamp}</p>}
              </div>
            </div>

            {formData.targetLamp && otherLamps.length > 0 && (
              <div className="pl-9">
                <label className="block text-sm font-medium text-muted mb-3">
                  Status Lampu Lain setelah {formData.targetLamp} Putus *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {otherLamps.map(lamp => (
                    <div key={lamp} className="p-4 bg-paper border-2 border-ink/20 rounded-xl">
                      <div className="font-medium text-ink mb-3">{lamp}</div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`lamp-${lamp}`}
                            value="on"
                            checked={(formData.correctStates || {})[lamp] === 'on'}
                            onChange={() => handleLampStateChange(lamp, 'on')}
                            className="text-emerald-700 focus:ring-brand"
                          />
                          <span className="text-sm text-emerald-700">Menyala</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`lamp-${lamp}`}
                            value="off"
                            checked={(formData.correctStates || {})[lamp] === 'off'}
                            onChange={() => handleLampStateChange(lamp, 'off')}
                            className="text-red-600 focus:ring-brand"
                          />
                          <span className="text-sm text-red-600">Padam</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.correctStates && <p className="text-red-600 text-sm mt-2">{errors.correctStates}</p>}
              </div>
            )}
          </div>

          {/* Summary */}
          {formData.targetLamp && (
            <div className="mt-6 pt-6 border-t border-ink/20">
              <div className="bg-brand-soft border-2 border-ink rounded-xl p-6">
                <h4 className="font-semibold text-brand mb-3 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Ringkasan Skenario
                </h4>
                <div className="text-sm text-muted space-y-2">
                  <p><strong className="text-ink">Template:</strong> {selectedTemplate}</p>
                  <p><strong className="text-ink">Lampu yang putus:</strong> <span className="text-red-600">{formData.targetLamp}</span></p>
                  <p><strong className="text-ink">Efek pada lampu lain:</strong></p>
                  <ul className="ml-6 space-y-1">
                    {otherLamps.map(lamp => {
                      const state = (formData.correctStates || {})[lamp];
                      return (
                        <li key={lamp} className="text-muted">
                          {lamp}: {state === 'on' ? 'Menyala' : state === 'off' ? 'Padam' : 'Belum ditentukan'}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-ink/20">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-7 py-3.5 bg-brand border-2 border-ink text-white rounded-xl hover:bg-brand transition-all font-medium flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Preview Soal</span>
            </button>
            <button
              type="submit"
              className="px-7 py-3.5 bg-brand border-2 border-ink text-white rounded-xl hover:bg-brand transition-all font-medium flex items-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Simpan Soal</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}