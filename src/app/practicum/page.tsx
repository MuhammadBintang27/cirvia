'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import SimpleGestureDemo from '../../components/SimpleGestureDemo'



interface CircuitElement {
  id: string
  type: 'battery' | 'resistor' | 'wire'
  value: number
  position: { x: number, y: number }
  connections: string[]
}

interface CircuitCalculations {
  totalResistance: number
  current: number
  voltage: number
  power: number
}

export default function PracticumPage() {
  const [elements, setElements] = useState<CircuitElement[]>([
    {
      id: 'battery1',
      type: 'battery',
      value: 12, // 12V
      position: { x: 100, y: 200 },
      connections: ['wire1', 'wire4']
    },
    {
      id: 'resistor1',
      type: 'resistor',
      value: 100, // 100Ω
      position: { x: 300, y: 200 },
      connections: ['wire2', 'wire3']
    }
  ])

  const [calculations, setCalculations] = useState<CircuitCalculations>({
    totalResistance: 100,
    current: 0.12,
    voltage: 12,
    power: 1.44
  })

  const [handGestureMode, setHandGestureMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [gestureCommand, setGestureCommand] = useState<string>('')

  // Handle gesture detection
  const handleGestureDetected = (gesture: string, confidence: number) => {
    setGestureCommand(gesture)
    
    if (confidence > 0.7) {
      switch (gesture) {
        case 'point':
        case 'small_motion':
          // Select first element if none selected
          if (!selectedElement && elements.length > 0) {
            setSelectedElement(elements[0].id)
          }
          break
          
        case 'open_palm':
        case 'large_motion':
          // Add resistor
          addResistor()
          break
          
        case 'fist':
          // Delete selected element
          if (selectedElement && selectedElement !== 'battery1' && selectedElement !== 'resistor1') {
            removeElement(selectedElement)
            setSelectedElement(null)
          }
          break
          
        case 'wave':
          // Reset circuit to default
          setElements([
            {
              id: 'battery1',
              type: 'battery',
              value: 12,
              position: { x: 100, y: 200 },
              connections: ['wire1', 'wire4']
            },
            {
              id: 'resistor1',
              type: 'resistor',
              value: 100,
              position: { x: 300, y: 200 },
              connections: ['wire2', 'wire3']
            }
          ])
          setSelectedElement(null)
          break
      }
    }
  }

  // Handle gesture commands from SimpleGestureDemo
  const handleGestureCommand = (command: string) => {
    switch(command) {
      case 'add_battery':
        // Add a new battery if not at limit
        const batteries = elements.filter(el => el.type === 'battery')
        if (batteries.length < 3) {
          const newBattery = {
            id: `battery_${Date.now()}`,
            type: 'battery' as const,
            value: 9,
            position: { x: 50 + batteries.length * 150, y: 150 },
            connections: []
          }
          setElements([...elements, newBattery])
        }
        break
      case 'add_resistor':
        addResistor()
        break
      case 'clear_circuit':
        setElements([
          {
            id: 'battery1',
            type: 'battery',
            value: 12,
            position: { x: 100, y: 200 },
            connections: ['wire1', 'wire4']
          },
          {
            id: 'resistor1',
            type: 'resistor',
            value: 100,
            position: { x: 300, y: 200 },
            connections: ['wire2', 'wire3']
          }
        ])
        setSelectedElement(null)
        break
      case 'show_stats':
        alert(`Circuit Statistics:\nVoltage: ${calculations.voltage}V\nCurrent: ${calculations.current}A\nResistance: ${calculations.totalResistance}Ω\nPower: ${calculations.power}W`)
        break
    }
  }

  const calculateCircuit = useCallback(() => {
    // Hitung resistansi total untuk rangkaian seri
    const resistors = elements.filter(el => el.type === 'resistor')
    const totalResistance = resistors.reduce((sum, resistor) => sum + resistor.value, 0)
    
    // Ambil tegangan dari baterai
    const battery = elements.find(el => el.type === 'battery')
    const voltage = battery ? battery.value : 0
    
    // Hitung arus menggunakan hukum Ohm (I = V/R)
    const current = voltage > 0 && totalResistance > 0 ? voltage / totalResistance : 0
    
    // Hitung daya (P = V*I)
    const power = voltage * current

    setCalculations({
      totalResistance,
      current,
      voltage,
      power
    })
  }, [elements])

  useEffect(() => {
    calculateCircuit()
  }, [calculateCircuit])

  const addResistor = () => {
    const newResistor: CircuitElement = {
      id: `resistor${Date.now()}`,
      type: 'resistor',
      value: 50,
      position: { x: 400 + elements.length * 50, y: 200 },
      connections: []
    }
    setElements([...elements, newResistor])
  }

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
  }

  const updateElementValue = (id: string, newValue: number) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, value: newValue } : el
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar showBackButton backUrl="/materials" backText="Kembali ke Materi" />

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Praktikum Rangkaian Listrik</h1>
          <button
            onClick={() => setHandGestureMode(!handGestureMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              handGestureMode 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👋 {handGestureMode ? 'Mode Gerakan Aktif' : 'Aktifkan Mode Gerakan'}
          </button>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Computer Vision Panel */}
          {handGestureMode && (
            <div className="lg:col-span-3 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Computer Vision Control</h2>
                  <div className="text-sm text-gray-600">
                    Current Command: <span className="font-semibold text-blue-600">{gestureCommand}</span>
                  </div>
                </div>
                <SimpleGestureDemo onGestureCommand={handleGestureCommand} />
              </div>
            </div>
          )}

          {/* Circuit Canvas */}
          <div className={handGestureMode ? "lg:col-span-2" : "lg:col-span-2"}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Rangkaian Listrik Seri</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={addResistor}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    + Tambah Resistor
                  </button>
                </div>
              </div>

              {/* Circuit Visualization */}
              <div className="bg-gray-50 rounded-lg p-8 min-h-96 relative border-2 border-dashed border-gray-300">
                <svg width="100%" height="400" className="absolute inset-0">
                  {/* Wire connections */}
                  <line x1="150" y1="200" x2="250" y2="200" stroke="#4B5563" strokeWidth="3" />
                  <line x1="350" y1="200" x2="450" y2="200" stroke="#4B5563" strokeWidth="3" />
                  <line x1="450" y1="200" x2="450" y2="300" stroke="#4B5563" strokeWidth="3" />
                  <line x1="450" y1="300" x2="150" y2="300" stroke="#4B5563" strokeWidth="3" />
                  <line x1="150" y1="300" x2="150" y2="200" stroke="#4B5563" strokeWidth="3" />
                </svg>

                {/* Circuit Elements */}
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                      selectedElement === element.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                    }`}
                    style={{
                      left: element.position.x,
                      top: element.position.y
                    }}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    {element.type === 'battery' && (
                      <div className="bg-yellow-400 w-16 h-8 rounded flex items-center justify-center border-2 border-yellow-600">
                        <span className="text-xs font-bold">🔋 {element.value}V</span>
                      </div>
                    )}
                    {element.type === 'resistor' && (
                      <div className="bg-orange-400 w-20 h-6 rounded flex items-center justify-center border-2 border-orange-600 relative">
                        <span className="text-xs font-bold text-white">{element.value}Ω</span>
                        {element.id !== 'resistor1' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeElement(element.id)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Current Flow Animation */}
                <div className="absolute">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" 
                       style={{ left: '200px', top: '195px' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" 
                       style={{ left: '300px', top: '195px', animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" 
                       style={{ left: '400px', top: '195px', animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* Element Controls */}
              {selectedElement && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3">
                    Edit {elements.find(el => el.id === selectedElement)?.type === 'battery' ? 'Baterai' : 'Resistor'}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-blue-700">
                      Nilai: 
                    </label>
                    <input
                      type="number"
                      value={elements.find(el => el.id === selectedElement)?.value || 0}
                      onChange={(e) => updateElementValue(selectedElement, Number(e.target.value))}
                      className="border border-blue-300 rounded px-3 py-1 w-20 text-center"
                    />
                    <span className="text-sm text-blue-600">
                      {elements.find(el => el.id === selectedElement)?.type === 'battery' ? 'V' : 'Ω'}
                    </span>
                    <button
                      onClick={() => setSelectedElement(null)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculations Panel */}
          <div className="space-y-6">
            {/* Real-time Calculations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Perhitungan Real-time</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-700">Tegangan (V)</span>
                    <span className="text-xl font-bold text-blue-800">{calculations.voltage.toFixed(2)} V</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-700">Arus (I)</span>
                    <span className="text-xl font-bold text-green-800">{calculations.current.toFixed(3)} A</span>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-orange-700">Resistansi Total (R)</span>
                    <span className="text-xl font-bold text-orange-800">{calculations.totalResistance.toFixed(2)} Ω</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-700">Daya (P)</span>
                    <span className="text-xl font-bold text-purple-800">{calculations.power.toFixed(3)} W</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rumus yang Digunakan</h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-700">Hukum Ohm:</div>
                  <div className="text-gray-600 font-mono">I = V / R</div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-700">Resistansi Seri:</div>
                  <div className="text-gray-600 font-mono">R_total = R₁ + R₂ + R₃ + ...</div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-700">Daya Listrik:</div>
                  <div className="text-gray-600 font-mono">P = V × I</div>
                </div>
              </div>
            </div>

            {/* Hand Gesture Info */}
            {handGestureMode && (
              <div className="bg-green-50 rounded-xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-3">🤖 AI Control Active</h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center justify-between">
                    <span>Current Gesture:</span>
                    <span className="font-semibold">{gestureCommand || 'none'}</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 mt-2">
                    <div className="font-medium mb-1">Available Commands:</div>
                    <div>👆 Point/Small Motion → Select element</div>
                    <div>✋ Open Palm/Large Motion → Add resistor</div>
                    <div>✊ Fist → Delete element</div>
                    <div>👋 Wave/Fast Motion → Reset circuit</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
