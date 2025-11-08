'use client';

import React, { useState } from 'react';
import { CircuitOrderingQuestion } from '@/lib/questions';
import { Settings, Zap, Lightbulb, CheckCircle2, HelpCircle, Eye, Edit, List, Target } from 'lucide-react';

interface CircuitOrderingQuestionFormProps {
  onSubmit: (question: CircuitOrderingQuestion) => void;
  initialData?: CircuitOrderingQuestion;
}

type CircuitTemplate = 'simple' | 'series' | 'parallel' | 'mixed' | 'complex-series' | 'complex-parallel' | 'mixed-advanced';
type BrightnessLevel = 'high' | 'medium' | 'low';

export default function CircuitOrderingQuestionForm({ onSubmit, initialData }: CircuitOrderingQuestionFormProps) {
  const [showPreview, setShowPreview] = useState(false);
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
    <div className="space-y-10">
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <List className="w-7 h-7 mr-3 text-pink-400" />
          Form Soal Pengurutan Rangkaian
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
        /* Preview Mode - Match TipeSoal2 Display */
        <div className="space-y-8">
          {/* Question Info */}
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
            <p className="text-blue-200/90 text-lg mb-4">{formData.description}</p>
            
            {/* Instruction Box */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30 mb-6">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-cyan-300 font-bold">Instruksi:</span>
              </div>
              <div className="text-white font-semibold">
                {formData.instruction || 'Urutkan rangkaian...'}
              </div>
            </div>

            {/* Hint Button */}
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-all"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Tampilkan Hint
            </button>
          </div>

          {/* Circuits Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(formData.circuits || []).map((circuit, idx) => (
              <div
                key={circuit.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-pink-400/40 transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{circuit.id}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    circuit.brightnessLevel === 'high' ? 'bg-yellow-400/20 text-yellow-300' :
                    circuit.brightnessLevel === 'medium' ? 'bg-orange-400/20 text-orange-300' :
                    'bg-red-400/20 text-red-300'
                  }`}>
                    {circuit.brightnessLevel === 'high' ? 'Terang' :
                     circuit.brightnessLevel === 'medium' ? 'Sedang' : 'Redup'}
                  </div>
                </div>
                
                <h4 className="text-white font-medium mb-3">{circuit.name}</h4>
                
                {/* Circuit Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Tegangan:</span>
                    <span className="text-white font-mono">{circuit.voltage}V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200/70">Template:</span>
                    <span className="text-white">{circuit.template}</span>
                  </div>
                  {circuit.totalCurrent && (
                    <div className="flex justify-between">
                      <span className="text-blue-200/70">Arus:</span>
                      <span className="text-white font-mono">{circuit.totalCurrent}A</span>
                    </div>
                  )}
                </div>

                {/* Drag indicator */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center text-white/40 text-xs">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ordering Slots Preview */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <List className="w-6 h-6 mr-2 text-pink-400" />
              Area Pengurutan
            </h4>
            <p className="text-sm text-blue-200/70 mb-4">Drag & drop rangkaian ke slot di bawah sesuai urutan yang benar</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(formData.circuits || []).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border-2 border-dashed border-pink-400/40 rounded-xl p-6 min-h-[120px] flex flex-col items-center justify-center"
                >
                  <div className="text-pink-400 font-bold mb-2">#{idx + 1}</div>
                  <div className="text-white/40 text-sm">Drop here</div>
                </div>
              ))}
            </div>
          </div>

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
              className="px-7 py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl"
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
              <Settings className="w-6 h-6 mr-3 text-pink-400" />
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
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all ${
                    errors.title ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="contoh: Urutan Tingkat Kecerahan Lampu"
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
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all"
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
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all resize-none ${
                  errors.description ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="Berikan konteks tentang tujuan pengurutan rangkaian..."
              />
              {errors.description && <p className="text-red-300 text-sm mt-1.5">{errors.description}</p>}
            </div>

            <div className="pl-9">
              <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Instruksi Pengurutan *
              </label>
              <input
                type="text"
                value={formData.instruction || ''}
                onChange={(e) => handleInputChange('instruction', e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all ${
                  errors.instruction ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="contoh: Urutkan dari paling terang ke paling redup"
              />
              {errors.instruction && <p className="text-red-300 text-sm mt-1.5">{errors.instruction}</p>}
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
                  placeholder="contoh: I = V/R. Daya total ~ V²/R_total"
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
                  placeholder="Jelaskan logika pengurutan..."
                />
                {errors.explanation && <p className="text-red-300 text-sm mt-1.5">{errors.explanation}</p>}
              </div>
            </div>
          </div>

          {/* Rangkaian Configuration */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-xl font-bold text-white flex items-center">
                <Zap className="w-6 h-6 mr-3 text-purple-400" />
                Rangkaian yang Akan Diurutkan
              </h4>
              <button
                type="button"
                onClick={addCircuit}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                + Tambah Rangkaian
              </button>
            </div>

            <div className="space-y-6 pl-9">
              {(formData.circuits || []).map((circuit, circuitIndex) => (
                <div key={circuit.id} className="p-5 bg-white/5 border-2 border-white/10 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-white text-lg">Rangkaian {circuit.id}</h5>
                    {(formData.circuits || []).length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeCircuit(circuitIndex)}
                        className="px-3 py-1.5 text-sm bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Nama Rangkaian
                      </label>
                      <input
                        type="text"
                        value={circuit.name}
                        onChange={(e) => updateCircuit(circuitIndex, 'name', e.target.value)}
                        className={`w-full px-4 py-2.5 bg-white/5 border-2 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all ${
                          errors[`circuit-${circuitIndex}-name`] ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Template
                      </label>
                      <select
                        value={circuit.template}
                        onChange={(e) => updateCircuit(circuitIndex, 'template', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all"
                      >
                        <option value="simple" className="bg-gray-800">Sederhana</option>
                        <option value="series" className="bg-gray-800">Seri</option>
                        <option value="parallel" className="bg-gray-800">Paralel</option>
                        <option value="mixed" className="bg-gray-800">Campuran</option>
                        <option value="complex-series" className="bg-gray-800">Seri Kompleks</option>
                        <option value="complex-parallel" className="bg-gray-800">Paralel Kompleks</option>
                        <option value="mixed-advanced" className="bg-gray-800">Campuran Lanjutan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Tegangan (V)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={circuit.voltage}
                        onChange={(e) => updateCircuit(circuitIndex, 'voltage', parseFloat(e.target.value))}
                        className={`w-full px-4 py-2.5 bg-white/5 border-2 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all ${
                          errors[`circuit-${circuitIndex}-voltage`] ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Resistors */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-blue-200">Resistor</label>
                      <button
                        type="button"
                        onClick={() => addResistor(circuitIndex)}
                        className="px-3 py-1.5 text-xs bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        + Resistor
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(circuit.resistors || []).map((resistor, resistorIndex) => (
                        <div key={resistor.id} className="flex items-center space-x-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                          <input
                            type="text"
                            value={resistor.id}
                            onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'id', e.target.value)}
                            className="w-16 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white"
                            placeholder="R1"
                          />
                          <input
                            type="number"
                            value={resistor.value}
                            onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'value', parseFloat(e.target.value))}
                            className="w-24 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white"
                            placeholder="Ohm"
                          />
                          <select
                            value={resistor.color}
                            onChange={(e) => updateResistor(circuitIndex, resistorIndex, 'color', e.target.value)}
                            className="w-24 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white"
                          >
                            {COLORS.map(color => (
                              <option key={color} value={color} className="bg-gray-800">{color}</option>
                            ))}
                          </select>
                          {(circuit.resistors || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeResistor(circuitIndex, resistorIndex)}
                              className="px-2 py-1 text-xs bg-red-500/80 text-white rounded hover:bg-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Tingkat Kecerahan
                      </label>
                      <select
                        value={circuit.brightnessLevel}
                        onChange={(e) => updateCircuit(circuitIndex, 'brightnessLevel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all"
                      >
                        <option value="high" className="bg-gray-800">Tinggi</option>
                        <option value="medium" className="bg-gray-800">Sedang</option>
                        <option value="low" className="bg-gray-800">Rendah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Arus Total (opsional)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={circuit.totalCurrent || ''}
                        onChange={(e) => updateCircuit(circuitIndex, 'totalCurrent', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Deskripsi Rangkaian (opsional)
                    </label>
                    <textarea
                      value={circuit.description || ''}
                      onChange={(e) => updateCircuit(circuitIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all resize-none"
                      placeholder="Deskripsi teknis rangkaian..."
                    />
                  </div>
                </div>
              ))}
            </div>

            {errors.circuits && <p className="text-red-300 text-sm pl-9 mt-2">{errors.circuits}</p>}
          </div>

          {/* Urutan yang Benar */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
              Urutan yang Benar
            </h4>
            
            <p className="text-sm text-blue-200/70 pl-9">
              Susun rangkaian sesuai dengan kriteria pengurutan (misalnya dari paling terang ke paling redup)
            </p>
            
            <div className="flex flex-wrap gap-3 pl-9">
              {(formData.correctOrder || []).map((circuitId, index) => (
                <div key={`${circuitId}-${index}`} className="flex items-center space-x-2 p-3 bg-white/5 border-2 border-white/10 rounded-lg">
                  <span className="text-sm font-medium text-pink-400">#{index + 1}</span>
                  <select
                    value={circuitId}
                    onChange={(e) => {
                      const newOrder = [...(formData.correctOrder || [])];
                      newOrder[index] = e.target.value;
                      updateCorrectOrder(newOrder);
                    }}
                    className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-400/60 focus:bg-white/10"
                  >
                    {(formData.circuits || []).map(circuit => (
                      <option key={circuit.id} value={circuit.id} className="bg-gray-800">
                        {circuit.id} - {circuit.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            {errors.correctOrder && <p className="text-red-300 text-sm pl-9 mt-2">{errors.correctOrder}</p>}
          </div>

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
              className="px-7 py-3.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
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