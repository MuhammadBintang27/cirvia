'use client'

import React from 'react';
import { Resistor } from '@/lib/questions';

interface ResistorSelectorProps {
  availableResistors: Resistor[];
  onResistorSelect: (resistor: Resistor) => void;
  selectedResistor?: Resistor | null;
  disabled?: boolean;
}

const ResistorSelector: React.FC<ResistorSelectorProps> = ({
  availableResistors,
  onResistorSelect,
  selectedResistor,
  disabled = false
}) => {
  // Color mapping for resistor color codes
  const colorMap: { [key: string]: string } = {
    'black': '#1f2937',
    'brown': '#92400e',
    'red': '#dc2626',
    'orange': '#ea580c',
    'yellow': '#d97706',
    'green': '#059669',
    'blue': '#2563eb',
    'violet': '#7c3aed',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'white': '#f9fafb'
  };

  const renderResistorVisual = (resistor: Resistor, isSelected: boolean = false) => {
    return (
      <div className="relative">
        {/* Resistor body */}
        <div className={`
          w-16 h-6 rounded-sm relative overflow-hidden transition-all duration-300
          ${isSelected 
            ? 'bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg shadow-yellow-400/25' 
            : 'bg-gradient-to-r from-amber-800 to-amber-700'
          }
          ${!disabled && 'hover:scale-110 hover:shadow-lg'}
        `}>
          {/* Color bands */}
          <div className="absolute inset-0 flex items-center justify-center space-x-1">
            {resistor.colorCode.map((color, index) => (
              <div
                key={index}
                className={`w-1 h-full`}
                style={{ backgroundColor: colorMap[color.toLowerCase()] || '#6b7280' }}
              />
            ))}
          </div>
          
          {/* Leads */}
          <div className="absolute -left-2 top-1/2 w-2 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
          <div className="absolute -right-2 top-1/2 w-2 h-0.5 bg-gray-400 transform -translate-y-1/2"></div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Pilih Resistor</h3>
        <p className="text-blue-200/80 text-sm">
          Klik resistor untuk memilih dan menempatkannya pada rangkaian
        </p>
      </div>

      {/* Resistor grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {availableResistors.map((resistor) => {
          const isSelected = selectedResistor?.id === resistor.id;
          
          return (
            <div
              key={resistor.id}
              className={`
                relative p-4 rounded-xl transition-all duration-300 cursor-pointer
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50' 
                  : 'bg-gradient-to-br from-white/5 to-white/10 border border-white/20 hover:border-cyan-400/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-1'}
                transform
              `}
              onClick={() => !disabled && onResistorSelect(resistor)}
            >
              {/* Resistor visual */}
              <div className="flex justify-center mb-3">
                {renderResistorVisual(resistor, isSelected)}
              </div>
              
              {/* Resistor value */}
              <div className="text-center">
                <div className={`font-bold text-sm ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                  {resistor.label}
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          );
        })}
      </div>

      {/* Selected resistor info */}
      {selectedResistor && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold">Resistor Terpilih:</h4>
              <p className="text-blue-300">{selectedResistor.label} ({selectedResistor.value}Ω)</p>
            </div>
            <div className="flex justify-center">
              {renderResistorVisual(selectedResistor, true)}
            </div>
          </div>
          
          {/* Color code explanation */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-blue-200/70 text-xs mb-2">Kode Warna:</p>
            <div className="flex items-center space-x-2">
              {selectedResistor.colorCode.map((color, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: colorMap[color.toLowerCase()] || '#6b7280' }}
                  />
                  <span className="text-blue-200/70 text-xs capitalize">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30">
          <span className="text-cyan-300 text-sm">
            💡 Tip: Perhatikan kode warna untuk menentukan nilai resistansi
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResistorSelector;
