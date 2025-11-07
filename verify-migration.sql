-- Verification Query: Check if new columns exist in test_answers table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'test_answers' 
  AND column_name IN ('question_type', 'metadata')
ORDER BY column_name;

-- Expected Result: 
-- Should return 2 rows:
-- 1. question_type | character varying | YES | NULL
-- 2. metadata      | jsonb             | YES | NULL

-- Verification Query 2: Check if index was created
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'test_answers' 
  AND indexname = 'idx_test_answers_question_type';

-- Expected Result:
-- Should return 1 row with index definition

-- Sample Query: View recent test answers with new columns
SELECT 
  id,
  question_id,
  question_type,
  is_correct,
  metadata,
  created_at
FROM test_answers
ORDER BY created_at DESC
LIMIT 5;

-- This will show if data is being saved with the new structure
