-- Fix untuk mengubah question_id dari integer ke text di tabel test_answers
-- Jalankan di Supabase SQL Editor

-- 1. Backup data terlebih dahulu (opsional, untuk safety)
-- CREATE TABLE test_answers_backup AS SELECT * FROM test_answers;

-- 2. Drop foreign key constraints jika ada
-- ALTER TABLE test_answers DROP CONSTRAINT IF EXISTS test_answers_question_id_fkey;

-- 3. Ubah tipe kolom question_id dari integer ke text
ALTER TABLE test_answers ALTER COLUMN question_id TYPE text;

-- 4. Tambahkan komentar untuk dokumentasi
COMMENT ON COLUMN test_answers.question_id IS 'Question ID - can be integer for default questions or UUID for teacher-created questions';

-- 5. Update index jika diperlukan
DROP INDEX IF EXISTS idx_test_answers_question_id;
CREATE INDEX idx_test_answers_question_id ON test_answers(question_id);

-- Note: Tidak perlu foreign key constraint karena question_id bisa merujuk ke:
-- - Integer ID dari soal default (mixedQuestions)  
-- - UUID dari tabel questions (soal buatan guru)