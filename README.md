# Physics Circuit Simulator 🔌⚡

Platform pembelajaran fisika interaktif untuk simulasi rangkaian listrik dengan teknologi computer vision untuk deteksi gerakan tangan.

## 🎯 Fitur Utama

### 📚 Pembelajaran Komprehensif
- **Materi Pembelajaran**: Konsep dasar rangkaian listrik, hukum Ohm, dan daya listrik
- **Pre-Test**: Evaluasi pemahaman awal siswa
- **Post-Test**: Evaluasi pembelajaran setelah praktikum
- **Praktikum Virtual**: Simulasi rangkaian listrik interaktif

### 🤖 Computer Vision
- **Deteksi Gerakan Tangan**: Kontrol praktikum menggunakan gerakan tangan
- **Real-time Processing**: Deteksi gerakan secara langsung menggunakan webcam
- **Gesture Commands**: Berbagai perintah gesture untuk interaksi

### ⚡ Simulasi Rangkaian
- **Perhitungan Real-time**: Arus, tegangan, resistansi, dan daya
- **Komponen Interaktif**: Baterai, resistor dengan nilai yang dapat diubah
- **Visualisasi**: Animasi aliran arus dan tampilan yang menarik

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 14 dengan TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth dengan bcryptjs
- **Styling**: Tailwind CSS dengan Glass Morphism
- **Computer Vision**: MediaPipe, TensorFlow.js, WebRTC API
- **Icons & Animations**: Lucide React, CSS animations

## 🚀 Instalasi dan Menjalankan

### 1. Clone Repository
```bash
git clone <repository-url>
cd cirvia
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database (Supabase)
1. Buat project di [supabase.com](https://supabase.com)
2. Copy `.env.local.example` ke `.env.local`
3. Isi dengan credentials Supabase:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Jalankan SQL schema dari `database/supabase-schema.sql`

### 4. Jalankan Development Server
```bash
npm run dev
```

### 5. Buka Browser
```
http://localhost:3000
```

### 6. Login Default
```
Email: guru@cirvia.com
Password: password123
```

## 🎮 Gesture Commands

| Gesture | Fungsi | Deskripsi |
|---------|--------|-----------|
| Point (👆) | Select Element | Memilih komponen rangkaian |
| Open Palm (✋) | Add Resistor | Menambah resistor baru |
| Fist (✊) | Delete Element | Menghapus komponen terpilih |
| Wave (👋) | Reset Circuit | Mereset rangkaian ke kondisi awal |

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Camera access required untuk computer vision features

---

**Physics Circuit Simulator** - Membuat pembelajaran fisika menjadi lebih interaktif dan menyenangkan! 🚀⚡🎓

### 📚 **Pembelajaran Komprehensif**
- **Materi Pembelajaran**: Konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami
- **Pre-Test**: Evaluasi pemahaman awal sebelum belajar
- **Post-Test**: Evaluasi pemahaman setelah pembelajaran
- **Praktikum Virtual**: Simulasi rangkaian listrik interaktif dengan perhitungan real-time

### 🔬 **Simulasi Rangkaian Interaktif**
- Visualisasi rangkaian listrik seri secara real-time
- Perhitungan otomatis untuk:
  - **Arus (I)** - dalam Ampere
  - **Tegangan (V)** - dalam Volt  
  - **Resistansi (R)** - dalam Ohm
  - **Daya (P)** - dalam Watt
- Tambah/hapus komponen resistor secara dinamis
- Edit nilai komponen dengan interface yang user-friendly

### 👋 **Computer Vision Integration**
- Kontrol dengan gerakan tangan menggunakan teknologi AI
- Mode deteksi gerakan yang dapat diaktifkan/nonaktifkan
- Gesture commands:
  - 👆 **Tunjuk**: Memilih elemen
  - ✋ **Buka telapak**: Menambah resistor
  - ✊ **Kepal**: Menghapus elemen
  - 👋 **Lambaikan**: Reset rangkaian

### 📊 **Evaluasi dan Progress Tracking**
- Pre-test dengan 5 soal konsep dasar
- Post-test dengan 8 soal aplikasi lanjutan
- Analisis performa dengan feedback detail
- Review jawaban dengan penjelasan lengkap
- Saran pembelajaran berdasarkan hasil evaluasi

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dan npm
- Browser modern dengan dukungan JavaScript ES6+

### Installation

1. **Clone atau download project**
```bash
git clone <repository-url>
cd physics-circuit-simulator
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev
```

4. **Buka browser dan akses**
```
http://localhost:3000
```

## 📁 Struktur Project

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout dengan metadata
│   ├── page.tsx            # Homepage dengan navigation
│   ├── about/              # Halaman tentang kami
│   │   └── page.tsx
│   ├── materials/          # Halaman materi pembelajaran
│   │   └── page.tsx        # 3 modul: konsep dasar, rangkaian seri, daya
│   ├── pretest/            # Pre-test dengan 5 soal
│   │   └── page.tsx
│   ├── posttest/           # Post-test dengan 8 soal
│   │   └── page.tsx
│   ├── practicum/          # Praktikum simulasi rangkaian
│   │   └── page.tsx        # Interactive circuit builder
│   └── globals.css         # Tailwind CSS styles
```

