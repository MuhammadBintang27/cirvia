'use client';
import { Ico } from "@/components/ui/Ico";

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
    primary: 'border-ink',
    secondary: 'border-ink',
    white: 'border-ink'
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
        <p className="mt-2 text-sm text-muted dark:text-muted">
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
  // Hooks must be called at the top level, not conditionally
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Early return after hooks
  if (!isVisible) return null;

  // Show simple fallback during SSR/initial render
  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-paper z-50 flex items-center justify-center">
        <div className="text-ink text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-paper z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-soft rounded-full hidden animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-soft rounded-full hidden animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-soft rounded-full hidden animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Circuit Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={`circuit-${i}`}
              className="absolute w-16 h-16 border-2 border-ink rounded-lg"
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
            className="absolute text-brand text-xl animate-ping opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Ico n="sparkles" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Mascot Container */}
        <div className="relative mb-8">
          {/* Soft Glow Behind Mascot */}
          <div className="absolute inset-0 -m-12">
            <div className="absolute inset-0 bg-brand-soft rounded-full hidden animate-pulse"></div>
          </div>

          {/* Mascot Circle */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
            {/* Rotating Gradient Ring */}
            <div className="absolute inset-0 rounded-full bg-brand animate-spin" style={{ animationDuration: '4s' }}></div>
            
            {/* Dark Background for Mascot */}
            <div className="absolute inset-1 rounded-full bg-paper shadow-hard"></div>
            
            {/* Inner Glow */}
            <div className="absolute inset-3 rounded-full bg-brand-soft"></div>
            
            {/* Mascot Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full animate-float">
                <Image 
                  src="/assets/illustrations/maskotchatbot.png" 
                  alt="CIRVIA Mascot" 
                  fill
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  className="object-contain filter"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* CIRVIA Text */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-3">
            <span className="text-ink animate-pulse">
              CIRVIA
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-brand font-semibold">
            Circuit Virtual Interactive Application
          </p>
          <p className="text-sm sm:text-base text-brand mt-2 font-medium">
            Ayo belajar rangkaian listrik dengan seru! 
          </p>
        </div>

        {/* Fun Loading Animation */}
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-brand rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-muted text-base sm:text-lg font-semibold">
            {text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-72 sm:w-96 mb-4">
          <div className="h-3 bg-paper rounded-full overflow-hidden shadow-inner border-2 border-ink">
            <div className="h-full bg-brand rounded-full animate-loading-bar"></div>
          </div>
        </div>

        {/* Fun Emoji Icons */}
        <div className="flex items-center space-x-4 text-2xl">
          <span className="animate-bounce filter" style={{ animationDelay: '0s' }}><Ico n="plug" /></span>
          <span className="animate-bounce filter" style={{ animationDelay: '0.2s' }}><Ico n="lightbulb" /></span>
          <span className="animate-bounce filter" style={{ animationDelay: '0.4s' }}><Ico n="zap" /></span>
          <span className="animate-bounce filter" style={{ animationDelay: '0.6s' }}><Ico n="battery" /></span>
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