# 📋 E-LKPD Database Setup Guide

## 🎯 Overview
Panduan untuk setup database table `lkpd_data` di Supabase untuk fitur E-LKPD interaktif.

## 📝 Prerequisites
- Akses ke Supabase Dashboard project CIRVIA
- SQL Editor access
- Students table sudah ada (dari schema utama)

## 🚀 Step-by-Step Installation

### Step 1: Open Supabase SQL Editor
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project CIRVIA
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New Query**

### Step 2: Run Migration Script
Copy dan paste seluruh konten dari file `database/add-lkpd-table.sql` ke SQL Editor, kemudian klik **Run**.

Script akan membuat:
- ✅ Table `lkpd_data` dengan semua kolom yang diperlukan
- ✅ Indexes untuk performa optimal
- ✅ Row Level Security (RLS) policies
- ✅ Trigger untuk auto-update `updated_at`

### Step 3: Verify Table Creation
Jalankan query ini untuk verifikasi:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'lkpd_data';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lkpd_data'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'lkpd_data';
```

Expected results:
- Table `lkpd_data` should exist
- Should have 28 columns total
- Should have 5 RLS policies (view, insert, update, delete for students + view for teachers)

### Step 4: Test with Sample Data (Optional)

```sql
-- Insert sample LKPD data for testing
INSERT INTO lkpd_data (
    student_id,
    student_name,
    student_nis,
    series_1_voltage,
    series_1_resistance,
    series_1_current,
    completed_sections,
    progress_percentage
) VALUES (
    (SELECT id FROM students LIMIT 1), -- Use first student ID
    'Test Student',
    '12345',
    12.00,
    100.00,
    0.12,
    ARRAY['1', '2']::TEXT[],
    33.33
);

-- Verify insert
SELECT * FROM lkpd_data;
```

### Step 5: Cleanup Test Data (Optional)

```sql
-- Delete test data
DELETE FROM lkpd_data WHERE student_name = 'Test Student';
```

## 🔍 Table Structure Details

### Column Overview:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `student_id` | UUID | Foreign key to students table |
| `student_name` | VARCHAR(255) | Student full name |
| `student_nis` | VARCHAR(50) | Student NIS number |
| **Series Circuit Observations** |
| `series_1_voltage` | DECIMAL(10,2) | Voltage for 1 resistor (V) |
| `series_1_resistance` | DECIMAL(10,2) | Resistance for 1 resistor (Ω) |
| `series_1_current` | DECIMAL(10,4) | Current for 1 resistor (A) |
| `series_2_voltage` | DECIMAL(10,2) | Voltage for 2 resistors (V) |
| `series_2_resistance` | DECIMAL(10,2) | Resistance for 2 resistors (Ω) |
| `series_2_current` | DECIMAL(10,4) | Current for 2 resistors (A) |
| **Parallel Circuit Observations** |
| `parallel_branch1_voltage` | DECIMAL(10,2) | Branch 1 voltage (V) |
| `parallel_branch1_resistance` | DECIMAL(10,2) | Branch 1 resistance (Ω) |
| `parallel_branch1_current` | DECIMAL(10,4) | Branch 1 current (A) |
| `parallel_branch2_voltage` | DECIMAL(10,2) | Branch 2 voltage (V) |
| `parallel_branch2_resistance` | DECIMAL(10,2) | Branch 2 resistance (Ω) |
| `parallel_branch2_current` | DECIMAL(10,4) | Branch 2 current (A) |
| `parallel_total_voltage` | DECIMAL(10,2) | Total voltage (V) |
| `parallel_total_resistance` | DECIMAL(10,2) | Total resistance (Ω) |
| `parallel_total_current` | DECIMAL(10,4) | Total current (A) |
| **Text Answers** |
| `analysis_answers` | JSONB | Analysis section answers |
| `conclusion_answers` | JSONB | Conclusion section answers |
| **Progress Tracking** |
| `completed_sections` | TEXT[] | Array of completed section IDs |
| `progress_percentage` | DECIMAL(5,2) | Completion percentage |
| `is_completed` | BOOLEAN | Overall completion status |
| **Timestamps** |
| `started_at` | TIMESTAMP | When student first opened LKPD |
| `completed_at` | TIMESTAMP | When all sections completed |
| `last_saved_at` | TIMESTAMP | Last auto-save timestamp |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

## 🔐 Security Policies Explanation

### 1. Students can view own LKPD data
```sql
FOR SELECT USING (
  student_id IN (
    SELECT id FROM students WHERE auth.uid()::text = id::text
  )
)
```
Students can only see their own LKPD records.

### 2. Teachers can view students LKPD data
```sql
FOR SELECT USING (
  student_id IN (
    SELECT s.id FROM students s 
    JOIN teachers t ON s.teacher_id = t.id 
    WHERE auth.uid()::text = t.id::text
  )
)
```
Teachers can view LKPD data of all their students.

### 3. Students can insert own LKPD data
```sql
FOR INSERT WITH CHECK (
  student_id IN (
    SELECT id FROM students WHERE auth.uid()::text = id::text
  )
)
```
Students can create new LKPD records for themselves.

### 4. Students can update own LKPD data
```sql
FOR UPDATE USING (
  student_id IN (
    SELECT id FROM students WHERE auth.uid()::text = id::text
  )
)
```
Students can modify only their own LKPD data.

### 5. Students can delete own LKPD data
```sql
FOR DELETE USING (
  student_id IN (
    SELECT id FROM students WHERE auth.uid()::text = id::text
  )
)
```
Students can delete their own LKPD records if needed.

## 📊 Useful Queries

### Get LKPD completion statistics
```sql
SELECT 
    student_name,
    student_nis,
    progress_percentage,
    is_completed,
    last_saved_at
