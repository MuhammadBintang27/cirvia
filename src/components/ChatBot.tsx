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
      text: 'Halo! Aku CIRVIA Assistant 🤖✨ \n\nAku di sini untuk jadi teman belajar kamu tentang rangkaian listrik! Mau tanya apa aja boleh - mulai dari yang basic sampai yang rumit. Aku jelasin pakai bahasa yang gampang dipahami kok! \n\nYuk, mulai petualangan belajar fisika yang seru! Ada yang mau ditanyakan? 😊🔌',
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
    'hukum ohm': 'Hukum Ohm itu seperti resep masakan listrik! 😊 Bayangkan listrik seperti air yang mengalir. Hukum ini bilang kalau tegangan (V) itu seperti tekanan air, arus (I) seperti aliran airnya, dan hambatan (R) seperti pipa yang sempit. Rumusnya sederhana: V = I × R. Jadi kalau tegangannya besar, arusnya juga besar, tapi kalau hambatannya besar, arusnya jadi kecil. Mudah kan? 💡',
    
    'rangkaian seri': 'Rangkaian seri itu seperti kereta api! 🚂 Semua gerbongnya tersambung berurutan dalam satu jalur. Jadi kalau satu lampu mati, semua ikut mati (seperti lampu natal jaman dulu). Yang unik: arusnya sama di mana-mana, tapi tegangannya dibagi-bagi ke setiap komponen. Untuk menghitung hambatan totalnya tinggal dijumlah aja: R total = R1 + R2 + R3... Gampang!',
    
    'rangkaian paralel': 'Rangkaian paralel itu kebalikan dari seri - seperti jalan tol yang bercabang! 🛣️ Kalau satu lampu mati, yang lain tetap nyala. Di sini tegangannya sama di semua cabang, tapi arusnya yang terbagi. Untuk hambatan totalnya agak tricky: 1/R total = 1/R1 + 1/R2... Intinya, makin banyak cabang, makin kecil hambatan totalnya.',
    
    'daya listrik': 'Daya listrik itu seperti seberapa "rakus" alat listrik menghabiskan energi! 🔋 Lampu 10W hemat, setrika 1000W boros. Rumusnya P = V × I, artinya tegangan dikali arus. Makanya tagihan listrik dihitung dalam kWh (kilowatt-hour) - berapa lama kita pakai alat berdaya tinggi. Semakin besar dayanya, semakin cepat meteran listrik berputar! 💸',
    
    'tegangan': 'Tegangan itu seperti "semangat" listrik untuk mengalir! ⚡ Bayangkan seperti air terjun - makin tinggi terjunnya, makin kencang airnya jatuh. Tegangan diukur dalam Volt (V). Stop kontak rumah biasanya 220V, powerbank 5V, baterai AA 1.5V. Tegangan tinggi = energi besar, makanya hati-hati dengan listrik PLN ya! 😅',
    
    'arus listrik': 'Arus listrik itu seperti aliran sungai, tapi yang mengalir adalah elektron! 🌊 Diukur dalam Ampere (A). Charger HP biasanya 1-2A, rumah tangga sekitar 10-20A. Fun fact: arah arus yang kita pelajari (dari + ke -) sebenarnya kebalikan dari arah elektron yang sesungguhnya! Tapi tenang, hitungannya tetap benar kok.',
    
    'hambatan': 'Hambatan itu seperti "kemacetan" buat arus listrik! 🚗 Diukur dalam Ohm (Ω). Kabel tembaga hambatannya kecil (jalan tol), karet hambatannya besar (jalan sempit). Resistor sengaja dibuat untuk "menghambat" arus supaya komponen lain nggak kebakar. Makin besar hambatan, makin susah arus mengalir.',
    
    'praktikum': 'Wah, praktikum CIRVIA seru banget! 🎉 Kamu bisa jadi "insinyur listrik" virtual - tambah baterai, pasang resistor, terus lihat hasilnya langsung! Yang keren, semua perhitungan Hukum Ohm muncul real-time. Nggak perlu takut kesetrum atau komponen rusak. Plus ada mode gesture control pakai kamera - futuristik banget! 🤖',
    
    'gesture control': 'Fitur andalan CIRVIA nih! 🔥 Pakai kamera laptop/HP, kamu bisa kontrol rangkaian pakai gerakan tangan:\n\n👆 Tunjuk = pilih komponen\n✋ Telapak terbuka = tambah resistor\n✊ Kepal = hapus komponen\n👋 Lambaian = reset rangkaian\n\nBerasa kayak Tony Stark ngontrol hologram! Teknologi computer vision yang mudah dipelajari. Coba deh, dijamin ketagihan! 😎'
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
    if (lowerQuestion.includes('halo') || lowerQuestion.includes('hai') || lowerQuestion.includes('hello')) {
      return 'Halo! 👋 Senang banget ketemu kamu! Aku CIRVIA Assistant, siap bantu kamu memahami dunia rangkaian listrik yang seru. Ada yang mau ditanyakan? Jangan malu-malu ya! 😊'
    }
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('bantuan') || lowerQuestion.includes('bisa apa')) {
      return 'Aku bisa bantu kamu dengan banyak hal nih! 🌟\n\n📚 Materi: Hukum Ohm, Rangkaian Seri/Paralel, Daya Listrik\n⚡ Konsep: Tegangan, Arus, Hambatan\n🎮 Fitur CIRVIA: Praktikum Virtual & Gesture Control\n\nTinggal tanya aja, aku jelasin dengan bahasa yang gampang dipahami! 💫'
    }

    if (lowerQuestion.includes('rumus') || lowerQuestion.includes('formula')) {
      return 'Nih rumus-rumus penting yang wajib kamu tahu! 📝✨\n\n⚡ Hukum Ohm: V = I × R\n🔋 Daya Listrik: P = V × I\n🔗 Rangkaian Seri: R total = R1 + R2 + R3...\n🌐 Rangkaian Paralel: 1/R total = 1/R1 + 1/R2...\n\nMau penjelasan detail salah satunya? Tinggal bilang aja! 😄'
    }

    if (lowerQuestion.includes('cara') || lowerQuestion.includes('bagaimana')) {
      return 'Wah, pertanyaan yang bagus! 🤔 Aku suka orang yang ingin tahu caranya. Coba spesifik dikit ya - mau tahu cara apa? Misalnya "cara menghitung arus" atau "cara menggunakan praktikum CIRVIA". Biar aku bisa kasih penjelasan yang tepat sasaran! 🎯'
    }

    return 'Hmm, sepertinya aku belum paham betul dengan pertanyaan kamu 🤔 Tapi jangan khawatir! Coba tanyakan tentang:\n\n💡 Konsep dasar: Hukum Ohm, Tegangan, Arus, Hambatan\n🔌 Rangkaian: Seri atau Paralel\n⚡ Daya Listrik dan perhitungannya\n🎮 Fitur CIRVIA: Praktikum Virtual dan Gesture Control\n\nAtau kasih contoh soal juga boleh lho! Aku siap bantu! 😊✨'
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
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <span className="text-xl md:text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">CIRVIA Assistant</h3>
            <p className="text-xs text-blue-200/80">🧠 AI Physics Expert</p>
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
      <div className="relative flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.01] md:hover:scale-[1.02] ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-purple-400/30 rounded-br-sm shadow-lg shadow-purple-500/25'
                  : 'bg-gradient-to-br from-white/10 to-white/5 text-white border-white/20 rounded-bl-sm shadow-lg'
              }`}
            >
              <p className="text-sm md:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
              {message.sender === 'bot' && (
                <div className="flex items-center justify-between mt-2 md:mt-3 pt-2 border-t border-white/10">
                  <span className="text-xs text-blue-200/70 font-medium">
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                    className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  >
                    {isSpeaking ? <VolumeX size={12} className="text-red-400 md:w-[14px] md:h-[14px]" /> : <Volume2 size={12} className="text-cyan-400 md:w-[14px] md:h-[14px]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 text-white p-3 md:p-4 rounded-2xl rounded-bl-sm shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-blue-200/70 ml-2">CIRVIA sedang berpikir...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
        
        {/* Quick Questions */}
        <div className="mt-3 md:mt-4 flex flex-wrap gap-1.5 md:gap-2">
          {['Hukum Ohm', 'Rangkaian Seri', 'Daya Listrik', 'Praktikum'].map((topic) => (
            <button
              key={topic}
              onClick={() => setInputText(`Jelaskan tentang ${topic.toLowerCase()}`)}
              className="px-2.5 md:px-3 py-1.5 md:py-2 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-full hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/50 transform hover:scale-105"
            >
              {topic}
            </button>
          ))}
        </div>
        
        {/* AI Status Indicator */}
        <div className="mt-2 md:mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 px-2.5 md:px-3 py-1 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/20">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200/70 font-medium">AI Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
