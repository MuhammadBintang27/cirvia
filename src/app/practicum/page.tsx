
'use client'

import Navbar from '@/components/Navbar'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SimpleGestureDemo from '../../components/SimpleGestureDemo'
import CVPracticumLauncher from '../../components/CVPracticumLauncher'
import EmbeddedCVPracticum from '../../components/EmbeddedCVPracticum'
import EmbeddedPythonCV from '../../components/EmbeddedPythonCV'

interface CircuitElement {
  id: string
  type: 'battery' | 'resistor' | 'wire'
  value: number
  position: { x: number; y: number }
  connections: string[]
}

interface GestureResult {
  gesture: string
  confidence: number
}

export default function PracticumPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'web' | 'cv'>('web')
  
  // Circuit elements state
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
  
  // UI state
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [showGestures, setShowGestures] = useState(false)

  // Gesture handling
  const onGestureDetected = (result: GestureResult) => {
    const { gesture, confidence } = result
    
    if (confidence > 0.7) {
      switch (gesture) {
        case 'point':
        case 'small_motion':
          if (!selectedElement && elements.length > 0) {
            setSelectedElement(elements[0].id)
          }
          break
          
        case 'open_palm':
        case 'large_motion':
          addResistor()
          break
          
        case 'fist':
          if (selectedElement && selectedElement !== 'battery1' && selectedElement !== 'resistor1') {
            removeElement(selectedElement)
            setSelectedElement(null)
          }
          break
          
        case 'wave':
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

  const handleGestureCommand = (command: string) => {
    switch(command) {
      case 'add_battery':
        const batteries = elements.filter(el => el.type === 'battery')
        if (batteries.length < 3) {
          const newBattery = {
            id: `battery_${Date.now()}`,
            type: 'battery' as const,
            value: 9,
            position: { x: 50 + batteries.length * 150, y: 150 },
            connections: []
          }
          setElements(prev => [...prev, newBattery])
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
          }
        ])
        setSelectedElement(null)
        break
        
      case 'calculate':
        calculateCircuit()
        break
    }
  }

  const addResistor = () => {
    const resistors = elements.filter(el => el.type === 'resistor')
    if (resistors.length < 5) {
      const newResistor = {
        id: `resistor_${Date.now()}`,
        type: 'resistor' as const,
        value: Math.floor(Math.random() * 500) + 50,
        position: { x: 200 + resistors.length * 100, y: 250 },
        connections: []
      }
      setElements(prev => [...prev, newResistor])
    }
  }

  const removeElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId))
  }

  const calculateCircuit = () => {
    const batteries = elements.filter(el => el.type === 'battery')
    const resistors = elements.filter(el => el.type === 'resistor')
    
    if (batteries.length === 0 || resistors.length === 0) {
      alert('Circuit membutuhkan minimal 1 baterai dan 1 resistor!')
      return
    }
    
    const totalVoltage = batteries.reduce((sum, battery) => sum + battery.value, 0)
    const totalResistance = resistors.reduce((sum, resistor) => sum + resistor.value, 0)
    const current = totalVoltage / totalResistance
    const power = totalVoltage * current
    
    alert(`
Hasil Perhitungan Rangkaian:
• Total Tegangan: ${totalVoltage}V
• Total Resistansi: ${totalResistance}Ω  
• Arus: ${current.toFixed(3)}A
• Daya: ${power.toFixed(3)}W
    `)
  }

  const updateElementValue = (elementId: string, newValue: number) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, value: newValue } : el
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100">
      {/* Navbar */}
      <Navbar />
      {/* Header - Always Visible & Standardized */}
      <div className="text-center mb-12 pt-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-6 shadow-lg">
          <span className="text-3xl">🔬</span>
        </div>
        <h1 className="text-5xl font-bold mb-4 drop-shadow-sm">
          <span className="text-primary-800">Praktikum</span>{' '}
          <span className="text-accent-500">Rangkaian Listrik</span>
        </h1>
        <p className="text-xl text-primary-700 max-w-2xl mx-auto leading-relaxed">
          Praktikum interaktif untuk memahami konsep dasar rangkaian listrik melalui simulasi dan gesture control
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 animate-slide-in">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex border border-primary-100">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'web'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-primary-50'
              }`}
            >
              🌐 Web Practicum
            </button>
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'cv'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-primary-700 hover:text-primary-800 hover:bg-primary-50'
              }`}
            >
              🤖 Computer Vision
            </button>
          </div>
        </div>

        {/* Web Practicum Content */}
        {activeTab === 'web' && (
          <div className="max-w-6xl mx-auto">
            {/* Circuit Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-primary-100 animate-scale-in">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                ⚡ Simulasi Rangkaian
              </h2>
              <div className="bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-8 min-h-96 relative overflow-hidden">
                {/* Circuit Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                      selectedElement === element.id
                        ? 'scale-110 z-10'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      left: `${Math.min(Math.max(element.position.x, 50), 90)}%`,
                      top: `${Math.min(Math.max(element.position.y, 50), 90)}%`
                    }}
                    onClick={() => setSelectedElement(selectedElement === element.id ? null : element.id)}
                  >
                    {element.type === 'battery' ? (
                      <div className={`w-16 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm border-2 ${
                        selectedElement === element.id
                          ? 'bg-yellow-500 border-yellow-600 shadow-lg'
                          : 'bg-red-500 border-red-600 shadow-md'
                      }`}>
                        {element.value}V
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xs border-2 transform rotate-45 ${
                        selectedElement === element.id
                          ? 'bg-yellow-500 border-yellow-600 shadow-lg'
                          : 'bg-green-500 border-green-600 shadow-md'
                      }`}>
                        <span className="transform -rotate-45">{element.value}Ω</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Connection lines (simplified) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {elements.length > 1 && elements.map((element, index) => {
                    if (index === 0) return null
                    const prevElement = elements[index - 1]
                    return (
                      <line
                        key={`line-${element.id}`}
                        x1={`${Math.min(Math.max(prevElement.position.x, 5), 95)}%`}
                        y1={`${Math.min(Math.max(prevElement.position.y, 5), 95)}%`}
                        x2={`${Math.min(Math.max(element.position.x, 5), 95)}%`}
                        y2={`${Math.min(Math.max(element.position.y, 5), 95)}%`}
                        stroke="#374151"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Control Panel */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Element Controls */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 animate-slide-in">
                <h3 className="text-xl font-bold text-primary-800 mb-4">
                  🔧 Kontrol Elemen
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleGestureCommand('add_battery')}
                      className="px-5 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      🔋 + Baterai
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('add_resistor')}
                      className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      ⚡ + Resistor
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('calculate')}
                      className="px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      📊 Hitung
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('clear_circuit')}
                      className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      🗑 Reset
                    </button>
                  </div>

                  {/* Selected Element Info */}
                  {selectedElement && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <h4 className="font-semibold text-primary-800 mb-2">
                        Elemen Terpilih: {selectedElement}
                      </h4>
                      {(() => {
                        const element = elements.find(el => el.id === selectedElement)
                        if (!element) return null
                        
                        return (
                          <div className="space-y-2">
                            <p className="text-sm text-primary-700">
                              Tipe: {element.type === 'battery' ? 'Baterai' : 'Resistor'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-primary-700">
                                {element.type === 'battery' ? 'Tegangan (V):' : 'Resistansi (Ω):'}
                              </label>
                              <input
                                type="number"
                                value={element.value}
                                onChange={(e) => updateElementValue(element.id, Number(e.target.value))}
                                className="w-20 px-3 py-2 border-2 border-primary-300 rounded-lg text-sm font-semibold text-primary-800 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                                min="1"
                                max={element.type === 'battery' ? "24" : "1000"}
                              />
                            </div>
                            {element.id !== 'battery1' && element.id !== 'resistor1' && (
                              <button
                                onClick={() => removeElement(element.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all transform hover:scale-105 shadow-md"
                              >
                                🗑 Hapus Elemen
                              </button>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Gesture Control */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-primary-100 animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-primary-800">
                    👋 Kontrol Gesture
                  </h3>
                  <button
                    onClick={() => setShowGestures(!showGestures)}
                    className={`px-5 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      showGestures
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                    }`}
                  >
                    {showGestures ? '⏹ Stop' : '▶ Start'}
                  </button>
                </div>

                {showGestures && (
                  <div className="space-y-4">
                    <SimpleGestureDemo 
                      onGestureCommand={handleGestureCommand}
                    />
                    
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-5 border-l-4 border-primary-500">
                      <h4 className="font-bold text-primary-800 mb-3 text-lg">📖 Panduan Gesture:</h4>
                      <div className="space-y-3 text-sm">
                        <p className="flex items-center text-primary-700"><span className="text-lg mr-2">✋</span> <strong className="text-primary-800 mr-2">Telapak Terbuka:</strong> Tambah Resistor</p>
                        <p className="flex items-center text-primary-700"><span className="text-lg mr-2">👍</span> <strong className="text-primary-800 mr-2">Jempol:</strong> Tambah Baterai</p>  
                        <p className="flex items-center text-primary-700"><span className="text-lg mr-2">✌</span> <strong className="text-primary-800 mr-2">Peace Sign:</strong> Hitung Rangkaian</p>
                        <p className="flex items-center text-primary-700"><span className="text-lg mr-2">✊</span> <strong className="text-primary-800 mr-2">Kepalan:</strong> Reset Rangkaian</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Computer Vision Practicum Content */}
        {activeTab === 'cv' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">
                Praktikum Computer Vision
              </h2>
              <p className="text-lg text-primary-600 max-w-3xl mx-auto">
                Aplikasi Python CV lengkap dengan gesture detection, embedded langsung di platform web tanpa jendela terpisah!
              </p>
            </div>

            {/* Main Python CV Application - Embedded */}
            <EmbeddedPythonCV />

            {/* Alternative Options */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Simple Web Version */}
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 animate-slide-in">
                <h3 className="text-lg font-bold text-primary-800 mb-4">
                  🌐 Alternative: Simple Web Version
                </h3>
                <p className="text-primary-600 mb-4">
                  Jika Python server tidak bisa berjalan, gunakan versi web sederhana:
                </p>
                <EmbeddedCVPracticum />
              </div>

              {/* Desktop Application */}
              <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 animate-slide-in">
                <h3 className="text-lg font-bold text-primary-800 mb-4">
                  💻 Alternative: Desktop Application
                </h3>
                <p className="text-primary-600 mb-4">
                  Atau gunakan aplikasi desktop Python yang berjalan secara terpisah:
                </p>
                <CVPracticumLauncher />
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-primary-100 animate-scale-in">
              <h3 className="text-xl font-bold text-primary-800 mb-4">
                📊 Perbandingan Fitur
              </h3>
              
              <div className="overflow-x-auto bg-primary-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-primary-200 bg-white">
                      <th className="text-left py-4 px-4 font-bold text-primary-800">Fitur</th>
                      <th className="text-center py-4 px-4 text-primary-600 font-bold">🤖 Python CV<br/><small className="font-normal text-primary-500">(Embedded)</small></th>
                      <th className="text-center py-4 px-4 text-green-600 font-bold">🌐 Web Version<br/><small className="font-normal text-green-500">(Simple)</small></th>
                      <th className="text-center py-4 px-4 text-purple-600 font-bold">💻 Desktop App<br/><small className="font-normal text-purple-500">(Separate)</small></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="border-b border-primary-100 bg-white hover:bg-primary-25">
                      <td className="text-left py-3 px-4 font-semibold text-primary-800">Hand Gesture Detection</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅ Advanced</td>
                      <td className="py-3 px-4 text-yellow-600 font-semibold">⚠ Basic</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅ Advanced</td>
                    </tr>
                    <tr className="border-b border-primary-100 bg-white hover:bg-primary-25">
                      <td className="text-left py-3 px-4 font-semibold text-primary-800">Real-time Calculations</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅</td>
                    </tr>
                    <tr className="border-b border-primary-100 bg-white hover:bg-primary-25">
                      <td className="text-left py-3 px-4 font-semibold text-primary-800">Embedded in Platform</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅</td>
                      <td className="py-3 px-4 text-red-600 font-semibold">❌</td>
                    </tr>
                    <tr className="border-b border-primary-100 bg-white hover:bg-primary-25">
                      <td className="text-left py-3 px-4 font-semibold text-primary-800">Installation Required</td>
                      <td className="py-3 px-4 text-yellow-600 font-semibold">⚠ Python Only</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅ None</td>
                      <td className="py-3 px-4 text-red-600 font-semibold">❌ Full Setup</td>
                    </tr>
                    <tr className="bg-white hover:bg-primary-25">
                      <td className="text-left py-3 px-4 font-semibold text-primary-800">Performance</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅ High</td>
                      <td className="py-3 px-4 text-yellow-600 font-semibold">⚠ Medium</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">✅ Highest</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}