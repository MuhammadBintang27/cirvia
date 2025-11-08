'use client';

import React, { useState, useEffect } from 'react';
import { CircuitQuestion } from '@/lib/questions';
import { Settings, Zap, Target, Eye, Edit, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface CircuitQuestionFormProps {
  onSubmit: (question: CircuitQuestion) => void;
  initialData?: CircuitQuestion;
}

// Interface for resistor options that teacher will define
interface ResistorOption {
  id: string;
  value: number;
  label: string;
}

export default function CircuitQuestionForm({ onSubmit, initialData }: CircuitQuestionFormProps) {
  const [showPreview, setShowPreview] = useState(false);
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
    ...initialData
  });

  // Teacher-defined resistor options (flexible system)
  const [resistorOptions, setResistorOptions] = useState<ResistorOption[]>([
    { id: '1', value: 100, label: 'R1 (100Ω)' },
    { id: '2', value: 200, label: 'R2 (200Ω)' },
    { id: '3', value: 300, label: 'R3 (300Ω)' }
  ]);
  
  // Correct solution as array of resistor values
  const [correctSolution, setCorrectSolution] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize data from existing question if provided
  useEffect(() => {
    if (initialData && (initialData as any).teacherSettings) {
      const settings = (initialData as any).teacherSettings;
      if (settings.resistorOptions) {
        setResistorOptions(settings.resistorOptions.map((r: any, i: number) => ({
          id: (i + 1).toString(),
          value: r.value,
          label: r.label
        })));
      }
      if (settings.correctSolution) {
        setCorrectSolution(settings.correctSolution);
      }
    }
  }, [initialData]);

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

    if (resistorOptions.length < 3) {
      newErrors.resistors = 'Minimal berikan 3 pilihan resistor untuk siswa';
    }

    if (correctSolution.length === 0 || correctSolution.length !== formData.resistorSlots) {
      newErrors.correctSolution = 'Semua slot resistor harus diisi dengan solusi yang benar';
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
        resistorSlots: formData.resistorSlots!
      };

      // Store teacher-defined resistor options and solution in a special format
      // This will be used by the teacher assignment system
      (question as any).teacherSettings = {
        resistorOptions: resistorOptions.map(r => ({ value: r.value, label: r.label })),
        correctSolution: correctSolution
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

  // Add new resistor option
  const handleAddResistor = () => {
    const newId = (resistorOptions.length + 1).toString();
    setResistorOptions(prev => [...prev, {
      id: newId,
      value: 100,
      label: `R${newId} (100Ω)`
    }]);
  };

  // Remove resistor option
  const handleRemoveResistor = (id: string) => {
    if (resistorOptions.length > 3) { // Keep minimum 3 resistors
      setResistorOptions(prev => prev.filter(r => r.id !== id));
    }
  };

  // Update resistor option value
  const handleResistorValueChange = (id: string, value: number) => {
    setResistorOptions(prev => prev.map(r => 
      r.id === id 
        ? { ...r, value, label: `R${id} (${value}Ω)` }
        : r
    ));
  };

  // Handle correct solution change
  const handleCorrectSolutionChange = (index: number, value: number) => {
    const newSolution = [...correctSolution];
    newSolution[index] = value;
    setCorrectSolution(newSolution);
  };

  return (
    <div className="space-y-8">
      {/* Toggle Preview/Edit */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Settings className="w-7 h-7 mr-3 text-emerald-400" />
          {showPreview ? 'Preview Soal Rangkaian' : 'Form Soal Rangkaian'}
        </h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-500/30 transition-all font-medium"
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
        /* PREVIEW MODE - Match TipeSoal1 Display */
        <div className="space-y-8 animate-fadeIn">
          {/* Main Grid - Question on Left, Circuit on Right */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Question Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {formData.title || 'Judul Soal Rangkaian'}
                </h2>
                <p className="text-blue-200/90 text-lg mb-6">
                  {formData.description || 'Deskripsi soal rangkaian...'}
                </p>

                {/* Hint Button */}
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-all"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Sembunyikan Hint
                </button>

                {/* Hint Display */}
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-400/30">
                  <p className="text-yellow-200">{formData.hint || 'Hint akan ditampilkan di sini...'}</p>
                </div>
              </div>

              {/* Resistor Options Preview */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h4 className="text-white font-bold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-emerald-400" />
                  Pilih Resistor
                </h4>
                <p className="text-sm text-blue-200/70 mb-4">Klik pada slot resistor untuk menempatkan komponen</p>
                <div className="grid grid-cols-3 gap-3">
                  {resistorOptions.slice(0, 6).map((resistor, idx) => (
                    <div
                      key={resistor.id}
                      className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 rounded-lg border border-emerald-400/30 text-center cursor-pointer hover:bg-emerald-500/20 transition-all"
                    >
                      <div className="text-white font-mono font-bold">{resistor.value}Ω</div>
                      <div className="text-xs text-emerald-300/70 mt-1">{resistor.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Circuit Diagram Preview */}
            <div className="space-y-6">
              {/* Circuit Display */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Diagram Rangkaian {formData.circuitType === 'series' ? 'Seri' : 'Paralel'}
                  </h3>
                  <div className="px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <span className="text-purple-300 text-sm font-medium">
                      🔗 Rangkaian {formData.circuitType === 'series' ? 'Seri' : 'Paralel'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-blue-200/70 mb-6 text-center">
                  Klik pada slot atau drag & drop resistor untuk menempatkan komponen
                </p>

                {/* Simplified Circuit Representation */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border-2 border-dashed border-blue-400/30 min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">⚡</div>
                    <div className="text-white font-bold text-lg">{formData.voltage}V</div>
                    <div className="text-blue-200/70 text-sm">
                      {formData.resistorSlots} Slot Resistor
                    </div>
                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: formData.resistorSlots || 2 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-16 h-12 bg-white/5 border-2 border-dashed border-emerald-400/50 rounded-lg flex items-center justify-center text-emerald-300 text-xs"
                        >
                          Slot {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target & Results Preview */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h4 className="text-white font-bold mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                  Target & Hasil Perhitungan
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-400/30">
                    <span className="text-blue-200/70">Target:</span>
                    <span className="text-emerald-300 font-mono font-bold">
                      {formData.targetCurrent ? `${formData.targetCurrent} A` : 
                       formData.targetVoltage ? `${formData.targetVoltage} V` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-white/10">
                    <span className="text-blue-200/70">Resistansi Total:</span>
                    <span className="text-white font-mono">- Ω</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-white/10">
                    <span className="text-blue-200/70">Arus Total:</span>
                    <span className="text-white font-mono">- A</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-blue-200/70">Daya Total:</span>
                    <span className="text-white font-mono">- W</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Section */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm p-6 rounded-xl border-l-4 border-green-400">
            <h5 className="font-bold text-green-300 mb-3 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Penjelasan Jawaban
            </h5>
            <p className="text-green-200/80 text-sm">{formData.explanation || 'Penjelasan akan ditampilkan setelah submit...'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
            >
              Kembali Edit
            </button>
          </div>
        </div>
      ) : (
        /* EDIT MODE - Flat Layout */
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Informasi Dasar */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Settings className="w-6 h-6 mr-3 text-emerald-400" />
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
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all ${
                    errors.title ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="contoh: Rangkaian Seri Dasar"
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
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all"
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
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all resize-none ${
                  errors.description ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="Jelaskan apa yang harus dilakukan siswa dalam soal ini..."
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
                  placeholder="Berikan petunjuk untuk membantu siswa..."
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
                  placeholder="Jelaskan mengapa jawaban ini benar..."
                />
                {errors.explanation && <p className="text-red-300 text-sm mt-1.5">{errors.explanation}</p>}
              </div>
            </div>
          </div>

          {/* Konfigurasi Rangkaian */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Zap className="w-6 h-6 mr-3 text-yellow-400" />
              Konfigurasi Rangkaian
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Tipe Rangkaian
                </label>
                <select
                  value={formData.circuitType || 'series'}
                  onChange={(e) => handleInputChange('circuitType', e.target.value as 'series' | 'parallel')}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all"
                >
                  <option value="series" className="bg-gray-800">Seri</option>
                  <option value="parallel" className="bg-gray-800">Paralel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Tegangan Sumber (V) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.voltage || ''}
                  onChange={(e) => handleInputChange('voltage', parseFloat(e.target.value))}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all ${
                    errors.voltage ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="12"
                />
                {errors.voltage && <p className="text-red-300 text-sm mt-1.5">{errors.voltage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Jumlah Slot Resistor
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.resistorSlots || ''}
                  onChange={(e) => handleInputChange('resistorSlots', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-emerald-400/60 focus:bg-white/10 transition-all ${
                    errors.resistorSlots ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="2"
                />
                {errors.resistorSlots && <p className="text-red-300 text-sm mt-1.5">{errors.resistorSlots}</p>}
              </div>
            </div>
          </div>

          {/* Target Settings */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Target Perhitungan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-9">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Target Arus (A)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.targetCurrent || ''}
                  onChange={(e) => handleInputChange('targetCurrent', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all ${
                    errors.targetCurrent ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="0.1"
                />
                {errors.targetCurrent && <p className="text-red-300 text-sm mt-1.5">{errors.targetCurrent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Target Tegangan (V)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetVoltage || ''}
                  onChange={(e) => handleInputChange('targetVoltage', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-400/60 focus:bg-white/10 transition-all ${
                    errors.targetVoltage ? 'border-red-400/60 bg-red-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                  placeholder="4.0"
                />
                {errors.targetVoltage && <p className="text-red-300 text-sm mt-1.5">{errors.targetVoltage}</p>}
              </div>
            </div>

            {(errors.target) && (
              <p className="text-red-300 text-sm pl-9">{errors.target}</p>
            )}
          </div>

          {/* Resistor Options */}
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h4 className="text-xl font-bold text-white flex items-center">
                <HelpCircle className="w-6 h-6 mr-3 text-purple-400" />
                Resistor yang Tersedia untuk Siswa
              </h4>
              <button
                type="button"
                onClick={handleAddResistor}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                + Tambah Resistor
              </button>
            </div>
            
            <p className="text-sm text-blue-200/70 pl-9">
              Tentukan nilai resistor yang akan tersedia untuk siswa pilih (minimal 3 resistor)
            </p>
            
            <div className="space-y-3 pl-9">
              {resistorOptions.map((resistor, index) => (
                <div key={resistor.id} className="flex items-center space-x-3 p-4 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-xl transition-all">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Resistor {index + 1}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={resistor.value}
                        onChange={(e) => handleResistorValueChange(resistor.id, parseInt(e.target.value) || 1)}
                        className="w-32 px-4 py-2 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white placeholder-blue-300/40 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all"
                        placeholder="100"
                      />
                      <span className="text-blue-200">Ω</span>
                    </div>
                  </div>
                  {resistorOptions.length > 3 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResistor(resistor.id)}
                      className="px-3 py-2 text-red-300 hover:bg-red-500/20 rounded-lg text-sm transition-all"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.resistors && <p className="text-red-300 text-sm pl-9">{errors.resistors}</p>}
          </div>

          {/* Correct Solution */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white flex items-center pb-3 border-b border-white/10">
              <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
              Solusi yang Benar
            </h4>
            
            <p className="text-sm text-blue-200/70 pl-9">
              Pilih nilai resistor yang merupakan jawaban benar untuk setiap slot dalam rangkaian ini
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pl-9">
              {Array.from({ length: formData.resistorSlots || 2 }).map((_, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Slot {index + 1}
                  </label>
                  <select
                    value={correctSolution[index] || ''}
                    onChange={(e) => handleCorrectSolutionChange(index, parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-white/5 border-2 border-white/10 hover:border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400/60 focus:bg-white/10 transition-all"
                  >
                    <option value="" className="bg-gray-800">Pilih resistor...</option>
                    {resistorOptions.map(resistor => (
                      <option key={resistor.id} value={resistor.value} className="bg-gray-800">
                        {resistor.label}
                      </option>
                    ))}
                  </select>
                </div>
                  ))}
            </div>
            {errors.correctSolution && <p className="text-red-300 text-sm pl-9">{errors.correctSolution}</p>}
          </div>

          {/* Compact Summary Bar */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-white/5 to-transparent rounded-xl border border-white/10">
              <div className="flex items-center space-x-6">
                <div className="text-sm">
                  <span className="text-blue-200/70">Tipe:</span>{' '}
                  <span className="text-white font-medium">
                    {formData.circuitType === 'series' ? 'Seri' : 'Paralel'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-blue-200/70">Tegangan:</span>{' '}
                  <span className="text-white font-medium">{formData.voltage || 0}V</span>
                </div>
                <div className="text-sm">
                  <span className="text-blue-200/70">Slot:</span>{' '}
                  <span className="text-white font-medium">{formData.resistorSlots || 0}</span>
                </div>
                <div className="text-sm">
                  <span className="text-blue-200/70">Resistor:</span>{' '}
                  <span className="text-white font-medium">{resistorOptions.length}</span>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-blue-200/70">Solusi:</span>{' '}
                <span className={`font-medium ${correctSolution.filter(Boolean).length === (formData.resistorSlots || 0) ? 'text-green-400' : 'text-red-400'}`}>
                  {correctSolution.filter(Boolean).length}/{formData.resistorSlots || 0}
                </span>
              </div>
            </div>
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
              className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
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