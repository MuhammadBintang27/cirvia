'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle, X, Lightbulb, LightbulbOff, Power, Target, AlertCircle, RotateCcw } from 'lucide-react';
import { CircuitAnalysisQuestion, resolveCircuitTemplate } from '@/lib/questions';

interface TipeSoal4Props {
  question: CircuitAnalysisQuestion;
  onAnswer: (lampStates: { [lampId: string]: 'on' | 'off' | 'unknown' } | boolean, isCorrect?: boolean) => void;
}

interface TipeSoal4State {
  lampStates: { [lampId: string]: 'on' | 'off' | 'unknown' };
  showResult: boolean;
  isCorrect: boolean;
  feedback: { [lampId: string]: 'correct' | 'incorrect' | 'none' };
}

interface CircuitNode {
  id: string;
  type: 'source' | 'lamp' | 'junction';
  label: string;
  position: { x: number; y: number };
  connections: string[];
}

// Utility untuk analisis konektivitas rangkaian
class CircuitAnalyzer {
  private nodes: Map<string, CircuitNode> = new Map();
  private adjacencyList: Map<string, string[]> = new Map();

  constructor(components: any[], connections: any[]) {
    this.buildGraph(components, connections);
  }

  private buildGraph(components: any[], connections: any[]) {
    // Initialize nodes
    components.forEach(comp => {
      this.nodes.set(comp.id, {
        id: comp.id,
        type: comp.type,
        label: comp.label,
        position: comp.position,
        connections: []
      });
      this.adjacencyList.set(comp.id, []);
    });

    // Build adjacency list from connections
    connections.forEach(conn => {
      this.adjacencyList.get(conn.from)?.push(conn.to);
      this.adjacencyList.get(conn.to)?.push(conn.from);
      
      const fromNode = this.nodes.get(conn.from);
      const toNode = this.nodes.get(conn.to);
      if (fromNode) fromNode.connections.push(conn.to);
      if (toNode) toNode.connections.push(conn.from);
    });
  }

  // Analisis status lampu setelah satu lampu dipadamkan
  analyzeLampStates(targetLamp: string): { [lampId: string]: 'on' | 'off' } {
    const result: { [lampId: string]: 'on' | 'off' } = {};
    const sourceNode = Array.from(this.nodes.values()).find(n => n.type === 'source');
    
    if (!sourceNode) return result;

    // Get all lamp nodes except target
    const lampNodes = Array.from(this.nodes.values()).filter(n => 
      n.type === 'lamp' && n.id !== targetLamp
    );

    // Check each lamp for connectivity to source (considering target lamp as open circuit)
    lampNodes.forEach(lamp => {
      const hasPath = this.hasClosedPath(sourceNode.id, lamp.id, targetLamp);
      result[lamp.id] = hasPath ? 'on' : 'off';
    });

    return result;
  }

  // DFS untuk mencari jalur tertutup dari source ke lampu (excluding open lamp)
  private hasClosedPath(sourceId: string, lampId: string, openLampId: string): boolean {
    const visited = new Set<string>();
    
    const dfs = (currentId: string): boolean => {
      if (currentId === lampId) return true;
      if (currentId === openLampId) return false; // Open circuit
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      
      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) return true;
      }
      
      return false;
    };

    return dfs(sourceId);
  }

  getNodes(): CircuitNode[] {
    return Array.from(this.nodes.values());
  }
}

