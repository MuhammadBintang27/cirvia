'use client'

import React from 'react';

interface CircuitDiagramProps {
  circuitType: 'series' | 'parallel';
  voltage: number;
  resistorValues: (number | null)[];
  resistorSlots: number;
  onSlotClick?: (slotIndex: number) => void;
  activeSlot?: number;
  showValues?: boolean;
}

const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  circuitType,
  voltage,
  resistorValues,
  resistorSlots,
  onSlotClick,
  activeSlot,
  showValues = true
}) => {
  const handleSlotClick = (slotIndex: number) => {
    if (onSlotClick) {
      onSlotClick(slotIndex);
    }
  };

  const renderSeriesCircuit = () => {
    const slotWidth = 60;
    const slotHeight = 20;
    const spacing = 100;
    const startY = 150;
    const batteryX = 50;
    const totalWidth = 150 + (resistorSlots * spacing);

    return (
      <svg width={totalWidth + 100} height="300" className="mx-auto">
        {/* Circuit frame */}
        <rect 
          x="10" 
          y="10" 
          width={totalWidth + 80} 
          height="280" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="2" 
          rx="10"
        />
        
        {/* Battery */}
        <g>
          {/* Battery symbol */}
          <line x1={batteryX} y1="120" x2={batteryX} y2="180" stroke="#fbbf24" strokeWidth="6" />
          <line x1={batteryX + 10} y1="110" x2={batteryX + 10} y2="190" stroke="#fbbf24" strokeWidth="3" />
          
          {/* Battery label */}
          <text x={batteryX - 5} y="210" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">
            {voltage}V
          </text>
          
          {/* Positive/Negative indicators */}
          <text x={batteryX - 20} y="125" fill="#ef4444" fontSize="12" fontWeight="bold">+</text>
          <text x={batteryX - 20} y="185" fill="#3b82f6" fontSize="12" fontWeight="bold">-</text>
        </g>

        {/* Top wire */}
        <line 
          x1={batteryX + 15} 
          y1="110" 
          x2={150 + (resistorSlots * spacing)} 
          y2="110" 
          stroke="#22d3ee" 
          strokeWidth="3"
        />

        {/* Bottom wire */}
        <line 
          x1={batteryX + 15} 
          y1="190" 
          x2={150 + (resistorSlots * spacing)} 
          y2="190" 
          stroke="#22d3ee" 
          strokeWidth="3"
        />

        {/* Right vertical wire */}
        <line 
          x1={150 + (resistorSlots * spacing)} 
          y1="110" 
          x2={150 + (resistorSlots * spacing)} 
          y2="190" 
          stroke="#22d3ee" 
          strokeWidth="3"
        />

        {/* Resistors */}
        {Array.from({ length: resistorSlots }, (_, i) => {
          const x = 150 + (i * spacing);
          const isActive = activeSlot === i;
          const hasValue = resistorValues[i] !== null && resistorValues[i] !== undefined;
          
          return (
            <g key={i}>
              {/* Connecting wires */}
              <line x1={x - 30} y1="110" x2={x} y2="110" stroke="#22d3ee" strokeWidth="3" />
              <line x1={x - 30} y1="190" x2={x} y2="190" stroke="#22d3ee" strokeWidth="3" />
              <line x1={x + slotWidth} y1="110" x2={x + 30 + slotWidth} y2="110" stroke="#22d3ee" strokeWidth="3" />
              <line x1={x + slotWidth} y1="190" x2={x + 30 + slotWidth} y2="190" stroke="#22d3ee" strokeWidth="3" />
              
              {/* Vertical connecting wires */}
              <line x1={x} y1="110" x2={x} y2={startY - 10} stroke="#22d3ee" strokeWidth="3" />
              <line x1={x + slotWidth} y1="110" x2={x + slotWidth} y2={startY - 10} stroke="#22d3ee" strokeWidth="3" />
              <line x1={x} y1={startY + slotHeight + 10} x2={x} y2="190" stroke="#22d3ee" strokeWidth="3" />
              <line x1={x + slotWidth} y1={startY + slotHeight + 10} x2={x + slotWidth} y2="190" stroke="#22d3ee" strokeWidth="3" />

              {/* Resistor slot */}
              <rect
                x={x}
                y={startY}
                width={slotWidth}
                height={slotHeight}
                fill={hasValue ? "#dc2626" : isActive ? "#3b82f6" : "#374151"}
                stroke={isActive ? "#60a5fa" : hasValue ? "#fca5a5" : "#6b7280"}
                strokeWidth="2"
                rx="3"
                className="cursor-pointer transition-all duration-300 hover:stroke-cyan-400"
                onClick={() => handleSlotClick(i)}
              />

              {/* Resistor zigzag pattern */}
              {hasValue && (
                <path
                  d={`M${x + 5},${startY + 10} L${x + 15},${startY + 5} L${x + 25},${startY + 15} L${x + 35},${startY + 5} L${x + 45},${startY + 15} L${x + 55},${startY + 10}`}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="none"
                />
              )}

              {/* Slot number */}
              <text 
                x={x + slotWidth/2} 
                y={startY + slotHeight/2 + 4} 
                fill="white" 
                fontSize="10" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {i + 1}
              </text>

              {/* Resistor value */}
              {hasValue && showValues && (
                <text 
                  x={x + slotWidth/2} 
                  y={startY - 15} 
                  fill="#fbbf24" 
                  fontSize="12" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {resistorValues[i]}Ω
                </text>
              )}

              {/* Click indicator */}
              {isActive && (
                <g>
                  <circle 
                    cx={x + slotWidth/2} 
                    cy={startY + slotHeight/2} 
                    r="8" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="2" 
                    className="animate-ping"
                  />
                  <text 
                    x={x + slotWidth/2} 
                    y={startY + slotHeight + 35} 
                    fill="#60a5fa" 
                    fontSize="10" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    Pilih resistor
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Current flow arrows */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
          </marker>
        </defs>
        
        <line 
          x1="120" 
          y1="105" 
          x2="140" 
          y2="105" 
          stroke="#22d3ee" 
          strokeWidth="2" 
          markerEnd="url(#arrowhead)"
        />
        <text x="130" y="100" fill="#22d3ee" fontSize="10" textAnchor="middle">I</text>
      </svg>
    );
  };

  const renderParallelCircuit = () => {
    const slotWidth = 60;
    const slotHeight = 20;
    const batteryX = 50;
    const branchSpacing = 60;
    const startX = 200;

    return (
      <svg width="500" height="400" className="mx-auto">
        {/* Circuit frame */}
        <rect 
          x="10" 
          y="10" 
          width="480" 
          height="380" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="2" 
          rx="10"
        />
        
        {/* Battery */}
        <g>
          <line x1={batteryX} y1="120" x2={batteryX} y2="280" stroke="#fbbf24" strokeWidth="6" />
          <line x1={batteryX + 10} y1="110" x2={batteryX + 10} y2="290" stroke="#fbbf24" strokeWidth="3" />
          
          <text x={batteryX + 5} y="320" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">
            {voltage}V
          </text>
          
          <text x={batteryX - 20} y="125" fill="#ef4444" fontSize="12" fontWeight="bold">+</text>
          <text x={batteryX - 20} y="285" fill="#3b82f6" fontSize="12" fontWeight="bold">-</text>
        </g>

        {/* Main horizontal wires */}
        <line x1={batteryX + 15} y1="110" x2="420" y2="110" stroke="#22d3ee" strokeWidth="3" />
        <line x1={batteryX + 15} y1="290" x2="420" y2="290" stroke="#22d3ee" strokeWidth="3" />

        {/* Right vertical wire */}
        <line x1="420" y1="110" x2="420" y2="290" stroke="#22d3ee" strokeWidth="3" />

        {/* Parallel branches */}
        {Array.from({ length: resistorSlots }, (_, i) => {
          const branchY = 140 + (i * branchSpacing);
          const isActive = activeSlot === i;
          const hasValue = resistorValues[i] !== null && resistorValues[i] !== undefined;
          
          return (
            <g key={i}>
              {/* Branch connecting wires */}
              <line x1="120" y1="110" x2="120" y2={branchY} stroke="#22d3ee" strokeWidth="3" />
              <line x1="120" y1={branchY} x2={startX} y2={branchY} stroke="#22d3ee" strokeWidth="3" />
              <line x1={startX + slotWidth} y1={branchY} x2="350" y2={branchY} stroke="#22d3ee" strokeWidth="3" />
              <line x1="350" y1={branchY} x2="350" y2="290" stroke="#22d3ee" strokeWidth="3" />

              {/* Resistor slot */}
              <rect
                x={startX}
                y={branchY - slotHeight/2}
                width={slotWidth}
                height={slotHeight}
                fill={hasValue ? "#dc2626" : isActive ? "#3b82f6" : "#374151"}
                stroke={isActive ? "#60a5fa" : hasValue ? "#fca5a5" : "#6b7280"}
                strokeWidth="2"
                rx="3"
                className="cursor-pointer transition-all duration-300 hover:stroke-cyan-400"
                onClick={() => handleSlotClick(i)}
              />

              {/* Resistor zigzag pattern */}
              {hasValue && (
                <path
                  d={`M${startX + 5},${branchY} L${startX + 15},${branchY - 5} L${startX + 25},${branchY + 5} L${startX + 35},${branchY - 5} L${startX + 45},${branchY + 5} L${startX + 55},${branchY}`}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  fill="none"
                />
              )}

              {/* Slot number */}
              <text 
                x={startX + slotWidth/2} 
                y={branchY + 4} 
                fill="white" 
                fontSize="10" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {i + 1}
              </text>

              {/* Resistor value */}
              {hasValue && showValues && (
                <text 
                  x={startX + slotWidth/2} 
                  y={branchY - 20} 
                  fill="#fbbf24" 
                  fontSize="12" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {resistorValues[i]}Ω
                </text>
              )}

              {/* Active slot indicator */}
              {isActive && (
                <g>
                  <circle 
                    cx={startX + slotWidth/2} 
                    cy={branchY} 
                    r="8" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="2" 
                    className="animate-ping"
                  />
                  <text 
                    x={startX + slotWidth/2} 
                    y={branchY + 35} 
                    fill="#60a5fa" 
                    fontSize="10" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    Pilih resistor
                  </text>
                </g>
              )}

              {/* Branch current arrows */}
              <defs>
                <marker id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
                </marker>
              </defs>
              
              <line 
                x1={startX - 30} 
                y1={branchY} 
                x2={startX - 10} 
                y2={branchY} 
                stroke="#22d3ee" 
                strokeWidth="2" 
                markerEnd={`url(#arrowhead-${i})`}
              />
              <text 
                x={startX - 20} 
                y={branchY - 8} 
                fill="#22d3ee" 
                fontSize="9" 
                textAnchor="middle"
              >
                I{i + 1}
              </text>
            </g>
          );
        })}

        {/* Main current arrow */}
        <defs>
          <marker id="main-arrow" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
          </marker>
        </defs>
        
        <line 
          x1="80" 
          y1="105" 
          x2="110" 
          y2="105" 
          stroke="#22d3ee" 
          strokeWidth="3" 
          markerEnd="url(#main-arrow)"
        />
        <text x="95" y="100" fill="#22d3ee" fontSize="12" fontWeight="bold" textAnchor="middle">Itotal</text>
      </svg>
    );
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">
          Diagram Rangkaian {circuitType === 'series' ? 'Seri' : 'Paralel'}
        </h3>
        <p className="text-blue-200/80 text-sm">
          {circuitType === 'series' 
            ? 'Klik pada slot resistor untuk menempatkan komponen' 
            : 'Setiap cabang paralel memiliki tegangan yang sama'
          }
        </p>
      </div>
      
      <div className="flex justify-center">
        {circuitType === 'series' ? renderSeriesCircuit() : renderParallelCircuit()}
      </div>
      
      {/* Circuit type indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
          <span className="text-purple-300 text-sm font-medium">
            {circuitType === 'series' ? '🔗 Rangkaian Seri' : '🔀 Rangkaian Paralel'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CircuitDiagram;
