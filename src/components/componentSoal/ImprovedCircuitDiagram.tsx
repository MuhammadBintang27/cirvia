'use client'

import React, { useState } from 'react';
import { Resistor } from '@/lib/questions';

interface ImprovedCircuitDiagramProps {
  circuitType: 'series' | 'parallel';
  voltage: number;
  resistorValues: (number | null)[];
  resistorSlots: number;
  onSlotClick?: (slotIndex: number) => void;
  onSlotDrop?: (slotIndex: number, resistor: Resistor) => void;
  activeSlot?: number;
  showValues?: boolean;
}

const ImprovedCircuitDiagram: React.FC<ImprovedCircuitDiagramProps> = ({
  circuitType,
  voltage,
  resistorValues,
  resistorSlots,
  onSlotClick,
  onSlotDrop,
  activeSlot,
  showValues = true
}) => {
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const handleSlotClick = (slotIndex: number) => {
    onSlotClick?.(slotIndex);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    try {
      const resistorData = JSON.parse(e.dataTransfer.getData('application/json'));
      onSlotDrop?.(slotIndex, resistorData);
    } catch (error) {
      console.error('Error parsing dropped resistor data:', error);
    }
  };

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

  const getResistorColorBands = (value: number) => {
    const valueStr = value.toString().padStart(3, '0');
    const firstDigit = parseInt(valueStr[0]);
    const secondDigit = parseInt(valueStr[1]);
    const multiplier = valueStr.length - 2;
    
    const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
    
    return {
      first: colors[firstDigit] || 'black',
      second: colors[secondDigit] || 'black',
      multiplier: colors[multiplier] || 'black',
      tolerance: 'yellow' // Gold for 5% tolerance
    };
  };

  const renderBattery = (x: number, y: number) => {
    return (
      <g>
        <defs>
          <linearGradient id="battery-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <filter id="battery-shadow">
            <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>
        
        {/* Battery main body */}
        <rect 
          x={x} 
          y={y} 
          width="35" 
          height="60" 
          fill="url(#battery-gradient)"
          rx="8"
          filter="url(#battery-shadow)"
          stroke="#065f46"
          strokeWidth="2"
        />
        
        {/* Battery positive terminal */}
        <rect 
          x={x + 12} 
          y={y - 5} 
          width="10" 
          height="8" 
          fill="#4ade80"
          rx="2"
          stroke="#065f46"
          strokeWidth="1"
        />
        
        {/* Battery labels */}
        <text 
          x={x + 17} 
          y={y + 35} 
          fill="white" 
          fontSize="12" 
          fontWeight="bold" 
          textAnchor="middle"
        >
          {voltage}V
        </text>
        
        {/* Plus/minus indicators */}
        <text x={x - 15} y={y + 15} fill="#ef4444" fontSize="16" fontWeight="bold">+</text>
        <text x={x - 15} y={y + 50} fill="#3b82f6" fontSize="16" fontWeight="bold">-</text>
      </g>
    );
  };

  const renderWire = (x1: number, y1: number, x2: number, y2: number, animated: boolean = false) => {
    return (
      <g>
        <defs>
          <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        
        {/* Simple, clean wire like in the reference image */}
        <line 
          x1={x1} 
          y1={y1} 
          x2={x2} 
          y2={y2} 
          stroke="#fbbf24" 
          strokeWidth="4"
          strokeLinecap="round"
          className={animated ? "animate-pulse" : ""}
        />
      </g>
    );
  };

  const renderResistorSlot = (x: number, y: number, slotIndex: number, resistorValue: number | null) => {
    const isActive = activeSlot === slotIndex;
    const isDragOver = dragOverSlot === slotIndex;
    const hasValue = resistorValue !== null && resistorValue !== undefined;
    
    return (
      <g>
        {/* Drop zone background */}
        <rect
          x={x - 10}
          y={y - 12}
          width="100"
          height="24"
          fill={isDragOver ? "rgba(59, 130, 246, 0.2)" : "transparent"}
          stroke={isActive ? "#60a5fa" : isDragOver ? "#3b82f6" : "transparent"}
          strokeWidth="2"
          strokeDasharray={isActive || isDragOver ? "5,5" : "0"}
          rx="8"
          className="cursor-pointer transition-all duration-300"
          onClick={() => handleSlotClick(slotIndex)}
          onDragOver={(e) => handleDragOver(e, slotIndex)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, slotIndex)}
        />

        {hasValue ? renderFilledResistor(x, y, resistorValue!, slotIndex) : renderEmptySlot(x, y, slotIndex, isActive)}
      </g>
    );
  };

  const renderFilledResistor = (x: number, y: number, value: number, slotIndex: number) => {
    const bands = getResistorColorBands(value);
    
    return (
      <g>
        <defs>
          <linearGradient id={`resistor-gradient-${slotIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#9d7209" />
          </linearGradient>
          <filter id={`resistor-shadow-${slotIndex}`}>
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" />
          </filter>
        </defs>
        
        {/* Resistor body */}
        <rect 
          x={x} 
          y={y - 6} 
          width="80" 
          height="12" 
          fill={`url(#resistor-gradient-${slotIndex})`}
          rx="6"
          filter={`url(#resistor-shadow-${slotIndex})`}
          stroke="#8b7355"
          strokeWidth="1"
        />
        
        {/* Metal leads - connection points */}
        <circle cx={x} cy={y} r="2" fill="#c0c0c0" />
        <circle cx={x + 80} cy={y} r="2" fill="#c0c0c0" />
        
        {/* Color bands */}
        <rect x={x + 15} y={y - 7} width="4" height="14" fill={colorMap[bands.first]} />
        <rect x={x + 25} y={y - 7} width="4" height="14" fill={colorMap[bands.second]} />
        <rect x={x + 35} y={y - 7} width="4" height="14" fill={colorMap[bands.multiplier]} />
        <rect x={x + 58} y={y - 7} width="4" height="14" fill={colorMap[bands.tolerance]} />
        
        {/* Value label */}
        {showValues && (
          <text 
            x={x + 40} 
            y={y - 12} 
            fill="#fbbf24" 
            fontSize="12" 
            fontWeight="bold" 
            textAnchor="middle"
          >
            {value}Ω
          </text>
        )}
      </g>
    );
  };

  const renderEmptySlot = (x: number, y: number, slotIndex: number, isActive: boolean) => {
    return (
      <g>
        {/* Empty slot outline - simple dashed rectangle */}
        <rect 
          x={x} 
          y={y - 6} 
          width="80" 
          height="12" 
          fill="transparent"
          stroke={isActive ? "#60a5fa" : "#6b7280"}
          strokeWidth="2"
          strokeDasharray="8,4"
          rx="6"
          className={isActive ? "animate-pulse" : ""}
        />
        
        {/* Connection points - small circles */}
        <circle cx={x} cy={y} r="2" fill={isActive ? "#60a5fa" : "#6b7280"} />
        <circle cx={x + 80} cy={y} r="2" fill={isActive ? "#60a5fa" : "#6b7280"} />
      </g>
    );
  };

  const renderCurrentArrow = (x: number, y: number, direction: 'right' | 'down' = 'right') => {
    const arrowPath = direction === 'right' 
      ? `M ${x-8} ${y-4} L ${x+4} ${y} L ${x-8} ${y+4}` 
      : `M ${x-4} ${y-8} L ${x} ${y+4} L ${x+4} ${y-8}`;
    
    return (
      <g>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
          </marker>
        </defs>
        
        <circle cx={x} cy={y} r="8" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1" />
        <path d={arrowPath} fill="none" stroke="#10b981" strokeWidth="2" />
        <text x={x} y={y + 2} fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">I</text>
      </g>
    );
  };

  const renderSeriesCircuit = () => {
    const spacing = 120;
    const startY = 180;
    const batteryX = 60;
    const batteryTopY = startY - 30; // Posisi Y atas baterai
    const batteryBottomY = batteryTopY + 60; // Posisi Y bawah baterai (tinggi baterai = 60)
    const wireTopY = batteryTopY; // Kabel atas pas di ujung atas baterai
    const wireBottomY = batteryBottomY; // Kabel bawah pas di ujung bawah baterai
    const totalWidth = 150 + (resistorSlots * spacing);

    return (
      <svg width={totalWidth + 100} height="280" className="mx-auto">        
        {/* Battery */}
        {renderBattery(batteryX, batteryTopY)}
        
        {/* Series circuit - components in single path */}
        {/* Top horizontal wire from battery positive */}
        {renderWire(batteryX + 35, wireTopY, 150, wireTopY)}
        
        {/* Resistors in series with connecting wires */}
        {Array.from({ length: resistorSlots }, (_, i) => {
          const x = 150 + (i * spacing);
          const nextX = i < resistorSlots - 1 ? x + spacing : totalWidth - 20;
          
          return (
            <g key={i}>
              {/* Resistor slot */}
              {renderResistorSlot(x, wireTopY, i, resistorValues[i])}
              
              {/* Wire to next component or to return path */}
              {renderWire(x + 80, wireTopY, nextX, wireTopY)}
            </g>
          );
        })}
        
        {/* Right vertical wire (return path) */}
        {renderWire(totalWidth - 20, wireTopY, totalWidth - 20, wireBottomY)}
        
        {/* Bottom horizontal wire (return to battery negative) */}
        {renderWire(totalWidth - 20, wireBottomY, batteryX + 35, wireBottomY)}
        
        {/* Current arrow */}
        {renderCurrentArrow(120, wireTopY - 15)}
      </svg>
    );
  };

  const renderParallelCircuit = () => {
    const batteryX = 60;
    const batteryTopY = 120; // Posisi Y atas baterai
    const batteryBottomY = batteryTopY + 60; // Posisi Y bawah baterai (tinggi baterai = 60)
    const branchSpacing = 60;
    const startX = 200;
    const junctionLeftX = 140;
    const junctionRightX = 400;
    
    // Kabel utama dengan jarak vertikal yang lebih lebar
    const mainWireTopY = batteryTopY - 20; // 20px di atas baterai
    const mainWireBottomY = batteryBottomY + 20; // 20px di bawah baterai

    return (
      <svg width="500" height="320" className="mx-auto">
        {/* Battery */}
        {renderBattery(batteryX, batteryTopY)}
        
        {/* Kabel penghubung dari baterai ke kabel utama */}
        {/* Vertikal dari terminal positif baterai ke kabel utama atas */}
        {renderWire(batteryX + 35, batteryTopY, batteryX + 35, mainWireTopY)}
        
        {/* Vertikal dari terminal negatif baterai ke kabel utama bawah */}
        {renderWire(batteryX + 35, batteryBottomY, batteryX + 35, mainWireBottomY)}
        
        {/* Main wires - dengan jarak vertikal yang lebih lebar */}
        {/* Top wire: Dari kabel penghubung → Right junction */}
        {renderWire(batteryX + 35, mainWireTopY, junctionRightX, mainWireTopY)}
        
        {/* Bottom wire: Dari kabel penghubung → Right junction */}
        {renderWire(batteryX + 35, mainWireBottomY, junctionRightX, mainWireBottomY)}
        
        {/* Right vertical connection */}
        {renderWire(junctionRightX, mainWireTopY, junctionRightX, mainWireBottomY)}
        
        {/* Junction points - pada kabel utama */}
        <circle cx={junctionLeftX} cy={mainWireTopY} r="3" fill="#fbbf24" />
        <circle cx={junctionLeftX} cy={mainWireBottomY} r="3" fill="#fbbf24" />
        <circle cx={junctionRightX} cy={mainWireTopY} r="3" fill="#fbbf24" />
        <circle cx={junctionRightX} cy={mainWireBottomY} r="3" fill="#fbbf24" />
        
        {/* Parallel branches - tanpa celah */}
        {Array.from({ length: resistorSlots }, (_, i) => {
          // Distribusi cabang paralel di antara kabel utama yang lebih lebar  
          let branchY;
          const availableHeight = mainWireBottomY - mainWireTopY; // Tinggi area tersedia
          
          if (resistorSlots === 1) {
            branchY = mainWireTopY + (availableHeight / 2); // Satu cabang di tengah
          } else if (resistorSlots === 2) {
            // Dua cabang: distribusi dengan jarak yang lebih besar
            branchY = i === 0 ? mainWireTopY + (availableHeight * 0.3) : mainWireTopY + (availableHeight * 0.7);
          } else {
            // Tiga cabang atau lebih: distribusi merata di seluruh area
            branchY = mainWireTopY + (availableHeight * 0.2) + (i * (availableHeight * 0.6 / (resistorSlots - 1)));
          }
          
          return (
            <g key={i}>
              {/* Vertical wire dari top ke branch */}
              {renderWire(junctionLeftX, mainWireTopY, junctionLeftX, branchY)}
              
              {/* Horizontal wire ke resistor */}
              {renderWire(junctionLeftX, branchY, startX, branchY)}
              
              {/* Horizontal wire dari resistor ke junction kanan */}
              {renderWire(startX + 80, branchY, junctionRightX, branchY)}
              
              {/* Vertical wire dari branch ke bottom */}
              {renderWire(junctionRightX, branchY, junctionRightX, mainWireBottomY)}
              
              {/* Branch junction points */}
              <circle cx={junctionLeftX} cy={branchY} r="2" fill="#fbbf24" />
              <circle cx={junctionRightX} cy={branchY} r="2" fill="#fbbf24" />
              
              {/* Resistor slot */}
              {renderResistorSlot(startX, branchY, i, resistorValues[i])}
            </g>
          );
        })}
        
        {/* Main current arrow */}
        {renderCurrentArrow(100, mainWireTopY - 15)}
        
        {/* Branch current arrows */}
        {Array.from({ length: resistorSlots }, (_, i) => {
          // Gunakan logika posisi yang sama dengan branch
          let branchY;
          const availableHeight = mainWireBottomY - mainWireTopY;
          
          if (resistorSlots === 1) {
            branchY = mainWireTopY + (availableHeight / 2);
          } else if (resistorSlots === 2) {
            branchY = i === 0 ? mainWireTopY + (availableHeight * 0.3) : mainWireTopY + (availableHeight * 0.7);
          } else {
            branchY = mainWireTopY + (availableHeight * 0.2) + (i * (availableHeight * 0.6 / (resistorSlots - 1)));
          }
          
          return renderCurrentArrow(170, branchY - 10);
        })}
      </svg>
    );
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-600/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center">
          <span className="mr-2">⚡</span>
          Diagram Rangkaian {circuitType === 'series' ? 'Seri' : 'Paralel'}
        </h3>
        <p className="text-blue-200/80 text-sm">
          {circuitType === 'series' 
            ? 'Klik pada slot atau drag & drop resistor untuk menempatkan komponen' 
            : 'Setiap cabang paralel memiliki tegangan yang sama dengan sumber'
          }
        </p>
      </div>
      
      <div className="flex justify-center">
        {circuitType === 'series' ? renderSeriesCircuit() : renderParallelCircuit()}
      </div>
      
      {/* Circuit type indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-sm">
          <span className="text-purple-300 text-sm font-medium">
            {circuitType === 'series' ? '🔗 Rangkaian Seri' : '🔀 Rangkaian Paralel'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedCircuitDiagram;