import { SupabaseAuthService } from '@/lib/supabase-auth-service'
import { supabase } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

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

async function generateQueryEmbedding(query: string): Promise<number[]> {
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_KEY) {
    console.error('OPENAI_API_KEY not found in environment variables')
    throw new Error('OPENAI_API_KEY not configured')
  }

  console.log('Generating embedding for query:', query.substring(0, 50) + '...')
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        input: query.trim(),
        model: 'text-embedding-ada-002'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      console.error('Invalid embedding response:', data)
      throw new Error('Invalid embedding response from OpenAI')
    }

    console.log('Embedding generated successfully, dimension:', data.data[0].embedding.length)
    return data.data[0].embedding
  } catch (error) {
    console.error('generateQueryEmbedding error:', error)
    throw error
  }
}

async function retrieveContext(query: string) {
  console.log('retrieveContext called with query:', query.substring(0, 100) + '...')
  
  try {
    const queryEmbedding = await generateQueryEmbedding(query)
    console.log('Query embedding generated successfully')
    
    console.log('Searching for similar documents...')
    const { data: matches, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: 5
    })

    if (error) {
      console.error('Vector search error:', error)
      console.log('Falling back to keyword search')
      return fallbackKeywordSearch(query)
    }

    if (!matches || matches.length === 0) {
      const { data: fallbackMatches } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 3
      })
      
      if (!fallbackMatches || fallbackMatches.length === 0) {
        return fallbackKeywordSearch(query)
      }
      
      return fallbackMatches
        .map((match: any) => `${match.title} (similarity: ${match.similarity.toFixed(2)}): ${match.content}`)
        .join('\n\n')
    }

    return matches
      .map((match: any) => `${match.title} (similarity: ${match.similarity.toFixed(2)}): ${match.content}`)
      .join('\n\n')

  } catch (error) {
    console.error('retrieveContext error:', error)
    console.log('Using fallback keyword search due to vector search failure')
    return fallbackKeywordSearch(query)
  }
}

function handleLocalFallback(message: string, retrieved: string) {
  console.log('Using local ChatBot knowledge base')
  
  const knowledgeBase: Record<string, string> = {
    'hukum ohm': 'Hukum Ohm itu seperti resep masakan listrik! 😊 Bayangkan listrik seperti air yang mengalir. Hukum ini bilang kalau tegangan (V) itu seperti tekanan air, arus (I) seperti aliran airnya, dan hambatan (R) seperti pipa yang sempit. Rumusnya sederhana: V = I × R. Jadi kalau tegangannya besar, arusnya juga besar, tapi kalau hambatannya besar, arusnya jadi kecil. Mudah kan? 💡',
    'rangkaian seri': 'Rangkaian seri itu seperti kereta api! 🚂 Semua gerbongnya tersambung berurutan dalam satu jalur. Jadi kalau satu lampu mati, semua ikut mati (seperti lampu natal jaman dulu). Yang unik: arusnya sama di mana-mana, tapi tegangannya dibagi-bagi ke setiap komponen. Untuk menghitung hambatan totalnya tinggal dijumlah aja: R total = R1 + R2 + R3... Gampang!',
    'rangkaian paralel': 'Rangkaian paralel itu kebalikan dari seri - seperti jalan tol yang bercabang! 🛣️ Kalau satu lampu mati, yang lain tetap nyala. Di sini tegangannya sama di semua cabang, tapi arusnya yang terbagi. Untuk hambatan totalnya agak tricky: 1/R total = 1/R1 + 1/R2... Intinya, makin banyak cabang, makin kecil hambatan totalnya.',
    'daya listrik': 'Daya listrik itu seperti seberapa "rakus" alat listrik menghabiskan energi! 🔋 Lampu 10W hemat, setrika 1000W boros. Rumusnya P = V × I, artinya tegangan dikali arus. Makanya tagihan listrik dihitung dalam kWh (kilowatt-hour) - berapa lama kita pakai alat berdaya tinggi. Semakin besar dayanya, semakin cepat meteran listrik berputar! 💸',
    'praktikum': 'Wah, praktikum CIRVIA seru banget! 🎉 Kamu bisa jadi "insinyur listrik" virtual - tambah baterai, pasang resistor, terus lihat hasilnya langsung! Yang keren, semua perhitungan Hukum Ohm muncul real-time. Nggak perlu takut kesetrum atau komponen rusak. Plus ada mode gesture control pakai kamera - futuristik banget! 🤖'
  }

  const lowerMessage = message.toLowerCase()
  let answer = ''

  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      answer = value
      break
    }
  }

  if (retrieved && !answer) {
    answer = `Berdasarkan informasi yang saya temukan:\n\n${retrieved}\n\nSemoga ini membantu! Ada yang ingin ditanyakan lebih lanjut? 😊`
  } else if (!answer) {
    answer = 'Hmm, sepertinya aku belum paham betul dengan pertanyaan kamu 🤔 Tapi jangan khawatir! Coba tanyakan tentang:\n\n💡 Konsep dasar: Hukum Ohm, Tegangan, Arus, Hambatan\n🔌 Rangkaian: Seri atau Paralel\n⚡ Daya Listrik dan perhitungannya\n🎮 Fitur CIRVIA: Praktikum Virtual dan Gesture Control\n\nAtau kasih contoh soal juga boleh lho! Aku siap bantu! 😊✨'
  }

  return answer
}

