# 📖 Panduan Menambah Soal Posttest Tipe 1 (Circuit Questions)

## 🎯 Struktur Data Soal

Untuk menambah soal circuit di posttest, Anda perlu menambahkan objek baru di array `circuitQuestions` dalam file `src/lib/questions.ts`.

### 📋 Interface CircuitQuestion

```typescript
interface CircuitQuestion {
  id: number;                    // ID unik soal (increment dari soal terakhir)
  title: string;                // Judul soal
  description: string;          // Deskripsi/instruksi soal
  circuitType: 'series' | 'parallel';  // Tipe rangkaian
  voltage: number;              // Tegangan sumber (Volt)
  targetCurrent?: number;       // Target arus (Ampere) - opsional
  targetVoltage?: number;       // Target tegangan komponen - opsional  
  resistorSlots: number;        // Jumlah slot resistor (2-4)
  availableResistors: Resistor[]; // Resistor yang tersedia
  correctSolution: number[];    // Solusi benar (array nilai resistor)
  explanation: string;          // Penjelasan solusi
  hint: string;                 // Petunjuk untuk siswa
  difficulty: 'easy' | 'medium' | 'hard'; // Tingkat kesulitan
}
```

## 🔧 Langkah-Langkah Menambah Soal

### 1. Buka File Questions
```
src/lib/questions.ts
```

### 2. Scroll ke Array circuitQuestions
Cari bagian:
```typescript
export const circuitQuestions: CircuitQuestion[] = [
  // ... soal-soal yang sudah ada
];
```

### 3. Tambah Soal Baru Sebelum Penutup Array
```typescript
{
  id: 9, // ID berikutnya (increment dari soal terakhir)
  title: "Judul Soal Anda",
  description: "Instruksi soal yang jelas dan spesifik",
  circuitType: 'series', // atau 'parallel'
  voltage: 12, // Tegangan sumber dalam Volt
  targetCurrent: 0.2, // Target arus dalam Ampere
  resistorSlots: 2, // Jumlah slot resistor (2-4)
  availableResistors: availableResistors.slice(0, 6), // Resistor yang bisa dipilih
  correctSolution: [47, 100], // Nilai resistor yang benar (urutan sesuai slot)
  explanation: "Penjelasan mengapa solusi ini benar dengan perhitungan",
  hint: "Petunjuk untuk membantu siswa menyelesaikan soal",
  difficulty: 'medium' // easy, medium, atau hard
}
```

## 🎨 Contoh Soal Lengkap

### Contoh 1: Rangkaian Seri
```typescript
{
  id: 9,
  title: "Rangkaian Seri Lampu LED",
  description: "Buat rangkaian seri untuk menyalakan LED dengan arus 0.02A menggunakan baterai 9V",
  circuitType: 'series',
  voltage: 9,
  targetCurrent: 0.02,
  resistorSlots: 2,
  availableResistors: availableResistors.slice(0, 8),
  correctSolution: [220, 220], // Total = 440Ω, I = 9V/440Ω ≈ 0.02A
  explanation: "Rtotal yang dibutuhkan = V/I = 9V/0.02A = 450Ω. Dengan R1=220Ω dan R2=220Ω: Rtotal = 440Ω, I = 9V/440Ω = 0.0205A ≈ 0.02A",
  hint: "Gunakan hukum Ohm: R = V/I untuk menentukan resistansi total yang diperlukan",
  difficulty: 'medium'
}
```

### Contoh 2: Rangkaian Paralel
```typescript
{
  id: 10,
  title: "Pembagi Arus Paralel",
  description: "Susun tiga resistor paralel untuk mendapatkan arus total 0.3A dengan tegangan 6V",
  circuitType: 'parallel',
  voltage: 6,
  targetCurrent: 0.3,
  resistorSlots: 3,
  availableResistors: availableResistors.slice(2, 9),
  correctSolution: [100, 100, 100], // 1/Rtotal = 3/100, Rtotal = 33.3Ω, I = 0.18A
  explanation: "Target Rtotal = 6V/0.3A = 20Ω. Tiga resistor 100Ω paralel: 1/Rtotal = 1/100 + 1/100 + 1/100 = 3/100, Rtotal = 33.3Ω",
  hint: "Dalam paralel: 1/Rtotal = 1/R1 + 1/R2 + 1/R3. Semakin banyak cabang, semakin kecil resistansi total",
  difficulty: 'hard'
}
```

## 📊 Resistor yang Tersedia

```typescript
const availableResistors = [
  { id: 1, value: 10, label: '10Ω' },    // availableResistors[0]
  { id: 2, value: 22, label: '22Ω' },    // availableResistors[1]
  { id: 3, value: 47, label: '47Ω' },    // availableResistors[2]
  { id: 4, value: 100, label: '100Ω' },  // availableResistors[3]
  { id: 5, value: 220, label: '220Ω' },  // availableResistors[4]
  { id: 6, value: 330, label: '330Ω' },  // availableResistors[5]
  { id: 7, value: 470, label: '470Ω' },  // availableResistors[6]
  { id: 8, value: 680, label: '680Ω' },  // availableResistors[7]
  { id: 9, value: 1000, label: '1kΩ' },  // availableResistors[8]
  // ... dan seterusnya
];
```

### Cara Memilih Resistor:
```typescript
// Menggunakan resistor pertama sampai ke-6 (10Ω - 330Ω)
availableResistors: availableResistors.slice(0, 6)

// Menggunakan resistor ke-3 sampai ke-8 (47Ω - 680Ω)  
availableResistors: availableResistors.slice(2, 8)

// Menggunakan semua resistor
availableResistors: availableResistors
```

## 🧮 Tips Perhitungan

### Rangkaian Seri:
- **Rtotal = R1 + R2 + R3 + ...**
- **Arus sama di semua komponen: I = V/Rtotal**
- **Tegangan terbagi: V1 = I × R1**

### Rangkaian Paralel:
- **1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ...**
- **Tegangan sama di semua cabang**
- **Arus terbagi: I1 = V/R1**

## 💡 Best Practices

### 1. **ID Soal**
- Selalu increment dari soal terakhir
- Jangan ada ID yang duplikat

### 2. **Target Values**
- Gunakan `targetCurrent` untuk soal yang fokus pada arus
- Gunakan `targetVoltage` untuk soal yang fokus pada tegangan komponen
- Bisa gunakan keduanya jika perlu validasi kedua parameter

### 3. **Correct Solution**
- Hitung dengan teliti menggunakan hukum Ohm
- Urutkan sesuai dengan slot resistor (slot 1, slot 2, dst.)
- Pastikan hasil perhitungan mendekati target (toleransi ±10%)

### 4. **Explanation**
- Sertakan rumus yang digunakan
- Tunjukkan langkah perhitungan
- Jelaskan konsep fisika di baliknya

### 5. **Hint**
- Berikan petunjuk konseptual, bukan jawaban langsung
- Arahkan ke rumus atau prinsip yang relevan
- Buat hints yang membantu proses berpikir

### 6. **Difficulty Level**
- **Easy**: 1-2 resistor, perhitungan sederhana
- **Medium**: 2-3 resistor, perlu analisis
- **Hard**: 3+ resistor, konsep kompleks

## 🚀 Setelah Menambah Soal

1. **Save file** `questions.ts`
2. **Test** posttest untuk memastikan soal baru muncul
3. **Verifikasi** perhitungan dengan menyelesaikan soal
4. **Cek** apakah explanation dan hint membantu

Soal baru akan otomatis muncul di posttest tanpa perlu restart server! ✨