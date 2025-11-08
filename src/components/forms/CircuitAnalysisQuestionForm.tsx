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
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Zap className="w-7 h-7 mr-3 text-cyan-400" />
          Form Soal Analisis Rangkaian
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/30 text-white rounded-xl transition-all flex items-center space-x-2"
        >
          {showPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPreview ? 'Edit' : 'Preview'}</span>
        </button>
      </div>

      {showPreview ? (
        /* Preview Mode - Match TipeSoal4 Display */
        <div className="space-y-8">
          {/* Question Header */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                formData.difficulty === 'easy' ? 'bg-green-400' : 
                formData.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-white/70 text-sm font-medium uppercase">
                {formData.difficulty === 'easy' ? 'Mudah' : 
                 formData.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">{formData.title || 'Judul Soal'}</h2>
            
            {/* Target Lamp Info */}
            <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg mb-4">
              <div className="flex items-center space-x-3">
                <X className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-red-300 font-semibold">
                    Lampu {formData.targetLamp || '?'} PADAM
                  </p>
                  <p className="text-red-200/80 text-sm">
                    {formData.description}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-blue-200/90 text-lg">{formData.question}</p>
          </div>

          {/* Circuit Visualization */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-white/10 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                Rangkaian Listrik
              </h3>
              <p className="text-gray-300 text-sm">
                Template: <span className="text-cyan-400 font-medium">{selectedTemplate}</span>
              </p>
              <p className="text-gray-300 text-sm">
                Klik lampu untuk memprediksi kondisi Nyala/Padam
              </p>
            </div>
            
            {/* Simplified Circuit Display */}
            <div className="w-full h-80 bg-slate-900/30 rounded-lg border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  {/* Battery Icon */}
                  <div className="inline-flex items-center justify-center w-20 h-12 bg-green-500/20 border-2 border-green-400 rounded-lg mb-2">
                    <span className="text-green-400 font-bold text-xs">+12V</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* Example lamps */}
                  {['L1', 'L2', 'L3'].map((lamp, idx) => (
                    <div key={lamp} className="flex flex-col items-center">
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${
                        formData.targetLamp === lamp 
                          ? 'bg-red-900/30 border-red-500' 
                          : 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                      }`}>
                        {formData.targetLamp === lamp ? (
                          <X className="w-8 h-8 text-red-400" />
                        ) : (
                          <Lightbulb className="w-8 h-8 text-yellow-300" />
                        )}
                      </div>
                      <span className="text-white font-bold mt-2">{lamp}</span>
                      {formData.targetLamp !== lamp && (
                        <div className="mt-2 text-xs">
                          <button className="px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-xs">
                            Nyala
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-white/50 text-sm mt-6">
                  Preview diagram rangkaian (template: {selectedTemplate})
                </p>
              </div>
            </div>
          </div>

          {/* Lamp States Summary */}
          {formData.correctStates && Object.keys(formData.correctStates).length > 0 && (
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-cyan-400" />
                Status Lampu yang Benar
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.correctStates).map(([lampId, state]) => (
                  <div key={lampId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{lampId}</span>
                      <div className={`flex items-center px-3 py-1 rounded-full ${
                        state === 'on' 
                          ? 'bg-yellow-400/20 text-yellow-300' 
                          : 'bg-gray-500/20 text-gray-400'
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
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border-2 border-yellow-400/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Hint
              </h4>
              <p className="text-blue-100/80 text-sm">{formData.hint || 'Belum diisi'}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border-2 border-green-400/20 rounded-xl p-6">
              <h4 className="text-lg font-bold text-green-300 mb-3 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Penjelasan
              </h4>
              <p className="text-blue-100/80 text-sm">{formData.explanation || 'Belum diisi'}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl"
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
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Settings className="w-6 h-6 mr-3 text-cyan-400" />
              Informasi Dasar
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Judul Soal *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all ${
                    errors.title ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="contoh: Analisis Rangkaian Campuran - L3 Putus"
                />
                {errors.title && <p className="text-red-300 text-sm mt-1.5">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Tingkat Kesulitan
                </label>
                <select
                  value={formData.difficulty || 'easy'}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all"
                >
                  <option value="easy" className="bg-gray-800">Mudah</option>
                  <option value="medium" className="bg-gray-800">Sedang</option>
                  <option value="hard" className="bg-gray-800">Sulit</option>
                </select>
              </div>
            </div>

            <div className="pl-9">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Deskripsi Soal *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all resize-none ${
                  errors.description ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="Berikan konteks untuk skenario analisis rangkaian..."
              />
              {errors.description && <p className="text-red-300 text-sm mt-1.5">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-yellow-300 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint untuk Siswa *
                </label>
                <textarea
                  value={formData.hint || ''}
                  onChange={(e) => handleInputChange('hint', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-yellow-400/60 focus:bg-white/10 transition-all resize-none ${
                    errors.hint ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="Berikan petunjuk cara menganalisis rangkaian..."
                />
                {errors.hint && <p className="text-red-300 text-sm mt-1.5">{errors.hint}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-300 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Penjelasan Jawaban *
                </label>
                <textarea
                  value={formData.explanation || ''}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-green-400/60 focus:bg-white/10 transition-all resize-none ${
                    errors.explanation ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="Jelaskan alur analisis dan alasan jawaban..."
                />
                {errors.explanation && <p className="text-red-300 text-sm mt-1.5">{errors.explanation}</p>}
              </div>
            </div>
          </div>

          {/* Konfigurasi Analisis Rangkaian */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Zap className="w-6 h-6 mr-3 text-yellow-400" />
              Konfigurasi Analisis Rangkaian
            </h4>
            
            <div className="pl-9 space-y-4">
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Template Rangkaian
              </label>
              <div className="space-y-3">
                {Object.entries(CIRCUIT_TEMPLATES).map(([key, template]) => (
                  <label key={key} className="flex items-start space-x-3 p-4 bg-white/5 border-2 border-white/10 hover:border-cyan-400/40 rounded-xl cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="circuitTemplate"
                      value={key}
                      checked={selectedTemplate === key}
                      onChange={() => handleTemplateChange(key as CircuitTemplateType)}
                      className="mt-1 text-cyan-500 focus:ring-cyan-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{key}</div>
                      <div className="text-sm text-blue-200/70 mt-1">
                        {TEMPLATE_DESCRIPTIONS[key as CircuitTemplateType]}
                      </div>
                      <div className="text-xs text-blue-300/50 mt-2">
                        Lampu: {template.components.filter(c => c.type === 'lamp').map(c => c.id).join(', ')}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pl-9">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Pertanyaan Analisis *
              </label>
              <textarea
                value={formData.question || ''}
                onChange={(e) => handleInputChange('question', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all resize-none ${
                  errors.question ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="contoh: Jika lampu L3 padam (putus), lampu mana yang ikut padam dan mana yang tetap menyala?"
              />
              {errors.question && <p className="text-red-300 text-sm mt-1.5">{errors.question}</p>}
            </div>
          </div>

          {/* Skenario Kerusakan */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Target className="w-6 h-6 mr-3 text-red-400" />
              Skenario Kerusakan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Lampu yang Rusak/Putus *
                </label>
                <select
                  value={formData.targetLamp || ''}
                  onChange={(e) => handleInputChange('targetLamp', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white focus:outline-none focus:border-red-400/60 focus:bg-white/10 transition-all ${
                    errors.targetLamp ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <option value="" className="bg-gray-800">Pilih lampu yang rusak...</option>
                  {availableLamps.map(lamp => (
                    <option key={lamp} value={lamp} className="bg-gray-800">
                      {lamp}
                    </option>
                  ))}
                </select>
                {errors.targetLamp && <p className="text-red-300 text-sm mt-1.5">{errors.targetLamp}</p>}
              </div>
            </div>

            {formData.targetLamp && otherLamps.length > 0 && (
              <div className="pl-9">
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Status Lampu Lain setelah {formData.targetLamp} Putus *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {otherLamps.map(lamp => (
                    <div key={lamp} className="p-4 bg-white/5 border-2 border-white/10 rounded-xl">
                      <div className="font-medium text-white mb-3">{lamp}</div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`lamp-${lamp}`}
                            value="on"
                            checked={(formData.correctStates || {})[lamp] === 'on'}
                            onChange={() => handleLampStateChange(lamp, 'on')}
                            className="text-green-500 focus:ring-green-500"
                          />
                          <span className="text-sm text-green-400">Menyala</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`lamp-${lamp}`}
                            value="off"
                            checked={(formData.correctStates || {})[lamp] === 'off'}
                            onChange={() => handleLampStateChange(lamp, 'off')}
                            className="text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm text-red-400">Padam</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.correctStates && <p className="text-red-300 text-sm mt-2">{errors.correctStates}</p>}
              </div>
            )}
          </div>

          {/* Summary */}
          {formData.targetLamp && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border-2 border-cyan-400/20 rounded-xl p-6">
                <h4 className="font-semibold text-cyan-300 mb-3 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Ringkasan Skenario
                </h4>
                <div className="text-sm text-blue-100/90 space-y-2">
                  <p><strong className="text-white">Template:</strong> {selectedTemplate}</p>
                  <p><strong className="text-white">Lampu yang putus:</strong> <span className="text-red-400">{formData.targetLamp}</span></p>
                  <p><strong className="text-white">Efek pada lampu lain:</strong></p>
                  <ul className="ml-6 space-y-1">
                    {otherLamps.map(lamp => {
                      const state = (formData.correctStates || {})[lamp];
                      return (
                        <li key={lamp} className="text-blue-100/80">
                          {lamp}: {state === 'on' ? '🟢 Menyala' : state === 'off' ? '🔴 Padam' : '⚪ Belum ditentukan'}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-7 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Preview Soal</span>
            </button>
            <button
              type="submit"
              className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
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