# Circuit Builder CV - Computer Vision untuk Praktikum Listrik Statis

Aplikasi edukasi berbasis Computer Vision untuk siswa SMA belajar rangkaian listrik menggunakan deteksi gesture tangan.

## 🎯 Tujuan Pembelajaran

- Memahami konsep rangkaian listrik seri dan paralel
- Menerapkan Hukum Ohm (V = I × R)
- Menghitung tegangan, arus, resistansi, dan daya
- Praktikum interaktif menggunakan teknologi Computer Vision

## ✨ Fitur Utama

### 🤏 Pinch Detection

- **Pilih Komponen**: Gunakan gesture pinch untuk memilih komponen dari panel
- **Drag & Drop**: Seret komponen ke area praktikum
- **Koneksi Otomatis**: Kabel otomatis tersambung saat bersentuhan

### 🔧 Komponen Tersedia

- **🔋 Baterai**: Sumber tegangan (12V default)
- **💡 Lampu**: Beban dengan resistansi (50Ω default)
- **🔲 Resistor**: Hambatan (100Ω default)
- **🔘 Saklar**: Kontrol ON/OFF
- **〰️ Kabel**: Penghubung antar komponen

### 👆 Kontrol Gesture

- **Jari Telunjuk**: Nyalakan saklar (ON)
- **Peace Sign**: Matikan saklar (OFF)
- **Pinch**: Pilih dan drag komponen

### 📊 Perhitungan Real-time

- **Tegangan (V)**: Tampilan tegangan rangkaian
- **Arus (I)**: Perhitungan arus berdasarkan Hukum Ohm
- **Resistansi (R)**: Total resistansi rangkaian
- **Daya (P)**: Daya yang dikonsumsi (P = V × I)

## 🚀 Instalasi dan Menjalankan

### Persyaratan Sistem

- Python 3.8 atau lebih baru
- Webcam (kamera laptop/eksternal)
- Windows/Linux/macOS

### Langkah Instalasi

1. **Clone atau download project**

```bash
git clone <repository-url>
cd "testing CV"
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Jalankan aplikasi**

```bash
python main.py
```

## 🎮 Cara Penggunaan

### Langkah-langkah Praktikum:

1. **Pastikan kamera aktif** - Feed kamera muncul di sudut kanan atas
2. **Pilih komponen** - Gunakan pinch gesture di panel atas
3. **Tempatkan komponen** - Drag ke area praktikum (area grid)
4. **Sambungkan dengan kabel** - Pilih kabel, drag dari satu komponen ke yang lain
5. **Kontrol saklar** - Telunjuk untuk ON, peace sign untuk OFF
6. **Lihat hasil** - Panel bawah menampilkan perhitungan Hukum Ohm

### Contoh Rangkaian Seri:

```
[Baterai] ─── [Resistor] ─── [Lampu] ─── [Saklar] ─── [Baterai]
```

### Contoh Rangkaian Paralel:

```
[Baterai] ─┬─ [Resistor] ─┬─ [Baterai]
           └─ [Lampu] ────┘
```

## 🧮 Rumus yang Digunakan

### Hukum Ohm:

- **V = I × R** (Tegangan = Arus × Resistansi)
- **I = V / R** (Arus = Tegangan / Resistansi)
- **P = V × I** (Daya = Tegangan × Arus)

### Rangkaian Seri:

- **Rtotal = R1 + R2 + R3 + ...**
- **Itotal = V / Rtotal**
- **Arus sama di semua komponen**

### Rangkaian Paralel:

- **1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ...**
- **Tegangan sama di semua cabang**
- **Itotal = I1 + I2 + I3 + ...**

## ⌨️ Kontrol Keyboard

- **ESC**: Keluar dari aplikasi
- **R**: Reset rangkaian (hapus semua komponen)

## 🏗️ Struktur Project

```
testing CV/
├── main.py                 # File utama aplikasi
├── requirements.txt        # Dependencies Python
├── README.md              # Dokumentasi
├── src/                   # Source code
│   ├── hand_detection/    # Modul deteksi gesture
│   ├── circuit_logic/     # Logika rangkaian dan perhitungan
│   ├── ui/               # User interface
│   ├── circuit_components/ # Komponen rangkaian
│   └── utils/            # Utility functions
├── assets/               # Asset gambar/icon
└── tests/               # Unit tests
```

## 🎓 Untuk Guru/Pendidik

### Saran Penggunaan di Kelas:

1. **Demo awal**: Tunjukkan cara menggunakan gesture
2. **Praktikum terbimbing**: Mulai dengan rangkaian sederhana
3. **Eksperimen bebas**: Biarkan siswa berkreasi
4. **Diskusi hasil**: Bahas mengapa nilai berbeda-beda

### Topik Pembelajaran:

- Konsep dasar listrik statis
- Hukum Ohm dan aplikasinya
- Perbedaan rangkaian seri vs paralel
- Perhitungan daya dan efisiensi
- Teknologi Computer Vision

## 🔧 Troubleshooting

### Kamera tidak terdeteksi:

```bash
# Cek kamera tersedia
python -c "import cv2; print('Camera:', cv2.VideoCapture(0).isOpened())"
```

### Gesture tidak responsif:

- Pastikan pencahayaan cukup
- Jaga jarak tangan dengan kamera (30-60 cm)
- Hindari background yang rumit

### Perhitungan tidak akurat:

- Pastikan semua komponen tersambung dengan kabel
- Cek status saklar (harus ON)
- Reset dan coba lagi dengan 'R'

## 📋 TODO / Pengembangan Selanjutnya

- [ ] Penyimpanan dan loading rangkaian
- [ ] Mode pembelajaran step-by-step
- [ ] Animasi aliran arus listrik
- [ ] Komponen tambahan (kapasitor, induktor)
- [ ] Export hasil ke PDF
- [ ] Mode multiplayer/kolaboratif

## 🤝 Kontribusi

Project ini dikembangkan untuk keperluan edukasi. Kontribusi dan saran sangat diterima!

## 📄 Lisensi

Project ini menggunakan lisensi MIT - bebas digunakan untuk keperluan edukasi.

---

**Selamat belajar dan bereksperimen dengan Circuit Builder CV! 🔬⚡**