function fallbackKeywordSearch(query: string): string {
  const internalKb = [
    { title: 'hukum ohm', text: 'Hukum Ohm: V = I × R. Tegangan (V), Arus (I), Hambatan (R).' },
    { title: 'rangkaian seri', text: 'Rangkaian seri: arus sama di semua elemen, R total = R1 + R2 + ...' },
    { title: 'rangkaian paralel', text: 'Rangkaian paralel: tegangan sama di semua cabang, 1/R total = 1/R1 + 1/R2 + ...' }
  ]

  const q = query.toLowerCase()
  const found = internalKb.filter(d => q.includes(d.title) || d.text.toLowerCase().includes(q))

  try {
    const booksDir = path.join(process.cwd(), 'data', 'rag_books')
    if (fs.existsSync(booksDir)) {
      const files = fs.readdirSync(booksDir)
      for (const f of files) {
        if (f === 'README.md') continue
        const full = path.join(booksDir, f)
        if (fs.statSync(full).isFile()) {
          const text = fs.readFileSync(full, 'utf8')
          if (text.toLowerCase().includes(q)) {
            found.push({ title: f, text: text.slice(0, 1000) })
          }
        }
      }
    }
  } catch (e) {
    console.warn('fallbackKeywordSearch error:', e)
  }

  return found.slice(0, 3).map(r => `${r.title}: ${r.text}`).join('\n')
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

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    const hasValidOpenAI = !!OPENAI_KEY
    
    console.log('OpenAI API available:', hasValidOpenAI)

    const retrieved = await retrieveContext(message)

    const systemPrompt = `You are CIRVIA Assistant, an educational assistant for electrical circuits. Use concise, friendly Indonesian explanations suitable for school students. When helpful, show formulas. If retrieved context is provided, incorporate it and cite the source.`

    const messages: any[] = [{ role: 'system', content: systemPrompt }]
    if (retrieved) messages.push({ role: 'system', content: `Retrieved documents:\n${retrieved}` })
    if (body.history && Array.isArray(body.history)) for (const h of body.history) messages.push(h)
    messages.push({ role: 'user', content: message })

    if (!OPENAI_KEY) {
      console.log('No OpenAI key, using local fallback')
      const reply = handleLocalFallback(message, retrieved)
      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      // NON-STREAMING REQUEST (like AgroMarFeed)
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({ 
          model: 'gpt-4', 
          messages, 
          temperature: 0.2, 
          max_tokens: 1024,
          stream: false  // ← NON-STREAMING!
        })
      })

      if (!openaiRes.ok) {
        const errorText = await openaiRes.text()
        console.error('OpenAI API error:', openaiRes.status, errorText)
        
        if (openaiRes.status === 429 || openaiRes.status >= 400) {
          console.log('OpenAI API unavailable, using local fallback')
          const reply = handleLocalFallback(message, retrieved)
          return new Response(JSON.stringify({ reply }), {
            headers: { 'Content-Type': 'application/json' }
          })
        }
        
        throw new Error(`OpenAI error: ${openaiRes.status} - ${errorText}`)
      }

      const data = await openaiRes.json()
      const reply = data.choices?.[0]?.message?.content || 'AI tidak dapat merespons.'

      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (err: any) {
      console.error('OpenAI request error:', err)
      const reply = handleLocalFallback(message, retrieved)
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
