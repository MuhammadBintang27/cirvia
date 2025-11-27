-- FIX LKPD RLS Policies - Untuk Custom Auth System
-- Error 406/401 terjadi karena RLS policy pakai auth.uid() yang tidak ada di custom auth
-- Jalankan ini di Supabase SQL Editor

-- 1. DROP semua policy lama yang salah
DROP POLICY IF EXISTS "Students can view own LKPD data" ON lkpd_data;
DROP POLICY IF EXISTS "Teachers can view students LKPD data" ON lkpd_data;
DROP POLICY IF EXISTS "Students can insert own LKPD data" ON lkpd_data;
DROP POLICY IF EXISTS "Students can update own LKPD data" ON lkpd_data;
DROP POLICY IF EXISTS "Students can delete own LKPD data" ON lkpd_data;

-- 2. DISABLE RLS sementara untuk testing
-- Setelah berhasil, bisa enable lagi dengan custom policy yang benar
ALTER TABLE lkpd_data DISABLE ROW LEVEL SECURITY;

-- 3. Jika mau tetap pakai RLS, gunakan policy ini (UNCOMMENT jika diperlukan):
-- ALTER TABLE lkpd_data ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (dengan service role key atau anon key)
-- CREATE POLICY "Allow all authenticated access" ON lkpd_data
--     FOR ALL 
--     USING (true)
--     WITH CHECK (true);

-- ATAU lebih strict - hanya allow untuk student_id yang ada di students table:
-- CREATE POLICY "Allow access to valid students" ON lkpd_data
--     FOR ALL 
--     USING (student_id IN (SELECT id FROM students))
--     WITH CHECK (student_id IN (SELECT id FROM students));
