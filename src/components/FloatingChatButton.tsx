'use client'

import { useState, useEffect } from 'react'
import ChatBot from './ChatBot'

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([])

  useEffect(() => {
    setIsClient(true)
    // Generate particles only on client side
    const newParticles = [...Array(3)].map(() => ({
      left: `${20 + Math.random() * 40}%`,
      top: `${20 + Math.random() * 40}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random()}s`
    }))
    setParticles(newParticles)
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/30 to-blue-500/30 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>
        
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-white rounded-full shadow-2xl backdrop-blur-xl border border-white/20 transform hover:scale-110 transition-all duration-500 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300/50 group overflow-hidden"
          style={{
            animation: isOpen ? 'none' : 'bounce 2s infinite'
          }}
          aria-label="Open CIRVIA Assistant"
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-white/10 rounded-full"></div>
          
          {/* Floating particles inside button */}
          {!isOpen && isClient && particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            ></div>
          ))}
          
          {isOpen ? (
            <span className="text-xl md:text-2xl transform rotate-45 transition-transform duration-300 relative z-10">+</span>
          ) : (
            <>
              <span className="text-xl md:text-2xl relative z-10 group-hover:animate-bounce">🤖</span>
              {/* Enhanced notification dot */}
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            </>
          )}
          
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
        
        {/* Enhanced pulse animation when closed */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-ping opacity-10 pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* Tooltip - Hidden on mobile */}
        {!isOpen && (
          <div className="hidden md:block absolute bottom-full right-0 mb-3 px-3 py-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl text-white text-sm rounded-lg border border-white/20 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap">
            <span className="font-medium">💬 Chat dengan CIRVIA AI</span>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-700"></div>
          </div>
        )}
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default FloatingChatButton
