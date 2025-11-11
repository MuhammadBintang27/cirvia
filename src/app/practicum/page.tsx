"use client";

import { useState } from "react";
import CircuitBuilderEnhanced from "../../components/praktikum-drag-n-drop/CircuitBuilderEnhanced";
import WebCVPracticum from "../../components/praktikum-cv/WebCVPracticum";
import Navbar from "@/components/Navbar";
import { CircuitAction, GestureResult } from "@/components/praktikum-cv/types";

export default function PracticumPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"drag-drop" | "cv">("drag-drop");

  /**
   * Handle circuit actions from CV gestures
   */
  const handleCircuitAction = (action: CircuitAction) => {
    console.log("🎮 Circuit Action from Gesture:", action);

    // TODO: Implement actual circuit manipulation
    // This will be connected to CircuitBuilderEnhanced's state management
    // For now, just log the action

    // Example integration:
    // - action.type === 'add' → Call addComponent(action.componentType, action.position)
    // - action.type === 'move' → Call moveComponent(action.componentId, action.position)
    // - action.type === 'delete' → Call deleteComponent(action.componentId)
    // - action.type === 'rotate' → Call rotateComponent(action.componentId)
    // - action.type === 'toggle' → Call toggleSwitch(action.componentId)
  };

  /**
   * Handle gesture detection events
   */
  const handleGestureDetected = (gesture: GestureResult) => {
    // Optional: Add gesture feedback or analytics
    if (gesture.confidence > 0.85) {
      console.log(`👋 High confidence gesture detected: ${gesture.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements - Matching Landing Page */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
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
            {/* Main Icon */}
            <div className="relative mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400/5 to-blue-500/5 animate-pulse delay-500"></div>
                <span className="text-6xl relative z-10">🔬</span>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                Praktikum
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Rangkaian Listrik
              </span>
            </h1>

            <p className="text-xl text-blue-200/90 max-w-4xl mx-auto leading-relaxed mb-8">
              Laboratorium virtual interaktif dengan teknologi computer vision
              dan simulasi real-time untuk eksplorasi mendalam konsep rangkaian
              listrik
            </p>

        
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 inline-flex">
              <button
                onClick={() => setActiveTab("drag-drop")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "drag-drop"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🖱️ Drag & Drop Mode
              </button>
              <button
                onClick={() => setActiveTab("cv")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "cv"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10"
                }`}
              >
                👋 Computer Vision Mode
              </button>
            </div>
          </div>

          {/* Drag & Drop Practicum Content */}
          {activeTab === "drag-drop" && (
            <div className="max-w-6xl mx-auto">
              {/* Feature Introduction */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl mr-4">
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
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30">
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
              <div className="mb-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-2xl mr-4">
                      <span className="text-2xl">👋</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Computer Vision Hand Gesture Control
                      </h3>
                      <p className="text-blue-200/80">
                        Kontrol rangkaian listrik menggunakan gesture tangan
                        dengan teknologi MediaPipe AI
                      </p>
                    </div>
                  </div>

                  {/* Web CV Practicum Component */}
                  <WebCVPracticum
                    onCircuitAction={handleCircuitAction}
                    onGestureDetected={handleGestureDetected}
                  />

                  {/* Enhanced Tips */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-400/30">
                    <h4 className="text-white font-bold mb-3 flex items-center">
                      <span className="text-xl mr-2">�</span>
                      Tips Penggunaan
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-blue-200/90 text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Pastikan pencahayaan ruangan cukup untuk deteksi
                            tangan optimal
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Posisikan tangan di depan kamera dengan jarak 30-60
                            cm
                          </span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Gunakan gesture yang jelas dan stabil untuk akurasi
                            tinggi
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span>
                            Lihat panduan gesture di sebelah kanan canvas untuk
                            referensi
                          </span>
                        </li>
                      </ul>
                    </div>
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
