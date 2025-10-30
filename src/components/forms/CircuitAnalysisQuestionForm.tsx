'use client';

import React, { useState } from 'react';
import { CircuitAnalysisQuestion, CIRCUIT_TEMPLATES, CircuitTemplateType } from '@/lib/questions';

interface CircuitAnalysisQuestionFormProps {
  onSubmit: (question: CircuitAnalysisQuestion) => void;
  initialData?: CircuitAnalysisQuestion;
}

export default function CircuitAnalysisQuestionForm({ onSubmit, initialData }: CircuitAnalysisQuestionFormProps) {
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
              placeholder="contoh: Analisis Rangkaian Campuran - L3 Putus"
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
            placeholder="Berikan konteks untuk skenario analisis rangkaian..."
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
              placeholder="Berikan petunjuk cara menganalisis rangkaian..."
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
              placeholder="Jelaskan alur analisis dan alasan jawaban..."
            />
            {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
          </div>
        </div>
      </div>

      {/* Circuit Analysis Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Konfigurasi Analisis Rangkaian</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Rangkaian
          </label>
          <div className="space-y-3">
            {Object.entries(CIRCUIT_TEMPLATES).map(([key, template]) => (
              <label key={key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name="circuitTemplate"
                  value={key}
                  checked={selectedTemplate === key}
                  onChange={() => handleTemplateChange(key as CircuitTemplateType)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-800">{key}</div>
                  <div className="text-sm text-gray-600">
                    {TEMPLATE_DESCRIPTIONS[key as CircuitTemplateType]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Lampu: {template.components.filter(c => c.type === 'lamp').map(c => c.id).join(', ')}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pertanyaan Analisis *
          </label>
          <textarea
            value={formData.question || ''}
            onChange={(e) => handleInputChange('question', e.target.value)}
            rows={3}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contoh: Jika lampu L3 padam (putus), lampu mana yang ikut padam dan mana yang tetap menyala?"
          />
          {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
        </div>
      </div>

      {/* Target Lamp and States */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Skenario Kerusakan</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lampu yang Rusak/Putus *
            </label>
            <select
              value={formData.targetLamp || ''}
              onChange={(e) => handleInputChange('targetLamp', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.targetLamp ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih lampu yang rusak...</option>
              {availableLamps.map(lamp => (
                <option key={lamp} value={lamp}>
                  {lamp}
                </option>
              ))}
            </select>
            {errors.targetLamp && <p className="text-red-500 text-sm mt-1">{errors.targetLamp}</p>}
          </div>
        </div>

        {formData.targetLamp && otherLamps.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status Lampu Lain setelah {formData.targetLamp} Putus *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {otherLamps.map(lamp => (
                <div key={lamp} className="p-3 border rounded-lg bg-white">
                  <div className="font-medium text-gray-700 mb-2">{lamp}</div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`lamp-${lamp}`}
                        value="on"
                        checked={(formData.correctStates || {})[lamp] === 'on'}
                        onChange={() => handleLampStateChange(lamp, 'on')}
                        className="text-green-600"
                      />
                      <span className="text-sm text-green-600">Menyala</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`lamp-${lamp}`}
                        value="off"
                        checked={(formData.correctStates || {})[lamp] === 'off'}
                        onChange={() => handleLampStateChange(lamp, 'off')}
                        className="text-red-600"
                      />
                      <span className="text-sm text-red-600">Padam</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {errors.correctStates && <p className="text-red-500 text-sm mt-2">{errors.correctStates}</p>}
          </div>
        )}
      </div>

      {/* Summary */}
      {formData.targetLamp && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Ringkasan Skenario</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Template:</strong> {selectedTemplate}</p>
            <p><strong>Lampu yang putus:</strong> {formData.targetLamp}</p>
            <p><strong>Efek pada lampu lain:</strong></p>
            <ul className="ml-4 space-y-1">
              {otherLamps.map(lamp => {
                const state = (formData.correctStates || {})[lamp];
                return (
                  <li key={lamp}>
                    {lamp}: {state === 'on' ? '🟢 Menyala' : state === 'off' ? '🔴 Padam' : '⚪ Belum ditentukan'}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

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