'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

// AI-only chat - no local knowledge base fallback

const QUICK_TOPICS = ['Hukum Ohm', 'Rangkaian Seri', 'Daya Listrik', 'Praktikum'] as const

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Halo! Aku CIRVIA Assistant 🤖✨ \n\nAku di sini untuk jadi teman belajar kamu tentang rangkaian listrik! Mau tanya apa aja boleh - mulai dari yang basic sampai yang rumit. Aku jelasin pakai bahasa yang gampang dipahami kok! \n\nYuk, mulai petualangan belajar fisika yang seru! Ada yang mau ditanyakan? 😊🔌',
  sender: 'bot',
  timestamp: new Date()
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  // State management
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auth context
  const { user } = useAuth()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Text-to-speech functionality
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  // Main message handler - NON-STREAMING (like AgroMarFeed)
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isTyping) return

    const currentInput = inputText
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    }

    // Update UI immediately
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Get session token
      const session = typeof window !== 'undefined' ? localStorage.getItem('cirvia_session') || '' : ''

      // Make API request - NON-STREAMING
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'x-cirvia-session': session 
        },
        body: JSON.stringify({ message: currentInput })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      const aiReply = data.reply || 'AI tidak dapat merespons.'

      // Add bot response directly (no streaming)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      speakText(aiReply)
      setIsTyping(false)
    } catch (err) {
      console.error('Chat request failed:', err)
      
      // Show error message when AI service is unavailable
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, sepertinya ada gangguan koneksi. Silakan coba lagi dalam beberapa saat. 😅',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }, [inputText, isTyping, speakText])

  // Handle keyboard input
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // Handle quick topic selection
  const handleQuickTopic = useCallback((topic: string) => {
    setInputText(`Jelaskan tentang ${topic.toLowerCase()}`)
  }, [])

  // Simple markdown parser - inspired by AgroMarFeed approach
  const parseMarkdown = useCallback((text: string) => {
    // STEP 1: Fix merged words - add space between lowercase and uppercase
    let cleanText = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase: jokoWidodo -> joko Widodo
      .replace(/([.,;:!?])([A-Za-z])/g, '$1 $2')  // After punctuation: hello,world -> hello, world
      .replace(/([a-z])(\d)/g, '$1 $2')  // letter+number: abc123 -> abc 123
      .replace(/(\d)([a-z])/g, '$1 $2')  // number+letter: 123abc -> 123 abc
    
    // Handle headers first
    let processedText = cleanText.replace(/^### (.*$)/gm, '<h3>$1</h3>')
    processedText = processedText.replace(/^## (.*$)/gm, '<h2>$1</h2>')
    processedText = processedText.replace(/^# (.*$)/gm, '<h1>$1</h1>')

    // Handle other markdown elements
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>')
    processedText = processedText.replace(/`(.*?)`/g, '<code>$1</code>')
    
    // Handle numbered lists
    processedText = processedText.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    // Handle bullet lists
    processedText = processedText.replace(/^[\-\*]\s(.+)$/gm, '<li>$1</li>')

    // Split by tags and process
    const segments = processedText.split(/(<[^>]+>.*?<\/[^>]+>|<li>.*?<\/li>)/g)
    const result: React.ReactNode[] = []
    let listItems: string[] = []

    segments.forEach((segment, index) => {
      if (!segment) return

      // Collect list items
      if (segment.startsWith('<li>')) {
        const content = segment.replace(/<\/?li>/g, '')
        listItems.push(content)
        return
      }

      // Flush collected list items
      if (listItems.length > 0) {
        result.push(
          <div key={`list-${index}`} className="my-3 space-y-2">
            {listItems.map((item, i) => (
              <div key={i} className="flex items-start bg-slate-700/30 rounded-lg p-3 border-l-4 border-cyan-400/60">
                <span className="text-cyan-400 mr-3 flex-shrink-0 font-bold">•</span>
                <span className="flex-1 text-gray-100 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        )
        listItems = []
      }

      if (segment.startsWith('<h1>')) {
        const content = segment.replace(/<\/?h1>/g, '')
        result.push(
          <h1 key={index} className="font-bold text-xl mt-4 mb-2 text-cyan-300">
            {content}
          </h1>
        )
      } else if (segment.startsWith('<h2>')) {
        const content = segment.replace(/<\/?h2>/g, '')
        result.push(
          <h2 key={index} className="font-bold text-lg mt-3 mb-2 text-cyan-300">
            {content}
          </h2>
        )
      } else if (segment.startsWith('<h3>')) {
        const content = segment.replace(/<\/?h3>/g, '')
        result.push(
          <h3 key={index} className="font-semibold text-base mt-2 mb-1 text-cyan-300">
            {content}
          </h3>
        )
      } else if (segment.startsWith('<strong>')) {
        const content = segment.replace(/<\/?strong>/g, '')
        result.push(
          <strong key={index} className="font-bold text-white">
            {content}
          </strong>
        )
      } else if (segment.startsWith('<em>')) {
        const content = segment.replace(/<\/?em>/g, '')
        result.push(
          <em key={index} className="italic text-blue-200">
            {content}
          </em>
        )
      } else if (segment.startsWith('<code>')) {
        const content = segment.replace(/<\/?code>/g, '')
        result.push(
          <code key={index} className="bg-slate-700/50 px-2 py-1 rounded text-sm font-mono text-cyan-300 border border-cyan-500/30">
            {content}
          </code>
        )
      } else if (segment.trim()) {
        result.push(
          <span key={index} className="text-gray-100">
            {segment}
          </span>
        )
      }
    })

    // Flush any remaining list items
    if (listItems.length > 0) {
      result.push(
        <div key="list-final" className="my-3 space-y-2">
          {listItems.map((item, i) => (
            <div key={i} className="flex items-start bg-slate-700/30 rounded-lg p-3 border-l-4 border-cyan-400/60">
              <span className="text-cyan-400 mr-3 flex-shrink-0 font-bold">•</span>
              <span className="flex-1 text-gray-100 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )
    }

    return result.length > 0 ? result : <span className="text-gray-100">{text}</span>
  }, [])

  // Render individual message
  const renderMessage = useCallback((message: Message) => (
    <div
      key={message.id}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[95%] md:max-w-[90%] transition-all duration-300 hover:scale-[1.005] ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border border-purple-400/30 rounded-2xl rounded-br-sm shadow-lg shadow-purple-500/25 p-4 md:p-5 backdrop-blur-sm'
            : 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-white border border-slate-600/40 rounded-2xl rounded-bl-sm shadow-xl shadow-slate-900/50 p-3 md:p-4 backdrop-blur-sm'
        }`}
      >
        {message.sender === 'bot' ? (
          <div className="space-y-1">
            {/* AI Badge */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-600/30">
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/assets/illustrations/maskotkepala.png"
                  alt="CIRVIA"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-cyan-300 font-medium">CIRVIA Assistant</span>
            </div>
            
            {/* Formatted Content */}
            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {parseMarkdown(message.text)}
            </div>
          </div>
        ) : (
          <div className="text-sm md:text-base">
            <p className="leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
        )}
        
        {message.sender === 'bot' && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <span className="text-xs text-blue-200/70 font-medium flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {message.timestamp.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <button
              onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-110"
              title={isSpeaking ? 'Stop Audio' : 'Play Audio'}
            >
              {isSpeaking ? 
                <VolumeX size={14} className="text-red-400" /> : 
                <Volume2 size={14} className="text-cyan-400" />
              }
            </button>
          </div>
        )}
      </div>
    </div>
  ), [isSpeaking, speakText, stopSpeaking, parseMarkdown])

  // Render typing indicator
  const renderTypingIndicator = useCallback(() => (
    <div className="flex justify-start">
      <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 text-white p-4 md:p-5 rounded-2xl rounded-bl-sm shadow-lg max-w-[90%] md:max-w-[85%]">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <span className="text-sm text-blue-200/80 font-medium">CIRVIA sedang berpikir...</span>
        </div>
      </div>
    </div>
  ), [])

  // Render input section with controls and quick topics
  const renderInputSection = useCallback(() => (
    <div className="relative p-3 md:p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-t border-white/10 shrink-0">
      <div className="flex space-x-2 md:space-x-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tanyakan tentang rangkaian listrik..."
          className="flex-1 p-2.5 md:p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-blue-200/60 text-sm transition-all duration-300"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          className="p-2.5 md:p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm border border-purple-400/30"
        >
          <Send size={14} className="md:w-4 md:h-4" />
        </button>
      </div>
        
      {/* AI Status Indicator */}
      <div className="mt-2 md:mt-3 flex items-center justify-center">
        <div className="flex items-center space-x-2 px-2.5 md:px-3 py-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/20">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-200/70 font-medium">AI Online</span>
        </div>
      </div>
    </div>
  ), [inputText, isTyping, handleSendMessage, handleKeyPress])

  if (!isOpen) return null

  return (
    <div className="fixed inset-4 md:bottom-4 md:right-4 md:top-auto md:left-auto md:w-96 md:h-[600px] w-full h-full md:max-h-[80vh] bg-gradient-to-br from-slate-900/95 via-blue-950/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between p-4 md:p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border-b border-white/10 rounded-t-2xl shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <Image
              src="/assets/illustrations/maskotkepala.png"
              alt="CIRVIA Maskot"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">CIRVIA Assistant</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="relative flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-5 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {renderInputSection()}
    </div>
  )
}

export default ChatBot
