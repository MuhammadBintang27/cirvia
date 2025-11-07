import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { prompt, contextData, temperature = 0.7, maxTokens = 3000 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Check if Gemini API key is configured
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.error('❌ Google AI API key not configured')
      return NextResponse.json({ 
        error: 'AI service not configured',
        fallback: true 
      }, { status: 503 })
    }

    console.log('🤖 [GEMINI-API] Initializing Gemini 2.5 Flash...')
    
    // Initialize Gemini AI (use standard flash, not thinking mode)
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',  // Use standard flash (not thinking-exp)
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens, // Increased to 8000 for detailed responses
        responseMimeType: 'application/json', // Force JSON output
      }
    })

    console.log('🤖 [GEMINI-API] Sending prompt to Gemini...')
    console.log('🤖 [GEMINI-API] Prompt length:', prompt.length)
    console.log('🤖 [GEMINI-API] Prompt preview:', prompt.substring(0, 300))

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    let analysisText = response.text()
    
    console.log('✅ [GEMINI-API] Response received')
    console.log('✅ [GEMINI-API] Response type:', typeof analysisText)
    console.log('✅ [GEMINI-API] Response length:', analysisText?.length || 0)
    
    if (!analysisText) {
      console.error('❌ [GEMINI-API] Empty response from Gemini!')
      console.error('❌ [GEMINI-API] Full result:', JSON.stringify(result, null, 2))
      throw new Error('Empty response from Gemini API')
    }

    // Clean up markdown code fences
    analysisText = analysisText
      .replace(/```json\s*/g, '')  // Remove ```json
      .replace(/```\s*/g, '')       // Remove closing ```
      .trim()

    console.log('✅ [GEMINI-API] Response cleaned and ready')
    console.log('✅ [GEMINI-API] Preview:', analysisText.substring(0, 150))

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      model: 'gemini-2.5-flash'
    })

  } catch (error) {
    console.error('❌ [GEMINI-API] Error:', error)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: true,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