FROM lkpd_data
ORDER BY progress_percentage DESC, last_saved_at DESC;
```

### Count completed vs in-progress LKPDs
```sql
SELECT 
    CASE 
        WHEN is_completed THEN 'Completed'
        ELSE 'In Progress'
    END as status,
    COUNT(*) as count
FROM lkpd_data
GROUP BY is_completed;
```

### Get average progress per class
```sql
SELECT 
    s.class,
    COUNT(l.id) as total_students,
    AVG(l.progress_percentage) as avg_progress,
    SUM(CASE WHEN l.is_completed THEN 1 ELSE 0 END) as completed_count
FROM lkpd_data l
JOIN students s ON l.student_id = s.id
GROUP BY s.class
ORDER BY avg_progress DESC;
```

### Find students who haven't started LKPD
```sql
SELECT 
    s.name,
    s.nis,
    s.class
FROM students s
LEFT JOIN lkpd_data l ON s.id = l.student_id
WHERE l.id IS NULL;
```

### Get LKPD data with calculation verification
```sql
SELECT 
    student_name,
    series_1_voltage,
    series_1_resistance,
    series_1_current,
    -- Verify Ohm's Law: I = V / R
    ROUND(series_1_voltage / NULLIF(series_1_resistance, 0), 4) as calculated_current,
    ROUND(ABS(series_1_current - (series_1_voltage / NULLIF(series_1_resistance, 0))), 4) as error
FROM lkpd_data
WHERE series_1_voltage IS NOT NULL 
    AND series_1_resistance IS NOT NULL 
    AND series_1_current IS NOT NULL;
```

## 🔧 Maintenance Queries

### Reset a student's LKPD data
```sql
DELETE FROM lkpd_data 
WHERE student_id = 'UUID-HERE';
```

### Update all incomplete LKPDs to reflect latest schema
```sql
UPDATE lkpd_data
SET 
    progress_percentage = (
        ARRAY_LENGTH(completed_sections, 1)::DECIMAL / 6 * 100
    ),
    is_completed = (ARRAY_LENGTH(completed_sections, 1) = 6),
    updated_at = NOW()
WHERE is_completed IS NULL OR progress_percentage IS NULL;
```

### Archive old/completed LKPDs (>30 days)
```sql
-- Create archive table first
CREATE TABLE lkpd_data_archive (LIKE lkpd_data INCLUDING ALL);

-- Move old records
INSERT INTO lkpd_data_archive
SELECT * FROM lkpd_data
WHERE is_completed = true 
    AND completed_at < NOW() - INTERVAL '30 days';

-- Optional: Delete from main table
-- DELETE FROM lkpd_data
-- WHERE id IN (SELECT id FROM lkpd_data_archive);
```

## 🚨 Troubleshooting

### Error: relation "lkpd_data" does not exist
**Solution**: Run the migration script from `add-lkpd-table.sql`

### Error: permission denied for table lkpd_data
**Solution**: Check RLS policies are created correctly. Run:
```sql
SELECT * FROM pg_policies WHERE tablename = 'lkpd_data';
```

### Error: insert or update on table "lkpd_data" violates foreign key constraint
**Solution**: Ensure the `student_id` exists in the `students` table first.

### Students can't save data
**Solution**: 
1. Check if RLS is enabled: `ALTER TABLE lkpd_data ENABLE ROW LEVEL SECURITY;`
2. Verify student is logged in and `auth.uid()` matches their student ID
3. Check browser console for specific error messages

## 📈 Performance Monitoring

### Check table size
```sql
SELECT 
    pg_size_pretty(pg_total_relation_size('lkpd_data')) as total_size,
    pg_size_pretty(pg_relation_size('lkpd_data')) as table_size,
    pg_size_pretty(pg_indexes_size('lkpd_data')) as indexes_size;
```

### Check index usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'lkpd_data';
```

### Slow query analysis
```sql
-- Enable if not already
-- ALTER TABLE lkpd_data SET (log_autovacuum_min_duration = 0);

EXPLAIN ANALYZE
SELECT * FROM lkpd_data WHERE student_id = 'UUID-HERE';
```

## ✅ Post-Installation Checklist

- [ ] Table `lkpd_data` created successfully
- [ ] All 28 columns present with correct data types
- [ ] Indexes created on `student_id` and `is_completed`
- [ ] RLS enabled on table
- [ ] 5 RLS policies created and active
- [ ] Trigger `update_lkpd_data_updated_at` created
- [ ] Test insert successful
- [ ] Test update successful
- [ ] Test select by student successful
- [ ] Test teacher can view student data
- [ ] Foreign key constraint to students table working

## 📞 Support

Jika mengalami masalah:
1. Check Supabase logs di Dashboard → Logs
2. Verify RLS policies: SQL Editor → `SELECT * FROM pg_policies;`
3. Check student authentication: Pastikan login berhasil
4. Browser console: Look for network errors or JS exceptions

---

**Last Updated**: November 25, 2025  
**Migration File**: `database/add-lkpd-table.sql`  
**Service File**: `src/lib/supabase-lkpd-service.ts`  
**Component**: `src/components/ELKPD.tsx`
