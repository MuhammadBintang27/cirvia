-- ==========================================
-- CIRVIA — Reset All Questions & Packages
-- ==========================================
-- Script ini akan menghapus SEMUA soal dan package yang ada
-- Gunakan dengan hati-hati! Data yang terhapus tidak bisa dikembalikan.

DO $$
BEGIN
  RAISE NOTICE '⚠️  WARNING: Deleting all questions and packages...';

  -- Delete in correct order (child tables first, then parent)
  DELETE FROM circuit_questions;
  RAISE NOTICE '✅ Deleted all circuit_questions';

  DELETE FROM conceptual_questions;
  RAISE NOTICE '✅ Deleted all conceptual_questions';

  DELETE FROM circuit_analysis_questions;
  RAISE NOTICE '✅ Deleted all circuit_analysis_questions';

  DELETE FROM circuit_ordering_questions;
  RAISE NOTICE '✅ Deleted all circuit_ordering_questions';

  DELETE FROM class_packages;
  RAISE NOTICE '✅ Deleted all class_packages';

  DELETE FROM question_packages;
  RAISE NOTICE '✅ Deleted all question_packages';

  DELETE FROM questions;
  RAISE NOTICE '✅ Deleted all questions';

  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ ALL DATA DELETED SUCCESSFULLY!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Database is now clean and ready for new seed.';
  RAISE NOTICE '==========================================';
END $$;

-- Verification: Count remaining records
SELECT 
  'questions' as table_name, 
  COUNT(*) as remaining_count 
FROM questions
UNION ALL
SELECT 
  'circuit_questions' as table_name, 
  COUNT(*) as remaining_count 
FROM circuit_questions
UNION ALL
SELECT 
  'conceptual_questions' as table_name, 
  COUNT(*) as remaining_count 
FROM conceptual_questions
UNION ALL
SELECT 
  'question_packages' as table_name, 
  COUNT(*) as remaining_count 
FROM question_packages
UNION ALL
SELECT 
  'class_packages' as table_name, 
  COUNT(*) as remaining_count 
FROM class_packages;
