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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(teacher_id, class);
CREATE INDEX IF NOT EXISTS idx_test_results_student_id ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_test_results_type ON test_results(test_type);
CREATE INDEX IF NOT EXISTS idx_test_answers_result_id ON test_answers(test_result_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, user_role);

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

-- Row Level Security (RLS) Policies
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

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