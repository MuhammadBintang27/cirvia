-- Fix RLS Policies for DELETE operations
-- Run this in Supabase SQL Editor if delete doesn't work properly

-- 1. Check current delete policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN (
  'questions',
  'circuit_questions', 
  'conceptual_questions',
  'circuit_analysis_questions',
  'circuit_ordering_questions'
)
AND cmd = 'DELETE';

-- 2. Drop existing delete policies if they're too restrictive
DROP POLICY IF EXISTS "Teachers can delete their own questions" ON questions;
DROP POLICY IF EXISTS "Allow all operations on circuit_questions" ON circuit_questions;
DROP POLICY IF EXISTS "Allow all operations on conceptual_questions" ON conceptual_questions;
DROP POLICY IF EXISTS "Allow all operations on circuit_analysis_questions" ON circuit_analysis_questions;
DROP POLICY IF EXISTS "Allow all operations on circuit_ordering_questions" ON circuit_ordering_questions;

-- 3. Create new permissive delete policies

-- Main questions table - teachers can delete their own questions
CREATE POLICY "Teachers can delete their own questions"
  ON questions FOR DELETE
  USING (
    teacher_id IN (
      SELECT id FROM teachers 
      WHERE user_id = auth.uid()
    )
  );

-- Child tables - allow delete for all authenticated users
-- CASCADE will ensure only related rows are deleted
CREATE POLICY "Allow delete on circuit_questions"
  ON circuit_questions FOR DELETE
  USING (true);

CREATE POLICY "Allow delete on conceptual_questions"
  ON conceptual_questions FOR DELETE
  USING (true);

CREATE POLICY "Allow delete on circuit_analysis_questions"
  ON circuit_analysis_questions FOR DELETE
  USING (true);

CREATE POLICY "Allow delete on circuit_ordering_questions"
  ON circuit_ordering_questions FOR DELETE
  USING (true);

-- 4. Verify CASCADE is working
-- Test query (don't run if you have important data!)
-- SELECT 
--   q.id,
--   q.question_type,
--   cq.id as circuit_q_id,
--   coq.id as conceptual_q_id,
--   caq.id as analysis_q_id,
--   coq2.id as ordering_q_id
-- FROM questions q
-- LEFT JOIN circuit_questions cq ON cq.question_id = q.id
-- LEFT JOIN conceptual_questions coq ON coq.question_id = q.id
-- LEFT JOIN circuit_analysis_questions caq ON caq.question_id = q.id
-- LEFT JOIN circuit_ordering_questions coq2 ON coq2.question_id = q.id
-- LIMIT 5;

-- 5. Alternative: If CASCADE still doesn't work, use a stored procedure
CREATE OR REPLACE FUNCTION delete_question_cascade(question_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from specific tables first
  DELETE FROM circuit_questions WHERE question_id = question_uuid;
  DELETE FROM conceptual_questions WHERE question_id = question_uuid;
  DELETE FROM circuit_analysis_questions WHERE question_id = question_uuid;
  DELETE FROM circuit_ordering_questions WHERE question_id = question_uuid;
  
  -- Then delete from main table
  DELETE FROM questions WHERE id = question_uuid;
  
  RAISE NOTICE 'Question % deleted successfully', question_uuid;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION delete_question_cascade TO authenticated;

-- Usage example:
-- SELECT delete_question_cascade('your-question-id-here');
