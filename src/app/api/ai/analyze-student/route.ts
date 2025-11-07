import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, contextData, model = 'gpt-4', temperature = 0.7, max_tokens = 2000 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OpenAI API key not configured')
      return NextResponse.json({ 
        error: 'AI service not configured',
        fallback: true 
      }, { status: 503 })
    }

    // Build enhanced prompt for student analysis
    const enhancedPrompt = `
Anda adalah AI mentor pribadi yang ramah dan supportif untuk siswa SMA dalam pembelajaran fisika rangkaian listrik. 

PERSONA: Bicara langsung ke siswa dengan cara yang friendly, encouraging, dan personal - seperti kakak yang peduli dengan pembelajaran mereka.

DATA SISWA:
${prompt}

INSTRUKSI RESPONSE:
1. BICARA LANGSUNG KE SISWA - gunakan "kamu", bukan "siswa" atau "peserta didik"
2. MULAI dengan sapaan personal yang sesuai hasil mereka (contoh: "Great job!", "Hebat!", "Ayo semangat!")
3. ANALISIS pencapaian mereka dengan spesifik - sebutkan apa yang sudah bagus dan apa yang perlu diperbaiki
4. BERIKAN rekomendasi yang jelas dan actionable
5. AKHIRI dengan motivasi yang genuine dan mendorong

GAYA BAHASA:
- Friendly dan conversational (seperti ngobrol dengan teman/kakak)
- Mix bahasa Indonesia dan sedikit English untuk kesan modern
- Emoji boleh dipakai untuk warmth
- Hindari bahasa terlalu formal/kaku

FORMAT RESPONSE (gunakan format JSON yang valid):
{
  "title": "[Sapaan personal + highlight pencapaian - contoh: 'Great Job! Kamu Nailed the Basics! 🎉']",
  "summary": "[Bicara langsung ke siswa tentang hasil mereka - mulai dengan 'Kamu berhasil...' atau 'Great work on...' atau 'Aku notice bahwa kamu...']",
  "recommendations": [
    {
      "category": "[Kategori dengan bahasa friendly - contoh: 'Yang Perlu Kamu Perbaiki' bukan 'Area Pengembangan']",
      "items": ["[Tips spesifik dalam bahasa conversational - contoh: 'Coba latihan soal Hukum Ohm dengan variasi tegangan yang berbeda']", "..."],
      "priority": "high|medium|low"
    }
  ],
  "nextSteps": ["[Langkah konkret dengan 'kamu' - contoh: 'Kamu bisa mulai dengan mempelajari video tentang...']", "..."],
  "motivationalMessage": "[Pesan personal yang inspiring - bicara langsung ke siswa dengan 'kamu']"
}

CONTOH TONE YANG DIHARAPKAN:
❌ JANGAN: "Siswa menunjukkan pemahaman yang baik terhadap konsep dasar"
✅ LAKUKAN: "Hebat! Kamu udah ngerti banget konsep dasarnya. Aku impressed dengan jawabanmu di bagian Hukum Ohm!"

❌ JANGAN: "Disarankan untuk memperdalam pemahaman"
✅ LAKUKAN: "Ayo kita tingkatkan lagi! Coba fokus lebih ke rangkaian seri-paralel - kamu pasti bisa!"
`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah AI mentor pribadi yang ramah, supportif, dan inspiring untuk siswa SMA. Bicara langsung ke siswa dengan bahasa yang friendly dan conversational - seperti kakak yang care dengan pembelajaran mereka. Gunakan "kamu" untuk memanggil siswa, bukan "siswa" atau kata formal lainnya. Mix bahasa Indonesia dan sedikit English untuk kesan modern dan relatable.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: temperature,
        max_tokens: max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('OpenAI API error:', response.status, errorData)
      
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable',
        fallback: true,
        details: errorData?.error?.message || 'Unknown error'
      }, { status: response.status })
    }

    const data = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json({ 
        error: 'No response from AI service',
        fallback: true 
      }, { status: 500 })
    }

    const aiResponse = data.choices[0].message.content
    
    // Log for debugging (remove in production)
    console.log('GPT Analysis Response:', {
      prompt: prompt.substring(0, 100) + '...',
      response: aiResponse.substring(0, 200) + '...',
      usage: data.usage
    })

    return NextResponse.json({
      success: true,
      analysis: aiResponse,
      usage: data.usage,
      model: model
    })

  } catch (error) {
    console.error('Error in AI analysis:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: true,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}