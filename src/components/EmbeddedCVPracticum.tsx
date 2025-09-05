'use client'

import { useRef, useEffect, useState } from 'react'

interface Component {
  id: string
  type: 'resistor' | 'battery' | 'wire'
  position: { x: number; y: number }
  value?: number
  selected: boolean
}

interface CircuitCalculations {
  voltage: number
  current: number
  resistance: number
  power: number
}

export default function EmbeddedCVPracticum() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [isActive, setIsActive] = useState(false)
  const [components, setComponents] = useState<Component[]>([])
  const [calculations, setCalculations] = useState<CircuitCalculations>({
    voltage: 0,
    current: 0,
    resistance: 0,
    power: 0
  })

  // Simple demo circuit builder without complex CV for now
  const addComponent = (type: 'resistor' | 'battery' | 'wire') => {
    const newComponent: Component = {
      id: `${type}_${Date.now()}`,
      type,
      position: { 
        x: 200 + Math.random() * 200, 
        y: 200 + Math.random() * 100 
      },
      value: type === 'battery' ? 12 : type === 'resistor' ? 100 : 0,
      selected: false
    }
    
    setComponents(prev => [...prev, newComponent])
    calculateCircuit([...components, newComponent])
  }

  const calculateCircuit = (comps: Component[]) => {
    const batteries = comps.filter(c => c.type === 'battery')
    const resistors = comps.filter(c => c.type === 'resistor')
    
    const voltage = batteries.reduce((sum, b) => sum + (b.value || 0), 0)
    const resistance = resistors.reduce((sum, r) => sum + (r.value || 0), 0)
    const current = resistance > 0 ? voltage / resistance : 0
    const power = voltage * current
    
    setCalculations({ voltage, current, resistance, power })
  }

  const clearCircuit = () => {
    setComponents([])
    setCalculations({ voltage: 0, current: 0, resistance: 0, power: 0 })
  }

  useEffect(() => {
    if (isActive) {
      setIsLoading(false)
    }
  }, [isActive])

  const startCV = () => {
    setIsActive(true)
    setError('')
  }

  const stopCV = () => {
    setIsActive(false)
    clearCircuit()
  }

  if (!isActive) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🎮 Web-Based Circuit Builder
        </h3>
        <p className="text-gray-600 mb-4">
          Bangun rangkaian listrik langsung di browser dengan interface sederhana!
        </p>
        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div>🖱️ <strong>Click buttons:</strong> Tambah komponen</div>
          <div>📊 <strong>Real-time:</strong> Lihat perhitungan otomatis</div>
          <div>🔧 <strong>Interactive:</strong> Bangun rangkaian dengan mudah</div>
        </div>
        <button
          onClick={startCV}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          🚀 Mulai Circuit Builder
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            🎮 Web Circuit Builder
          </h3>
          <button
            onClick={stopCV}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 p-4">
        {/* Circuit Building Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg p-4 min-h-96">
            <h4 className="font-semibold text-gray-800 mb-4">Circuit Workspace</h4>
            
            {/* Component Controls */}
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <button
                onClick={() => addComponent('battery')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <span>🔋</span>
                <span>Add Battery</span>
              </button>
              <button
                onClick={() => addComponent('resistor')}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                <span>🔌</span>
                <span>Add Resistor</span>
              </button>
              <button
                onClick={() => addComponent('wire')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <span>⚡</span>
                <span>Add Wire</span>
              </button>
              <button
                onClick={clearCircuit}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors ml-4"
              >
                <span>🗑️</span>
                <span>Clear</span>
              </button>
            </div>

            {/* Circuit Visualization */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-300 min-h-64">
              <h5 className="font-medium text-gray-700 mb-3">Circuit Components ({components.length})</h5>
              
              {components.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No components yet</p>
                  <p className="text-sm">Click the buttons above to add components</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {components.map(comp => (
                    <div key={comp.id} className="p-3 bg-gray-50 rounded-lg border text-center">
                      <div className="text-2xl mb-1">
                        {comp.type === 'battery' ? '🔋' : comp.type === 'resistor' ? '🔌' : '⚡'}
                      </div>
                      <div className="text-sm font-medium text-gray-700 capitalize">{comp.type}</div>
                      {comp.value && (
                        <div className="text-xs text-gray-600 mt-1">
                          {comp.value}{comp.type === 'battery' ? 'V' : 'Ω'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Circuit Information Panel */}
        <div className="space-y-4">
          {/* Calculations */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">📊 Perhitungan Real-time</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm text-gray-600">Tegangan:</span>
                <span className="font-medium text-blue-600">{calculations.voltage.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm text-gray-600">Arus:</span>
                <span className="font-medium text-green-600">{calculations.current.toFixed(3)} A</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <span className="text-sm text-gray-600">Resistansi:</span>
                <span className="font-medium text-orange-600">{calculations.resistance.toFixed(2)} Ω</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm text-gray-600">Daya:</span>
                <span className="font-medium text-purple-600">{calculations.power.toFixed(3)} W</span>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">📐 Rumus Fisika</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="p-2 bg-white rounded">
                <div className="font-semibold">Hukum Ohm:</div>
                <div className="font-mono">I = V / R</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="font-semibold">Resistansi Seri:</div>
                <div className="font-mono">R = R₁ + R₂ + R₃ + ...</div>
              </div>
              <div className="p-2 bg-white rounded">
                <div className="font-semibold">Daya Listrik:</div>
                <div className="font-mono">P = V × I</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Cara Penggunaan</h4>
            <div className="space-y-1 text-xs text-blue-700">
              <div>1. Klik tombol untuk tambah komponen</div>
              <div>2. Lihat perhitungan otomatis di panel kanan</div>
              <div>3. Eksperimen dengan kombinasi berbeda</div>
              <div>4. Gunakan &quot;Clear&quot; untuk reset rangkaian</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
