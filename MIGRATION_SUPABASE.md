# Migration Guide: LocalStorage ke Supabase Database

## Overview
Sistem CIRVIA telah berhasil dimigrasikan dari localStorage ke Supabase PostgreSQL database untuk persistensi data yang lebih robust dan terpusat.

## Perubahan Utama

### 1. Database Schema
- **teachers**: Data guru dengan autentikasi
- **students**: Data siswa dengan referensi ke guru
- **sessions**: Manajemen session login
- **test_results**: Hasil test (pretest/posttest)
- **test_answers**: Detail jawaban per soal
- **student_progress**: Tracking progress siswa

### 2. Service Layer
- `SupabaseAuthService` menggantikan `AuthDB`
- `SupabaseTestService` menggantikan `TestResultsDB`
- All CRUD operations now use Supabase client

### 3. File Changes
```
✅ ADDED:
- src/lib/supabase.ts (Supabase client + types)
- src/lib/supabase-auth-service.ts (Authentication service)
- src/lib/supabase-test-service.ts (Test results service)
- database/supabase-schema.sql (Database schema)
- .env.local.example (Environment template)

❌ REMOVED:
- src/lib/auth-db.ts (replaced with supabase-auth-service)
- src/lib/test-results.ts (replaced with supabase-test-service)

🔄 UPDATED:
- src/contexts/AuthContext.tsx (uses SupabaseAuthService)
- src/app/pretest/page.tsx (uses SupabaseTestService)
- src/app/posttest/page.tsx (uses SupabaseTestService)
- src/app/dashboard/teacher/page.tsx (uses SupabaseAuthService)
- src/components/ExcelImport.tsx (uses SupabaseAuthService)
```

## Setup Instructions

### 1. Supabase Project Setup
1. Buat account di [supabase.com](https://supabase.com)
2. Create new project
3. Salin Project URL dan API Keys

### 2. Database Setup
1. Buka Supabase Dashboard > SQL Editor
2. Jalankan script dari `database/supabase-schema.sql`
3. Verify semua table telah dibuat

### 3. Environment Configuration
1. Copy `.env.local.example` ke `.env.local`
2. Isi dengan credentials Supabase:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Migration Data (Optional)
Jika ada data localStorage yang perlu dimigrasikan:
```typescript
// Jalankan sekali saja di browser console
await SupabaseAuthService.migrateFromLocalStorage();
```

## Features Tetap Sama

### Authentication
- ✅ Teacher registration/login
- ✅ Student login (name + NIS)
- ✅ Session management
- ✅ Protected routes

### Student Management  
- ✅ Excel import siswa
- ✅ Bulk student creation
- ✅ Class management
- ✅ Student search & filter

### Test System
- ✅ Pretest/Posttest execution
- ✅ Score calculation & grading
- ✅ Answer tracking per question
- ✅ Progress monitoring
- ✅ Class statistics

### Dashboard
- ✅ Teacher dashboard with statistics
- ✅ Student progress tracking
- ✅ Class performance analytics

## Key Benefits

### 1. Data Persistence
- Data tersimpan permanent di cloud
- Tidak hilang saat clear browser
- Accessible dari multiple devices

### 2. Multi-User Support
- Real-time data sync
- Multiple teachers dapat bekerja simultan
- Centralized student database

### 3. Performance
- Indexed database queries
- Optimized for large datasets
- Better search capabilities

### 4. Security
- Row Level Security (RLS) policies
- Encrypted data transmission
- Secure authentication

### 5. Scalability
- PostgreSQL can handle thousands of users
- Built-in backup & recovery
- Professional database management

## API Changes

### Before (localStorage):
```typescript
// Old way
const students = AuthDB.getStudentsByTeacher(teacherId);
const result = TestResultsDB.saveTestResult(testData);
```

### After (Supabase):
```typescript
// New way
const students = await SupabaseAuthService.getStudentsByTeacher(teacherId);
const result = await SupabaseTestService.saveTestResult(testData);
```

## Troubleshooting

### Environment Issues
- Pastikan `.env.local` berisi SUPABASE_URL dan SUPABASE_ANON_KEY
- Restart development server setelah update env

### Database Connection
- Verify Supabase project aktif
- Check network connectivity
- Validate API keys di Supabase dashboard

### Migration Issues
- Old localStorage data tetap ada untuk backup
- Migration function dapat dijalankan berulang kali
- Check browser console untuk error details

## Next Steps

1. **Testing**: Verify semua functionality works dengan database
2. **Performance**: Monitor query performance di production
3. **Backup**: Setup automated database backup
4. **Monitoring**: Add error tracking dan analytics
5. **Security**: Review dan strengthen RLS policies

## Default Account
```
Email: guru@cirvia.com
Password: password123
```

Migration completed successfully! 🎉