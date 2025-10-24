'use client'

import React from 'react';
import UnifiedCircuitCard from '@/components/componentSoal/UnifiedCircuitCard';
import { UnifiedCircuitGenerator, UNIFIED_CIRCUIT_TEMPLATES } from '@/lib/unifiedCircuitGenerator';

const UnifiedCircuitDemo = () => {
  // Generate sample circuits
  const simpleCircuit = UnifiedCircuitGenerator.generateRandomCircuit('simple');
  const seriesCircuit = UnifiedCircuitGenerator.generateRandomCircuit('series');
  const parallelCircuit = UnifiedCircuitGenerator.generateRandomCircuit('parallel');
  const mixedCircuit = UnifiedCircuitGenerator.generateRandomCircuit('mixed');
  const complexSeriesCircuit = UnifiedCircuitGenerator.generateRandomCircuit('complex-series');
  const complexParallelCircuit = UnifiedCircuitGenerator.generateRandomCircuit('complex-parallel');
  const advancedMixedCircuit = UnifiedCircuitGenerator.generateRandomCircuit('mixed-advanced');

  // Custom circuits
  const householdCircuit = UNIFIED_CIRCUIT_TEMPLATES.custom.householdCircuit();
  const carCircuit = UNIFIED_CIRCUIT_TEMPLATES.custom.carCircuit();
  const labCircuit = UNIFIED_CIRCUIT_TEMPLATES.custom.laboratoryCircuit();

  const circuits = [
    simpleCircuit,
    seriesCircuit,
    parallelCircuit,
    mixedCircuit,
    complexSeriesCircuit,
    complexParallelCircuit,
    advancedMixedCircuit,
    householdCircuit,
    carCircuit,
    labCircuit
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔥 Unified Circuit System Demo
          </h1>
          <p className="text-xl text-blue-200">
            Sistem rangkaian listrik terpadu dengan berbagai template dan konfigurasi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circuits.map((circuit, index) => (
            <div key={index} className="transform hover:scale-105 transition-all duration-300">
              <UnifiedCircuitCard
                circuit={circuit}
                showBrightness={true}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            ✨ Fitur Unified Circuit System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">
                🎯 Single Component
              </h3>
              <p className="text-green-200/80 text-sm">
                Satu komponen UnifiedCircuitCard untuk menggantikan CircuitCard dan ComplexCircuitCard
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">
                🔧 Flexible Configuration
              </h3>
              <p className="text-blue-200/80 text-sm">
                Jumlah resistor, lampu, voltage, dan template dapat dikonfigurasi sesuai kebutuhan
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                🎨 Realistic 3D
              </h3>
              <p className="text-purple-200/80 text-sm">
                Visual 3D realistis dengan battery, resistor color bands, dan bulb effects
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">
                📚 Educational
              </h3>
              <p className="text-yellow-200/80 text-sm">
                Current flow indicators, real-time calculations, dan informasi teknis lengkap
              </p>
            </div>

            <div className="bg-pink-500/10 border border-pink-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-pink-300 mb-3">
                🔄 Multiple Templates
              </h3>
              <p className="text-pink-200/80 text-sm">
                7+ template: simple, series, parallel, mixed, complex-series, complex-parallel, mixed-advanced
              </p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                🏗️ Custom Builder
              </h3>
              <p className="text-cyan-200/80 text-sm">
                CircuitBuilder component dan generator untuk membuat circuit configuration kustom
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-white/20">
            <span className="text-2xl mr-3">🎉</span>
            <span className="text-white font-semibold">
              Unified Circuit System - Successfully Implemented!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCircuitDemo;