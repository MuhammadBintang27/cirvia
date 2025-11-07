# Environment Setup for CIRVIA RAG System

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# OpenAI API Key (required for GPT-4 and embeddings)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration (should already be configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase Vector Setup

1. **Enable pgvector extension** in your Supabase project:
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL script from `supabase-vector-schema.sql`

2. **Verify the setup**:
   ```sql
   -- Check if the extension is enabled
   SELECT * FROM pg_extension WHERE extname = 'vector';
   
   -- Check if the documents table exists
   SELECT * FROM documents LIMIT 1;
   ```

## Document Ingestion

1. **Add your books/documents** to the `data/rag_books/` folder:
   ```
   data/rag_books/
   ├── README.md (keep this)
   ├── electrical_circuits_basics.md
   ├── teacher_notes_chapter1.txt
   └── physics_formulas.md
   ```

2. **Process documents into embeddings**:
   
   Option A: Via API (requires teacher login)
   ```bash
   # Get teacher session token from browser localStorage after login
   curl -X POST http://localhost:3000/api/embeddings \
     -H "Content-Type: application/json" \
     -H "x-cirvia-session: your-session-token" \
     -d '{"action": "batch_process_books"}'
   ```

   Option B: Via utility script
   ```bash
   # From project root
   npx tsx src/lib/document-ingestion.ts validate
   npx tsx src/lib/document-ingestion.ts ingest <session-token>
   npx tsx src/lib/document-ingestion.ts list
   ```

## Rate Limits

Current in-memory rate limits per minute:
- **Teacher**: 120 requests
- **Student**: 30 requests  
- **Anonymous**: 10 requests

For production, consider implementing Redis-based rate limiting.

## How It Works

1. **User asks question** → ChatBot sends to `/api/chat`
2. **Generate query embedding** → OpenAI text-embedding-ada-002
3. **Vector similarity search** → Supabase pgvector with cosine distance
4. **Retrieve relevant docs** → Top 5 matches above 0.78 similarity threshold
5. **Augment prompt** → Include retrieved context in GPT-4 prompt
6. **Stream response** → GPT-4 streams answer back to client

## Troubleshooting

### No embeddings found
- Check if documents are ingested: `GET /api/embeddings`
- Verify pgvector extension is enabled in Supabase
- Lower similarity threshold in `/api/chat/route.ts`

### OpenAI errors
- Verify `OPENAI_API_KEY` is set correctly
- Check API usage limits in OpenAI dashboard
- Monitor costs (GPT-4 + embeddings can add up)

### Rate limiting
- Check browser console for 429 errors
- Increase limits in `/api/chat/route.ts` if needed
- Implement Redis for distributed rate limiting

## Cost Optimization

- **Embeddings**: ~$0.0001 per 1K tokens (one-time cost per document)
- **GPT-4**: ~$0.03 per 1K tokens (per request)
- **Vector storage**: Minimal cost in Supabase

Tips:
- Chunk documents appropriately (1000 chars max)
- Cache embeddings (don't regenerate frequently)
- Use GPT-3.5-turbo for development ($0.001 per 1K tokens)
- Set max_tokens limits in streaming requests

## Next Steps

- [ ] Implement Redis-based rate limiting
- [ ] Add document management UI for teachers
- [ ] Support file uploads directly in the admin panel
- [ ] Add document versioning and metadata
- [ ] Implement hybrid search (keyword + vector)
- [ ] Add analytics and usage monitoring