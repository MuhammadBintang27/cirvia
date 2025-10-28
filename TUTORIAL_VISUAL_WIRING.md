# 📚 Tutorial Visual: Membuat Rangkaian dengan Sistem Kabel Baru

## 🎯 Tutorial 1: Rangkaian Seri Sederhana

### Langkah 1: Tambah Komponen

```
Klik tombol:
[🔋 Baterai]  [💡 Lampu]  [🧵 Kabel] x2
```

### Langkah 2: Posisikan di Canvas

```
Canvas:

    [🔋 Baterai]          [🧵 Kabel1]          [💡 Lampu]          [🧵 Kabel2]
        ●─────●              ●─────●              ●─────●              ●─────●
        A     B              A     B              A     B              A     B
```

### Langkah 3: Aktifkan Mode Koneksi

```
Klik: [🔗 Mode Koneksi]
Status: ON (biru) ✅
```

### Langkah 4: Hubungkan Kabel1

```
1. Klik: Kabel1 Terminal A (ujung kiri)
   Status: "Pending..." (kuning)

2. Klik: Baterai Terminal B (ujung kanan)
   ✅ Koneksi terbentuk!

Hasil:
    [🔋 Baterai]═════[🧵 Kabel1]          [💡 Lampu]          [🧵 Kabel2]
        ●     ●══════●     ●              ●─────●              ●─────●
              ↑ TERHUBUNG ↑
```

### Langkah 5: Hubungkan Kabel1 ke Lampu

```
3. Klik: Kabel1 Terminal B (ujung kanan)
   Status: "Pending..."

4. Klik: Lampu Terminal A (ujung kiri)
   ✅ Koneksi terbentuk!

Hasil:
    [🔋 Baterai]═════[🧵 Kabel1]══════[💡 Lampu]          [🧵 Kabel2]
        ●     ●══════●     ●══════●     ●              ●─────●
              TERHUBUNG            TERHUBUNG
```

### Langkah 6: Hubungkan Kabel2 (Menutup Loop)

```
5. Klik: Kabel2 Terminal A
6. Klik: Lampu Terminal B (ujung kanan)
7. Klik: Kabel2 Terminal B
8. Klik: Baterai Terminal A (ujung kiri)

Hasil FINAL:
    ╔═══════════════════════════════════════════╗
    ║  [🔋 Baterai]═[🧵 K1]═[💡 Lampu]═[🧵 K2]═║
    ║      ●────●═══●──●═══●──●═══●──●════●    ║
    ║      └──────────────────────────────┘    ║
    ║           ⚡ RANGKAIAN TERTUTUP ⚡         ║
    ║           💡 LAMPU MENYALA! ✨            ║
    ╚═══════════════════════════════════════════╝

Stats:
- Tegangan: 12V
- Resistansi: 50Ω
- Arus: 0.24A
- Daya: 2.88W
```

---

## 🔄 Tutorial 2: Rangkaian Paralel (2 Lampu)

### Langkah 1: Tambah Komponen

```
[🔋 Baterai]  [💡 Lampu] x2  [🧵 Kabel] x4
```

### Langkah 2: Layout Awal

```
                    [💡 Lampu1]
                     ●     ●

    [🔋 Baterai]                    [🧵 K3][🧵 K4]
        ●     ●

                    [💡 Lampu2]
                     ●     ●

    [🧵 K1][🧵 K2]
```

### Langkah 3: Hubungkan Cabang Atas (Lampu1)

```
Mode Koneksi: ON

1. Kabel1: Baterai(B) → Lampu1(A)
2. Kabel3: Lampu1(B) → Baterai(A)

Hasil:
                    [💡 Lampu1]
                ┌════●     ●════┐
                │                │
    [🔋 Baterai]│                │
        ●     ●─┘                └─●

                    [💡 Lampu2]
                     ●     ●
```

### Langkah 4: Hubungkan Cabang Bawah (Lampu2) - PARALEL!

```
3. Kabel2: Baterai(B) → Lampu2(A)  ← CABANG PARALEL!
4. Kabel4: Lampu2(B) → Baterai(A)

Hasil FINAL:
                    [💡 Lampu1] ← Cabang 1
                ┌════●     ●════┐
                │                │
    [🔋 Baterai]┤                ├─┐
        ●     ●─┤                │ │
                │                │ │
                └════●     ●════┘ │
                    [💡 Lampu2] ←─┘ Cabang 2

    ╔════════════════════════════════════════╗
    ║   ⚡ RANGKAIAN PARALEL BERHASIL! ⚡    ║
    ║   💡💡 KEDUA LAMPU MENYALA TERANG! ✨  ║
    ╚════════════════════════════════════════╝

Analisis:
- Tegangan: 12V (sama untuk kedua lampu)
- R1 = R2 = 50Ω
- R_total = 1/(1/50 + 1/50) = 25Ω
- I_total = 12/25 = 0.48A
- I_lampu1 = 0.24A
- I_lampu2 = 0.24A
- Brightness: TINGGI! ⭐⭐⭐
```

---

## 🎛️ Tutorial 3: Menggunakan Saklar

### Skenario: Kontrol Lampu dengan Saklar

```
Komponen:
[🔋 Baterai] [⚡ Saklar] [💡 Lampu] [🧵 Kabel] x3

Layout:
    [🔋]──[K1]──[⚡]──[K2]──[💡]──[K3]──[🔋]
```

### Status: Saklar OPEN (Default)

```
    [🔋 12V]══[K1]══[⚡ OPEN]  ╳  [K2]══[💡 OFF]══[K3]══[🔋]
                        ↑
                   TERPUTUS!

    Status: ❌ Lampu Mati (Abu-abu)
    Arus: 0A
    Message: "Saklar terbuka! Double-click untuk menutup"
```

### Action: Double-Click Saklar

```
    *Double-click pada saklar*
    🔊 *Beep sound* (900Hz)
```

### Status: Saklar CLOSED

```
    [🔋 12V]══[K1]══[⚡ CLOSED]══[K2]══[💡 ON]══[K3]══[🔋]
                        ↓
                   TERSAMBUNG!
                   ⚡⚡⚡ (animasi partikel)

    Status: ✅ Lampu Menyala! (Kuning cerah + glow)
    Arus: 0.24A
    Brightness: ⭐⭐⭐⭐⭐
    Message: "Rangkaian tertutup! Arus mengalir"
```

---

## 🔬 Tutorial 4: Eksperimen Seri vs Paralel

### Setup: 2 Resistor - Bisa Seri ATAU Paralel

#### Mode A: SERI (Resistansi Tinggi)

```
[🔋 12V]═[K1]═[🔌 R1:100Ω]═[K2]═[🔌 R2:100Ω]═[K3]═[🔋]

Perhitungan:
R_total = R1 + R2 = 100 + 100 = 200Ω
I = V/R = 12/200 = 0.06A
P = V×I = 12×0.06 = 0.72W

Hasil: Arus KECIL 📉
```

#### Mode B: PARALEL (Resistansi Rendah)

```
        ┌═[K1]═[🔌 R1:100Ω]═[K3]═┐
[🔋 12V]┤                          ├[🔋]
        └═[K2]═[🔌 R2:100Ω]═[K4]═┘

Perhitungan:
R_total = 1/(1/100 + 1/100) = 50Ω
I = V/R = 12/50 = 0.24A
P = V×I = 12×0.24 = 2.88W

Hasil: Arus BESAR 📈 (4x lebih besar!)
```

### Perbandingan Visual:

```
╔══════════════════╦══════════════════╗
║   SERI (Mode A)  ║ PARALEL (Mode B) ║
╠══════════════════╬══════════════════╣
║ R: 200Ω         ║ R: 50Ω          ║
║ I: 0.06A 📉     ║ I: 0.24A 📈     ║
║ P: 0.72W        ║ P: 2.88W        ║
║ Lampu: Redup 🌑 ║ Lampu: Terang 🌟║
╚══════════════════╩══════════════════╝
```

---

## 💡 Tips Visualisasi

### Membaca Status Kabel:

```
[🧵 Kabel]
 ●─────●
 A     B

Status Label di bawah kabel:
┌─────────────────────────┐
│ "Belum" (Orange)        │ → 0 koneksi
│ "Sebagian" (Orange)     │ → 1 koneksi
│ "Terhubung" (Hijau) ✅  │ → 2 koneksi (siap!)
└─────────────────────────┘
```

### Terminal Indicators:

```
Tidak Terhubung:  ● (abu-abu, kecil)
Terhubung:        ◉ (hijau, pulse) ← animasi!
Pending:          ◎ (biru, highlight)
```

### Current Flow Animation:

```
Tidak ada arus:
─────────────────

Ada arus (saklar closed):
⚡─⚡─⚡─⚡─⚡─⚡─⚡ (animasi bergerak →)
💛💛💛💛💛💛💛 (partikel kuning)
```

---

## 🎮 Interactive Demo Steps

### Praktikum 1: Percobaan Hukum Ohm

```
Goal: Buktikan V = I × R

Setup:
1. Tambah: [🔋] [🔌 R:100Ω] [🧵]×2
2. Hubungkan rangkaian seri
3. Catat: V=12V, R=100Ω
4. Lihat hasil: I = 0.12A
5. Verifikasi: 12 = 0.12 × 100 ✅

Eksperimen:
- Ganti R dengan 50Ω → I naik jadi 0.24A
- Ganti R dengan 200Ω → I turun jadi 0.06A
```

### Praktikum 2: Brightness Comparison

```
Goal: Bandingkan brightness lampu seri vs paralel

Test A - Seri:
[🔋]─[Lampu1]─[Lampu2]─[🔋]
Result: 💡💡 (redup, karena V terbagi)

Test B - Paralel:
     ┌─[Lampu1]─┐
[🔋]─┤          ├─[🔋]
     └─[Lampu2]─┘
Result: 🌟🌟 (terang, V sama!)
```

---

## 🏆 Challenge Levels

### Level 1: Basic Circuit ⭐

```
Buat rangkaian sederhana:
- 1 Baterai
- 1 Lampu
- 2 Kabel
Target: Lampu menyala ✅
```

### Level 2: Saklar Control ⭐⭐

```
Tambahkan saklar untuk kontrol ON/OFF
Target: Bisa nyalakan/matikan lampu dengan saklar ✅
```

### Level 3: Paralel 2 Lampu ⭐⭐⭐

```
Buat 2 lampu paralel yang menyala terang
Target: Kedua lampu brightness sama ✅
```

### Level 4: Mixed Circuit ⭐⭐⭐⭐

```
Buat: Resistor (seri) + 2 Lampu (paralel)
Target: Pahami distribusi arus ✅
```

### Level 5: Traffic Light ⭐⭐⭐⭐⭐

```
Buat 3 lampu dengan 3 saklar terpisah
Target: Kontrol independen setiap lampu ✅
```

---

**Tutorial Version:** 1.0  
**Last Updated:** October 24, 2025  
**Difficulty:** Beginner to Advanced
