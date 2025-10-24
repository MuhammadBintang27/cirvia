'use client'

import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import UnifiedCircuitCard, { 
  CircuitConfiguration, 
  CircuitTemplate,
  ResistorComponent,
  LampComponent 
} from './UnifiedCircuitCard';
import { CircuitConfigurationBuilder } from '@/lib/unifiedCircuitGenerator';

interface CircuitBuilderProps {
  onSave: (circuit: CircuitConfiguration) => void;
  onCancel: () => void;
  initialCircuit?: CircuitConfiguration;
}

const CircuitBuilder: React.FC<CircuitBuilderProps> = ({
  onSave,
  onCancel,
  initialCircuit
}) => {
  const [config, setConfig] = useState(() => {
    if (initialCircuit) {
      return initialCircuit;
    }
    return {
      id: '',
      name: '',
      template: 'simple' as CircuitTemplate,
      battery: { type: 'battery' as const, voltage: 12 },
      resistors: [{ type: 'resistor' as const, id: 'R1', value: 100, color: 'blue' as const }],
      lamps: [{ type: 'lamp' as const, id: 'L1', power: 12, voltage: 12 }],
      description: '',
      brightnessLevel: 'medium' as const
    };
  });

  const [preview, setPreview] = useState(false);

  const templates: { value: CircuitTemplate; label: string }[] = [
    { value: 'simple', label: 'Sederhana' },
    { value: 'series', label: 'Seri' },
    { value: 'complex-series', label: 'Seri Kompleks' },
    { value: 'parallel', label: 'Paralel' },
    { value: 'complex-parallel', label: 'Paralel Kompleks' },
    { value: 'mixed', label: 'Campuran' },
    { value: 'mixed-advanced', label: 'Campuran Lanjut' }
  ];

  const voltageOptions = [6, 9, 12, 24];
  const resistorValues = [10, 22, 47, 100, 150, 220, 330, 470, 680, 1000, 1500, 2200];
  const lampPowers = [5, 10, 15, 20, 25, 40, 60, 75, 100];
  const resistorColors = ['red', 'green', 'blue', 'yellow', 'purple'] as const;

  const updateConfig = (updates: Partial<CircuitConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateBattery = (voltage: number) => {
    setConfig(prev => ({
      ...prev,
      battery: { type: 'battery', voltage },
      lamps: prev.lamps.map(lamp => ({ ...lamp, voltage }))
    }));
  };

  const addResistor = () => {
    const newResistor: ResistorComponent = {
      type: 'resistor',
      id: `R${config.resistors.length + 1}`,
      value: 100,
      color: 'blue'
    };
    setConfig(prev => ({
      ...prev,
      resistors: [...prev.resistors, newResistor]
    }));
  };

  const updateResistor = (index: number, updates: Partial<ResistorComponent>) => {
    setConfig(prev => ({
      ...prev,
      resistors: prev.resistors.map((resistor, i) => 
        i === index ? { ...resistor, ...updates } : resistor
      )
    }));
  };

  const removeResistor = (index: number) => {
    setConfig(prev => ({
      ...prev,
      resistors: prev.resistors.filter((_, i) => i !== index)
    }));
  };

  const addLamp = () => {
    const newLamp: LampComponent = {
      type: 'lamp',
      id: `L${config.lamps.length + 1}`,
      power: 12,
      voltage: config.battery.voltage
    };
    setConfig(prev => ({
      ...prev,
      lamps: [...prev.lamps, newLamp]
    }));
  };

  const updateLamp = (index: number, updates: Partial<LampComponent>) => {
    setConfig(prev => ({
      ...prev,
      lamps: prev.lamps.map((lamp, i) => 
        i === index ? { ...lamp, ...updates } : lamp
      )
    }));
  };

  const removeLamp = (index: number) => {
    setConfig(prev => ({
      ...prev,
      lamps: prev.lamps.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const finalConfig = {
      ...config,
      id: config.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
      description: config.description || `${config.name} - Rangkaian ${config.template}`
    };
    onSave(finalConfig);
  };

  const isValid = config.name && config.resistors.length > 0 && config.lamps.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {initialCircuit ? 'Edit Rangkaian' : 'Buat Rangkaian Baru'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center px-3 py-2 rounded-lg border transition-all ${
              preview
                ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                : 'bg-gray-500/20 border-gray-400/30 text-gray-300'
            }`}
          >
            {preview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {preview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Informasi Dasar</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nama Rangkaian
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Masukkan nama rangkaian..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Template
                </label>
                <select
                  value={config.template}
                  onChange={(e) => updateConfig({ template: e.target.value as CircuitTemplate })}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
                >
                  {templates.map(template => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tegangan Sumber (V)
                </label>
                <select
                  value={config.battery.voltage}
                  onChange={(e) => updateBattery(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
                >
                  {voltageOptions.map(voltage => (
                    <option key={voltage} value={voltage}>{voltage}V</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 h-24"
                  placeholder="Masukkan deskripsi rangkaian..."
                />
              </div>
            </div>
          </div>

          {/* Resistors */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Resistor</h3>
              <button
                onClick={addResistor}
                className="flex items-center px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg text-purple-300 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Resistor
              </button>
            </div>

            <div className="space-y-3">
              {config.resistors.map((resistor, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={resistor.id}
                      onChange={(e) => updateResistor(index, { id: e.target.value })}
                      className="w-20 px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                      placeholder="ID"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={resistor.value}
                      onChange={(e) => updateResistor(index, { value: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                    >
                      {resistorValues.map(value => (
                        <option key={value} value={value}>{value}Ω</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      value={resistor.color}
                      onChange={(e) => updateResistor(index, { color: e.target.value as any })}
                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                    >
                      {resistorColors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeResistor(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lamps */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Lampu</h3>
              <button
                onClick={addLamp}
                className="flex items-center px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/30 rounded-lg text-yellow-300 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lampu
              </button>
            </div>

            <div className="space-y-3">
              {config.lamps.map((lamp, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-black/20 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={lamp.id}
                      onChange={(e) => updateLamp(index, { id: e.target.value })}
                      className="w-20 px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                      placeholder="ID"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={lamp.power}
                      onChange={(e) => updateLamp(index, { power: Number(e.target.value) })}
                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                    >
                      {lampPowers.map(power => (
                        <option key={power} value={power}>{power}W</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeLamp(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {preview && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <UnifiedCircuitCard
                circuit={config}
                showBrightness={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 rounded-lg text-gray-300 transition-all"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`flex items-center px-6 py-2 rounded-lg border transition-all ${
            isValid
              ? 'bg-green-500/20 hover:bg-green-500/30 border-green-400/30 text-green-300'
              : 'bg-gray-500/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan
        </button>
      </div>
    </div>
  );
};

export default CircuitBuilder;