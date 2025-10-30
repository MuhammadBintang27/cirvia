'use client'

import React, { useState } from 'react';
import { Resistor } from '@/lib/questions';

interface DragDropResistorSelectorProps {
  availableResistors: Resistor[];
  onResistorDrag: (resistor: Resistor) => void;
  disabled?: boolean;
}

const DragDropResistorSelector: React.FC<DragDropResistorSelectorProps> = ({
  availableResistors,
  onResistorDrag,
  disabled = false
}) => {
  const [draggedResistor, setDraggedResistor] = useState<number | null>(null);

  // Early return if no resistors available
  if (!availableResistors || availableResistors.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Tidak Ada Resistor Tersedia</h3>
          <p className="text-slate-400 text-sm">Belum ada resistor yang tersedia untuk dipilih.</p>
        </div>
      </div>
    );
  }

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

  const handleDragStart = (e: React.DragEvent, resistor: Resistor) => {
    setDraggedResistor(resistor.id);
    e.dataTransfer.setData('application/json', JSON.stringify(resistor));
    e.dataTransfer.effectAllowed = 'copy';
    onResistorDrag(resistor);
  };

  const handleDragEnd = () => {
    setDraggedResistor(null);
  };

  const renderResistorVisual = (resistor: Resistor, isDragging: boolean = false) => {
    if (!resistor) {
      return null;
    }
    
    return (
      <svg width="100" height="40" viewBox="0 0 100 40" className="drop-shadow-lg">
        <defs>
          <linearGradient id={`resistor-gradient-${resistor.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#9d7209" />
          </linearGradient>
          <filter id={`shadow-${resistor.id}`}>
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>
        
        {/* Resistor body - larger and more visible */}
        <rect 
          x="20" 
          y="16" 
          width="60" 
          height="8" 
          fill={`url(#resistor-gradient-${resistor.id})`}
          rx="4"
          filter={`url(#shadow-${resistor.id})`}
          stroke="#8b7355"
          strokeWidth="1"
        />
        
        {/* Metal leads - more prominent */}
        <rect x="10" y="19" width="15" height="2" fill="#c0c0c0" rx="1" />
        <rect x="75" y="19" width="15" height="2" fill="#c0c0c0" rx="1" />
        
        {/* Color bands - larger and more visible */}
        {resistor.colorCode?.map((color, index) => (
          <rect
            key={index}
            x={28 + (index * 10)}
            y="15"
            width="4"
            height="10"
            fill={colorMap[color.toLowerCase()] || '#6b7280'}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.5"
          />
        )) || []}
        
        {/* Highlight effect when dragging */}
        {isDragging && (
          <rect 
            x="18" 
            y="14" 
            width="64" 
            height="12" 
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            rx="6"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-600/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center">
          <span className="mr-2">🔧</span>
          Pilih Resistor
        </h3>
        <p className="text-blue-200/80 text-sm">
          Klik pada slot resistor untuk menempatkan komponen
        </p>
      </div>

      {/* Resistor grid - clean layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
        {availableResistors?.map((resistor) => {
          if (!resistor) return null;
          const isDragging = draggedResistor === resistor.id;
          
          return (
            <div
              key={resistor.id}
              className={`
                relative p-6 rounded-xl transition-all duration-300 cursor-grab active:cursor-grabbing min-h-[120px] flex flex-col justify-center
                ${isDragging 
                  ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-blue-400/60 scale-95' 
                  : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/40 hover:border-cyan-400/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-translate-y-1'}
                transform shadow-lg backdrop-blur-sm
              `}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, resistor)}
              onDragEnd={handleDragEnd}
            >
              {/* Resistor visual - centered and prominent */}
              <div className="flex justify-center mb-3">
                {renderResistorVisual(resistor, isDragging)}
              </div>
              
              {/* Resistor value - large and clear */}
              <div className="text-center">
                <div className={`font-bold text-2xl ${isDragging ? 'text-blue-300' : 'text-white'}`}>
                  {resistor.value}Ω
                </div>
              </div>
              
              {/* Drag indicator - subtle */}
              <div className="absolute top-3 right-3 text-slate-500 opacity-50">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="3" r="1" />
                  <circle cx="8" cy="3" r="1" />
                  <circle cx="13" cy="3" r="1" />
                  <circle cx="3" cy="8" r="1" />
                  <circle cx="8" cy="8" r="1" />
                  <circle cx="13" cy="8" r="1" />
                  <circle cx="3" cy="13" r="1" />
                  <circle cx="8" cy="13" r="1" />
                  <circle cx="13" cy="13" r="1" />
                </svg>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 rounded-xl pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
          <span className="text-cyan-300 text-sm font-medium">
            💡 Klik pada slot resistor di rangkaian untuk menempatkan komponen
          </span>
        </div>
      </div>
    </div>
  );
};

export default DragDropResistorSelector;