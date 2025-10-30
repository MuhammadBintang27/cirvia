'use client';

import React, { useState, useEffect } from 'react';
import { CircuitQuestion, availableResistors, Resistor } from '@/lib/questions';

interface CircuitQuestionFormProps {
  onSubmit: (question: CircuitQuestion) => void;
  initialData?: CircuitQuestion;
}

export default function CircuitQuestionForm({ onSubmit, initialData }: CircuitQuestionFormProps) {
  const [formData, setFormData] = useState<Partial<CircuitQuestion>>({
    questionType: 'circuit',
    title: '',
    description: '',
    explanation: '',
    hint: '',
    difficulty: 'easy',
    circuitType: 'series',
    voltage: 12,
    targetCurrent: undefined,
    targetVoltage: undefined,
    resistorSlots: 2,
    availableResistors: availableResistors.slice(0, 6),
    correctSolution: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedResistors, setSelectedResistors] = useState<number[]>(
    initialData?.availableResistors?.map(r => r.id) || [1, 2, 3, 4, 5, 6]
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Judul soal harus diisi';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Deskripsi soal harus diisi';
    }

    if (!formData.explanation?.trim()) {
      newErrors.explanation = 'Penjelasan harus diisi';
    }

    if (!formData.hint?.trim()) {
      newErrors.hint = 'Hint harus diisi';
    }

    if (!formData.voltage || formData.voltage <= 0) {
      newErrors.voltage = 'Tegangan harus berupa angka positif';
    }

    if (!formData.targetCurrent && !formData.targetVoltage) {
      newErrors.target = 'Harus ada target arus ATAU target tegangan';
    }

    if (formData.targetCurrent && formData.targetCurrent <= 0) {
      newErrors.targetCurrent = 'Target arus harus berupa angka positif';
    }

    if (formData.targetVoltage && formData.targetVoltage <= 0) {
      newErrors.targetVoltage = 'Target tegangan harus berupa angka positif';
    }

    if (!formData.resistorSlots || formData.resistorSlots < 1 || formData.resistorSlots > 5) {
      newErrors.resistorSlots = 'Jumlah slot resistor harus antara 1-5';
    }

    if (selectedResistors.length < 3) {
      newErrors.resistors = 'Minimal pilih 3 resistor untuk pilihan siswa';
    }

    if (!formData.correctSolution || formData.correctSolution.length === 0) {
      newErrors.correctSolution = 'Harus ada solusi yang benar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const question: CircuitQuestion = {
        id: initialData?.id || Date.now(),
        questionType: 'circuit',
        title: formData.title!,
        description: formData.description!,
        explanation: formData.explanation!,
        hint: formData.hint!,
        difficulty: formData.difficulty!,
        circuitType: formData.circuitType!,
        voltage: formData.voltage!,
        targetCurrent: formData.targetCurrent,
        targetVoltage: formData.targetVoltage,
        resistorSlots: formData.resistorSlots!,
        availableResistors: availableResistors.filter(r => selectedResistors.includes(r.id)),
        correctSolution: formData.correctSolution!,
      };

      onSubmit(question);
    }
  };

  const handleInputChange = (field: keyof CircuitQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResistorToggle = (resistorId: number) => {
    setSelectedResistors(prev => {
      if (prev.includes(resistorId)) {
        return prev.filter(id => id !== resistorId);
      } else {
        return [...prev, resistorId];
      }
    });
  };

  const handleCorrectSolutionChange = (index: number, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newSolution = [...(formData.correctSolution || [])];
      newSolution[index] = numValue;
      handleInputChange('correctSolution', newSolution);
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
              placeholder="contoh: Rangkaian Seri Dasar"
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
            rows={4}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jelaskan apa yang harus dilakukan siswa dalam soal ini..."
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

      {/* Circuit Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Konfigurasi Rangkaian</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Rangkaian
            </label>
            <select
              value={formData.circuitType || 'series'}
              onChange={(e) => handleInputChange('circuitType', e.target.value as 'series' | 'parallel')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="series">Seri</option>
              <option value="parallel">Paralel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tegangan Sumber (V) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.voltage || ''}
              onChange={(e) => handleInputChange('voltage', parseFloat(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.voltage ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12"
            />
            {errors.voltage && <p className="text-red-500 text-sm mt-1">{errors.voltage}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Slot Resistor
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.resistorSlots || ''}
              onChange={(e) => handleInputChange('resistorSlots', parseInt(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.resistorSlots ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2"
            />
            {errors.resistorSlots && <p className="text-red-500 text-sm mt-1">{errors.resistorSlots}</p>}
          </div>
        </div>

        {/* Target Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Arus (A)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.targetCurrent || ''}
              onChange={(e) => handleInputChange('targetCurrent', e.target.value ? parseFloat(e.target.value) : undefined)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.targetCurrent ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.1"
            />
            {errors.targetCurrent && <p className="text-red-500 text-sm mt-1">{errors.targetCurrent}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Tegangan (V)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.targetVoltage || ''}
              onChange={(e) => handleInputChange('targetVoltage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.targetVoltage ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="4.0"
            />
            {errors.targetVoltage && <p className="text-red-500 text-sm mt-1">{errors.targetVoltage}</p>}
          </div>
        </div>

        {(errors.target) && (
          <p className="text-red-500 text-sm mt-2">{errors.target}</p>
        )}
      </div>

      {/* Available Resistors */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Resistor yang Tersedia untuk Siswa</h4>
        <p className="text-sm text-gray-600 mb-4">
          Pilih resistor mana saja yang akan tersedia untuk siswa pilih (minimal 3)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {availableResistors.map((resistor) => (
            <label key={resistor.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedResistors.includes(resistor.id)}
                onChange={() => handleResistorToggle(resistor.id)}
                className="rounded"
              />
              <div className="text-sm">
                <div className="font-medium">{resistor.label}</div>
                <div className="text-gray-500">{resistor.value}Ω</div>
              </div>
            </label>
          ))}
        </div>
        {errors.resistors && <p className="text-red-500 text-sm mt-2">{errors.resistors}</p>}
      </div>

      {/* Correct Solution */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Solusi yang Benar</h4>
        <p className="text-sm text-gray-600 mb-4">
          Masukkan nilai resistor (dalam Ohm) yang merupakan jawaban benar untuk soal ini
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: formData.resistorSlots || 2 }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resistor {index + 1}
              </label>
              <select
                value={(formData.correctSolution || [])[index] || ''}
                onChange={(e) => handleCorrectSolutionChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih resistor...</option>
                {availableResistors
                  .filter(r => selectedResistors.includes(r.id))
                  .map(resistor => (
                    <option key={resistor.id} value={resistor.value}>
                      {resistor.label} ({resistor.value}Ω)
                    </option>
                  ))
                }
              </select>
            </div>
          ))}
        </div>
        {errors.correctSolution && <p className="text-red-500 text-sm mt-2">{errors.correctSolution}</p>}
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