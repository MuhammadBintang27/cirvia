'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle, X, Lightbulb, LightbulbOff, Power, Target, AlertCircle } from 'lucide-react';
import { CircuitAnalysisQuestion } from '@/lib/questions';

interface TipeSoal4Props {
  question: CircuitAnalysisQuestion;
  onAnswer: (isCorrect: boolean) => void;
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

interface CircuitPath {
  nodes: string[];
  isComplete: boolean;
  containsOpenLamp: boolean;
}

// Utility untuk analisis konektivitas rangkaian
class CircuitAnalyzer {
  private nodes: Map<string, CircuitNode> = new Map();
  private adjacencyList: Map<string, string[]> = new Map();

  constructor(components: CircuitAnalysisQuestion['circuit']['components'], connections: CircuitAnalysisQuestion['circuit']['connections']) {
    this.buildGraph(components, connections);
  }

  private buildGraph(components: CircuitAnalysisQuestion['circuit']['components'], connections: CircuitAnalysisQuestion['circuit']['connections']) {
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

// Generator untuk membuat rangkaian campuran
const generateMixedCircuit = (seed: number = 42): CircuitAnalysisQuestion['circuit'] => {
  // Seeded random untuk hasil yang konsisten
  const random = (min: number, max: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    return min + (seed / 233280) * (max - min);
  };

  const components: CircuitAnalysisQuestion['circuit']['components'] = [
    { id: 'source', type: 'source', label: '+/-', position: { x: 50, y: 200 } },
    { id: 'ground', type: 'junction', label: 'GND', position: { x: 50, y: 350 } },
    { id: 'j1', type: 'junction', label: 'J1', position: { x: 200, y: 200 } },
    { id: 'j2', type: 'junction', label: 'J2', position: { x: 350, y: 200 } },
    { id: 'j3', type: 'junction', label: 'J3', position: { x: 200, y: 275 } },
    { id: 'L1', type: 'lamp', label: 'L1', position: { x: 275, y: 150 } },
    { id: 'L2', type: 'lamp', label: 'L2', position: { x: 275, y: 200 } },
    { id: 'L3', type: 'lamp', label: 'L3', position: { x: 275, y: 250 } },
    { id: 'L4', type: 'lamp', label: 'L4', position: { x: 450, y: 175 } },
    { id: 'L5', type: 'lamp', label: 'L5', position: { x: 450, y: 225 } },
  ];

  const connections: CircuitAnalysisQuestion['circuit']['connections'] = [
    { id: 'c1', from: 'source', to: 'j1', type: 'series' },
    { id: 'c2', from: 'j1', to: 'L1', type: 'parallel' },
    { id: 'c3', from: 'j1', to: 'L2', type: 'parallel' },
    { id: 'c4', from: 'j1', to: 'j3', type: 'series' },
    { id: 'c5', from: 'j3', to: 'L3', type: 'parallel' },
    { id: 'c6', from: 'L1', to: 'j2', type: 'series' },
    { id: 'c7', from: 'L2', to: 'j2', type: 'series' },
    { id: 'c8', from: 'L3', to: 'j2', type: 'series' },
    { id: 'c9', from: 'j2', to: 'L4', type: 'parallel' },
    { id: 'c10', from: 'j2', to: 'L5', type: 'parallel' },
    { id: 'c11', from: 'L4', to: 'ground', type: 'series' },
    { id: 'c12', from: 'L5', to: 'ground', type: 'series' },
  ];

  return { components, connections };
};

const TipeSoal4: React.FC<TipeSoal4Props> = ({ question, onAnswer }) => {
  // Get lamp IDs from circuit
  const lampIds = useMemo(() => 
    question.circuit.components
      .filter(comp => comp.type === 'lamp')
      .map(comp => comp.id)
  , [question.circuit.components]);

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
    new CircuitAnalyzer(question.circuit.components, question.circuit.connections)
  , [question.circuit]);

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

  // Submit answer
  const handleSubmit = useCallback(() => {
    if (state.showResult) return;

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

    onAnswer(isCorrect);
  }, [state, lampIds, question.targetLamp, question.correctStates, onAnswer]);

  // Get lamp icon based on state
  const getLampIcon = (lampId: string, size: string = 'w-8 h-8') => {
    if (lampId === question.targetLamp) {
      return <X className={`${size} text-red-400`} />;
    }

    const userState = state.lampStates[lampId];
    const feedback = state.feedback[lampId];

    if (state.showResult) {
      const correctState = question.correctStates[lampId];
      const isCorrectPrediction = feedback === 'correct';
      
      if (correctState === 'on') {
        return (
          <div className="relative">
            <Lightbulb className={`${size} ${isCorrectPrediction ? 'text-yellow-400' : 'text-yellow-600'}`} />
            {feedback === 'incorrect' && <X className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />}
            {feedback === 'correct' && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />}
          </div>
        );
      } else {
        return (
          <div className="relative">
            <LightbulbOff className={`${size} ${isCorrectPrediction ? 'text-gray-400' : 'text-gray-600'}`} />
            {feedback === 'incorrect' && <X className="absolute -top-1 -right-1 w-4 h-4 text-red-500" />}
            {feedback === 'correct' && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />}
          </div>
        );
      }
    }

    // User prediction state
    switch (userState) {
      case 'on':
        return <Lightbulb className={`${size} text-yellow-400`} />;
      case 'off':
        return <LightbulbOff className={`${size} text-gray-400`} />;
      default:
        return <AlertCircle className={`${size} text-blue-400`} />;
    }
  };

  // Render circuit diagram
  const renderCircuit = () => {
    const nodes = analyzer.getNodes();
    
    return (
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-white/10">
        <svg viewBox="0 0 500 400" className="w-full h-64">
          {/* Render connections */}
          {question.circuit.connections.map(conn => {
            const fromComp = question.circuit.components.find(c => c.id === conn.from);
            const toComp = question.circuit.components.find(c => c.id === conn.to);
            
            if (!fromComp || !toComp) return null;

            return (
              <line
                key={conn.id}
                x1={fromComp.position.x}
                y1={fromComp.position.y}
                x2={toComp.position.x}
                y2={toComp.position.y}
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-300/60"
              />
            );
          })}

          {/* Render components */}
          {question.circuit.components.map(comp => {
            const isClickable = comp.type === 'lamp' && comp.id !== question.targetLamp && !state.showResult;
            
            return (
              <g key={comp.id} transform={`translate(${comp.position.x - 20}, ${comp.position.y - 20})`}>
                <circle
                  r="18"
                  fill={isClickable ? "rgba(59, 130, 246, 0.2)" : "rgba(30, 41, 59, 0.6)"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className={isClickable ? "text-blue-400 cursor-pointer hover:fill-blue-500/30" : "text-slate-400"}
                  onClick={() => isClickable && handleLampToggle(comp.id)}
                />
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  className="text-xs font-semibold fill-white pointer-events-none"
                >
                  {comp.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Lamp status indicators */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {lampIds.map(lampId => (
            <button
              key={lampId}
              onClick={() => handleLampToggle(lampId)}
              disabled={lampId === question.targetLamp || state.showResult}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                lampId === question.targetLamp
                  ? 'bg-red-500/10 border-red-400/30 cursor-not-allowed'
                  : state.showResult
                  ? 'bg-slate-700/30 border-slate-600/30 cursor-default'
                  : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 cursor-pointer'
              }`}
            >
              {getLampIcon(lampId)}
              <span className="text-white font-medium">{lampId}</span>
              {lampId === question.targetLamp && (
                <span className="text-red-300 text-sm">(Padam)</span>
              )}
              {state.lampStates[lampId] === 'on' && <span className="text-yellow-300 text-sm">Nyala</span>}
              {state.lampStates[lampId] === 'off' && <span className="text-gray-300 text-sm">Padam</span>}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">{question.title}</h2>
        </div>
        <p className="text-blue-200/90 text-lg mb-4">{question.description}</p>
        <p className="text-white/80 leading-relaxed">{question.question}</p>
      </div>

      {/* Circuit */}
      {renderCircuit()}

      {/* Instructions */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
        <p className="text-blue-300 font-semibold mb-2">Instruksi:</p>
        <p className="text-white/80">
          Klik pada setiap lampu untuk memprediksi apakah lampu tersebut akan nyala atau padam 
          ketika lampu <span className="text-red-300 font-bold">{question.targetLamp}</span> dipadamkan.
        </p>
      </div>

      {/* Submit Button */}
      {!state.showResult && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-2xl"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Submit Jawaban
          </button>
        </div>
      )}

      {/* Result */}
      {state.showResult && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            {state.isCorrect ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <X className="w-8 h-8 text-red-400" />
            )}
            <h3 className="text-2xl font-bold text-white">
              {state.isCorrect ? 'Jawaban Benar!' : 'Belum Tepat'}
            </h3>
          </div>

          {/* Detailed feedback */}
          <div className="space-y-3 mb-6">
            {lampIds.filter(id => id !== question.targetLamp).map(lampId => (
              <div key={lampId} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getLampIcon(lampId, 'w-6 h-6')}
                  <span className="text-white font-medium">{lampId}:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/80">
                    {question.correctStates[lampId] === 'on' ? 'Nyala' : 'Padam'}
                  </span>
                  {state.feedback[lampId] === 'correct' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {state.feedback[lampId] === 'incorrect' && (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
              <h4 className="text-blue-300 font-semibold mb-2">Penjelasan:</h4>
              <p className="text-white/80">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TipeSoal4;