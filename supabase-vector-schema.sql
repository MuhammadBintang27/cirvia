-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store document chunks with their embeddings
create table if not exists documents (
  id bigserial primary key,
  title text not null,
  content text not null,
  chunk_index integer not null default 0,
  source_file text,
  metadata jsonb default '{}',
  embedding vector(1536), -- OpenAI text-embedding-ada-002 produces 1536-dimensional vectors
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index for vector similarity search using cosine distance
create index if not exists documents_embedding_idx on documents 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create a function to search for similar documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count int default 5
)
returns table (
  id bigint,
  title text,
  content text,
  chunk_index integer,
  source_file text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.title,
    documents.content,
    documents.chunk_index,
    documents.source_file,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Enable RLS (Row Level Security)
alter table documents enable row level security;

-- Create a policy that allows all operations for authenticated users
create policy "Users can manage documents" on documents
  for all using (true);

-- Allow anonymous users to read documents (for public chatbot access)
create policy "Anonymous users can read documents" on documents
  for select using (true);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_documents_updated_at before update
    on documents for each row execute procedure update_updated_at_column();

-- Insert some sample documents for testing
insert into documents (title, content, source_file) values 
('Hukum Ohm', 'Hukum Ohm adalah hukum dasar dalam kelistrikan yang menyatakan bahwa besar arus listrik yang mengalir melalui suatu penghantar sebanding dengan beda potensial (tegangan) yang diberikan kepadanya dan berbanding terbalik dengan hambatan penghantar tersebut. Rumus: V = I × R, dimana V adalah tegangan (volt), I adalah arus (ampere), dan R adalah hambatan (ohm).', 'internal_kb'),
('Rangkaian Seri', 'Rangkaian seri adalah rangkaian listrik dimana komponen-komponen listrik disusun secara berurutan dalam satu jalur. Karakteristik rangkaian seri: arus sama di semua titik, tegangan terbagi pada setiap komponen, hambatan total adalah jumlah semua hambatan (Rtotal = R1 + R2 + R3...).', 'internal_kb'),
('Rangkaian Paralel', 'Rangkaian paralel adalah rangkaian listrik dimana komponen-komponen listrik disusun secara bercabang. Karakteristik rangkaian paralel: tegangan sama di semua cabang, arus terbagi pada setiap cabang, hambatan total mengikuti rumus 1/Rtotal = 1/R1 + 1/R2 + 1/R3...', 'internal_kb');