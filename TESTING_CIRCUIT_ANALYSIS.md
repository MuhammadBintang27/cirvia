# Testing Circuit Analysis Fix - Step by Step

## 🧪 Langkah Testing

### 1️⃣ Buka Browser Console
- Tekan **F12** atau **Ctrl+Shift+I**
- Pilih tab **Console**
- **JANGAN TUTUP** console ini selama testing

### 2️⃣ Refresh Aplikasi
- Tekan **Ctrl+F5** untuk hard refresh
- Pastikan aplikasi sudah reload

### 3️⃣ Buat Soal Baru Circuit Analysis

#### A. Navigasi ke Form
1. Login sebagai teacher
2. Pilih tab "Bank Soal"
3. Klik "Tambah Soal Baru"
4. Pilih "Soal Analisis Rangkaian"

#### B. Isi Form (Contoh Data)
- **Judul**: Test Circuit Analysis - L3 Padam
- **Deskripsi**: Tes untuk memastikan data tersimpan dengan benar
- **Tingkat Kesulitan**: Sedang
- **Template**: mixed-series-parallel
- **Pertanyaan**: Jika lampu L3 padam, lampu mana yang ikut padam?
- **Hint**: Perhatikan jalur seri dan paralel
- **Penjelasan**: L1-L2 jalur terpisah dari L3-L4
- **Lampu yang Rusak**: L3
- **Status Lampu Lain**:
  - L1: **Menyala** ✅
  - L2: **Menyala** ✅
  - L4: **Padam** ❌
  - L5: **Menyala** ✅

#### C. Submit Form
1. Klik "Preview Soal"
2. **PERHATIKAN CONSOLE** - akan muncul:
   ```
   [FORM DEBUG] Submitting question with correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' }
   ```
3. Klik "Simpan Soal"
4. **PERHATIKAN CONSOLE** - akan muncul:
   ```
   [DEBUG] circuitAnalysis correctStates: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' }
   [DEBUG] correctAnswersArray to save: ["L1-on", "L2-on", "L4-off", "L5-on"]
   [DEBUG] Saved analysis data: { id: "xxx", correct_answers: ["L1-on", "L2-on", "L4-off", "L5-on"], ... }
   ```

### 4️⃣ Verifikasi di Database

#### Opsi A: Via Supabase Dashboard
1. Buka Supabase dashboard
2. Pilih tabel `circuit_analysis_questions`
3. Cari row dengan question_id terbaru
4. Periksa kolom `correct_answers`
5. **Harus berisi**: `["L1-on", "L2-on", "L4-off", "L5-on"]`
6. **BUKAN**: `["L1", "L2", "L4", "L5"]` ❌

#### Opsi B: Via SQL
```sql
SELECT 
  q.id,
  q.title,
  ca.broken_component,
  ca.correct_answers
FROM questions q
JOIN circuit_analysis_questions ca ON ca.question_id = q.id
WHERE q.question_type = 'circuitAnalysis'
ORDER BY q.created_at DESC
LIMIT 1;
```

### 5️⃣ Test Sebagai Student

1. Logout dari teacher account
2. Login sebagai student
3. Ambil quiz yang berisi soal tadi
4. Jawab soal dengan benar:
   - L1: Klik sampai **💡 Nyala**
   - L2: Klik sampai **💡 Nyala**
   - L4: Klik sampai **❌ Padam**
   - L5: Klik sampai **💡 Nyala**
5. Submit jawaban
6. **Harusnya**: ✅ **BENAR**

---

## 🔍 Troubleshooting

### Jika Console Tidak Menampilkan Debug Log

**Kemungkinan 1: Cache Issue**
```bash
# Di terminal:
cd cirvia
npm run dev
```
Lalu refresh browser dengan Ctrl+F5

**Kemungkinan 2: File Belum Ter-save**
- Check apakah file sudah ada tanda bintang (*) di VS Code
- Save semua file: Ctrl+K, S

### Jika Data Masih Format Lama `["L1", "L2", "L4"]`

**Screenshot Console dan kirim ke saya:**
1. Screenshot console log lengkap
2. Screenshot isi database `correct_answers`
3. Kita akan debug bersama

### Jika Tipe Error Muncul

**Screenshot error dan share:**
- Error message lengkap
- Stack trace di console
- Browser yang digunakan

---

## 📋 Checklist

Centang setiap langkah yang sudah berhasil:

- [ ] Console terbuka dan siap
- [ ] Aplikasi sudah refresh
- [ ] Form circuit analysis terbuka
- [ ] Form terisi lengkap
- [ ] Preview soal berhasil
- [ ] Console menampilkan `[FORM DEBUG]`
- [ ] Console menampilkan `[DEBUG] correctStates`
- [ ] Console menampilkan `[DEBUG] correctAnswersArray`
- [ ] Console menampilkan `[DEBUG] Saved analysis data`
- [ ] Database menunjukkan format `["L1-on", "L4-off"]` ✅
- [ ] Test sebagai student berhasil
- [ ] Jawaban benar terdeteksi ✅

---

## 🎯 Expected Results

### Format yang BENAR ✅
```json
{
  "correct_answers": ["L1-on", "L2-on", "L4-off", "L5-on"]
}
```

### Format yang SALAH ❌
```json
{
  "correct_answers": ["L1", "L2", "L4", "L5"]
}
```
atau
```json
{
  "correct_answers": ["L2", "L3", "L4", "L5"]
}
```

---

## 📞 Jika Masih Bermasalah

Kirimkan screenshot dari:
1. **Console log** - semua log yang muncul
2. **Database** - isi kolom `correct_answers`
3. **Form** - saat mengisi status lampu

Dan saya akan bantu debug lebih lanjut!