const TipeSoal4: React.FC<TipeSoal4Props> = ({ question, onAnswer }) => {
  // Resolve circuit template to actual circuit structure
  const resolvedCircuit = useMemo(() => resolveCircuitTemplate(question.circuit), [question.circuit]);
  
  // Get lamp IDs from resolved circuit
  const lampIds = useMemo(() => 
    resolvedCircuit.components
      .filter(comp => comp.type === 'lamp')
      .map(comp => comp.id)
  , [resolvedCircuit.components]);

  const [state, setState] = useState<TipeSoal4State>(() => {
    const initialStates: { [lampId: string]: 'on' | 'off' | 'unknown' } = {};
    lampIds.forEach(lampId => {
      if (lampId !== question.targetLamp) {
        initialStates[lampId] = 'unknown';
      }
    });
    return {
      lampStates: initialStates,
      showResult: false,
      isCorrect: false,
      feedback: {}
    };
  });

  // Circuit analyzer instance
  const analyzer = useMemo(() => 
    new CircuitAnalyzer(resolvedCircuit.components, resolvedCircuit.connections)
  , [resolvedCircuit]);

  // Toggle lamp state prediction
  const handleLampToggle = useCallback((lampId: string) => {
    if (state.showResult || lampId === question.targetLamp) return;

    setState(prev => ({
      ...prev,
      lampStates: {
        ...prev.lampStates,
        [lampId]: prev.lampStates[lampId] === 'on' 
          ? 'off' 
          : prev.lampStates[lampId] === 'off' 
            ? 'unknown' 
            : 'on'
      }
    }));
  }, [state.showResult, question.targetLamp]);

  // Reset predictions
  const handleReset = useCallback(() => {
    if (state.showResult) return;

    const resetStates: { [lampId: string]: 'on' | 'off' | 'unknown' } = {};
    lampIds.forEach(lampId => {
      if (lampId !== question.targetLamp) {
        resetStates[lampId] = 'unknown';
      }
    });

    setState(prev => ({
      ...prev,
      lampStates: resetStates
    }));
  }, [state.showResult, lampIds, question.targetLamp]);

  // Check if all lamps are answered (no 'unknown' states)
  const canSubmit = useCallback(() => {
    // Check if all lamps (except broken one) have been answered
    const allAnswered = lampIds.every(lampId => state.lampStates[lampId] !== 'unknown');
    return allAnswered && !state.showResult;
  }, [state.lampStates, state.showResult, lampIds]);

  // Submit answer
  const handleSubmit = useCallback(() => {
    if (state.showResult) return;

    // Check if all lamps are answered
    const hasUnanswered = lampIds.some(lampId => state.lampStates[lampId] === 'unknown');
    if (hasUnanswered) {
      alert('⚠️ Silakan pilih status untuk semua lampu (Menyala atau Mati) sebelum submit!');
      return;
    }

    const feedback: { [lampId: string]: 'correct' | 'incorrect' | 'none' } = {};
    let correctCount = 0;
    let totalAnswered = 0;

    lampIds.forEach(lampId => {
      if (lampId === question.targetLamp) return;

      const userAnswer = state.lampStates[lampId];
      const correctAnswer = question.correctStates[lampId];

      if (userAnswer === 'unknown') {
        feedback[lampId] = 'none';
      } else {
        totalAnswered++;
        if (userAnswer === correctAnswer) {
          correctCount++;
          feedback[lampId] = 'correct';
        } else {
          feedback[lampId] = 'incorrect';
        }
      }
    });

    const isCorrect = totalAnswered > 0 && correctCount === totalAnswered;

    setState(prev => ({
      ...prev,
      showResult: true,
      isCorrect,
      feedback
    }));

    // Send actual lamp states, not just boolean
    onAnswer(state.lampStates, isCorrect);
  }, [state, lampIds, question.targetLamp, question.correctStates, onAnswer]);

  // Render SVG lamp component - more realistic bulb shape
  const renderLamp = (comp: any) => {
    const isTargetLamp = comp.id === question.targetLamp;
    const isClickable = comp.type === 'lamp' && !isTargetLamp && !state.showResult;
    const userState = state.lampStates[comp.id];
    const feedback = state.feedback[comp.id];
    const correctState = question.correctStates[comp.id];

    // Define lamp colors and states
    let lampColor = '#94a3b8'; // gray-400 default
    let glowEffect = '';
    let lampFill = '#1e293b'; // slate-800 default

    if (isTargetLamp) {
      // Target lamp - permanently off with red X
      lampColor = '#ef4444'; // red-500
      lampFill = '#7f1d1d'; // red-900
    } else if (state.showResult) {
      // Show ground truth in result mode
      if (correctState === 'on') {
        lampColor = '#fbbf24'; // amber-400 (on)
        lampFill = '#f59e0b'; // amber-500
        glowEffect = 'drop-shadow-glow-yellow';
      } else {
        lampColor = '#6b7280'; // gray-500 (off)
        lampFill = '#374151'; // gray-700
      }
    } else {
      // Show user predictions
      if (userState === 'on') {
        lampColor = '#fbbf24'; // amber-400
        lampFill = '#f59e0b'; // amber-500
        glowEffect = 'drop-shadow-glow-yellow';
      } else if (userState === 'off') {
        lampColor = '#6b7280'; // gray-500
        lampFill = '#374151'; // gray-700
      } else {
        lampColor = '#60a5fa'; // blue-400 (unknown)
        lampFill = '#1e40af'; // blue-800
      }
    }

    return (
      <g key={comp.id}>
        {/* Define SVG filters for glow effect */}
        <defs>
          <filter id={`glowYellow-${comp.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Clickable area for lamp */}
        {isClickable && (
          <circle
            cx={comp.position.x}
            cy={comp.position.y}
            r="30"
            fill="transparent"
            className="cursor-pointer"
            onClick={() => handleLampToggle(comp.id)}
          />
        )}
        
        {/* Lamp bulb shape - realistic bulb */}
        <ellipse
          cx={comp.position.x}
          cy={comp.position.y - 2}
          rx="16"
          ry="20"
          fill={lampFill}
          stroke={lampColor}
          strokeWidth="3"
          filter={glowEffect === 'drop-shadow-glow-yellow' ? `url(#glowYellow-${comp.id})` : ""}
          className={`transition-all duration-300 ${isClickable ? 'hover:stroke-4' : ''}`}
        />

        {/* Lamp screw base */}
        <rect
          x={comp.position.x - 8}
          y={comp.position.y + 18}
          width="16"
          height="6"
          fill="#64748b"
          stroke="#ffffff"
          strokeWidth="1"
          rx="2"
        />

        {/* Lamp filament (when on) */}
        {(userState === 'on' || (state.showResult && correctState === 'on')) && (
          <>
            <line
              x1={comp.position.x - 8}
              y1={comp.position.y - 8}
              x2={comp.position.x + 8}
              y2={comp.position.y + 8}
              stroke="#fff59d"
              strokeWidth="1.5"
              className="opacity-80"
            />
            <line
              x1={comp.position.x + 8}
              y1={comp.position.y - 8}
              x2={comp.position.x - 8}
              y2={comp.position.y + 8}
              stroke="#fff59d"
              strokeWidth="1.5"
              className="opacity-80"
            />
          </>
        )}

        {/* Lamp label - positioned consistently above all lamps */}
        <text
          x={comp.position.x}
          y={comp.position.y - 10}
          textAnchor="middle"
          className="text-sm font-bold fill-white pointer-events-none"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
        >
          {comp.label}
        </text>

        {/* Target lamp indicator (only X for target lamp) */}
        {isTargetLamp && (
          <text
            x={comp.position.x}
            y={comp.position.y + 5}
            textAnchor="middle"
            className="text-lg font-bold fill-red-300 pointer-events-none"
          >
            ❌
          </text>
        )}

        {/* Feedback indicators in result mode */}
        {state.showResult && !isTargetLamp && (
          <>
            {feedback === 'correct' && (
              <circle
                cx={comp.position.x + 18}
                cy={comp.position.y - 18}
                r="10"
                fill="#22c55e"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
            {feedback === 'incorrect' && (
              <circle
                cx={comp.position.x + 18}
                cy={comp.position.y - 18}
                r="10"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
            {feedback === 'correct' && (
              <text
                x={comp.position.x + 18}
                y={comp.position.y - 13}
                textAnchor="middle"
                className="text-sm fill-white font-bold pointer-events-none"
              >
                ✓
              </text>
            )}
            {feedback === 'incorrect' && (
              <text
                x={comp.position.x + 18}
                y={comp.position.y - 13}
                textAnchor="middle"
                className="text-sm fill-white font-bold pointer-events-none"
              >
                ✗
              </text>
            )}
          </>
        )}
      </g>
    );
  };

  // Render battery component - more realistic
  const renderBattery = (comp: any) => {
    return (
      <g key={comp.id}>
        {/* Battery main body */}
        <rect
          x={comp.position.x - 20}
          y={comp.position.y - 12}
          width="40"
          height="24"
          fill="#22c55e"
          stroke="#ffffff"
          strokeWidth="2"
          rx="4"
        />
        
        {/* Positive terminal */}
        <rect
          x={comp.position.x + 20}
          y={comp.position.y - 6}
          width="6"
          height="12"
          fill="#22c55e"
          rx="2"
        />

        {/* Negative terminal */}
        <rect
          x={comp.position.x - 26}
          y={comp.position.y - 4}
          width="6"
          height="8"
          fill="#22c55e"
          rx="1"
        />

        {/* + and - symbols */}
        <text
          x={comp.position.x + 12}
          y={comp.position.y + 4}
          textAnchor="middle"
          className="text-xs font-bold fill-white pointer-events-none"
        >
          +
        </text>
        <text
          x={comp.position.x - 12}
          y={comp.position.y + 4}
          textAnchor="middle"
          className="text-xs font-bold fill-white pointer-events-none"
        >
          −
        </text>

        {/* Voltage label */}
        <text
          x={comp.position.x}
          y={comp.position.y - 25}
          textAnchor="middle"
          className="text-sm font-bold fill-green-400 pointer-events-none"
        >
          {comp.label}
        </text>
      </g>
    );
  };

  // Render junction component - more visible connection points
  const renderJunction = (comp: any) => {
    return (
      <g key={comp.id}>
        {/* Junction main dot */}
        <circle
          cx={comp.position.x}
          cy={comp.position.y}
          r="6"
          fill="#64748b"
          stroke="#ffffff"
          strokeWidth="2"
        />
        
        {/* Junction inner highlight */}
        <circle
          cx={comp.position.x}
          cy={comp.position.y}
          r="3"
          fill="#94a3b8"
        />
      </g>
    );
  };

  // Render wire connections - uniform appearance for student analysis
  const renderWires = () => {
    return resolvedCircuit.connections.map(conn => {
      const fromComp = resolvedCircuit.components.find(c => c.id === conn.from);
      const toComp = resolvedCircuit.components.find(c => c.id === conn.to);
      
      if (!fromComp || !toComp) return null;

      // All wires look the same - students must analyze the circuit structure
      const wireColor = '#f59e0b'; // Uniform amber color
      const wireWidth = 4; // Consistent width
      
      return (
        <g key={conn.id}>
          {/* Wire shadow for depth */}
          <line
            x1={fromComp.position.x}
            y1={fromComp.position.y + 2}
            x2={toComp.position.x}
            y2={toComp.position.y + 2}
            stroke="#000000"
            strokeWidth={wireWidth + 1}
            className="opacity-25"
          />
          
          {/* Main wire - uniform appearance */}
          <line
            x1={fromComp.position.x}
            y1={fromComp.position.y}
            x2={toComp.position.x}
            y2={toComp.position.y}
            stroke={wireColor}
            strokeWidth={wireWidth}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          
          {/* Wire highlight for 3D effect */}
          <line
            x1={fromComp.position.x}
            y1={fromComp.position.y - 1}
            x2={toComp.position.x}
            y2={toComp.position.y - 1}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="opacity-40"
          />
        </g>
      );
    });
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
      <div className="grid grid-cols-2 gap-6 h-full">
        {/* Interactive SVG Circuit Diagram */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-400/30 p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">
              Rangkaian Listrik
            </h3>
            <p className="text-blue-200/90 text-sm">
              Klik lampu untuk memprediksi kondisi Nyala/Padam
            </p>
          </div>
          
          <svg viewBox="0 0 520 360" className="w-full h-80 bg-gradient-to-br from-slate-900/50 to-blue-900/30 rounded-lg border border-blue-500/20">
            {/* Render wire connections first (behind components) */}
            {renderWires()}
            
            {/* Render all circuit components */}
            {resolvedCircuit.components.map(comp => {
              switch (comp.type) {
                case 'lamp':
                  return renderLamp(comp);
                case 'source':
                  return renderBattery(comp);
                case 'junction':
                  return renderJunction(comp);
                default:
                  return null;
              }
            })}
          </svg>
        </div>

        {/* Information and Controls Panel */}
        <div className="flex flex-col justify-between">
          {/* Question Info */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-400/30 p-6 mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4">
              Analisis Rangkaian
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <p className="text-blue-200/90 font-medium mb-2">❓ Pertanyaan:</p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {question.question}
                </p>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <X className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-red-300 font-semibold">
                      Lampu {question.targetLamp} PADAM
                    </p>
                    <p className="text-red-200/80 text-sm">
                      {question.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <p className="text-blue-300 font-semibold mb-2">Instruksi:</p>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• Analisis struktur rangkaian untuk menentukan jalur arus</li>
                  <li>• Klik lampu pada diagram untuk memprediksi kondisinya</li>
                  <li>• 💡 = Nyala/Padam, ? = Belum diprediksi</li>
                  <li>• Perhatikan: lampu mana yang akan terpengaruh jika target lamp putus</li>
                  <li className="text-yellow-300 font-medium">⚠️ Semua lampu harus dipilih sebelum submit!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prediction Summary */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-400/30 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Status Prediksi
              </h4>
              {!state.showResult && !canSubmit() && (
                <span className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-400/30">
                  {lampIds.filter(id => state.lampStates[id] === 'unknown').length} lampu belum dipilih
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {lampIds
                .filter(lampId => lampId !== question.targetLamp)
                .map(lampId => {
                  const userState = state.lampStates[lampId];
                  const feedback = state.feedback[lampId];
                  const correctState = question.correctStates[lampId];
                  
                  return (
                    <div
                      key={lampId}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        state.showResult
                          ? feedback === 'correct'
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/40'
                            : feedback === 'incorrect'
                            ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/40'
                            : 'bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-gray-400/30'
                          : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-400/20 hover:border-blue-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{lampId}</span>
                        <div className="flex items-center space-x-2">
                          {state.showResult ? (
                            <>
                              <span className="text-sm text-gray-300">
                                {correctState === 'on' ? '🔆' : '❌'}
                              </span>
                              {feedback === 'correct' && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                              {feedback === 'incorrect' && (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                            </>
                          ) : (
                            <span className="text-sm">
                              {userState === 'on' ? '🔆' : userState === 'off' ? '❌' : '?'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!state.showResult && (
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-600/50 to-slate-700/50 hover:from-slate-600/70 hover:to-slate-700/70 text-white rounded-xl border border-slate-500/40 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 font-semibold shadow-lg ${
                    canSubmit()
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-blue-400/30 transform hover:scale-105 shadow-blue-500/25'
                      : 'bg-gray-600/30 text-gray-400 border-gray-500/30 cursor-not-allowed opacity-50'
                  }`}
                >
                  Submit
                </button>
              </div>
            )}

            {state.showResult && (
              <div className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                state.isCorrect
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/40 text-green-300'
                  : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-400/40 text-red-300'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {state.isCorrect ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <X className="w-6 h-6" />
                  )}
                  <span className="font-bold">
                    {state.isCorrect ? 'Benar!' : 'Kurang Tepat'}
                  </span>
                </div>
                <p className="text-sm opacity-80">
                  {state.isCorrect
                    ? 'Analisis rangkaian Anda sudah tepat!'
                    : 'Coba analisis ulang jalur arus pada rangkaian.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipeSoal4;