'use client'

import { useState, useEffect } from 'react'

interface InteractiveCircuitProps {
  voltage: number
  resistance: number
  title: string
}

const InteractiveCircuitDemo: React.FC<InteractiveCircuitProps> = ({ voltage, resistance, title }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCalculation, setShowCalculation] = useState(false)
  
  const current = voltage / resistance
  const power = voltage * current

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      
      {/* Interactive Circuit SVG */}
      <div className="relative">
        <svg width="400" height="200" viewBox="0 0 400 200" className="mx-auto">
          {/* Circuit Background */}
          <rect width="400" height="200" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" rx="8"/>
          
          {/* Wires */}
          <line x1="50" y1="100" x2="150" y2="100" stroke="#374151" strokeWidth="3"/>
          <line x1="250" y1="100" x2="350" y2="100" stroke="#374151" strokeWidth="3"/>
          <line x1="350" y1="100" x2="350" y2="150" stroke="#374151" strokeWidth="3"/>
          <line x1="350" y1="150" x2="50" y2="150" stroke="#374151" strokeWidth="3"/>
          <line x1="50" y1="150" x2="50" y2="100" stroke="#374151" strokeWidth="3"/>
          
          {/* Battery */}
          <g>
            <rect x="140" y="85" width="20" height="30" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" rx="3"/>
            <text x="150" y="78" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
              {voltage}V
            </text>
            <text x="150" y="120" textAnchor="middle" fontSize="10" fill="#6b7280">
              Battery
            </text>
          </g>
          
          {/* Resistor */}
          <g>
            <rect x="190" y="90" width="60" height="20" fill="#ef4444" stroke="#dc2626" strokeWidth="2" rx="3"/>
            <text x="220" y="78" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
              {resistance}Ω
            </text>
            <text x="220" y="125" textAnchor="middle" fontSize="10" fill="#6b7280">
              Resistor
            </text>
          </g>
          
          {/* Current Flow Animation */}
          {isAnimating && (
            <>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <path d="M 70,100 L 140,100 L 160,100 L 190,100 L 250,100 L 350,100 L 350,150 L 50,150 L 50,100 Z"/>
                </animateMotion>
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
                  <path d="M 70,100 L 140,100 L 160,100 L 190,100 L 250,100 L 350,100 L 350,150 L 50,150 L 50,100 Z"/>
                </animateMotion>
              </circle>
              <circle r="3" fill="#3b82f6">
                <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
                  <path d="M 70,100 L 140,100 L 160,100 L 190,100 L 250,100 L 350,100 L 350,150 L 50,150 L 50,100 Z"/>
                </animateMotion>
              </circle>
            </>
          )}
          
          {/* Current Direction Arrow */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          <line x1="100" y1="70" x2="130" y2="70" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <text x="115" y="65" textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="bold">
            Arah Arus
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isAnimating
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isAnimating ? 'Stop Animasi' : 'Mulai Animasi'}
        </button>
        
        <button
          onClick={() => setShowCalculation(!showCalculation)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showCalculation ? 'Sembunyikan' : 'Tampilkan'} Perhitungan
        </button>
      </div>

      {/* Calculation Panel */}
      {showCalculation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Perhitungan Real-time</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border">
              <span className="text-gray-600">Tegangan (V):</span>
              <span className="font-bold text-blue-600 ml-2">{voltage} V</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="text-gray-600">Resistansi (R):</span>
              <span className="font-bold text-red-600 ml-2">{resistance} Ω</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="text-gray-600">Arus (I):</span>
              <span className="font-bold text-green-600 ml-2">{current.toFixed(2)} A</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="text-gray-600">Daya (P):</span>
              <span className="font-bold text-purple-600 ml-2">{power.toFixed(2)} W</span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Hukum Ohm:</strong> I = V/R = {voltage}/{resistance} = {current.toFixed(2)} A
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Daya:</strong> P = V×I = {voltage}×{current.toFixed(2)} = {power.toFixed(2)} W
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InteractiveCircuitDemo
