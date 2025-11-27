-- DEBUG LKPD Table - Cek data yang tersimpan
-- Jalankan di Supabase SQL Editor untuk troubleshoot

-- 1. Cek apakah ada data di tabel lkpd_data
SELECT COUNT(*) as total_records FROM lkpd_data;

-- 2. Lihat semua data yang ada (jika ada)
SELECT 
  id,
  student_id,
  student_name,
  student_nis,
  series_5_voltage,
  series_5_current,
  analysis_answers,
  conclusion_answers,
  completed_sections,
  last_saved_at,
  created_at
FROM lkpd_data
ORDER BY created_at DESC;

-- 3. Cek students table untuk memastikan student_id ada
SELECT id, name, nis FROM students LIMIT 5;

-- 4. Cek RLS policies yang aktif
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'lkpd_data';

-- 5. Test INSERT manual (ganti dengan student_id yang valid dari step 3)
-- INSERT INTO lkpd_data (
--   student_id,
--   student_name,
--   student_nis,
--   series_5_voltage,
--   analysis_answers
-- ) VALUES (
--   'PASTE_STUDENT_ID_HERE'::uuid,
--   'Test Student',
--   'TEST123',
--   12.5,
--   '{"hypothesis": "Test hypothesis"}'::jsonb
-- );
