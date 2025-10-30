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
  question_id integer NOT NULL,
  selected_answer integer NOT NULL,
  correct_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  question_text text NOT NULL,
  selected_text text NOT NULL,
  correct_text text NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

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
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, user_role);
CREATE INDEX IF NOT EXISTS idx_learning_style_student_id ON learning_style_results(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_style_primary ON learning_style_results(primary_style);

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