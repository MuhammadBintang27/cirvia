'use client';

import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-4 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {text}
        </p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function LoadingOverlay({ isVisible, text = 'Memuat...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Circuit Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={`circuit-${i}`}
              className="absolute w-16 h-16 border-2 border-cyan-400/30 rounded-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Sparkling Stars */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-cyan-400 text-xl animate-ping opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Mascot Container */}
        <div className="relative mb-8">
          {/* Soft Glow Behind Mascot */}
          <div className="absolute inset-0 -m-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-cyan-400/40 to-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Mascot Circle */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            {/* Rotating Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 animate-spin" style={{ animationDuration: '4s' }}></div>
            
            {/* Dark Background for Mascot */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl"></div>
            
            {/* Inner Glow */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-950/50 to-indigo-950/50"></div>
            
            {/* Mascot Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full animate-float">
                <Image 
                  src="/assets/illustrations/maskotchatbot.png" 
                  alt="CIRVIA Mascot" 
                  fill
                  className="object-contain filter drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* CIRVIA Text */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-3">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
              CIRVIA
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-cyan-300/90 font-semibold">
            Circuit Virtual Interactive Application
          </p>
          <p className="text-sm sm:text-base text-blue-300/70 mt-2 font-medium">
            Ayo belajar rangkaian listrik dengan seru! ⚡
          </p>
        </div>

        {/* Fun Loading Animation */}
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-500/50"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce shadow-lg shadow-cyan-500/50" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-cyan-200 text-base sm:text-lg font-semibold">
            {text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-72 sm:w-96 mb-4">
          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden shadow-inner border border-cyan-500/20">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full animate-loading-bar shadow-lg shadow-cyan-500/50"></div>
          </div>
        </div>

        {/* Fun Emoji Icons */}
        <div className="flex items-center space-x-4 text-2xl">
          <span className="animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0s' }}>🔌</span>
          <span className="animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>💡</span>
          <span className="animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.4s' }}>⚡</span>
          <span className="animate-bounce filter drop-shadow-lg" style={{ animationDelay: '0.6s' }}>🔋</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}