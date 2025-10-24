'use client'

import React from 'react';
import { Zap, Lightbulb, Route, Share2, Battery, Cpu } from 'lucide-react';

// Circuit component types
export interface ResistorComponent {
  type: 'resistor';
  id: string;
  value: number; // ohms
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
}

export interface LampComponent {
  type: 'lamp';
  id: string;
  power: number; // watts
  voltage?: number;
  position?: { x: number; y: number };
}

export interface BatteryComponent {
  type: 'battery';
  voltage: number;
}

// Circuit template types
export type CircuitTemplate = 'simple' | 'series' | 'parallel' | 'mixed' | 'complex-series' | 'complex-parallel' | 'mixed-advanced';

export interface CircuitConfiguration {
  id: string;
  name: string;
  template: CircuitTemplate;
  battery: BatteryComponent;
  resistors: ResistorComponent[];
  lamps: LampComponent[];
  description?: string;
  brightnessLevel: 'high' | 'medium' | 'low';
  customLayout?: boolean;
}

interface UnifiedCircuitCardProps {
  circuit: CircuitConfiguration;
  isDragging?: boolean;
  showBrightness?: boolean;
  onDragStart?: (e: React.DragEvent, circuitId: string) => void;
  onKeyDown?: (e: React.KeyboardEvent, circuitId: string) => void;
  className?: string;
}

const UnifiedCircuitCard: React.FC<UnifiedCircuitCardProps> = ({
  circuit,
  isDragging = false,
  showBrightness = false,
  onDragStart,
  onKeyDown,
  className = ''
}) => {
  
  const getBrightnessInfo = (brightnessLevel: 'high' | 'medium' | 'low') => {
    switch (brightnessLevel) {
      case 'high': return { 
        label: 'Terang', 
        color: 'text-yellow-400', 
        glow: 'shadow-yellow-400/50',
        fillColor: '#FCD34D'
      };
      case 'medium': return { 
        label: 'Sedang', 
        color: 'text-orange-400', 
        glow: 'shadow-orange-400/50',
        fillColor: '#FB923C'
      };
      case 'low': return { 
        label: 'Redup', 
        color: 'text-red-400', 
        glow: 'shadow-red-400/50',
        fillColor: '#EF4444'
      };
    }
  };

  const getTemplateIcon = (template: CircuitTemplate) => {
    switch (template) {
      case 'series':
      case 'complex-series':
        return <Route className="w-4 h-4" />;
      case 'parallel':
      case 'complex-parallel':
        return <Share2 className="w-4 h-4" />;
      case 'mixed':
      case 'mixed-advanced':
        return <Zap className="w-4 h-4" />;
      case 'simple':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getTemplateName = (template: CircuitTemplate) => {
    switch (template) {
      case 'series': return 'Seri Sederhana';
      case 'complex-series': return 'Seri Kompleks';
      case 'parallel': return 'Paralel Sederhana';
      case 'complex-parallel': return 'Paralel Kompleks';
      case 'mixed': return 'Campuran';
      case 'mixed-advanced': return 'Campuran Lanjut';
      case 'simple': return 'Sederhana';
      default: return 'Kustom';
    }
  };

  const getResistorColorBands = (value: number) => {
    const colors = ['#000', '#8B4513', '#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#8A2BE2', '#808080', '#FFF'];
    const valueStr = value.toString().padStart(3, '0');
    const firstDigit = parseInt(valueStr[0]);
    const secondDigit = parseInt(valueStr[1]);
    const multiplier = valueStr.length - 2;
    
    return {
      first: colors[firstDigit],
      second: colors[secondDigit], 
      multiplier: colors[multiplier],
      tolerance: '#FFD700' // Gold for 5% tolerance
    };
  };

  const calculateCircuitValues = () => {
    const { battery, resistors, lamps, template } = circuit;
    const voltage = battery.voltage;
    
    switch (template) {
      case 'simple':
        const totalR = resistors.reduce((sum, r) => sum + r.value, 0);
        const current = totalR > 0 ? voltage / totalR : 0;
        const power = totalR > 0 ? (voltage * voltage) / totalR : 0;
        return { current, power, voltage };
        
      case 'series':
      case 'complex-series':
        const seriesR = resistors.reduce((sum, r) => sum + r.value, 0);
        const seriesCurrent = seriesR > 0 ? voltage / seriesR : 0;
        const seriesPower = seriesR > 0 ? (voltage * voltage) / seriesR : 0;
        return { current: seriesCurrent, power: seriesPower, voltage };
        
      case 'parallel':
      case 'complex-parallel':
        const parallelR = 1 / resistors.reduce((sum, r) => sum + (1 / r.value), 0);
        const parallelCurrent = parallelR > 0 ? voltage / parallelR : 0;
        const parallelPower = parallelR > 0 ? (voltage * voltage) / parallelR : 0;
        return { current: parallelCurrent, power: parallelPower, voltage };
        
      default:
        return { current: 0, power: 0, voltage };
    }
  };

  const values = calculateCircuitValues();
  const brightnessInfo = getBrightnessInfo(circuit.brightnessLevel);

  const renderCircuitSVG = () => {
    switch (circuit.template) {
      case 'simple':
        return renderSimpleTemplate();
      case 'series':
        return renderSeriesTemplate();
      case 'complex-series':
        return renderComplexSeriesTemplate();
      case 'parallel':
        return renderParallelTemplate();
      case 'complex-parallel':
        return renderComplexParallelTemplate();
      case 'mixed':
        return renderMixedTemplate();
      case 'mixed-advanced':
        return renderAdvancedMixedTemplate();
      default:
        return renderCustomTemplate();
    }
  };

  const renderBattery = (x: number, y: number, voltage: number, size = 'normal') => {
    const width = size === 'small' ? 20 : 25;
    const height = size === 'small' ? 12 : 16;
    const fontSize = size === 'small' ? 7 : 8;
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="#4ade80" stroke="#22c55e" strokeWidth="2" rx="2"/>
        <rect x={x+2} y={y+2} width={width-4} height={height-4} fill="#86efac" rx="1"/>
        <rect x={x+width} y={y+height/4} width="3" height={height/2} fill="#22c55e" rx="1"/>
        <text x={x+width/2} y={y-5} fill="#10b981" fontSize={fontSize} textAnchor="middle" fontWeight="bold">{voltage}V</text>
        <text x={x+width/2} y={y+height+12} fill="#10b981" fontSize="6" textAnchor="middle">BAT</text>
      </g>
    );
  };

  const renderResistor = (x: number, y: number, resistor: ResistorComponent, size = 'normal') => {
    const width = size === 'small' ? 30 : 40;
    const height = size === 'small' ? 8 : 12;
    const bands = getResistorColorBands(resistor.value);
    
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" rx={height/2}/>
        <rect x={x+2} y={y+2} width={width-4} height={height-4} fill="#a78bfa" rx={height/2-2}/>
        
        {/* Color bands */}
        <rect x={x+width*0.2} y={y} width="2" height={height} fill={bands.first}/>
        <rect x={x+width*0.35} y={y} width="2" height={height} fill={bands.second}/>
        <rect x={x+width*0.5} y={y} width="2" height={height} fill={bands.multiplier}/>
        <rect x={x+width*0.75} y={y} width="2" height={height} fill={bands.tolerance}/>
        
        <text x={x+width/2} y={y-5} fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">{resistor.id}</text>
        <text x={x+width/2} y={y+height+12} fill="#a78bfa" fontSize="6" textAnchor="middle">{resistor.value}Ω</text>
      </g>
    );
  };

  const renderLamp = (x: number, y: number, lamp: LampComponent, radius = 15) => {
    const gradientId = `lamp-${lamp.id}-${circuit.id}`;
    const glowId = `glow-${lamp.id}-${circuit.id}`;
    
    return (
      <g>
        <defs>
          <radialGradient id={gradientId} cx="0.3" cy="0.3">
            <stop offset="0%" stopColor={showBrightness ? brightnessInfo.fillColor : '#fbbf24'}/>
            <stop offset="70%" stopColor="#f59e0b"/>
            <stop offset="100%" stopColor="#d97706"/>
          </radialGradient>
          <radialGradient id={`${gradientId}-inner`} cx="0.4" cy="0.3">
            <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
          </radialGradient>
          <radialGradient id={glowId} cx="0.5" cy="0.5">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0"/>
            <stop offset="70%" stopColor="#fbbf24" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6"/>
          </radialGradient>
        </defs>
        
        <circle cx={x} cy={y} r={radius} fill={`url(#${gradientId})`} stroke="#fbbf24" strokeWidth="2"/>
        <circle cx={x} cy={y} r={radius-3} fill={`url(#${gradientId}-inner)`} opacity="0.8"/>
        
        {/* Filament */}
        <path d={`M ${x-4} ${y-3} Q ${x} ${y-6} ${x+4} ${y-3} Q ${x} ${y} ${x+4} ${y+3} Q ${x} ${y+6} ${x-4} ${y+3} Q ${x} ${y} ${x-4} ${y-3}`} 
              fill="none" stroke="#fbbf24" strokeWidth="1"/>
        
        {/* Base */}
        <rect x={x-4} y={y+radius-2} width="8" height="6" fill="#6b7280" stroke="#4b5563" strokeWidth="1" rx="1"/>
        <rect x={x-3} y={y+radius-1} width="6" height="4" fill="#9ca3af" rx="1"/>
        
        {/* Glow effect */}
        {showBrightness && circuit.brightnessLevel === 'high' && (
          <circle cx={x} cy={y} r={radius+8} fill={`url(#${glowId})`} opacity="0.6" className="animate-pulse"/>
        )}
        
        <text x={x} y={y+radius+15} fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">{lamp.id}</text>
        <text x={x} y={y+radius+24} fill="#34d399" fontSize="6" textAnchor="middle">{lamp.power}W</text>
      </g>
    );
  };

  const renderWire = (x1: number, y1: number, x2: number, y2: number, thickness = 3) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth={thickness}/>
  );

  const renderCurrentArrow = (x: number, y: number, direction: 'right' | 'down' = 'right') => {
    const arrowPath = direction === 'right' 
      ? `M ${x-5} ${y-3} L ${x} ${y} L ${x-5} ${y+3}` 
      : `M ${x-3} ${y-5} L ${x} ${y} L ${x+3} ${y-5}`;
    
    return (
      <g>
        <path d={arrowPath} fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#current-arrow)"/>
        <text x={x} y={y-8} fill="#10b981" fontSize="6" textAnchor="middle">I</text>
      </g>
    );
  };

  const renderSimpleTemplate = () => (
    <svg viewBox="0 0 300 120" className="w-full h-20">
      <rect x="0" y="0" width="300" height="120" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(20, 52, circuit.battery.voltage)}
      {renderWire(48, 60, 80, 60)}
      {renderResistor(80, 54, circuit.resistors[0])}
      {renderWire(120, 60, 150, 60)}
      {renderLamp(180, 60, circuit.lamps[0])}
      
      {/* Return path */}
      {renderWire(195, 60, 220, 60)}
      {renderWire(220, 60, 220, 90)}
      {renderWire(220, 90, 20, 90)}
      {renderWire(20, 90, 20, 68)}
      
      {renderCurrentArrow(65, 57)}
      
      {/* Circuit info */}
      <text x="15" y="15" fill="#60a5fa" fontSize="8" fontWeight="bold">I = {values.current.toFixed(2)}A</text>
      <text x="15" y="25" fill="#34d399" fontSize="8" fontWeight="bold">P = {values.power.toFixed(2)}W</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderSeriesTemplate = () => (
    <svg viewBox="0 0 380 140" className="w-full h-24">
      <rect x="0" y="0" width="380" height="140" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 62, circuit.battery.voltage)}
      {renderWire(43, 70, 70, 70)}
      
      {/* Multiple resistors in series */}
      {circuit.resistors.map((resistor, index) => (
        <g key={resistor.id}>
          {renderResistor(70 + index * 60, 64, resistor)}
          {index < circuit.resistors.length - 1 && renderWire(110 + index * 60, 70, 130 + index * 60, 70)}
        </g>
      ))}
      
      {renderWire(70 + circuit.resistors.length * 60, 70, 100 + circuit.resistors.length * 60, 70)}
      
      {/* Multiple lamps in series */}
      {circuit.lamps.map((lamp, index) => (
        <g key={lamp.id}>
          {renderLamp(130 + circuit.resistors.length * 60 + index * 50, 70, lamp, 12)}
          {index < circuit.lamps.length - 1 && renderWire(142 + circuit.resistors.length * 60 + index * 50, 70, 168 + circuit.resistors.length * 60 + index * 50, 70)}
        </g>
      ))}
      
      {/* Return path */}
      {renderWire(142 + circuit.resistors.length * 60 + circuit.lamps.length * 50, 70, 350, 70)}
      {renderWire(350, 70, 350, 110)}
      {renderWire(350, 110, 15, 110)}
      {renderWire(15, 110, 15, 78)}
      
      {renderCurrentArrow(55, 67)}
      
      {/* Circuit info */}
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Seri: R₁+R₂+...+Rₙ</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">Rtotal = {circuit.resistors.reduce((sum, r) => sum + r.value, 0)}Ω</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">I = {values.current.toFixed(2)}A</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderParallelTemplate = () => (
    <svg viewBox="0 0 320 200" className="w-full h-32">
      <rect x="0" y="0" width="320" height="200" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 92, circuit.battery.voltage)}
      {renderWire(43, 100, 80, 100)}
      
      {/* Parallel branches */}
      {(() => {
        const branchY = [60, 100, 140];
        return circuit.resistors.slice(0, 3).map((resistor, index) => (
          <g key={resistor.id}>
            {renderWire(80, 100, 80, branchY[index])}
            {renderWire(80, branchY[index], 120, branchY[index])}
            {renderResistor(120, branchY[index] - 6, resistor, 'small')}
            {renderWire(150, branchY[index], 180, branchY[index])}
            {renderLamp(200, branchY[index], circuit.lamps[index] || {id: `L${index+1}`, type: 'lamp', power: 10}, 12)}
            {renderWire(212, branchY[index], 240, branchY[index])}
            {renderWire(240, branchY[index], 240, 100)}
          </g>
        ));
      })()}
      
      {renderWire(240, 100, 280, 100)}
      {renderWire(280, 100, 280, 140)}
      {renderWire(280, 140, 15, 140)}
      {renderWire(15, 140, 15, 108)}
      
      {renderCurrentArrow(65, 97)}
      {renderCurrentArrow(90, 57, 'down')}
      {renderCurrentArrow(90, 97)}
      {renderCurrentArrow(90, 137, 'down')}
      
      {/* Circuit info */}
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Paralel: 1/Rtotal = 1/R₁+1/R₂+...</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">Setiap cabang: {circuit.battery.voltage}V</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">Itotal = {values.current.toFixed(2)}A</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderComplexSeriesTemplate = () => (
    <svg viewBox="0 0 420 160" className="w-full h-28">
      <rect x="0" y="0" width="420" height="160" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 72, circuit.battery.voltage)}
      {renderWire(43, 80, 70, 80)}
      
      {/* Complex series with multiple components */}
      {(() => {
        let currentX = 70;
        const components = [...circuit.resistors, ...circuit.lamps];
        return (
          <g>
            {components.map((component, index) => {
              const element = (
                <g key={`${component.type}-${component.id}`}>
                  {component.type === 'resistor' ? (
                    renderResistor(currentX, 74, component as ResistorComponent)
                  ) : (
                    renderLamp(currentX + 20, 80, component as LampComponent, 14)
                  )}
                  {index < components.length - 1 && 
                    renderWire(currentX + (component.type === 'resistor' ? 40 : 40), 80, currentX + (component.type === 'resistor' ? 50 : 65), 80)}
                </g>
              );
              currentX += component.type === 'resistor' ? 50 : 45;
              return element;
            })}
            {/* Return path */}
            {renderWire(currentX - 10, 80, 380, 80)}
          </g>
        );
      })()}
      {renderWire(380, 80, 380, 120)}
      {renderWire(380, 120, 15, 120)}
      {renderWire(15, 120, 15, 88)}
      
      {renderCurrentArrow(55, 77)}
      
      {/* Enhanced circuit info */}
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Seri Kompleks</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">{circuit.resistors.length} Resistor + {circuit.lamps.length} Lampu</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">I = {values.current.toFixed(2)}A (sama semua)</text>
      <text x="10" y="52" fill="#ec4899" fontSize="7">Ptotal = {values.power.toFixed(2)}W</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderComplexParallelTemplate = () => (
    <svg viewBox="0 0 360 220" className="w-full h-36">
      <rect x="0" y="0" width="360" height="220" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 102, circuit.battery.voltage)}
      {renderWire(43, 110, 80, 110)}
      
      {/* Multiple parallel branches with different components */}
      {(() => {
        const branches = Math.min(4, Math.max(circuit.resistors.length, circuit.lamps.length));
        const branchYPositions = [60, 90, 130, 160];
        
        return (
          <g>
            {Array.from({length: branches}, (_, index) => (
              <g key={`branch-${index}`}>
                {renderWire(80, 110, 80, branchYPositions[index])}
                {renderWire(80, branchYPositions[index], 120, branchYPositions[index])}
                
                {circuit.resistors[index] && renderResistor(120, branchYPositions[index] - 6, circuit.resistors[index], 'small')}
                {renderWire(150, branchYPositions[index], 190, branchYPositions[index])}
                
                {circuit.lamps[index] && renderLamp(210, branchYPositions[index], circuit.lamps[index], 11)}
                {renderWire(221, branchYPositions[index], 260, branchYPositions[index])}
                {renderWire(260, branchYPositions[index], 260, 110)}
              </g>
            ))}
            
            {renderWire(260, 110, 300, 110)}
            {renderWire(300, 110, 300, 150)}
            {renderWire(300, 150, 15, 150)}
            {renderWire(15, 150, 15, 118)}
            
            {/* Multiple current arrows */}
            {renderCurrentArrow(65, 107)}
            {branchYPositions.slice(0, branches).map((y: number, index: number) => (
              <g key={`arrow-${index}`}>
                {renderCurrentArrow(100, y-3)}
                {renderCurrentArrow(175, y-3)}
              </g>
            ))}
            
            {/* Enhanced circuit info */}
            <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Paralel Kompleks</text>
            <text x="10" y="32" fill="#34d399" fontSize="7">{branches} cabang paralel</text>
          </g>
        );
      })()}
      <text x="10" y="42" fill="#fbbf24" fontSize="7">V setiap cabang = {circuit.battery.voltage}V</text>
      <text x="10" y="52" fill="#ec4899" fontSize="7">Itotal = Σ I cabang</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderMixedTemplate = () => (
    <svg viewBox="0 0 400 180" className="w-full h-32">
      <rect x="0" y="0" width="400" height="180" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 82, circuit.battery.voltage)}
      {renderWire(43, 90, 80, 90)}
      
      {/* Series resistor first */}
      {circuit.resistors[0] && renderResistor(80, 84, circuit.resistors[0])}
      {renderWire(120, 90, 160, 90)}
      
      {/* Parallel section */}
      {renderWire(160, 90, 160, 70)}
      {renderWire(160, 90, 160, 110)}
      
      {renderWire(160, 70, 240, 70)}
      {renderWire(160, 110, 240, 110)}
      
      {/* Parallel components */}
      {circuit.lamps[0] && renderLamp(200, 70, circuit.lamps[0], 12)}
      {circuit.lamps[1] && renderLamp(200, 110, circuit.lamps[1], 12)}
      
      {renderWire(212, 70, 240, 70)}
      {renderWire(212, 110, 240, 110)}
      {renderWire(240, 70, 240, 110)}
      
      {/* Final series component */}
      {renderWire(240, 90, 280, 90)}
      {circuit.resistors[1] && renderResistor(280, 84, circuit.resistors[1])}
      
      {/* Return path */}
      {renderWire(320, 90, 350, 90)}
      {renderWire(350, 90, 350, 130)}
      {renderWire(350, 130, 15, 130)}
      {renderWire(15, 130, 15, 98)}
      
      {/* Current arrows */}
      {renderCurrentArrow(65, 87)}
      {renderCurrentArrow(145, 87)}
      {renderCurrentArrow(175, 67)}
      {renderCurrentArrow(175, 107)}
      {renderCurrentArrow(260, 87)}
      
      {/* Circuit analysis */}
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Rangkaian Campuran</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">Seri + Paralel + Seri</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">Analisis bertahap</text>
      <text x="10" y="52" fill="#ec4899" fontSize="7">Tegangan terbagi</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderAdvancedMixedTemplate = () => (
    <svg viewBox="0 0 450 240" className="w-full h-40">
      <rect x="0" y="0" width="450" height="240" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {renderBattery(15, 112, circuit.battery.voltage)}
      {renderWire(43, 120, 80, 120)}
      
      {/* First series resistor */}
      {circuit.resistors[0] && renderResistor(80, 114, circuit.resistors[0], 'small')}
      {renderWire(110, 120, 150, 120)}
      
      {/* Complex parallel section */}
      {renderWire(150, 120, 150, 80)}
      {renderWire(150, 120, 150, 160)}
      
      {/* Upper parallel branch with series components */}
      {renderWire(150, 80, 200, 80)}
      {circuit.resistors[1] && renderResistor(200, 74, circuit.resistors[1], 'small')}
      {renderWire(230, 80, 280, 80)}
      {circuit.lamps[0] && renderLamp(300, 80, circuit.lamps[0], 10)}
      {renderWire(310, 80, 340, 80)}
      
      {/* Lower parallel branch */}
      {renderWire(150, 160, 200, 160)}
      {circuit.lamps[1] && renderLamp(220, 160, circuit.lamps[1], 10)}
      {renderWire(230, 160, 280, 160)}
      {circuit.resistors[2] && renderResistor(280, 154, circuit.resistors[2], 'small')}
      {renderWire(310, 160, 340, 160)}
      
      {/* Reconnection */}
      {renderWire(340, 80, 340, 160)}
      {renderWire(340, 120, 380, 120)}
      
      {/* Final series component */}
      {circuit.lamps[2] && renderLamp(400, 120, circuit.lamps[2], 12)}
      
      {/* Return path */}
      {renderWire(412, 120, 420, 120)}
      {renderWire(420, 120, 420, 180)}
      {renderWire(420, 180, 15, 180)}
      {renderWire(15, 180, 15, 128)}
      
      {/* Multiple current arrows */}
      {renderCurrentArrow(65, 117)}
      {renderCurrentArrow(130, 117)}
      {renderCurrentArrow(175, 77)}
      {renderCurrentArrow(255, 77)}
      {renderCurrentArrow(175, 157)}
      {renderCurrentArrow(255, 157)}
      {renderCurrentArrow(360, 117)}
      
      {/* Advanced circuit analysis */}
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Rangkaian Campuran Lanjut</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">Multi-level paralel + seri</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">Analisis kompleks</text>
      <text x="10" y="52" fill="#ec4899" fontSize="7">{circuit.resistors.length}R + {circuit.lamps.length}L</text>
      <text x="10" y="62" fill="#06b6d4" fontSize="7">Reduksi bertahap</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  const renderCustomTemplate = () => (
    <svg viewBox="0 0 400 200" className="w-full h-32">
      <rect x="0" y="0" width="400" height="200" fill="#1e3a8a" rx="8" className="opacity-20"/>
      
      {/* Custom layout - adaptive positioning */}
      {renderBattery(20, 90, circuit.battery.voltage)}
      
      {/* Arrange components in a flexible grid */}
      {circuit.resistors.map((resistor, index) => (
        renderResistor(80 + (index % 3) * 80, 60 + Math.floor(index / 3) * 40, resistor, 'small')
      ))}
      
      {circuit.lamps.map((lamp, index) => (
        renderLamp(120 + (index % 3) * 80, 100 + Math.floor(index / 3) * 40, lamp, 10)
      ))}
      
      {/* Connecting wires - simplified */}
      {renderWire(48, 98, 380, 98)}
      {renderWire(380, 98, 380, 160)}
      {renderWire(380, 160, 20, 160)}
      {renderWire(20, 160, 20, 106)}
      
      <text x="10" y="20" fill="#60a5fa" fontSize="9" fontWeight="bold">Rangkaian Kustom</text>
      <text x="10" y="32" fill="#34d399" fontSize="7">Layout fleksibel</text>
      <text x="10" y="42" fill="#fbbf24" fontSize="7">{circuit.resistors.length + circuit.lamps.length} komponen</text>
      
      <defs>
        <marker id="current-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#10b981"/>
        </marker>
      </defs>
    </svg>
  );

  return (
    <div
      className={`
        relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
        rounded-2xl p-6 border border-white/20 cursor-grab active:cursor-grabbing
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${showBrightness ? `shadow-lg ${brightnessInfo.glow}` : ''}
        ${className}
      `}
      draggable={onDragStart !== undefined}
      onDragStart={(e) => onDragStart?.(e, circuit.id)}
      onKeyDown={(e) => onKeyDown?.(e, circuit.id)}
      tabIndex={0}
      role="button"
      aria-label={`Rangkaian ${circuit.id}: ${circuit.name} - ${getTemplateName(circuit.template)}`}
    >
      {/* Header with Template Type */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
            {getTemplateIcon(circuit.template)}
            <span className="text-blue-300 text-xs ml-2 font-medium">
              {getTemplateName(circuit.template)}
            </span>
          </div>
          
          {/* Component count badges */}
          <div className="flex space-x-1">
            {circuit.resistors.length > 0 && (
              <div className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">
                {circuit.resistors.length}R
              </div>
            )}
            {circuit.lamps.length > 0 && (
              <div className="px-2 py-1 bg-yellow-500/20 rounded text-xs text-yellow-300">
                {circuit.lamps.length}L
              </div>
            )}
          </div>
        </div>
        
        {/* Circuit ID Badge */}
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{circuit.id}</span>
        </div>
      </div>

      {/* Circuit Diagram */}
      <div className="bg-black/20 rounded-xl p-4 mb-4 border border-white/10">
        {renderCircuitSVG()}
      </div>

      {/* Circuit Information */}
      <div className="space-y-3">
        <h3 className="text-white font-bold text-lg">{circuit.name}</h3>
        
        {/* Circuit Description */}
        {circuit.description && (
          <p className="text-blue-200/80 text-sm">{circuit.description}</p>
        )}
        
        {/* Technical Specifications */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-white/60">Tegangan Sumber:</div>
            <div className="text-green-400 font-bold">{circuit.battery.voltage}V</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-white/60">Daya Total:</div>
            <div className="text-yellow-400 font-bold">{values.power.toFixed(2)}W</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-white/60">Arus Utama:</div>
            <div className="text-blue-400 font-bold">{values.current.toFixed(2)}A</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-white/60">Kecerahan:</div>
            {showBrightness && (
              <div className={`flex items-center space-x-1 ${brightnessInfo.color}`}>
                <Lightbulb className="w-3 h-3" />
                <span className="font-medium">{brightnessInfo.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Component Details */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Komponen:</div>
          <div className="flex flex-wrap gap-2">
            {circuit.resistors.map(resistor => (
              <span key={resistor.id} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                {resistor.id}: {resistor.value}Ω
              </span>
            ))}
            {circuit.lamps.map(lamp => (
              <span key={lamp.id} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                {lamp.id}: {lamp.power}W
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Handle Indicator */}
      <div className="absolute top-2 left-2 text-white/40">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCircuitCard;