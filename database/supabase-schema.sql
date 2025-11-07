-- Supabase Schema untuk CIRVIA
-- Jalankan query ini di Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: teachers
CREATE TABLE IF NOT EXISTS teachers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  name varchar NOT NULL,
  phone_number varchar,
  school varchar,
  is_verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: students
CREATE TABLE IF NOT EXISTS students (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name varchar NOT NULL,
  nis varchar UNIQUE NOT NULL,
  class varchar NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  email varchar,
  phone_number varchar,
  pre_test_score numeric(5,2),
  post_test_score numeric(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL,
  user_role varchar CHECK (user_role IN ('teacher', 'student')) NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Table: test_results
CREATE TABLE IF NOT EXISTS test_results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  student_name varchar NOT NULL,
  student_nis varchar NOT NULL,
  test_type varchar CHECK (test_type IN ('pretest', 'posttest')) NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  percentage numeric(5,2) NOT NULL,
  time_spent integer NOT NULL, -- in seconds
  grade varchar NOT NULL,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  -- Constraint: One result per student per test type
  UNIQUE(student_id, test_type)
);

-- Table: test_answers
CREATE TABLE IF NOT EXISTS test_answers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  test_result_id uuid REFERENCES test_results(id) ON DELETE CASCADE,
  question_id text NOT NULL, -- Changed from integer to text to support both numeric IDs and string IDs ('conceptual-1', 'analysis-5', etc.)
  selected_answer integer NOT NULL,
  correct_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  question_text text NOT NULL,
  selected_text text NOT NULL,
  correct_text text NOT NULL,
  explanation text NOT NULL,
  question_type VARCHAR(50), -- Type of question: conceptual, circuit, circuitAnalysis, simulation
  metadata JSONB, -- Additional data specific to question type (e.g., simulation values, circuit config, tolerance checks)
  created_at timestamptz DEFAULT now()
);

-- Add comments for new columns
COMMENT ON COLUMN test_answers.question_type IS 'Type of question: conceptual, circuit, circuitAnalysis, simulation';
COMMENT ON COLUMN test_answers.metadata IS 'Additional data specific to question type (e.g., simulation values, circuit config, tolerance checks). Examples: conceptual: {"totalChoices": 5, "choiceExplanation": "..."}, circuit: {"totalConfigurations": 3}, circuitAnalysis: {"totalOptions": 4, "selectedValue": "..."}, simulation: {"tolerance": 5, "userValues": {...}, "expectedValues": {...}, "individualChecks": [...]}';

-- Update existing test_answers records to have question_type (migration)
UPDATE test_answers 
SET question_type = CASE
  WHEN question_id LIKE 'conceptual-%' THEN 'conceptual'
  WHEN question_id LIKE 'circuit-%' THEN 'circuit'
  WHEN question_id LIKE 'analysis-%' THEN 'circuitAnalysis'
  WHEN question_id LIKE 'simulation-%' THEN 'simulation'
  ELSE 'conceptual' -- default fallback
END
WHERE question_type IS NULL;

-- Table: student_progress
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  pre_test_result_id uuid REFERENCES test_results(id) ON DELETE SET NULL,
  post_test_result_id uuid REFERENCES test_results(id) ON DELETE SET NULL,
  score_improvement numeric(5,2),
  percentage_improvement numeric(5,2),
  time_improvement integer, -- in seconds
  completed_materials text[] DEFAULT '{}',
  practice_history jsonb DEFAULT '[]',
  learning_style varchar CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: learning_style_results
CREATE TABLE IF NOT EXISTS learning_style_results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  student_name varchar NOT NULL,
  student_nis varchar NOT NULL,
  visual integer NOT NULL,
  auditory integer NOT NULL,
  kinesthetic integer NOT NULL,
  primary_style varchar CHECK (primary_style IN ('visual', 'auditory', 'kinesthetic')) NOT NULL,
  percentages jsonb NOT NULL, -- {visual: 40, auditory: 35, kinesthetic: 25}
  time_spent integer NOT NULL, -- in seconds
  answers text[] NOT NULL, -- Array of 'a', 'b', 'c' answers
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  -- Constraint: One result per student (allow retake by deleting previous)
  UNIQUE(student_id)
);

-- Table: ai_feedback_history (Menyimpan riwayat feedback AI untuk setiap siswa)
CREATE TABLE IF NOT EXISTS ai_feedback_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  test_result_id uuid REFERENCES test_results(id) ON DELETE CASCADE,
  learning_style_result_id uuid REFERENCES learning_style_results(id) ON DELETE SET NULL,
  feedback_type varchar(20) CHECK (feedback_type IN ('post_learning_style', 'post_pretest', 'post_posttest')),
  
  -- Feedback content
  title varchar(255) NOT NULL,
  summary text NOT NULL,
  recommendations jsonb NOT NULL,
  next_steps text[] NOT NULL,
  motivational_message text NOT NULL,
  
  -- Context data used for generation
  context_data jsonb NOT NULL, -- Complete context sent to AI
  ai_prompt text, -- Generated prompt for AI
  
  -- Engagement tracking
  viewed_at timestamptz,
  viewed_full_report boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

-- Table: questions (Base table for all question metadata)
CREATE TABLE IF NOT EXISTS questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  question_type varchar CHECK (question_type IN ('circuit', 'conceptual', 'circuitAnalysis', 'circuitOrdering')) NOT NULL,
  title varchar NOT NULL,
  difficulty varchar CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  tags text[] DEFAULT '{}', -- Array of tags for categorization
  
  -- Metadata
  usage_count integer DEFAULT 0, -- How many times this question has been used
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: circuit_questions (TipeSoal1 - Circuit questions)
CREATE TABLE IF NOT EXISTS circuit_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  circuit_type varchar CHECK (circuit_type IN ('series', 'parallel')) NOT NULL,
  voltage integer NOT NULL,
  target_current numeric(10,4),
  target_voltage numeric(10,4), 
  resistor_slots integer NOT NULL,
  available_resistors integer[] NOT NULL, -- Array of available resistor values
  correct_solution integer[] NOT NULL, -- Array of correct resistor values
  description text NOT NULL,
  explanation text NOT NULL,
  hint text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: conceptual_questions (TipeSoal3 - Conceptual questions) 
CREATE TABLE IF NOT EXISTS conceptual_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  question text NOT NULL,
  explanation text NOT NULL,
  hint text,
  is_multiple_choice boolean DEFAULT true,
  choices jsonb NOT NULL, -- Array of choice objects: [{"id": "a", "text": "Choice A", "isCorrect": false}]
  correct_answers text[] NOT NULL, -- Array of correct choice IDs: ["a", "c"]
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: circuit_analysis_questions (TipeSoal2 - Circuit analysis questions)
CREATE TABLE IF NOT EXISTS circuit_analysis_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  circuit_template varchar NOT NULL, -- Template name or circuit config
  broken_component varchar NOT NULL, -- Which component is broken/analyzed
  question text NOT NULL,
  explanation text NOT NULL,
  hint text,
  choices jsonb NOT NULL, -- Array of choice objects
  correct_answers text[] NOT NULL, -- Array of correct choice IDs
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: circuit_ordering_questions (TipeSoal4 - Circuit ordering questions)
CREATE TABLE IF NOT EXISTS circuit_ordering_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE UNIQUE,
  ordering_type varchar CHECK (ordering_type IN ('current', 'voltage', 'resistance', 'power', 'brightness')) NOT NULL,
  question text NOT NULL,
  explanation text NOT NULL,
  hint text,
  circuit_items jsonb NOT NULL, -- Array of circuits/components to order
  correct_order integer[] NOT NULL, -- Correct order (0-based indices)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: question_banks
CREATE TABLE IF NOT EXISTS question_banks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  description text,
  question_ids uuid[] DEFAULT '{}', -- Array of question IDs
  is_public boolean DEFAULT false, -- Whether other teachers can use this bank
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: custom_tests (for tests created by teachers using their questions)
CREATE TABLE IF NOT EXISTS custom_tests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description text,
  question_ids uuid[] NOT NULL, -- Array of question IDs to include in test
  time_limit integer, -- Time limit in minutes
  is_active boolean DEFAULT true,
  test_type varchar CHECK (test_type IN ('practice', 'quiz', 'exam')) DEFAULT 'quiz',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: custom_test_results (results for custom tests)
