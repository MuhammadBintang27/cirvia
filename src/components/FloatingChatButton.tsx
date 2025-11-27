'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import ChatBot from './ChatBot'

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Hide chatbot on specific pages
  const hiddenPages = [
    '/login',
    '/login/student',
    '/register',
    '/pretest',
    '/posttest',
    '/learning-style',
    '/practicum'  // E-LKPD replaces chatbot on practicum page
  ]

  const shouldHide = hiddenPages.some(page => pathname?.startsWith(page))

  if (shouldHide) {
    return null
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <style jsx>{`
        @keyframes gentleBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1);
          }
        }
      `}</style>
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
        <button
          onClick={toggleChat}
          className="relative w-24 h-24 md:w-32 md:h-32 focus:outline-none focus:ring-0 focus:border-0 active:outline-none group"
          style={{
            outline: 'none',
            boxShadow: 'none',
            transition: 'transform 0.4s ease-in-out',
            animation: isOpen ? 'none' : 'gentleBounce 3s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = 'none'
            e.currentTarget.style.transform = 'scale(1.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            if (!isOpen) {
              e.currentTarget.style.animation = 'gentleBounce 3s ease-in-out infinite'
            }
          }}
          aria-label="Open CIRVIA Assistant"
        >
          {isOpen ? (
            /* Close button saat chat dibuka */
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center">
              <span className="text-2xl md:text-3xl text-white transform rotate-45 transition-transform duration-300">+</span>
            </div>
          ) : (
            /* Maskot CIRVIA langsung */
            <div className="relative w-full h-full transition-transform duration-300 drop-shadow-2xl">
              <Image
                src="/assets/illustrations/maskotAyunan.png"
                alt="CIRVIA Maskot"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </button>
        
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
