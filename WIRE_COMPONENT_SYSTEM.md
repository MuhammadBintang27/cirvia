# 🧵 Sistem Kabel sebagai Komponen - Circuit Builder Enhanced

## 🎯 Konsep Baru

Sekarang **Kabel (Wire)** adalah **item/komponen tersendiri** yang bisa ditambahkan dan diatur seperti komponen lainnya (Baterai, Lampu, Resistor, Saklar).

### ✨ Keuntungan Sistem Baru:

1. **Lebih Fleksibel**: Bisa menambahkan kabel sesuai kebutuhan
2. **Mudah Membuat Paralel**: Tinggal tambah lebih banyak kabel
3. **Visual Lebih Jelas**: Kabel terlihat sebagai objek fisik
4. **Drag & Drop**: Kabel bisa dipindahkan seperti komponen lain
5. **Status Koneksi**: Bisa lihat apakah kabel sudah terhubung atau belum

---

## 📋 Cara Menggunakan

### **1. Tambah Kabel ke Canvas**

```
Klik tombol "🧵 Kabel" di toolbar
→ Kabel akan muncul di canvas
→ Bisa di-drag untuk memindahkan posisi
```

### **2. Hubungkan Ujung Kabel ke Komponen**

#### Langkah-langkah:

```
1. Klik tombol "🔗 Mode Koneksi"
2. Klik TERMINAL KABEL (bulatan di ujung kabel)
3. Lalu klik TERMINAL KOMPONEN (Baterai/Lampu/dll)
4. Ujung kabel akan terhubung! ✅
5. Ulangi untuk ujung kabel lainnya
```

#### Contoh Sederhana (Rangkaian Seri):

```
Baterai ← Kabel1 → Lampu
  ●─────[🧵]─────●

Langkah:
1. Tambah: Baterai, Kabel, Lampu
2. Mode Koneksi ON
3. Klik Kabel(ujung A) → Klik Baterai(terminal +)
4. Klik Kabel(ujung B) → Klik Lampu(terminal kiri)
5. Tambah Kabel2 untuk menutup rangkaian
6. Klik Kabel2(ujung A) → Klik Lampu(terminal kanan)
7. Klik Kabel2(ujung B) → Klik Baterai(terminal -)
```

---

## 🔄 Membuat Rangkaian Paralel

Sekarang sangat mudah membuat rangkaian paralel!

### **Contoh: 2 Lampu Paralel**

```
        ┌── Kabel1 ── Lampu1 ── Kabel3 ──┐
Baterai ┤                                 ├─ Baterai
        └── Kabel2 ── Lampu2 ── Kabel4 ──┘
```

#### Langkah Detail:

```
1. Tambah komponen:
   - 1x Baterai
   - 2x Lampu
   - 4x Kabel

2. Hubungkan:
   A. Kabel1: Baterai(+) → Lampu1(kiri)
   B. Kabel2: Baterai(+) → Lampu2(kiri)  ← PARALEL!
   C. Kabel3: Lampu1(kanan) → Baterai(-)
   D. Kabel4: Lampu2(kanan) → Baterai(-) ← PARALEL!

3. Selesai! Kedua lampu akan menyala dengan brightness yang sama
```

### **Rangkaian Seri vs Paralel**

#### Seri (Lampu Redup):

```
Baterai → Kabel1 → Lampu1 → Kabel2 → Lampu2 → Kabel3 → Baterai
(Arus sama, tegangan terbagi)
```

#### Paralel (Lampu Terang):

```
        ┌── Lampu1 ──┐
Baterai ┤            ├── Baterai
        └── Lampu2 ──┘
(Tegangan sama, arus terbagi)
```

---

## 🎨 Visual Indikator

### **Status Kabel:**

| Status                 | Tampilan                           | Keterangan                |
| ---------------------- | ---------------------------------- | ------------------------- |
| **Belum Terhubung**    | Label: "Belum" (Orange)            | Kedua ujung belum connect |
| **Sebagian Terhubung** | Label: "Sebagian" (Orange)         | 1 ujung sudah connect     |
| **Terhubung Penuh**    | Label: "Terhubung" (Hijau) + Pulse | Kedua ujung sudah connect |

### **Terminal Kabel:**

- **Tidak Terhubung**: Terminal abu-abu
- **Terhubung**: Lingkaran hijau dengan animasi pulse

---

## ⚡ Aliran Arus

Ketika rangkaian tertutup dan saklar ON:

- **Animasi partikel elektron** mengalir melalui kabel
- **Garis kuning putus-putus** bergerak
- **Efek glow** pada kabel yang dialiri arus
- **Lampu menyala** jika mendapat arus

---

## 🔧 Fitur Lanjutan

### **Drag & Drop Kabel**

```
• Klik dan drag kabel untuk memindahkan
• Koneksi tetap terjaga saat dipindah
• Bisa rotasi kabel (↻ Rotasi)
```

### **Hapus Kabel**

```
1. Klik kabel untuk select
2. Klik tombol "🗑️ Hapus"
3. Koneksi akan terputus otomatis
```

### **Putuskan Koneksi**

```
- Hapus kabel = koneksi terputus
- Atau hapus komponen yang terhubung
```

---

## 💡 Tips & Trik

### ✅ **Best Practices:**

1. **Rencanakan Layout Dulu**

   - Posisikan komponen sebelum menambah kabel
   - Beri jarak yang cukup

2. **Gunakan Rotasi**

   - Putar kabel agar rapi (0°, 90°, 180°, 270°)
   - Sesuaikan orientasi dengan layout

3. **Warna Kabel (Future)**

   - Saat ini semua kabel hitam
   - Bisa di-customize untuk + dan -

4. **Paralel = Banyak Kabel**
   - Jangan takut tambah banyak kabel
   - Setiap cabang paralel butuh kabel tersendiri

### ⚠️ **Common Mistakes:**

1. **Lupa Menutup Rangkaian**

   - Pastikan arus bisa kembali ke baterai (-)
   - Butuh minimal: Komponen + Kabel = Loop

2. **Kabel Belum Terhubung Penuh**

   - Cek label kabel: harus "Terhubung" (hijau)
   - Kedua ujung harus terkoneksi

3. **Saklar Terbuka**
   - Double-click saklar untuk CLOSED
   - Cek label: harus hijau "CLOSED"

---

## 🎓 Contoh Praktis

### **Contoh 1: Rangkaian Seri Sederhana**

```
Komponen:
- 1 Baterai (12V)
- 1 Resistor (100Ω)
- 1 Lampu (50Ω)
- 3 Kabel

Koneksi:
Kabel1: Baterai(+) → Resistor(kiri)
Kabel2: Resistor(kanan) → Lampu(kiri)
Kabel3: Lampu(kanan) → Baterai(-)

Hasil:
- Total R = 150Ω
- I = 12V / 150Ω = 0.08A
- Lampu menyala redup
```

### **Contoh 2: Rangkaian Paralel 2 Lampu**

```
Komponen:
- 1 Baterai (12V)
- 2 Lampu (masing-masing 50Ω)
- 4 Kabel

Koneksi:
Kabel1: Baterai(+) → Lampu1(kiri)
Kabel2: Baterai(+) → Lampu2(kiri)
Kabel3: Lampu1(kanan) → Baterai(-)
Kabel4: Lampu2(kanan) → Baterai(-)

Hasil:
- Total R = 1/(1/50 + 1/50) = 25Ω
- I total = 12V / 25Ω = 0.48A
- Setiap lampu: I = 0.24A
- Lampu menyala TERANG (lebih terang dari seri!)
```

### **Contoh 3: Mixed (Seri + Paralel)**

```
Komponen:
- 1 Baterai (12V)
- 1 Resistor (100Ω) - SERI
- 2 Lampu (50Ω) - PARALEL
- 5 Kabel

Koneksi:
Kabel1: Baterai(+) → Resistor(kiri)
Kabel2: Resistor(kanan) → Lampu1(kiri)
Kabel3: Resistor(kanan) → Lampu2(kiri)  ← cabang paralel
Kabel4: Lampu1(kanan) → Baterai(-)
Kabel5: Lampu2(kanan) → Baterai(-)

Hasil:
- R_seri = 100Ω
- R_paralel = 25Ω
- Total = 125Ω
- I = 12V / 125Ω = 0.096A
```

---

## 🚀 Keunggulan Sistem Baru

| Fitur                 | Sistem Lama   | Sistem Baru (Kabel Item) |
| --------------------- | ------------- | ------------------------ |
| **Fleksibilitas**     | Terbatas      | ✅ Sangat Fleksibel      |
| **Rangkaian Paralel** | Sulit         | ✅ Mudah                 |
| **Visual Feedback**   | Minim         | ✅ Jelas (status label)  |
| **Drag & Drop Kabel** | ❌ Tidak bisa | ✅ Bisa                  |
| **Jumlah Kabel**      | Fixed         | ✅ Unlimited             |
| **Learning Curve**    | Mudah         | ✅ Intuitive             |

---

## 🔮 Fitur Mendatang

- [ ] **Kabel Berwarna** (Merah untuk +, Hitam untuk -)
- [ ] **Auto-routing** kabel yang lebih smart
- [ ] **Snap to nearest terminal**
- [ ] **Junction node** untuk titik cabang
- [ ] **Kabel dengan panjang berbeda**
- [ ] **Display voltage/current per wire**

---

**Version:** 2.1.0  
**Feature:** Wire as Component System  
**Date:** October 24, 2025
