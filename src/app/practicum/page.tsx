"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CVPracticumLauncher from "../../components/CVPracticumLauncher";
import CircuitBuilderEnhanced from "../../components/praktikum-drag-n-drop/CircuitBuilderEnhanced";
import Navbar from "@/components/Navbar";

interface CircuitElement {
  id: string;
  type: "battery" | "resistor" | "wire";
  value: number;
  position: { x: number; y: number };
  connections: string[];
}

interface GestureResult {
  gesture: string;
  confidence: number;
}

export default function PracticumPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"web" | "cv">("web");

  // Circuit elements state
  const [elements, setElements] = useState<CircuitElement[]>([
    {
      id: "battery1",
      type: "battery",
      value: 12, // 12V
      position: { x: 100, y: 200 },
      connections: ["wire1", "wire4"],
    },
    {
      id: "resistor1",
      type: "resistor",
      value: 100, // 100Ω
      position: { x: 300, y: 200 },
      connections: ["wire2", "wire3"],
    },
  ]);

  // UI state
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showGestures, setShowGestures] = useState(false);

  // Gesture handling
  const onGestureDetected = (result: GestureResult) => {
    const { gesture, confidence } = result;

    if (confidence > 0.7) {
      switch (gesture) {
        case "point":
        case "small_motion":
          if (!selectedElement && elements.length > 0) {
            setSelectedElement(elements[0].id);
          }
          break;

        case "open_palm":
        case "large_motion":
          addResistor();
          break;

        case "fist":
          if (
            selectedElement &&
            selectedElement !== "battery1" &&
            selectedElement !== "resistor1"
          ) {
            removeElement(selectedElement);
            setSelectedElement(null);
          }
          break;

        case "wave":
          setElements([
            {
              id: "battery1",
              type: "battery",
              value: 12,
              position: { x: 100, y: 200 },
              connections: ["wire1", "wire4"],
            },
            {
              id: "resistor1",
              type: "resistor",
              value: 100,
              position: { x: 300, y: 200 },
              connections: ["wire2", "wire3"],
            },
          ]);
          setSelectedElement(null);
          break;
      }
    }
  };

  const handleGestureCommand = (command: string) => {
    switch (command) {
      case "add_battery":
        const batteries = elements.filter((el) => el.type === "battery");
        if (batteries.length < 3) {
          const newBattery = {
            id: `battery_${Date.now()}`,
            type: "battery" as const,
            value: 9,
            position: { x: 50 + batteries.length * 150, y: 150 },
            connections: [],
          };
          setElements((prev) => [...prev, newBattery]);
        }
        break;

      case "add_resistor":
        addResistor();
        break;

      case "clear_circuit":
        setElements([
          {
            id: "battery1",
            type: "battery",
            value: 12,
            position: { x: 100, y: 200 },
            connections: ["wire1", "wire4"],
          },
        ]);
        setSelectedElement(null);
        break;

      case "calculate":
        calculateCircuit();
        break;
    }
  };

  const addResistor = () => {
    const resistors = elements.filter((el) => el.type === "resistor");
    if (resistors.length < 5) {
      const newResistor = {
        id: `resistor_${Date.now()}`,
        type: "resistor" as const,
        value: Math.floor(Math.random() * 500) + 50,
        position: { x: 200 + resistors.length * 100, y: 250 },
        connections: [],
      };
      setElements((prev) => [...prev, newResistor]);
    }
  };

  const removeElement = (elementId: string) => {
    setElements((prev) => prev.filter((el) => el.id !== elementId));
  };

  const calculateCircuit = () => {
    const batteries = elements.filter((el) => el.type === "battery");
    const resistors = elements.filter((el) => el.type === "resistor");

    if (batteries.length === 0 || resistors.length === 0) {
      alert("Circuit membutuhkan minimal 1 baterai dan 1 resistor!");
      return;
    }

    const totalVoltage = batteries.reduce(
      (sum, battery) => sum + battery.value,
      0
    );
    const totalResistance = resistors.reduce(
      (sum, resistor) => sum + resistor.value,
      0
    );
    const current = totalVoltage / totalResistance;
    const power = totalVoltage * current;

    alert(`
Hasil Perhitungan Rangkaian:
• Total Tegangan: ${totalVoltage}V
• Total Resistansi: ${totalResistance}Ω  
• Arus: ${current.toFixed(3)}A
• Daya: ${power.toFixed(3)}W
    `);
  };

  const updateElementValue = (elementId: string, newValue: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, value: newValue } : el))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <Navbar />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full border border-orange-400/30 backdrop-blur-sm mb-8">
              <span className="text-2xl mr-2">🔬</span>
              <span className="text-orange-400 text-sm font-medium">
                Interactive Laboratory
              </span>
              <span className="text-2xl ml-2">⚡</span>
            </div>

            {/* Main Icon */}
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/10 to-red-600/10 animate-pulse"></div>
                <span className="text-6xl relative z-10">🔬</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-red-300 bg-clip-text text-transparent drop-shadow-2xl">
                Praktikum
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Rangkaian Listrik
              </span>
            </h1>

            <p className="text-xl text-blue-200/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Laboratorium virtual interaktif dengan teknologi computer vision
              dan simulasi real-time untuk eksplorasi mendalam konsep rangkaian
              listrik
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Virtual</div>
                <div className="text-orange-300 text-sm">Lab Environment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">AI-Powered</div>
                <div className="text-orange-300 text-sm">Gesture Control</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Real-time</div>
                <div className="text-orange-300 text-sm">Calculations</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 inline-flex">
              <button
                onClick={() => setActiveTab("web")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "web"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🌐 Web Practicum
              </button>
              <button
                onClick={() => setActiveTab("cv")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "cv"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🤖 Computer Vision
              </button>
            </div>
          </div>

          {/* Web Practicum Content */}
          {activeTab === "web" && (
            <div className="max-w-6xl mx-auto">
              {/* Feature Introduction */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl mr-4">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Interactive Web Laboratory
                      </h3>
                      <p className="text-blue-200/80">
                        Simulasi rangkaian listrik dengan interface drag & drop
                      </p>
                    </div>
                  </div>

                  {/* Circuit Builder */}
                  <CircuitBuilderEnhanced />

                  {/* Enhanced Tips */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-400/30">
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      <span className="text-xl mr-2">💡</span>
                      Panduan Penggunaan
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-blue-200/90 text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>
                            Gunakan toolbar untuk menambah komponen baru ke
                            canvas
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>
                            Aktifkan &quot;Mode Koneksi&quot; untuk menarik
                            kabel antar terminal
                          </span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>
                            Double-click saklar untuk membuka/menutup rangkaian
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>
                            Pilih komponen lalu gunakan rotasi untuk mengatur
                            posisi
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Computer Vision Practicum Content */}
          {activeTab === "cv" && (
            <div className="max-w-6xl mx-auto">
              {/* AI-Powered Laboratory Section */}
              <div className="mb-12">
                <div className="bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-blue-800/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-400/20 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl mr-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        AI-Powered Computer Vision Lab
                      </h3>
                      <p className="text-blue-200/80">
                        Kontrol rangkaian menggunakan gesture tangan dengan
                        teknologi AI
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30">
                      <div className="text-2xl mb-2">👆</div>
                      <h4 className="text-white font-bold mb-2">
                        Gesture Detection
                      </h4>
                      <p className="text-blue-200/80 text-sm">
                        Deteksi real-time gerakan tangan untuk kontrol intuitif
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-xl p-4 border border-purple-400/30">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="text-white font-bold mb-2">
                        Real-time Calculation
                      </h4>
                      <p className="text-blue-200/80 text-sm">
                        Perhitungan otomatis nilai rangkaian secara instant
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-700/20 to-purple-700/10 rounded-xl p-4 border border-blue-400/30">
                      <div className="text-2xl mb-2">🔬</div>
                      <h4 className="text-white font-bold mb-2">
                        Interactive Components
                      </h4>
                      <p className="text-blue-200/80 text-sm">
                        Komponen virtual yang responsif terhadap gesture
                      </p>
                    </div>
                  </div>

                  {/* Gesture Guide */}
                  <div className="bg-gradient-to-r from-blue-700/20 to-purple-700/10 rounded-xl p-6 border border-blue-400/30 mb-6">
                    <h4 className="text-white font-bold mb-4 flex items-center">
                      <span className="text-xl mr-2">🖐️</span>
                      Panduan Gesture Control
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">👆</span>
                          <div>
                            <div className="text-blue-300 font-medium">
                              Point Gesture
                            </div>
                            <div className="text-blue-200/70">
                              Pilih dan seleksi komponen
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">✋</span>
                          <div>
                            <div className="text-blue-300 font-medium">
                              Open Palm
                            </div>
                            <div className="text-blue-200/70">
                              Tambah resistor baru
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">✊</span>
                          <div>
                            <div className="text-blue-300 font-medium">
                              Fist Gesture
                            </div>
                            <div className="text-blue-200/70">
                              Hapus komponen terpilih
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">👋</span>
                          <div>
                            <div className="text-blue-300 font-medium">
                              Wave Gesture
                            </div>
                            <div className="text-blue-200/70">
                              Reset rangkaian ke default
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Application Section */}
              <div className="grid md:grid-cols-1 gap-8">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 to-purple-600/40 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative bg-gradient-to-br from-blue-900/30 to-purple-900/20 backdrop-blur-xl rounded-3xl p-10 border border-blue-400/20 hover:border-blue-400/30 transition-all duration-500">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">💻</span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4 text-center">
                      Desktop Computer Vision App
                    </h3>
                    <p className="text-blue-200/80 mb-8 text-lg text-center leading-relaxed">
                      Aplikasi desktop Python dengan teknologi computer vision
                      canggih untuk pengalaman praktikum yang immersive
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-center text-blue-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>Hand Gesture Recognition dengan MediaPipe</span>
                      </div>
                      <div className="flex items-center justify-center text-blue-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>Real-time Circuit Simulation & Calculation</span>
                      </div>
                      <div className="flex items-center justify-center text-blue-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>Interactive Visual Interface with OpenCV</span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <CVPracticumLauncher />
                    </div>
                  </div>
                </div>
              </div>

              {/* System Requirements */}
              <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/10">
                <h4 className="text-white font-bold mb-4 flex items-center">
                  <span className="text-xl mr-2">⚙️</span>
                  System Requirements
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-200/80">
                  <div>
                    <div className="text-blue-300 font-medium mb-2">Camera</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Webcam atau kamera built-in</li>
                      <li>• Resolusi minimal 640x480</li>
                      <li>• Pencahayaan yang cukup</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-blue-300 font-medium mb-2">
                      Software
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>• Python 3.8+</li>
                      <li>• OpenCV, MediaPipe</li>
                      <li>• NumPy, Matplotlib</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-blue-300 font-medium mb-2">
                      Hardware
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>• CPU: Intel i3+ atau setara</li>
                      <li>• RAM: 4GB minimum</li>
                      <li>• GPU: Opsional untuk performa</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
