# 🚀 CIRVIA - Supabase Database Setup

## Setup Database

### 1. Buat Project Supabase Baru

1. Pergi ke [supabase.com](https://supabase.com)
2. Klik "Start your project"  
3. Sign up/Login dengan GitHub atau email
4. Klik "New Project"
5. Pilih organization dan beri nama project: `cirvia-database`
6. Set password yang kuat untuk database
7. Pilih region terdekat (Singapore untuk Indonesia)
8. Klik "Create new project"

### 2. Setup Environment Variables

1. Di Supabase Dashboard, pergi ke **Settings** > **API**
2. Copy **Project URL** dan **anon public key**
3. Update file `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Development
NODE_ENV=development
```

### 3. Buat Database Schema

1. Di Supabase Dashboard, pergi ke **SQL Editor**
2. Klik "New Query"
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" untuk execute schema

### 4. Verifikasi Setup

Cek di **Table Editor** bahwa tables sudah terbuat:
- ✅ `teachers`
- ✅ `students` 
- ✅ `test_results`
- ✅ `test_answers`
- ✅ `student_progress`
- ✅ `sessions`

### 5. Test Data

Schema sudah include sample data:
- **Teacher**: `teacher@cirvia.com` / `password`
- **Students**: 5 sample students dengan NIS 12345-12349

## Database Structure

```
teachers
├── id (UUID, Primary Key)
├── email (VARCHAR, Unique)
├── password_hash (VARCHAR)
├── name (VARCHAR)
├── phone_number (VARCHAR, Optional)
├── school (VARCHAR, Optional)
├── is_verified (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

students
├── id (UUID, Primary Key)
├── name (VARCHAR)
├── nis (VARCHAR, Unique)
├── class (VARCHAR)
├── teacher_id (UUID, Foreign Key → teachers.id)
├── email (VARCHAR, Optional)
├── phone_number (VARCHAR, Optional)
├── pre_test_score (DECIMAL)
├── post_test_score (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

test_results
├── id (UUID, Primary Key)
├── student_id (UUID, Foreign Key → students.id)
├── student_name (VARCHAR)
├── student_nis (VARCHAR)
├── test_type (ENUM: 'pretest', 'posttest')
├── score (INTEGER)
├── total_questions (INTEGER)
├── correct_answers (INTEGER)
├── percentage (DECIMAL)
├── time_spent (INTEGER, seconds)
├── grade (ENUM: 'A', 'B', 'C', 'D', 'E')
├── completed_at (TIMESTAMP)
└── created_at (TIMESTAMP)

test_answers
├── id (UUID, Primary Key)
├── test_result_id (UUID, Foreign Key → test_results.id)
├── question_id (INTEGER)
├── selected_answer (INTEGER)
├── correct_answer (INTEGER)
├── is_correct (BOOLEAN)
├── question_text (TEXT)
├── selected_text (TEXT)
├── correct_text (TEXT)
├── explanation (TEXT)
└── created_at (TIMESTAMP)

student_progress
├── id (UUID, Primary Key)
├── student_id (UUID, Unique, Foreign Key → students.id)
├── pre_test_result_id (UUID, Foreign Key → test_results.id)
├── post_test_result_id (UUID, Foreign Key → test_results.id)
├── score_improvement (DECIMAL)
├── percentage_improvement (DECIMAL)
├── time_improvement (INTEGER)
├── completed_materials (JSONB)
├── practice_history (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

sessions
├── id (UUID, Primary Key)
├── user_id (UUID)
├── user_role (ENUM: 'teacher', 'student')
├── expires_at (TIMESTAMP)
└── created_at (TIMESTAMP)
```

## Security Features

### Row Level Security (RLS)
- ✅ **Teachers** hanya bisa akses data mereka sendiri
- ✅ **Students** hanya bisa akses data mereka sendiri  
- ✅ **Teachers** bisa lihat data students mereka
- ✅ **Students** bisa lihat test results mereka sendiri
- ✅ **Teachers** bisa lihat test results students mereka

### Indexes
- ✅ Optimized queries dengan indexes pada foreign keys
- ✅ Fast lookup berdasarkan student_id, teacher_id, test_type
- ✅ Session management dengan expiry index

### Triggers
- ✅ Auto-update `updated_at` timestamp
- ✅ Data integrity dengan foreign key constraints

## API Usage Examples

### Simpan Test Result
```typescript
const result = await SupabaseTestService.saveTestResult({
  studentId: 'uuid',
  studentName: 'Ahmad Fadli',
  studentNis: '12345',
  testType: 'pretest',
  score: 4,
  totalQuestions: 5,
  correctAnswers: 4,
  percentage: 80,
  timeSpent: 600,
  answers: [...],
  grade: 'B'
});
```

### Get Student Progress
```typescript
const progress = await SupabaseTestService.getStudentProgress('student-uuid');
```

### Get Class Statistics
```typescript  
const stats = await SupabaseTestService.getClassStatistics('teacher-uuid');
```

## Migration dari localStorage

Sistem sudah siap replace localStorage sepenuhnya. Data akan:

1. ✅ **Persist** - Tidak hilang saat clear browser
2. ✅ **Real-time** - Updates langsung ke semua devices  
3. ✅ **Secure** - Row Level Security dan data encryption
4. ✅ **Scalable** - Support ribuan students dan teachers
5. ✅ **Backup** - Auto backup dan point-in-time recovery
6. ✅ **Analytics** - Rich queries untuk reporting

## Monitoring & Analytics

Di Supabase Dashboard, Anda bisa:
- 📊 **Monitor** real-time database activity
- 📈 **Analytics** usage patterns dan performance  
- 🔍 **Query** data dengan SQL Editor
- 📥 **Export** data untuk analisis
- ⚡ **Optimize** performance dengan query insights

---

**Ready to go!** 🚀 Database sudah siap untuk production use!