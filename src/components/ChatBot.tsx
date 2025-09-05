'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Volume2, VolumeX } from 'lucide-react'

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

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya CIRVIA Assistant 🤖 Saya siap membantu Anda memahami konsep rangkaian listrik. Apa yang ingin Anda pelajari hari ini?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Knowledge base untuk chatbot
  const knowledgeBase = {
    'hukum ohm': 'Hukum Ohm menyatakan bahwa arus listrik (I) berbanding lurus dengan tegangan (V) dan berbanding terbalik dengan hambatan (R). Rumusnya: V = I × R',
    'rangkaian seri': 'Rangkaian seri adalah rangkaian yang komponen-komponennya disusun berurutan. Ciri-ciri: arus sama di semua titik, tegangan terbagi, dan hambatan total = R1 + R2 + R3...',
    'rangkaian paralel': 'Rangkaian paralel adalah rangkaian yang komponen-komponennya disusun bercabang. Ciri-ciri: tegangan sama di semua cabang, arus terbagi, dan 1/Rtotal = 1/R1 + 1/R2 + 1/R3...',
    'daya listrik': 'Daya listrik adalah energi listrik yang digunakan per satuan waktu. Rumus: P = V × I = I²R = V²/R, dengan satuan Watt (W)',
    'tegangan': 'Tegangan atau beda potensial adalah energi per satuan muatan yang diperlukan untuk memindahkan muatan dari satu titik ke titik lain. Satuan: Volt (V)',
    'arus listrik': 'Arus listrik adalah aliran muatan listrik per satuan waktu. Satuan: Ampere (A). Arah arus konvensional dari potensial tinggi ke rendah',
    'hambatan': 'Hambatan atau resistansi adalah kemampuan suatu bahan untuk menghambat aliran arus listrik. Satuan: Ohm (Ω)',
    'praktikum': 'Di CIRVIA, Anda bisa melakukan praktikum virtual dengan menambahkan komponen seperti baterai dan resistor, lalu melihat perhitungan real-time!',
    'gesture control': 'CIRVIA dilengkapi teknologi computer vision yang memungkinkan kontrol menggunakan gerakan tangan: 👆 untuk pilih, ✋ untuk tambah resistor, ✊ untuk hapus, 👋 untuk reset'
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    for (const [key, answer] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(key)) {
        return answer
      }
    }

    // Default responses untuk pertanyaan umum
    if (lowerQuestion.includes('halo') || lowerQuestion.includes('hai')) {
      return 'Halo! Senang bertemu dengan Anda. Saya siap membantu menjawab pertanyaan tentang rangkaian listrik!'
    }
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('bantuan')) {
      return 'Saya bisa membantu Anda dengan topik: Hukum Ohm, Rangkaian Seri/Paralel, Daya Listrik, Tegangan, Arus, Hambatan, Praktikum Virtual, dan Gesture Control. Silakan tanya!'
    }

    if (lowerQuestion.includes('rumus')) {
      return 'Beberapa rumus penting:\n• Hukum Ohm: V = I × R\n• Daya: P = V × I\n• Rangkaian Seri: Rtotal = R1 + R2 + R3...\n• Rangkaian Paralel: 1/Rtotal = 1/R1 + 1/R2...'
    }

    return 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang: Hukum Ohm, Rangkaian Seri/Paralel, Daya Listrik, atau fitur CIRVIA lainnya. 😊'
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
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
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(inputText)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      
      // Auto-speak bot response
      speakText(answer)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold">CIRVIA Assistant</h3>
            <p className="text-xs opacity-90">Expert System Fisika</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              {message.sender === 'bot' && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tanyakan tentang rangkaian listrik..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        
        {/* Quick Questions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['Hukum Ohm', 'Rangkaian Seri', 'Daya Listrik', 'Praktikum'].map((topic) => (
            <button
              key={topic}
              onClick={() => setInputText(`Jelaskan tentang ${topic.toLowerCase()}`)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatBot
