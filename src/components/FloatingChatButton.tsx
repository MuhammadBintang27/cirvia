'use client'

import { useState } from 'react'
import ChatBot from './ChatBot'

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
          style={{
            animation: isOpen ? 'none' : 'bounce 2s infinite'
          }}
          aria-label="Open CIRVIA Assistant"
        >
          {isOpen ? (
            <span className="text-2xl transform rotate-45 transition-transform duration-300">+</span>
          ) : (
            <>
              <span className="text-2xl">🤖</span>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">!</span>
              </div>
            </>
          )}
        </button>
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full animate-ping opacity-30 pointer-events-none"></div>
        )}
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default FloatingChatButton
