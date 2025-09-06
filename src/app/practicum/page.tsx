
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <Navbar />
      {/* Header - Always Visible & Standardized */}
      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
          <span className="text-3xl">🔬</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Praktikum Rangkaian Listrik</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Praktikum interaktif untuk memahami konsep dasar rangkaian listrik melalui simulasi dan gesture control
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'web'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              🌐 Web Practicum
            </button>
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'cv'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
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
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ⚡ Simulasi Rangkaian
              </h2>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-96 relative overflow-hidden">
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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  🔧 Kontrol Elemen
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleGestureCommand('add_battery')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      + Baterai
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('add_resistor')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      + Resistor
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('calculate')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      📊 Hitung
                    </button>
                    <button 
                      onClick={() => handleGestureCommand('clear_circuit')}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      🗑 Reset
                    </button>
                  </div>

                  {/* Selected Element Info */}
                  {selectedElement && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Elemen Terpilih: {selectedElement}
                      </h4>
                      {(() => {
                        const element = elements.find(el => el.id === selectedElement)
                        if (!element) return null
                        
                        return (
                          <div className="space-y-2">
                            <p className="text-sm text-blue-800">
                              Tipe: {element.type === 'battery' ? 'Baterai' : 'Resistor'}
                            </p>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-blue-800">
                                {element.type === 'battery' ? 'Tegangan (V):' : 'Resistansi (Ω):'}
                              </label>
                              <input
                                type="number"
                                value={element.value}
                                onChange={(e) => updateElementValue(element.id, Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-blue-300 rounded text-sm"
                                min="1"
                                max={element.type === 'battery' ? "24" : "1000"}
                              />
                            </div>
                            {element.id !== 'battery1' && element.id !== 'resistor1' && (
                              <button
                                onClick={() => removeElement(element.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                              >
                                Hapus Elemen
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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    👋 Kontrol Gesture
                  </h3>
                  <button
                    onClick={() => setShowGestures(!showGestures)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      showGestures
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
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
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Panduan Gesture:</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>✋ <strong>Telapak Terbuka:</strong> Tambah Resistor</p>
                        <p>👍 <strong>Jempol:</strong> Tambah Baterai</p>  
                        <p>✌ <strong>Peace Sign:</strong> Hitung Rangkaian</p>
                        <p>✊ <strong>Kepalan:</strong> Reset Rangkaian</p>
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
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Praktikum Computer Vision
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Aplikasi Python CV lengkap dengan gesture detection, embedded langsung di platform web tanpa jendela terpisah!
              </p>
            </div>

            {/* Main Python CV Application - Embedded */}
            <EmbeddedPythonCV />

            {/* Alternative Options */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Simple Web Version */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🌐 Alternative: Simple Web Version
                </h3>
                <p className="text-gray-600 mb-4">
                  Jika Python server tidak bisa berjalan, gunakan versi web sederhana:
                </p>
                <EmbeddedCVPracticum />
              </div>

              {/* Desktop Application */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  💻 Alternative: Desktop Application
                </h3>
                <p className="text-gray-600 mb-4">
                  Atau gunakan aplikasi desktop Python yang berjalan secara terpisah:
                </p>
                <CVPracticumLauncher />
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📊 Perbandingan Fitur
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Fitur</th>
                      <th className="text-center py-2 px-3 text-blue-600">🤖 Python CV<br/><small>(Embedded)</small></th>
                      <th className="text-center py-2 px-3 text-green-600">🌐 Web Version<br/><small>(Simple)</small></th>
                      <th className="text-center py-2 px-3 text-purple-600">💻 Desktop App<br/><small>(Separate)</small></th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="border-b">
                      <td className="text-left py-2 px-3">Hand Gesture Detection</td>
                      <td className="py-2 px-3 text-green-500">✅ Advanced</td>
                      <td className="py-2 px-3 text-yellow-500">⚠ Basic</td>
                      <td className="py-2 px-3 text-green-500">✅ Advanced</td>
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-3">Real-time Calculations</td>
                      <td className="py-2 px-3 text-green-500">✅</td>
                      <td className="py-2 px-3 text-green-500">✅</td>
                      <td className="py-2 px-3 text-green-500">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-3">Embedded in Platform</td>
                      <td className="py-2 px-3 text-green-500">✅</td>
                      <td className="py-2 px-3 text-green-500">✅</td>
                      <td className="py-2 px-3 text-red-500">❌</td>
                    </tr>
                    <tr className="border-b">
                      <td className="text-left py-2 px-3">Installation Required</td>
                      <td className="py-2 px-3 text-yellow-500">⚠ Python Only</td>
                      <td className="py-2 px-3 text-green-500">✅ None</td>
                      <td className="py-2 px-3 text-red-500">❌ Full Setup</td>
                    </tr>
                    <tr>
                      <td className="text-left py-2 px-3">Performance</td>
                      <td className="py-2 px-3 text-green-500">✅ High</td>
                      <td className="py-2 px-3 text-yellow-500">⚠ Medium</td>
                      <td className="py-2 px-3 text-green-500">✅ Highest</td>
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