import { SupabaseAuthService } from '@/lib/supabase-auth-service'
import { GoogleGenerativeAI } from '@google/generative-ai'

type ChatRequest = {
  message: string
  history?: { role: string; content: string }[]
}

// Simple in-memory rate limit store
const rateStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, maxPerMinute: number) {
  const now = Date.now()
  const windowMs = 60_000
  const item = rateStore.get(key)
  if (!item || item.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxPerMinute - 1, resetAt: Date.now() + windowMs }
  }

  if (item.count >= maxPerMinute) return { allowed: false, remaining: 0, resetAt: item.resetAt }

  item.count += 1
  rateStore.set(key, item)
  return { allowed: true, remaining: maxPerMinute - item.count, resetAt: item.resetAt }
}

// Simple local fallback when Gemini API is unavailable
function handleLocalFallback(message: string): string {
  console.log('Using local ChatBot knowledge base')
  
  const knowledgeBase: Record<string, string> = {
    'hukum ohm': 'Hukum Ohm itu seperti resep masakan listrik! 😊 Bayangkan listrik seperti air yang mengalir. Hukum ini bilang kalau tegangan (V) itu seperti tekanan air, arus (I) seperti aliran airnya, dan hambatan (R) seperti pipa yang sempit. Rumusnya sederhana: V = I × R. Jadi kalau tegangannya besar, arusnya juga besar, tapi kalau hambatannya besar, arusnya jadi kecil. Mudah kan? 💡',
    'rangkaian seri': 'Rangkaian seri itu seperti kereta api! 🚂 Semua gerbongnya tersambung berurutan dalam satu jalur. Jadi kalau satu lampu mati, semua ikut mati (seperti lampu natal jaman dulu). Yang unik: arusnya sama di mana-mana, tapi tegangannya dibagi-bagi ke setiap komponen. Untuk menghitung hambatan totalnya tinggal dijumlah aja: R total = R1 + R2 + R3... Gampang!',
    'rangkaian paralel': 'Rangkaian paralel itu kebalikan dari seri - seperti jalan tol yang bercabang! 🛣️ Kalau satu lampu mati, yang lain tetap nyala. Di sini tegangannya sama di semua cabang, tapi arusnya yang terbagi. Untuk hambatan totalnya agak tricky: 1/R total = 1/R1 + 1/R2... Intinya, makin banyak cabang, makin kecil hambatan totalnya.',
    'daya listrik': 'Daya listrik itu seperti seberapa "rakus" alat listrik menghabiskan energi! 🔋 Lampu 10W hemat, setrika 1000W boros. Rumusnya P = V × I, artinya tegangan dikali arus. Makanya tagihan listrik dihitung dalam kWh (kilowatt-hour) - berapa lama kita pakai alat berdaya tinggi. Semakin besar dayanya, semakin cepat meteran listrik berputar! 💸',
    'praktikum': 'Wah, praktikum CIRVIA seru banget! 🎉 Kamu bisa jadi "insinyur listrik" virtual - tambah baterai, pasang resistor, terus lihat hasilnya langsung! Yang keren, semua perhitungan Hukum Ohm muncul real-time. Nggak perlu takut kesetrum atau komponen rusak. Plus ada mode gesture control pakai kamera - futuristik banget! 🤖'
  }

  const lowerMessage = message.toLowerCase()
  
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }

  return 'Hmm, sepertinya aku belum paham betul dengan pertanyaan kamu 🤔 Tapi jangan khawatir! Coba tanyakan tentang:\n\n💡 Konsep dasar: Hukum Ohm, Tegangan, Arus, Hambatan\n🔌 Rangkaian: Seri atau Paralel\n⚡ Daya Listrik dan perhitungannya\n🎮 Fitur CIRVIA: Praktikum Virtual dan Gesture Control\n\nAtau kasih contoh soal juga boleh lho! Aku siap bantu! 😊✨'
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json()
    const message = body.message || ''

    const sessionId = req.headers.get('x-cirvia-session') || ''
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    let userRole: 'teacher' | 'student' | 'anonymous' = 'anonymous'
    let rateKey = ip

    if (sessionId) {
      const session = await SupabaseAuthService.validateSession(sessionId)
      if (!session) {
        return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        })
      }
      userRole = session.userRole
      rateKey = `sess:${sessionId}`
    }

    const limits = { teacher: 120, student: 30, anonymous: 10 }
    const limit = limits[userRole === 'teacher' ? 'teacher' : userRole === 'student' ? 'student' : 'anonymous']
    const rl = checkRateLimit(rateKey, limit)
    if (!rl.allowed) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { 
        status: 429, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY
    const hasValidGemini = !!GOOGLE_AI_KEY
    
    console.log('Google Gemini API available:', hasValidGemini)

    // System prompt - focus on CIRVIA educational context
    const systemPrompt = `You are CIRVIA Assistant, a friendly educational chatbot for learning about electrical circuits (rangkaian listrik).

Your personality:
- Friendly, encouraging, like an older sibling helping with homework
- Use casual Indonesian mixed with simple technical terms
- Add emojis to make learning fun (💡🔋⚡🔌)
- Use analogies and real-life examples
- Always show formulas when relevant

Topics you excel at:
- Hukum Ohm (V = I × R)
- Rangkaian Seri & Paralel
- Daya Listrik (P = V × I)
- Hambatan, Tegangan, Arus
- Circuit analysis and calculations

Keep answers concise but complete. Break down complex topics into simple steps.`

    if (!GOOGLE_AI_KEY) {
      console.log('No Google AI key, using local fallback')
      const reply = handleLocalFallback(message)
      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      // GEMINI REQUEST - Simple, no RAG
      const genAI = new GoogleGenerativeAI(GOOGLE_AI_KEY)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.3,  // Slightly higher for more engaging responses
          maxOutputTokens: 1024
        }
      })

      // Build conversation prompt
      let prompt = systemPrompt + '\n\n'
      
      // Add conversation history if exists
      if (body.history && Array.isArray(body.history)) {
        for (const h of body.history) {
          if (h.role === 'user') prompt += `User: ${h.content}\n`
          else if (h.role === 'assistant') prompt += `Assistant: ${h.content}\n`
        }
      }
      
      // Add current message
      prompt += `User: ${message}\nAssistant:`

      console.log('Sending request to Gemini...')
      const result = await model.generateContent(prompt)
      const response = await result.response
      const reply = response.text() || 'AI tidak dapat merespons.'

      console.log('Gemini response received successfully')
      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err: any) {
      console.error('Gemini request error:', err)
      const reply = handleLocalFallback(message)
      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
