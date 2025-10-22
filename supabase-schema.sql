-- Supabase SQL Schema for CIRVIA
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create Teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    school VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    nis VARCHAR(50) UNIQUE NOT NULL,
    class VARCHAR(50) NOT NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    pre_test_score DECIMAL(5,2),
    post_test_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Test Results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    student_nis VARCHAR(50) NOT NULL,
    test_type VARCHAR(10) CHECK (test_type IN ('pretest', 'posttest')),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    time_spent INTEGER NOT NULL, -- in seconds
    grade VARCHAR(1) CHECK (grade IN ('A', 'B', 'C', 'D', 'E')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Test Answers table
CREATE TABLE test_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL,
    selected_answer INTEGER NOT NULL,
    correct_answer INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_text TEXT NOT NULL,
    selected_text TEXT NOT NULL,
    correct_text TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Student Progress table
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    pre_test_result_id UUID REFERENCES test_results(id) ON DELETE SET NULL,
    post_test_result_id UUID REFERENCES test_results(id) ON DELETE SET NULL,
    score_improvement DECIMAL(5,2),
    percentage_improvement DECIMAL(5,2),
    time_improvement INTEGER, -- in seconds
    completed_materials JSONB DEFAULT '[]'::jsonb,
    practice_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_role VARCHAR(10) CHECK (user_role IN ('teacher', 'student')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_students_teacher_id ON students(teacher_id);
CREATE INDEX idx_students_nis ON students(nis);
CREATE INDEX idx_test_results_student_id ON test_results(student_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);
CREATE INDEX idx_test_answers_test_result_id ON test_answers(test_result_id);
CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Teachers can only see their own data
CREATE POLICY "Teachers can view own data" ON teachers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Teachers can update own data" ON teachers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Students can only see their own data
CREATE POLICY "Students can view own data" ON students
    FOR SELECT USING (auth.uid()::text = id::text);

-- Teachers can see their students
CREATE POLICY "Teachers can view their students" ON students
    FOR SELECT USING (teacher_id IN (SELECT id FROM teachers WHERE auth.uid()::text = id::text));

-- Students can view their test results
CREATE POLICY "Students can view own test results" ON test_results
    FOR SELECT USING (student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text));

-- Teachers can view their students' test results
CREATE POLICY "Teachers can view students test results" ON test_results
    FOR SELECT USING (student_id IN (
        SELECT s.id FROM students s 
        JOIN teachers t ON s.teacher_id = t.id 
        WHERE auth.uid()::text = t.id::text
    ));

-- Students can insert their own test results
CREATE POLICY "Students can insert own test results" ON test_results
    FOR INSERT WITH CHECK (student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text));

-- Similar policies for test_answers
CREATE POLICY "View test answers" ON test_answers
    FOR SELECT USING (test_result_id IN (
        SELECT tr.id FROM test_results tr
        JOIN students s ON tr.student_id = s.id
        WHERE auth.uid()::text = s.id::text
        OR s.teacher_id IN (SELECT id FROM teachers WHERE auth.uid()::text = id::text)
    ));

CREATE POLICY "Insert test answers" ON test_answers
    FOR INSERT WITH CHECK (test_result_id IN (
        SELECT tr.id FROM test_results tr
        JOIN students s ON tr.student_id = s.id
        WHERE auth.uid()::text = s.id::text
    ));

-- Student progress policies
CREATE POLICY "View student progress" ON student_progress
    FOR SELECT USING (
        student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text)
        OR student_id IN (
            SELECT s.id FROM students s 
            JOIN teachers t ON s.teacher_id = t.id 
            WHERE auth.uid()::text = t.id::text
        )
    );

CREATE POLICY "Insert/Update student progress" ON student_progress
    FOR ALL USING (
        student_id IN (SELECT id FROM students WHERE auth.uid()::text = id::text)
    );

-- Enable RLS on all tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Insert default teacher account (for testing)
INSERT INTO teachers (email, password_hash, name, is_verified) 
VALUES (
    'teacher@cirvia.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'Demo Teacher',
    true
);

-- Sample student data
DO $$
DECLARE
    teacher_uuid UUID;
BEGIN
    SELECT id INTO teacher_uuid FROM teachers WHERE email = 'teacher@cirvia.com';
    
    INSERT INTO students (name, nis, class, teacher_id) VALUES
    ('Ahmad Fadli', '12345', 'XII IPA 1', teacher_uuid),
    ('Siti Nurhaliza', '12346', 'XII IPA 1', teacher_uuid),
    ('Budi Santoso', '12347', 'XII IPA 2', teacher_uuid),
    ('Citra Dewi', '12348', 'XII IPA 2', teacher_uuid),
    ('Dicky Pratama', '12349', 'XII IPA 3', teacher_uuid);
END $$;