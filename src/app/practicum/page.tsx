"use client";
import { Ico } from "@/components/ui/Ico";

import { useEffect, useState } from "react";
import CircuitBuilderEnhanced from "../../components/praktikum-drag-n-drop/CircuitBuilderEnhanced";
import WebCVPracticum from "../../components/praktikum-cv/WebCVPracticum";
import Navbar from "@/components/Navbar";
import ELKPD from "@/components/ELKPD";
import { CircuitAction, GestureResult } from "@/components/praktikum-cv/types";

export default function PracticumPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"drag-drop" | "cv">("drag-drop");

  // /practicum?mode=cv membuka tab Computer Vision langsung
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "cv") setActiveTab("cv");
  }, []);

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
    <div className="min-h-screen bg-transparent relative">
      {/* Animated Background Elements - Matching Landing Page */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-soft rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-soft rounded-full hidden animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse delay-2000"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-soft rounded-full hidden"
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
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-brand-soft border-2 border-ink shadow-hard">
                <div className="absolute inset-0 rounded-full bg-brand-soft hidden"></div>
                <div className="absolute inset-2 rounded-full bg-brand-soft hidden delay-500"></div>
                <span className="text-6xl relative z-10"><Ico n="microscope" /></span>
              </div>
              <div className="absolute -inset-4 bg-brand-soft rounded-full hidden animate-pulse"></div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-ink">
                Praktikum
              </span>
              <br />
              <span className="text-ink">
                Rangkaian Listrik
              </span>
            </h1>

            <p className="text-xl text-muted max-w-4xl mx-auto leading-relaxed mb-8">
              Laboratorium virtual interaktif dengan teknologi computer vision
              dan simulasi real-time untuk eksplorasi mendalam konsep rangkaian
              listrik
            </p>

        
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-paper rounded-2xl shadow-hard border-2 border-ink p-2 inline-flex">
              <button
                onClick={() => setActiveTab("drag-drop")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  activeTab === "drag-drop"
                    ? "bg-brand text-white"
                    : "text-muted hover:text-ink hover:bg-lamp-soft"
                }`}
              >
                Drag & Drop Mode
              </button>
              <button
                onClick={() => setActiveTab("cv")}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  activeTab === "cv"
                    ? "bg-brand text-white"
                    : "text-muted hover:text-ink hover:bg-lamp-soft"
                }`}
              >
                Computer Vision Mode
              </button>
            </div>
          </div>

          {/* Drag & Drop Practicum Content */}
          {activeTab === "drag-drop" && (
            <div className="max-w-6xl mx-auto">
              {/* Feature Introduction */}
              <div className="mb-8">
                <div className="bg-paper rounded-2xl p-8 border-2 border-ink shadow-hard">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-brand-soft rounded-2xl mr-4">
                      <span className="text-2xl"><Ico n="globe" /></span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink">
                        Interactive Web Laboratory
                      </h3>
                      <p className="text-muted">
                        Simulasi rangkaian listrik dengan interface drag & drop
                      </p>
                    </div>
                  </div>

                  {/* Circuit Builder */}
                  {/* bangku kerja tetap gelap: komponennya digambar untuk latar gelap */}
                  <div className="rounded-2xl border-2 border-ink bg-[#14172B] p-3 sm:p-4">
                    <CircuitBuilderEnhanced />
                  </div>

                  {/* Enhanced Tips */}
                  <div className="mt-6 p-6 bg-brand-soft rounded-xl border-2 border-ink">
                    <h4 className="text-ink font-bold mb-3 flex items-center">
                      <span className="text-xl mr-2"><Ico n="lightbulb" /></span>
                      Panduan Penggunaan
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-muted text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-brand mr-2">•</span>
                          <span>
                            Gunakan toolbar untuk menambah komponen baru ke
                            canvas
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand mr-2">•</span>
                          <span>
                            Aktifkan &quot;Mode Koneksi&quot; untuk menarik
                            kabel antar terminal
                          </span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-brand mr-2">•</span>
                          <span>
                            Double-click saklar untuk membuka/menutup rangkaian
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-brand mr-2">•</span>
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
                <div className="bg-paper rounded-2xl p-8 border-2 border-ink shadow-hard">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mr-4">
                      <span className="text-2xl"><Ico n="hand" /></span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink">
                        Computer Vision Hand Gesture Control
                      </h3>
                      <p className="text-muted">
                        Kontrol rangkaian listrik menggunakan gesture tangan
                        dengan teknologi MediaPipe AI
                      </p>
                    </div>
                  </div>

                  {/* Web CV Practicum Component */}
                  <div className="rounded-2xl border-2 border-ink bg-[#14172B] p-3 sm:p-4">
                    <WebCVPracticum
                      onCircuitAction={handleCircuitAction}
                      onGestureDetected={handleGestureDetected}
                    />
                  </div>

                  {/* Enhanced Tips */}
                  <div className="mt-6 p-6 bg-purple-100 rounded-xl border-2 border-ink">
                    <h4 className="text-ink font-bold mb-3 flex items-center">
                      <span className="text-xl mr-2"><Ico n="lightbulb" /></span>
                      Tips Penggunaan
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-muted text-sm">
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-700 mr-2">•</span>
                          <span>
                            Pastikan pencahayaan ruangan cukup untuk deteksi
                            tangan optimal
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-700 mr-2">•</span>
                          <span>
                            Posisikan tangan di depan kamera dengan jarak 30-60
                            cm
                          </span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-700 mr-2">•</span>
                          <span>
                            Gunakan gesture yang jelas dan stabil untuk akurasi
                            tinggi
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-700 mr-2">•</span>
                          <span>
                            Lihat panduan gestur di bawah area praktikum untuk referensi
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

      {/* E-LKPD Component - Floating Assistant */}
      <ELKPD />
    </div>
  );
}