CREATE TABLE IF NOT EXISTS custom_test_results (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  test_id uuid REFERENCES custom_tests(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  student_name varchar NOT NULL,
  student_nis varchar NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  percentage numeric(5,2) NOT NULL,
  time_spent integer NOT NULL, -- in seconds
  answers jsonb NOT NULL, -- Array of answers with question_id, selected_answer, is_correct
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  -- Constraint: One result per student per test (allow retake by updating)
  UNIQUE(test_id, student_id)
);

-- Table: question_packages (paket soal untuk pretest/posttest)
CREATE TABLE IF NOT EXISTS question_packages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  description text,
  package_type varchar CHECK (package_type IN ('pretest', 'posttest', 'practice', 'quiz')) NOT NULL,
  question_ids uuid[] NOT NULL, -- Array of question IDs
  time_limit integer, -- Time limit in minutes
  is_default boolean DEFAULT false, -- Default system package
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: class_packages (assignment paket soal ke kelas)
CREATE TABLE IF NOT EXISTS class_packages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  class_name varchar NOT NULL,
  pretest_package_id uuid REFERENCES question_packages(id) ON DELETE SET NULL,
  posttest_package_id uuid REFERENCES question_packages(id) ON DELETE SET NULL,
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint: One assignment per teacher per class
  UNIQUE(teacher_id, class_name)
);

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(teacher_id, class);
CREATE INDEX IF NOT EXISTS idx_test_results_student_id ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_test_results_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_answers_result_id ON test_answers(test_result_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_question_type ON test_answers(question_type);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, user_role);
CREATE INDEX IF NOT EXISTS idx_learning_style_student_id ON learning_style_results(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_style_primary ON learning_style_results(primary_style);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_student_id ON ai_feedback_history(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_test_result_id ON ai_feedback_history(test_result_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_type ON ai_feedback_history(feedback_type);

-- Indexes untuk questions dan related tables
CREATE INDEX IF NOT EXISTS idx_questions_teacher_id ON questions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);

-- Indexes untuk specific question type tables
CREATE INDEX IF NOT EXISTS idx_circuit_questions_question_id ON circuit_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_circuit_questions_type ON circuit_questions(circuit_type);
CREATE INDEX IF NOT EXISTS idx_conceptual_questions_question_id ON conceptual_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_circuit_analysis_questions_question_id ON circuit_analysis_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_circuit_ordering_questions_question_id ON circuit_ordering_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_circuit_ordering_questions_type ON circuit_ordering_questions(ordering_type);
CREATE INDEX IF NOT EXISTS idx_question_banks_teacher_id ON question_banks(teacher_id);
CREATE INDEX IF NOT EXISTS idx_question_banks_public ON question_banks(is_public);
CREATE INDEX IF NOT EXISTS idx_custom_tests_teacher_id ON custom_tests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_custom_tests_active ON custom_tests(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_test_results_test_id ON custom_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_custom_test_results_student_id ON custom_test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_question_packages_teacher_id ON question_packages(teacher_id);
CREATE INDEX IF NOT EXISTS idx_question_packages_type ON question_packages(package_type);
CREATE INDEX IF NOT EXISTS idx_question_packages_default ON question_packages(is_default);
CREATE INDEX IF NOT EXISTS idx_class_packages_teacher_id ON class_packages(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_packages_class ON class_packages(class_name);

-- Functions untuk auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers untuk auto-update updated_at
CREATE TRIGGER update_teachers_updated_at 
    BEFORE UPDATE ON teachers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at 
    BEFORE UPDATE ON student_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circuit_questions_updated_at 
    BEFORE UPDATE ON circuit_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conceptual_questions_updated_at 
    BEFORE UPDATE ON conceptual_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circuit_analysis_questions_updated_at 
    BEFORE UPDATE ON circuit_analysis_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_circuit_ordering_questions_updated_at 
    BEFORE UPDATE ON circuit_ordering_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_banks_updated_at 
    BEFORE UPDATE ON question_banks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_tests_updated_at 
    BEFORE UPDATE ON custom_tests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_packages_updated_at 
    BEFORE UPDATE ON question_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_packages_updated_at 
    BEFORE UPDATE ON class_packages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_style_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conceptual_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_analysis_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_ordering_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_packages ENABLE ROW LEVEL SECURITY;

-- Policies for teachers table
CREATE POLICY "Teachers can view own data" 
  ON teachers FOR SELECT 
  USING (true); -- Allow all for now, can be restricted later

CREATE POLICY "Teachers can update own data" 
  ON teachers FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can create teacher accounts" 
  ON teachers FOR INSERT 
  WITH CHECK (true);

-- Policies for students table
CREATE POLICY "Teachers can manage their students" 
  ON students FOR ALL 
  USING (true); -- Simplified for demo

-- Policies for other tables
CREATE POLICY "Allow all operations" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON test_results FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON test_answers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON student_progress FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON learning_style_results FOR ALL USING (true);

-- Policies for questions tables
CREATE POLICY "Teachers can manage own questions" 
  ON questions FOR ALL 
  USING (true); -- Simplified for demo, can be restricted to teacher_id

-- Policies for specific question type tables
CREATE POLICY "Teachers can manage circuit questions" 
  ON circuit_questions FOR ALL 
  USING (true);

CREATE POLICY "Teachers can manage conceptual questions" 
  ON conceptual_questions FOR ALL 
  USING (true);

CREATE POLICY "Teachers can manage circuit analysis questions" 
  ON circuit_analysis_questions FOR ALL 
  USING (true);

CREATE POLICY "Teachers can manage circuit ordering questions" 
  ON circuit_ordering_questions FOR ALL 
  USING (true);

CREATE POLICY "Teachers can view public question banks" 
  ON question_banks FOR SELECT 
  USING (is_public = true OR true); -- Allow all for demo

CREATE POLICY "Teachers can manage own question banks" 
  ON question_banks FOR ALL 
  USING (true); -- Simplified for demo

CREATE POLICY "Teachers can manage own custom tests" 
  ON custom_tests FOR ALL 
  USING (true); -- Simplified for demo

CREATE POLICY "Allow custom test results operations" 
  ON custom_test_results FOR ALL 
  USING (true); -- Simplified for demo

-- Policies for question packages tables
CREATE POLICY "Teachers can manage own question packages" 
  ON question_packages FOR ALL 
  USING (true); -- Simplified for demo

CREATE POLICY "Teachers can manage own class packages" 
  ON class_packages FOR ALL 
  USING (true); -- Simplified for demo

-- Insert default teacher account
INSERT INTO teachers (email, password_hash, name, school, phone_number, is_verified)
VALUES (
  'guru@cirvia.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
  'Guru Demo',
  'SMA Demo',
  '081234567890',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert default question packages (system default)
-- Note: question_ids will be empty initially, can be populated later
INSERT INTO question_packages (id, teacher_id, name, description, package_type, question_ids, time_limit, is_default, is_active)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM teachers WHERE email = 'guru@cirvia.com' LIMIT 1),
    'Paket Pretest Default',
    'Paket soal pretest default yang disediakan sistem untuk menguji pemahaman awal siswa tentang rangkaian listrik',
    'pretest',
    '{}', -- Will be populated with actual question IDs
    30, -- 30 minutes
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM teachers WHERE email = 'guru@cirvia.com' LIMIT 1),
    'Paket Posttest Default',
    'Paket soal posttest default yang disediakan sistem untuk menguji pemahaman akhir siswa setelah pembelajaran',
    'posttest',
    '{}', -- Will be populated with actual question IDs
    45, -- 45 minutes
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Function untuk cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- View untuk student progress yang lengkap
CREATE OR REPLACE VIEW student_progress_view AS
SELECT 
  s.id,
  s.name,
  s.nis,
  s.class,
  s.teacher_id,
  s.pre_test_score,
  s.post_test_score,
  CASE 
    WHEN s.pre_test_score IS NOT NULL AND s.post_test_score IS NOT NULL 
    THEN s.post_test_score - s.pre_test_score 
  END as score_improvement,
  CASE 
    WHEN s.pre_test_score IS NOT NULL AND s.post_test_score IS NOT NULL AND s.pre_test_score > 0
    THEN ((s.post_test_score - s.pre_test_score) / s.pre_test_score) * 100 
  END as percentage_improvement,
  CASE 
    WHEN s.pre_test_score IS NOT NULL AND s.post_test_score IS NULL 
    THEN 'pretest_only'
    WHEN s.pre_test_score IS NULL AND s.post_test_score IS NOT NULL 
    THEN 'posttest_only'
    WHEN s.pre_test_score IS NOT NULL AND s.post_test_score IS NOT NULL 
    THEN 'completed'
    ELSE 'not_started'
  END as progress_status,
  s.created_at,
  s.updated_at
FROM students s;

COMMENT ON TABLE teachers IS 'Tabel untuk menyimpan data guru/teacher';
COMMENT ON TABLE students IS 'Tabel untuk menyimpan data siswa';
COMMENT ON TABLE sessions IS 'Tabel untuk menyimpan session login';
COMMENT ON TABLE test_results IS 'Tabel untuk menyimpan hasil test (pretest/posttest)';
COMMENT ON TABLE test_answers IS 'Tabel untuk menyimpan jawaban detail setiap soal';
COMMENT ON TABLE student_progress IS 'Tabel untuk tracking progress siswa';
COMMENT ON TABLE learning_style_results IS 'Tabel untuk menyimpan hasil tes gaya belajar siswa';
COMMENT ON TABLE questions IS 'Tabel untuk menyimpan metadata soal-soal yang dibuat guru';
COMMENT ON TABLE circuit_questions IS 'Tabel untuk menyimpan soal rangkaian listrik (TipeSoal1)';
COMMENT ON TABLE conceptual_questions IS 'Tabel untuk menyimpan soal konseptual (TipeSoal3)';
COMMENT ON TABLE circuit_analysis_questions IS 'Tabel untuk menyimpan soal analisis rangkaian (TipeSoal2)';
COMMENT ON TABLE circuit_ordering_questions IS 'Tabel untuk menyimpan soal pengurutan rangkaian (TipeSoal4)';
COMMENT ON TABLE question_banks IS 'Tabel untuk menyimpan kumpulan soal dalam bank soal';
COMMENT ON TABLE custom_tests IS 'Tabel untuk menyimpan tes custom yang dibuat guru';
COMMENT ON TABLE custom_test_results IS 'Tabel untuk menyimpan hasil tes custom siswa';
COMMENT ON TABLE question_packages IS 'Tabel untuk menyimpan paket soal pretest/posttest';
COMMENT ON TABLE class_packages IS 'Tabel untuk assignment paket soal ke kelas tertentu';

-- ========================================
-- RAG (Retrieval-Augmented Generation) & AI Analysis Tables
-- ========================================

-- Table: knowledge_base (untuk menyimpan knowledge base/materi pembelajaran)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title varchar NOT NULL,
  content text NOT NULL,
  category varchar CHECK (category IN ('basic_concepts', 'ohms_law', 'series_circuits', 'parallel_circuits', 'power_electricity', 'circuit_analysis', 'practical_examples', 'common_mistakes', 'formulas', 'definitions')) NOT NULL,
  subcategory varchar,
  tags text[] DEFAULT '{}', -- Array of tags for better categorization
  difficulty_level varchar CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  
  -- RAG specific fields
  content_vector text, -- Vector embedding untuk semantic search (akan diisi manual atau via API)
  keywords text[] DEFAULT '{}', -- Keywords untuk traditional search
  search_metadata jsonb DEFAULT '{}', -- Additional metadata untuk search optimization
  
  -- Content structure
  content_type varchar CHECK (content_type IN ('concept', 'formula', 'example', 'explanation', 'procedure', 'tip', 'warning')) NOT NULL,
  related_topics text[] DEFAULT '{}', -- Related knowledge base IDs atau topics
  
  -- Usage tracking
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  effectiveness_score numeric(3,2) DEFAULT 0.0, -- Based on user feedback/interaction
  
  -- Content management
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false, -- Content quality verification
  created_by varchar DEFAULT 'system', -- 'system', 'teacher', 'ai_generated'
  source_reference varchar, -- Reference to original source material
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chat_conversations (untuk menyimpan percakapan AI)
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid, -- Could be student or teacher (nullable untuk anonymous)
  user_type varchar CHECK (user_type IN ('student', 'teacher', 'anonymous')) NOT NULL,
  session_id varchar, -- Browser session untuk anonymous users
  
  -- Conversation metadata
  title varchar, -- Auto-generated atau user-defined conversation title
  context_type varchar CHECK (context_type IN ('general', 'specific_topic', 'problem_solving', 'homework_help', 'concept_clarification')) DEFAULT 'general',
  current_topic varchar, -- Current topic being discussed
  
  -- RAG context
  active_knowledge_ids uuid[] DEFAULT '{}', -- Currently relevant knowledge base entries
  conversation_summary text, -- Summary of conversation context
  
  -- Conversation state
  is_active boolean DEFAULT true,
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: chat_messages (untuk menyimpan pesan individual)
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  
  -- Message content
  message_text text NOT NULL,
  message_type varchar CHECK (message_type IN ('user', 'assistant', 'system')) NOT NULL,
  
  -- RAG specific data
  retrieved_knowledge_ids uuid[] DEFAULT '{}', -- Knowledge base entries used untuk response ini
  knowledge_relevance_scores numeric[] DEFAULT '{}', -- Relevance scores untuk setiap retrieved knowledge
  message_context text, -- Message context atau embedding info
  
  -- AI response metadata (untuk assistant messages)
  ai_model varchar, -- e.g., 'gpt-4', 'gpt-3.5-turbo'
  response_confidence numeric(3,2), -- AI confidence dalam response
  generation_method varchar CHECK (generation_method IN ('direct', 'rag', 'hybrid')) DEFAULT 'rag',
  processing_time_ms integer, -- Response generation time
  
  -- Content analysis
  sentiment varchar CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  topics_detected text[] DEFAULT '{}', -- Topics detected dalam message
  question_type varchar CHECK (question_type IN ('conceptual', 'procedural', 'factual', 'analytical', 'creative')),
  
  -- User interaction
  user_rating integer CHECK (user_rating BETWEEN 1 AND 5), -- User rating untuk AI responses
  user_feedback text, -- User feedback pada response
  is_helpful boolean, -- User marked as helpful/not helpful
  
  -- System metadata
  token_count integer, -- Token count untuk message
  created_at timestamptz DEFAULT now()
);

-- Table: ai_analysis_sessions (untuk sesi analisis AI terhadap performance siswa)
CREATE TABLE IF NOT EXISTS ai_analysis_sessions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Subject of analysis
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  analysis_type varchar CHECK (analysis_type IN ('performance', 'learning_pattern', 'knowledge_gap', 'progress_tracking', 'personalized_recommendation')) NOT NULL,
  
  -- Analysis scope
  scope_type varchar CHECK (scope_type IN ('individual', 'class', 'comparative')) DEFAULT 'individual',
  time_period_start timestamptz,
  time_period_end timestamptz,
  
  -- Data sources used untuk analysis
  data_sources jsonb NOT NULL, -- {test_results: true, chat_history: true, learning_style: true, etc.}
  test_result_ids uuid[] DEFAULT '{}', -- Specific test results analyzed
  conversation_ids uuid[] DEFAULT '{}', -- Chat conversations analyzed
  
  -- AI Analysis results
  analysis_summary text NOT NULL, -- AI-generated summary
  key_insights jsonb NOT NULL, -- Structured insights: {strengths: [], weaknesses: [], patterns: []}
  recommendations jsonb NOT NULL, -- AI recommendations: {study_plan: [], resources: [], focus_areas: []}
  confidence_scores jsonb NOT NULL, -- Confidence dalam various analysis aspects
  
  -- Performance metrics detected
  learning_patterns jsonb DEFAULT '{}', -- Detected learning patterns
  knowledge_gaps text[] DEFAULT '{}', -- Identified knowledge gaps
  strength_areas text[] DEFAULT '{}', -- Student's strong areas
  improvement_suggestions text[] DEFAULT '{}', -- Specific improvement suggestions
  
  -- Analysis metadata
  ai_model varchar NOT NULL, -- AI model used untuk analysis
  processing_time_ms integer,
  total_data_points integer, -- Number of data points analyzed
  analysis_quality_score numeric(3,2), -- Internal quality assessment
  
  -- Follow-up tracking
  recommendations_applied jsonb DEFAULT '{}', -- Which recommendations were applied
  follow_up_required boolean DEFAULT false,
  next_analysis_suggested_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: learning_recommendations (untuk menyimpan rekomendasi pembelajaran yang dipersonalisasi)
CREATE TABLE IF NOT EXISTS learning_recommendations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  analysis_session_id uuid REFERENCES ai_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Recommendation details
  recommendation_type varchar CHECK (recommendation_type IN ('study_material', 'practice_problem', 'concept_review', 'skill_building', 'remedial_action')) NOT NULL,
  title varchar NOT NULL,
  description text NOT NULL,
  
  -- Content references
  knowledge_base_ids uuid[] DEFAULT '{}', -- Related knowledge base entries
  question_ids uuid[] DEFAULT '{}', -- Recommended practice questions
  external_resources jsonb DEFAULT '{}', -- External learning resources
  
  -- Personalization data
  difficulty_level varchar CHECK (difficulty_level IN ('easy', 'medium', 'hard')) NOT NULL,
  estimated_time_minutes integer, -- Estimated time to complete
  learning_style_alignment varchar CHECK (learning_style_alignment IN ('visual', 'auditory', 'kinesthetic', 'mixed')),
  priority_level varchar CHECK (priority_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
  
  -- Progress tracking
  status varchar CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Effectiveness tracking
  user_rating integer CHECK (user_rating BETWEEN 1 AND 5),
  user_feedback text,
  effectiveness_score numeric(3,2), -- Based on subsequent performance
  
  -- Scheduling
  suggested_start_date timestamptz,
  due_date timestamptz,
  reminder_sent_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table: semantic_search_logs (untuk tracking search queries dan performance)
CREATE TABLE IF NOT EXISTS semantic_search_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Search context
  user_id uuid, -- Optional, untuk anonymous users bisa null
  user_type varchar CHECK (user_type IN ('student', 'teacher', 'anonymous')),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  
  -- Search details
  query_text text NOT NULL,
  query_context text, -- Query context atau embedding info
  search_type varchar CHECK (search_type IN ('semantic', 'keyword', 'hybrid')) NOT NULL,
  
  -- Results
  results_found integer NOT NULL,
  retrieved_knowledge_ids uuid[] DEFAULT '{}',
  relevance_scores numeric[] DEFAULT '{}',
  top_result_score numeric(5,4),
  
  -- Performance metrics
  search_duration_ms integer,
  processing_time_ms integer,
  
  -- User interaction dengan results
  clicked_result_ids uuid[] DEFAULT '{}', -- Which results user interacted with
  user_satisfaction integer CHECK (user_satisfaction BETWEEN 1 AND 5), -- Optional user rating
  
  created_at timestamptz DEFAULT now()
);

-- Table: ai_model_usage (untuk tracking penggunaan model AI dan costs)
CREATE TABLE IF NOT EXISTS ai_model_usage (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Usage context
  user_id uuid,
  user_type varchar CHECK (user_type IN ('student', 'teacher', 'system')),
  operation_type varchar CHECK (operation_type IN ('chat_response', 'analysis', 'embedding', 'search', 'recommendation')) NOT NULL,
  
  -- Model details
  ai_model varchar NOT NULL, -- e.g., 'gpt-4', 'text-embedding-ada-002'
  model_version varchar,
  
  -- Usage metrics
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  processing_time_ms integer,
  
  -- Cost tracking (if applicable)
  estimated_cost_usd numeric(10,6),
  
  -- Context IDs untuk reference
  conversation_id uuid,
  analysis_session_id uuid,
  message_id uuid,
  
  -- Quality metrics
  success boolean DEFAULT true,
  error_message text,
  quality_score numeric(3,2), -- Internal quality assessment
  
  created_at timestamptz DEFAULT now()
);

-- Table: student_learning_analytics (untuk advanced analytics student behavior)
CREATE TABLE IF NOT EXISTS student_learning_analytics (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  
  -- Time-based analytics
  analysis_date date NOT NULL,
  week_number integer, -- Week dalam semester
  month_number integer, -- Month dalam year
  
  -- Learning behavior metrics
  study_session_count integer DEFAULT 0,
  total_study_time_minutes integer DEFAULT 0,
  avg_session_duration_minutes numeric(8,2),
  chat_interactions_count integer DEFAULT 0,
  questions_asked_count integer DEFAULT 0,
  
  -- Performance metrics
  quiz_attempts integer DEFAULT 0,
  quiz_average_score numeric(5,2),
  improvement_rate numeric(5,2), -- Week-over-week improvement
  consistency_score numeric(3,2), -- How consistent student's performance
  
  -- Engagement metrics
  material_pages_viewed integer DEFAULT 0,
  video_watch_time_minutes integer DEFAULT 0,
  practice_problems_attempted integer DEFAULT 0,
  help_requests_count integer DEFAULT 0,
  
  -- Learning pattern insights
  preferred_study_time varchar, -- 'morning', 'afternoon', 'evening', 'night'
  most_active_day varchar, -- Day of week
  learning_velocity numeric(5,2), -- Concepts learned per week
  retention_rate numeric(3,2), -- How well student retains information
  
  -- AI-generated insights
  behavior_patterns jsonb DEFAULT '{}',
  learning_recommendations jsonb DEFAULT '{}',
  risk_indicators jsonb DEFAULT '{}', -- Early warning indicators
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint: One record per student per date
  UNIQUE(student_id, analysis_date)
);

-- ========================================
-- Additional Indexes untuk RAG dan AI Tables
-- ========================================

-- Indexes untuk knowledge_base
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_difficulty ON knowledge_base(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_active ON knowledge_base(is_active);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_keywords ON knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_type ON knowledge_base(content_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_usage_count ON knowledge_base(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_effectiveness ON knowledge_base(effectiveness_score DESC);

-- Indexes untuk chat_conversations
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user ON chat_conversations(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_active ON chat_conversations(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message ON chat_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_context_type ON chat_conversations(context_type);

-- Indexes untuk chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_type ON chat_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_rating ON chat_messages(user_rating);
CREATE INDEX IF NOT EXISTS idx_chat_messages_helpful ON chat_messages(is_helpful);
CREATE INDEX IF NOT EXISTS idx_chat_messages_topics ON chat_messages USING GIN(topics_detected);

-- Indexes untuk ai_analysis_sessions
CREATE INDEX IF NOT EXISTS idx_ai_analysis_student ON ai_analysis_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_teacher ON ai_analysis_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_type ON ai_analysis_sessions(analysis_type);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_created_at ON ai_analysis_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_follow_up ON ai_analysis_sessions(follow_up_required);

-- Indexes untuk learning_recommendations
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_student ON learning_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_analysis ON learning_recommendations(analysis_session_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_type ON learning_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_status ON learning_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_priority ON learning_recommendations(priority_level);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_due_date ON learning_recommendations(due_date);

-- Indexes untuk semantic_search_logs
CREATE INDEX IF NOT EXISTS idx_semantic_search_user ON semantic_search_logs(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_semantic_search_conversation ON semantic_search_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_semantic_search_created_at ON semantic_search_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_semantic_search_type ON semantic_search_logs(search_type);
CREATE INDEX IF NOT EXISTS idx_semantic_search_performance ON semantic_search_logs(search_duration_ms);

-- Indexes untuk ai_model_usage
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_user ON ai_model_usage(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_operation ON ai_model_usage(operation_type);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_model ON ai_model_usage(ai_model);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_created_at ON ai_model_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_tokens ON ai_model_usage(total_tokens DESC);
CREATE INDEX IF NOT EXISTS idx_ai_model_usage_cost ON ai_model_usage(estimated_cost_usd DESC);

-- Indexes untuk student_learning_analytics
CREATE INDEX IF NOT EXISTS idx_student_learning_analytics_student ON student_learning_analytics(student_id);
CREATE INDEX IF NOT EXISTS idx_student_learning_analytics_date ON student_learning_analytics(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_student_learning_analytics_week ON student_learning_analytics(week_number);
CREATE INDEX IF NOT EXISTS idx_student_learning_analytics_month ON student_learning_analytics(month_number);

-- ========================================
-- Additional Triggers untuk RAG Tables
-- ========================================

CREATE TRIGGER update_knowledge_base_updated_at 
    BEFORE UPDATE ON knowledge_base 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_analysis_sessions_updated_at 
    BEFORE UPDATE ON ai_analysis_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_recommendations_updated_at 
    BEFORE UPDATE ON learning_recommendations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_learning_analytics_updated_at 
    BEFORE UPDATE ON student_learning_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Row Level Security untuk RAG Tables
-- ========================================

ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_learning_analytics ENABLE ROW LEVEL SECURITY;

-- Basic policies (dapat direfinement sesuai kebutuhan spesifik)
CREATE POLICY "Allow all operations on knowledge_base" ON knowledge_base FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_conversations" ON chat_conversations FOR ALL USING (true);
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_analysis_sessions" ON ai_analysis_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on learning_recommendations" ON learning_recommendations FOR ALL USING (true);
CREATE POLICY "Allow all operations on semantic_search_logs" ON semantic_search_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_model_usage" ON ai_model_usage FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_learning_analytics" ON student_learning_analytics FOR ALL USING (true);

-- ========================================
-- Functions untuk RAG Operations
-- ========================================

-- Function untuk update usage statistics knowledge base
CREATE OR REPLACE FUNCTION update_knowledge_usage(kb_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE knowledge_base 
  SET usage_count = usage_count + 1,
      last_used_at = now()
  WHERE id = kb_id;
END;
$$ LANGUAGE plpgsql;

-- Function untuk calculate conversation context
CREATE OR REPLACE FUNCTION update_conversation_context(conv_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE chat_conversations 
  SET message_count = (
    SELECT COUNT(*) FROM chat_messages WHERE conversation_id = conv_id
  ),
  last_message_at = (
    SELECT MAX(created_at) FROM chat_messages WHERE conversation_id = conv_id
  )
  WHERE id = conv_id;
END;
$$ LANGUAGE plpgsql;

-- Function untuk cleanup old conversations
CREATE OR REPLACE FUNCTION cleanup_old_conversations(days_old integer DEFAULT 90)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM chat_conversations 
  WHERE last_message_at < (now() - interval '1 day' * days_old)
    AND is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function untuk generate learning analytics
CREATE OR REPLACE FUNCTION generate_daily_learning_analytics(target_date date DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO student_learning_analytics (
    student_id, 
    analysis_date, 
    week_number, 
    month_number,
    chat_interactions_count,
    questions_asked_count
  )
  SELECT 
    cc.user_id,
    target_date,
    EXTRACT(WEEK FROM target_date)::integer,
    EXTRACT(MONTH FROM target_date)::integer,
    COUNT(DISTINCT cc.id) as chat_interactions,
    COUNT(cm.id) FILTER (WHERE cm.message_type = 'user') as questions_asked
  FROM chat_conversations cc
  LEFT JOIN chat_messages cm ON cc.id = cm.conversation_id
  WHERE cc.user_type = 'student' 
    AND cc.user_id IS NOT NULL
    AND DATE(cc.created_at) = target_date
  GROUP BY cc.user_id
  ON CONFLICT (student_id, analysis_date) 
  DO UPDATE SET 
    chat_interactions_count = EXCLUDED.chat_interactions_count,
    questions_asked_count = EXCLUDED.questions_asked_count,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- Views untuk RAG Analytics
-- ========================================

-- View untuk popular knowledge base entries
CREATE OR REPLACE VIEW popular_knowledge_base AS
SELECT 
  kb.id,
  kb.title,
  kb.category,
  kb.subcategory,
  kb.usage_count,
  kb.effectiveness_score,
  kb.last_used_at,
  kb.created_at
FROM knowledge_base kb
WHERE kb.is_active = true
ORDER BY kb.usage_count DESC, kb.effectiveness_score DESC;

-- View untuk chat analytics
CREATE OR REPLACE VIEW chat_analytics AS
SELECT 
  DATE(cc.created_at) as chat_date,
  cc.user_type,
  cc.context_type,
  COUNT(*) as conversation_count,
  AVG(cc.message_count) as avg_messages_per_conversation,
  COUNT(CASE WHEN cc.is_active THEN 1 END) as active_conversations
FROM chat_conversations cc
GROUP BY DATE(cc.created_at), cc.user_type, cc.context_type
ORDER BY chat_date DESC;

-- View untuk AI model usage analytics
CREATE OR REPLACE VIEW ai_usage_analytics AS
SELECT 
  DATE(amu.created_at) as usage_date,
  amu.ai_model,
  amu.operation_type,
  COUNT(*) as request_count,
  SUM(amu.total_tokens) as total_tokens,
  AVG(amu.processing_time_ms) as avg_processing_time,
  SUM(amu.estimated_cost_usd) as total_estimated_cost
FROM ai_model_usage amu
WHERE amu.success = true
GROUP BY DATE(amu.created_at), amu.ai_model, amu.operation_type
ORDER BY usage_date DESC;

-- View untuk student learning insights
CREATE OR REPLACE VIEW student_learning_insights AS
SELECT 
  s.id as student_id,
  s.name as student_name,
  s.class,
  sla.analysis_date,
  sla.chat_interactions_count,
  sla.questions_asked_count,
  sla.study_session_count,
  sla.total_study_time_minutes,
  sla.consistency_score,
  sla.learning_velocity,
  sla.preferred_study_time,
  sla.behavior_patterns,
  sla.risk_indicators
FROM students s
JOIN student_learning_analytics sla ON s.id = sla.student_id
ORDER BY sla.analysis_date DESC, s.name;

-- ========================================
-- Sample Data untuk Knowledge Base
-- ========================================

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (title, content, category, subcategory, content_type, difficulty_level, keywords, tags, is_active, is_verified, created_by) VALUES
  (
    'Hukum Ohm - Konsep Dasar',
    'Hukum Ohm menyatakan bahwa arus listrik (I) yang mengalir dalam suatu penghantar berbanding lurus dengan tegangan (V) dan berbanding terbalik dengan hambatan (R). Rumus matematisnya adalah V = I × R. Hukum ini sangat fundamental dalam analisis rangkaian listrik.',
    'ohms_law',
    'basic_theory',
    'concept',
    'beginner',
    ARRAY['hukum ohm', 'arus', 'tegangan', 'hambatan', 'rumus'],
    ARRAY['fundamental', 'basic', 'formula'],
    true,
    true,
    'system'
  ),
  (
    'Rangkaian Seri - Karakteristik',
    'Dalam rangkaian seri, komponen-komponen dihubungkan secara berurutan sehingga arus yang mengalir sama di semua komponen. Hambatan total adalah penjumlahan semua hambatan: Rtotal = R1 + R2 + R3 + ... Tegangan total dibagi sesuai dengan besar hambatan masing-masing komponen.',
    'series_circuits',
    'characteristics',
    'concept',
    'beginner',
    ARRAY['rangkaian seri', 'hambatan total', 'arus sama', 'tegangan terbagi'],
    ARRAY['series', 'circuit', 'resistance'],
    true,
    true,
    'system'
  ),
  (
    'Rangkaian Paralel - Karakteristik',
    'Dalam rangkaian paralel, komponen-komponen dihubungkan secara bercabang sehingga tegangan sama di semua cabang. Untuk hambatan total: 1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ... Arus total adalah penjumlahan arus di setiap cabang.',
    'parallel_circuits',
    'characteristics',
    'concept',
    'beginner',
    ARRAY['rangkaian paralel', 'tegangan sama', 'arus terbagi', 'hambatan paralel'],
    ARRAY['parallel', 'circuit', 'voltage'],
    true,
    true,
    'system'
  ),
  (
    'Daya Listrik - Rumus dan Aplikasi',
    'Daya listrik (P) adalah energi listrik yang digunakan per satuan waktu. Rumus dasar: P = V × I. Rumus alternatif: P = I² × R atau P = V²/R. Satuan daya adalah Watt (W). Dalam kehidupan sehari-hari, daya menentukan seberapa cepat alat listrik menggunakan energi.',
    'power_electricity',
    'formulas',
    'concept',
    'beginner',
    ARRAY['daya listrik', 'watt', 'energi', 'rumus daya'],
    ARRAY['power', 'energy', 'formula'],
    true,
    true,
    'system'
  ),
  (
    'Kesalahan Umum dalam Analisis Rangkaian',
    'Kesalahan yang sering terjadi: 1) Menggunakan rumus rangkaian seri untuk paralel atau sebaliknya, 2) Salah menghitung hambatan total paralel, 3) Tidak memperhatikan arah arus, 4) Mengabaikan hukum Kirchhoff, 5) Salah mengkonversi satuan. Selalu periksa kembali jenis rangkaian sebelum menghitung.',
    'common_mistakes',
    'analysis_errors',
    'tip',
    'intermediate',
    ARRAY['kesalahan', 'analisis rangkaian', 'tips', 'hindari'],
    ARRAY['mistakes', 'tips', 'analysis'],
    true,
    true,
    'system'
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- Comments untuk RAG Tables
-- ========================================

COMMENT ON TABLE knowledge_base IS 'Tabel untuk menyimpan knowledge base/materi pembelajaran dengan vector embeddings untuk RAG';
COMMENT ON TABLE chat_conversations IS 'Tabel untuk menyimpan percakapan AI dengan konteks dan embeddings';
COMMENT ON TABLE chat_messages IS 'Tabel untuk menyimpan pesan individual dalam percakapan AI';
COMMENT ON TABLE ai_analysis_sessions IS 'Tabel untuk menyimpan sesi analisis AI terhadap performance siswa';
COMMENT ON TABLE learning_recommendations IS 'Tabel untuk menyimpan rekomendasi pembelajaran yang dipersonalisasi';
COMMENT ON TABLE semantic_search_logs IS 'Tabel untuk tracking semantic search queries dan performance';
COMMENT ON TABLE ai_model_usage IS 'Tabel untuk tracking penggunaan model AI dan monitoring costs';
COMMENT ON TABLE student_learning_analytics IS 'Tabel untuk advanced analytics student behavior dan learning patterns';