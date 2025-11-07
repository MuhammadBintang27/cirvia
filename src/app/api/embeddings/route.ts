import { SupabaseAuthService } from '@/lib/supabase-auth-service'
import { supabase } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

type EmbedRequest = {
  text: string
  title?: string
  sourceFile?: string
  metadata?: Record<string, any>
}

type BatchEmbedRequest = {
  action: 'batch_process_books'
}

// Function to chunk text into smaller pieces for better embeddings
function chunkText(text: string, maxChunkSize: number = 1000, overlap: number = 100): string[] {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    let end = Math.min(start + maxChunkSize, text.length)
    
    // Try to break at sentence or paragraph boundaries
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end)
      const lastNewline = text.lastIndexOf('\n', end)
      const breakPoint = Math.max(lastPeriod, lastNewline)
      
      if (breakPoint > start + maxChunkSize * 0.5) {
        end = breakPoint + 1
      }
    }
    
    chunks.push(text.slice(start, end).trim())
    start = end - overlap
  }
  
  return chunks.filter(chunk => chunk.length > 50) // Filter out very short chunks
}

async function generateEmbedding(text: string): Promise<number[]> {
  const OPENAI_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_KEY) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002'
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI embeddings error: ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

async function storeDocumentWithEmbedding(
  title: string,
  content: string,
  sourceFile: string,
  chunkIndex: number = 0,
  metadata: Record<string, any> = {}
) {
  const embedding = await generateEmbedding(content)
  
  const { data, error } = await supabase
    .from('documents')
    .insert({
      title,
      content,
      source_file: sourceFile,
      chunk_index: chunkIndex,
      metadata,
      embedding
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to store document: ${error.message}`)
  }

  return data
}

async function processBooksFolder() {
  const booksDir = path.join(process.cwd(), 'data', 'rag_books')
  if (!fs.existsSync(booksDir)) {
    return { message: 'Books directory does not exist', processed: 0 }
  }

  const files = fs.readdirSync(booksDir)
  let processed = 0

  for (const file of files) {
    if (file === 'README.md') continue // Skip readme
    
    const filePath = path.join(booksDir, file)
    if (!fs.statSync(filePath).isFile()) continue

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const chunks = chunkText(content)
      
      // Clear existing documents from this file
      await supabase
        .from('documents')
        .delete()
        .eq('source_file', file)

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        await storeDocumentWithEmbedding(
          `${file} - Part ${i + 1}`,
          chunks[i],
          file,
          i,
          { total_chunks: chunks.length, file_size: content.length }
        )
      }
      
      processed++
      console.log(`Processed ${file}: ${chunks.length} chunks`)
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
    }
  }

  return { message: `Processed ${processed} files`, processed }
}

export async function POST(req: Request) {
  try {
    // Auth check - only teachers should be able to add/manage documents
    const sessionId = req.headers.get('x-cirvia-session') || ''
    let isAuthorized = false

    if (sessionId) {
      const session = await SupabaseAuthService.validateSession(sessionId)
      if (session && session.userRole === 'teacher') {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Only teachers can manage documents.' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()

    // Handle batch processing of books folder
    if ('action' in body && body.action === 'batch_process_books') {
      const result = await processBooksFolder()
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Handle single document embedding
    const { text, title, sourceFile, metadata }: EmbedRequest = body

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const chunks = chunkText(text)
    const results = []

    for (let i = 0; i < chunks.length; i++) {
      const result = await storeDocumentWithEmbedding(
        title || 'Untitled Document',
        chunks[i],
        sourceFile || 'api_upload',
        i,
        metadata || {}
      )
      results.push(result)
    }

    return new Response(JSON.stringify({ 
      message: 'Document processed successfully',
      chunks: results.length,
      documents: results 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Embeddings error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// GET endpoint to list stored documents
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sourceFile = url.searchParams.get('source_file')
    
    let query = supabase
      .from('documents')
      .select('id, title, source_file, chunk_index, metadata, created_at')
      .order('created_at', { ascending: false })

    if (sourceFile) {
      query = query.eq('source_file', sourceFile)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      throw new Error(`Failed to fetch documents: ${error.message}`)
    }

    return new Response(JSON.stringify({ documents: data }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}