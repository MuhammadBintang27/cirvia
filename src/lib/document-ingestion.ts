import fs from 'fs'
import path from 'path'

/**
 * Document Ingestion Utility for CIRVIA RAG System
 * 
 * This script helps process and ingest documents into the vector database.
 * Run it after setting up the Supabase vector schema and adding books to data/rag_books/
 */

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3000'

async function ingestBooksFolder(sessionToken: string) {
  console.log('🚀 Starting document ingestion...')
  
  try {
    const response = await fetch(`${API_BASE}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cirvia-session': sessionToken
      },
      body: JSON.stringify({
        action: 'batch_process_books'
      })
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Ingestion failed')
    }

    console.log('✅ Ingestion completed:', result)
    return result
    
  } catch (error) {
    console.error('❌ Ingestion failed:', error)
    throw error
  }
}

async function listStoredDocuments() {
  try {
    const response = await fetch(`${API_BASE}/api/embeddings`)
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to list documents')
    }

    console.log('📚 Stored documents:')
    result.documents.forEach((doc: any) => {
      console.log(`- ${doc.title} (${doc.source_file}, chunk ${doc.chunk_index})`)
    })
    
    return result.documents
    
  } catch (error) {
    console.error('❌ Failed to list documents:', error)
    throw error
  }
}

function validateBooksFolder() {
  const booksDir = path.join(process.cwd(), 'data', 'rag_books')
  
  if (!fs.existsSync(booksDir)) {
    console.error('❌ Books directory does not exist:', booksDir)
    return false
  }

  const files = fs.readdirSync(booksDir)
    .filter(f => f !== 'README.md' && fs.statSync(path.join(booksDir, f)).isFile())
  
  if (files.length === 0) {
    console.warn('⚠️  No book files found in:', booksDir)
    console.log('   Add .txt or .md files to this directory before running ingestion.')
    return false
  }

  console.log(`📖 Found ${files.length} book files:`)
  files.forEach(f => console.log(`   - ${f}`))
  
  return true
}

// Export functions for use in other scripts
export {
  ingestBooksFolder,
  listStoredDocuments,
  validateBooksFolder
}

// CLI usage when run directly
if (require.main === module) {
  const command = process.argv[2]
  const sessionToken = process.argv[3]

  switch (command) {
    case 'validate':
      validateBooksFolder()
      break
      
    case 'ingest':
      if (!sessionToken) {
        console.error('❌ Session token required for ingestion')
        console.log('Usage: node document-ingestion.js ingest <teacher-session-token>')
        process.exit(1)
      }
      
      if (validateBooksFolder()) {
        ingestBooksFolder(sessionToken)
          .then(() => console.log('🎉 All done!'))
          .catch(() => process.exit(1))
      }
      break
      
    case 'list':
      listStoredDocuments()
        .then(() => console.log('📋 Document listing complete'))
        .catch(() => process.exit(1))
      break
      
    default:
      console.log('CIRVIA Document Ingestion Utility')
      console.log('')
      console.log('Commands:')
      console.log('  validate                     - Check if books folder exists and has files')
      console.log('  ingest <session-token>       - Process books and generate embeddings')
      console.log('  list                         - List all stored documents')
      console.log('')
      console.log('Examples:')
      console.log('  npm run ingest validate')
      console.log('  npm run ingest ingest abc123')
      console.log('  npm run ingest list')
  }
}