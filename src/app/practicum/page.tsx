"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CVPracticumLauncher from "../../components/CVPracticumLauncher";
import CircuitBuilder from "../../components/CircuitBuilder";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">CIRVIA</h1>
              </Link>
            </div>

            <nav className="flex space-x-8">
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Tentang
              </Link>
              <Link
                href="/materials"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Materi
              </Link>
              <Link
                href="/pretest"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Pre-test
              </Link>
              <Link href="/practicum" className="text-blue-600 font-semibold">
                Praktikum
              </Link>
              <Link
                href="/posttest"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Post-test
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔬 Praktikum Rangkaian Listrik
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Praktikum interaktif untuk memahami konsep dasar rangkaian listrik
            melalui simulasi dan gesture control
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex">
            <button
              onClick={() => setActiveTab("web")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "web"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              🌐 Web Practicum
            </button>
            <button
              onClick={() => setActiveTab("cv")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === "cv"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              🤖 Computer Vision
            </button>
          </div>
        </div>

        {/* Web Practicum Content */}
        {activeTab === "web" && (
          <div className="max-w-6xl mx-auto">
            {/* Circuit Builder */}
            <CircuitBuilder />

            {/* Tips */}
            <p className="mt-4 text-sm text-gray-600">
              Gunakan toolbar di atas kanvas: tambah komponen, masuk Mode
              Koneksi untuk menarik kabel antar terminal, double-click saklar
              untuk membuka/menutup, dan rotasi komponen sesuai kebutuhan.
            </p>
          </div>
        )}

        {/* Computer Vision Practicum Content */}
        {activeTab === "cv" && (
          <div className="max-w-6xl mx-auto">
            

            {/* Alternative Options */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
             
             

              {/* Desktop Application */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  💻 Alternative: Desktop Application
                </h3>
                <p className="text-gray-600 mb-4">
                  Atau gunakan aplikasi desktop Python yang berjalan secara
                  terpisah:
                </p>
                <CVPracticumLauncher />
              </div>
            </div>

           
          </div>
        )}
      </div>
    </div>
  );
}
