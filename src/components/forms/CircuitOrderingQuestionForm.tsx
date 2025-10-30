'use client';

import React, { useState } from 'react';
import { CircuitOrderingQuestion } from '@/lib/questions';

interface CircuitOrderingQuestionFormProps {
  onSubmit: (question: CircuitOrderingQuestion) => void;
  initialData?: CircuitOrderingQuestion;
}

type CircuitTemplate = 'simple' | 'series' | 'parallel' | 'mixed' | 'complex-series' | 'complex-parallel' | 'mixed-advanced';
type BrightnessLevel = 'high' | 'medium' | 'low';

export default function CircuitOrderingQuestionForm({ onSubmit, initialData }: CircuitOrderingQuestionFormProps) {
  const [formData, setFormData] = useState<Partial<CircuitOrderingQuestion>>({
    questionType: 'circuitOrdering',
    title: '',
    description: '',
    explanation: '',
    hint: '',
    difficulty: 'easy',
    instruction: '',
    circuits: [
      {
        id: 'A',
        name: 'Rangkaian A',
        template: 'series',
        voltage: 12,
        resistors: [{ id: 'R1', value: 10, color: 'red' }],
        lamps: [{ id: 'L1', power: 0 }],
        brightnessLevel: 'medium',
        description: ''
      }
    ],
    correctOrder: ['A'],
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

    if (!formData.instruction?.trim()) {
      newErrors.instruction = 'Instruksi pengurutan harus diisi';
    }

    if (!formData.explanation?.trim()) {
      newErrors.explanation = 'Penjelasan harus diisi';
    }

    if (!formData.hint?.trim()) {
      newErrors.hint = 'Hint harus diisi';
    }

    // Validate circuits
    const circuits = formData.circuits || [];
    if (circuits.length < 2) {
      newErrors.circuits = 'Minimal harus ada 2 rangkaian untuk diurutkan';
    }

    circuits.forEach((circuit, index) => {
      if (!circuit.name?.trim()) {
        newErrors[`circuit-${index}-name`] = `Nama rangkaian ${circuit.id} harus diisi`;
      }
      if (!circuit.voltage || circuit.voltage <= 0) {
        newErrors[`circuit-${index}-voltage`] = `Tegangan rangkaian ${circuit.id} harus valid`;
      }
      if (!circuit.resistors || circuit.resistors.length === 0) {
        newErrors[`circuit-${index}-resistors`] = `Rangkaian ${circuit.id} harus memiliki resistor`;
      }
    });

    // Validate correct order
    if (!formData.correctOrder || formData.correctOrder.length !== circuits.length) {
      newErrors.correctOrder = 'Urutan yang benar harus ditentukan untuk semua rangkaian';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const question: CircuitOrderingQuestion = {
        id: initialData?.id || Date.now(),
        questionType: 'circuitOrdering',
        title: formData.title!,
        description: formData.description!,
        explanation: formData.explanation!,
        hint: formData.hint!,
        difficulty: formData.difficulty!,
        instruction: formData.instruction!,
        circuits: formData.circuits!,
        correctOrder: formData.correctOrder!,
      };

      onSubmit(question);
    }
  };

  const handleInputChange = (field: keyof CircuitOrderingQuestion, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addCircuit = () => {
    const circuits = formData.circuits || [];
    const newId = String.fromCharCode(65 + circuits.length); // A, B, C, ...
    const newCircuit = {
      id: newId,
      name: `Rangkaian ${newId}`,
      template: 'series' as CircuitTemplate,
      voltage: 12,
      resistors: [{ id: 'R1', value: 10, color: 'red' as const }],
      lamps: [{ id: 'L1', power: 0 }],
      brightnessLevel: 'medium' as BrightnessLevel,
      description: ''
    };
    
    const newCircuits = [...circuits, newCircuit];
    const newOrder = [...(formData.correctOrder || []), newId];
    
    handleInputChange('circuits', newCircuits);
    handleInputChange('correctOrder', newOrder);
  };

  const removeCircuit = (index: number) => {
    if ((formData.circuits || []).length > 2) {
      const circuits = [...(formData.circuits || [])];
      const removedId = circuits[index].id;
      circuits.splice(index, 1);
      
      // Update correct order
      const newOrder = (formData.correctOrder || []).filter(id => id !== removedId);
      
      handleInputChange('circuits', circuits);
      handleInputChange('correctOrder', newOrder);
    }
  };

  const updateCircuit = (index: number, field: string, value: any) => {
    const circuits = [...(formData.circuits || [])];
    circuits[index] = { ...circuits[index], [field]: value };
    handleInputChange('circuits', circuits);
    
    // Clear circuit-specific errors
    const errorKey = `circuit-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addResistor = (circuitIndex: number) => {
    const circuits = [...(formData.circuits || [])];
    const resistors = [...(circuits[circuitIndex].resistors || [])];
    const newResistorId = `R${resistors.length + 1}`;
    resistors.push({ id: newResistorId, value: 10, color: 'red' });
    circuits[circuitIndex] = { ...circuits[circuitIndex], resistors };
    handleInputChange('circuits', circuits);
  };

  const updateResistor = (circuitIndex: number, resistorIndex: number, field: string, value: any) => {
    const circuits = [...(formData.circuits || [])];
    const resistors = [...(circuits[circuitIndex].resistors || [])];
    resistors[resistorIndex] = { ...resistors[resistorIndex], [field]: value };
    circuits[circuitIndex] = { ...circuits[circuitIndex], resistors };
    handleInputChange('circuits', circuits);
  };

  const removeResistor = (circuitIndex: number, resistorIndex: number) => {
    const circuits = [...(formData.circuits || [])];
    const resistors = [...(circuits[circuitIndex].resistors || [])];
    if (resistors.length > 1) {
      resistors.splice(resistorIndex, 1);
      circuits[circuitIndex] = { ...circuits[circuitIndex], resistors };
      handleInputChange('circuits', circuits);
    }
  };

  const updateCorrectOrder = (newOrder: string[]) => {
    handleInputChange('correctOrder', newOrder);
    if (errors.correctOrder) {
      setErrors(prev => ({ ...prev, correctOrder: '' }));
    }
  };

  const COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'brown', 'orange'] as const;

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
              placeholder="contoh: Urutan Tingkat Kecerahan Lampu"
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
            placeholder="Berikan konteks tentang tujuan pengurutan rangkaian..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instruksi Pengurutan *
          </label>
          <input
            type="text"
            value={formData.instruction || ''}
            onChange={(e) => handleInputChange('instruction', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.instruction ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contoh: Urutkan dari paling terang ke paling redup"
          />
          {errors.instruction && <p className="text-red-500 text-sm mt-1">{errors.instruction}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hint untuk Siswa *
            </label>
            <textarea
              value={formData.hint || ''}
              onChange={(e) => handleInputChange('hint', e.target.value)}
              rows={2}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.hint ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="contoh: I = V/R. Daya total ~ V²/R_total"
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
              rows={2}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.explanation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jelaskan logika pengurutan..."
            />
            {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
          </div>
        </div>
      </div>

      {/* Circuits Configuration */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">Rangkaian yang Akan Diurutkan</h4>
          <button
            type="button"
            onClick={addCircuit}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            + Tambah Rangkaian
          </button>
        </div>

        <div className="space-y-6">
          {(formData.circuits || []).map((circuit, circuitIndex) => (
            <div key={circuit.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-700">Rangkaian {circuit.id}</h5>
                {(formData.circuits || []).length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeCircuit(circuitIndex)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Rangkaian
                  </label>
                  <input
                    type="text"
                    value={circuit.name}
                    onChange={(e) => updateCircuit(circuitIndex, 'name', e.target.value)}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`circuit-${circuitIndex}-name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    value={circuit.template}
                    onChange={(e) => updateCircuit(circuitIndex, 'template', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="simple">Sederhana</option>
                    <option value="series">Seri</option>
                    <option value="parallel">Paralel</option>
                    <option value="mixed">Campuran</option>
                    <option value="complex-series">Seri Kompleks</option>
                    <option value="complex-parallel">Paralel Kompleks</option>
                    <option value="mixed-advanced">Campuran Lanjutan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tegangan (V)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={circuit.voltage}
                    onChange={(e) => updateCircuit(circuitIndex, 'voltage', parseFloat(e.target.value))}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`circuit-${circuitIndex}-voltage`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              {/* Resistors */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Resistor</label>
                  <button
                    type="button"
                    onClick={() => addResistor(circuitIndex)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    + Resistor
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {(circuit.resistors || []).map((resistor, resistorIndex) => (
                    <div key={resistor.id} className="flex items-center space-x-2 p-2 border rounded bg-gray-50">
                      <input
                        type="text"
                        value={resistor.id}
                        onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'id', e.target.value)}
                        className="w-16 p-1 text-xs border rounded"
                        placeholder="R1"
                      />
                      <input
                        type="number"
                        value={resistor.value}
                        onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'value', parseFloat(e.target.value))}
                        className="w-20 p-1 text-xs border rounded"
                        placeholder="Ohm"
                      />
                      <select
                        value={resistor.color}
                        onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'color', e.target.value)}
                        className="w-20 p-1 text-xs border rounded"
                      >
                        {COLORS.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                      {(circuit.resistors || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResistor(circuitIndex, resistorIndex)}
                          className="px-1 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tingkat Kecerahan
                  </label>
                  <select
                    value={circuit.brightnessLevel}
                    onChange={(e) => updateCircuit(circuitIndex, 'brightnessLevel', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="high">Tinggi</option>
                    <option value="medium">Sedang</option>
                    <option value="low">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arus Total (opsional)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={circuit.totalCurrent || ''}
                    onChange={(e) => updateCircuit(circuitIndex, 'totalCurrent', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Rangkaian (opsional)
                </label>
                <textarea
                  value={circuit.description || ''}
                  onChange={(e) => updateCircuit(circuitIndex, 'description', e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deskripsi teknis rangkaian..."
                />
              </div>
            </div>
          ))}
        </div>

        {errors.circuits && <p className="text-red-500 text-sm mt-2">{errors.circuits}</p>}
      </div>

      {/* Correct Order */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">Urutan yang Benar</h4>
        <p className="text-sm text-gray-600 mb-3">
          Susun rangkaian sesuai dengan kriteria pengurutan (misalnya dari paling terang ke paling redup)
        </p>
        
        <div className="flex flex-wrap gap-2">
          {(formData.correctOrder || []).map((circuitId, index) => (
            <div key={`${circuitId}-${index}`} className="flex items-center space-x-2 p-2 bg-white border rounded">
              <span className="text-sm font-medium">#{index + 1}</span>
              <select
                value={circuitId}
                onChange={(e) => {
                  const newOrder = [...(formData.correctOrder || [])];
                  newOrder[index] = e.target.value;
                  updateCorrectOrder(newOrder);
                }}
                className="p-1 text-sm border rounded"
              >
                {(formData.circuits || []).map(circuit => (
                  <option key={circuit.id} value={circuit.id}>
                    {circuit.id} - {circuit.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        
        {errors.correctOrder && <p className="text-red-500 text-sm mt-2">{errors.correctOrder}</p>}
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