## 🛠 Teknologi yang Digunakan

- **Frontend Framework**: Next.js 14 dengan App Router
- **Language**: TypeScript untuk type safety
- **Styling**: Tailwind CSS untuk UI yang responsif
- **Computer Vision**: Ready untuk integrasi TensorFlow.js
- **State Management**: React hooks untuk state lokal
- **Icons & UI**: Custom components dengan Tailwind

## 🎯 Target Pengguna

- **Siswa sekolah menengah** yang mempelajari fisika dasar
- **Guru fisika** sebagai alat bantu mengajar
- **Pelajar mandiri** yang ingin memahami konsep rangkaian listrik

## 📖 Cara Menggunakan

### 1. **Mulai dengan Pre-Test**
- Akses menu "Pre-Test" untuk mengevaluasi pemahaman awal
- Jawab 5 soal tentang konsep dasar listrik
- Lihat hasil dan rekomendasi pembelajaran

### 2. **Pelajari Materi**
- Buka halaman "Materi Pembelajaran"
- Pelajari 3 modul:
  - Modul 1: Konsep Dasar (I, V, R)
  - Modul 2: Rangkaian Seri
  - Modul 3: Daya Listrik
- Setiap modul dilengkapi rumus dan contoh soal

### 3. **Praktikum Virtual**
- Akses halaman "Praktikum"
- Eksperimen dengan rangkaian listrik interaktif
- Tambah/hapus resistor dan lihat perubahan nilai real-time
- Aktifkan mode computer vision untuk kontrol gesture

### 4. **Evaluasi dengan Post-Test**
- Selesaikan post-test dengan 8 soal aplikasi
- Dapatkan analisis performa detail
- Review jawaban yang salah dengan penjelasan

## 🔧 Development

### Available Scripts

```bash
# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Menambah Fitur Computer Vision

Project sudah siap untuk integrasi TensorFlow.js:

1. Install TensorFlow.js:
```bash
npm install @tensorflow/tfjs @tensorflow-models/handpose
```

2. Implementasi gesture detection di `/practicum/page.tsx`

3. Update state management untuk gesture commands

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 Roadmap

- [ ] **Integrasi TensorFlow.js** untuk computer vision
- [ ] **Rangkaian paralel** selain rangkaian seri
- [ ] **Mode kuis** dengan bank soal yang lebih besar
- [ ] **Progress tracking** untuk multiple sessions
- [ ] **Export/import** konfigurasi rangkaian
- [ ] **Responsive design** optimization untuk mobile
- [ ] **Dark mode** theme option
- [ ] **Multi-language** support (English)

## 📄 License

Project ini dibuat untuk tujuan edukatif. Silakan gunakan dan modifikasi sesuai kebutuhan pembelajaran.

## 👥 Tim Pengembang

- **Developer**: Ahli pengembangan web dan computer vision
- **Education Consultant**: Pakar pendidikan fisika dan metodologi pembelajaran  
- **UI/UX Designer**: Spesialis interface yang user-friendly

## 📞 Support

Jika mengalami masalah atau memiliki saran, silakan buat issue di repository atau hubungi tim pengembang.

---

**Physics Circuit Simulator** - Making physics learning interactive and fun! ⚡🎓
