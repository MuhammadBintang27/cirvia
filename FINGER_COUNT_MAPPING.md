# 🖐️ Finger Count to Component Mapping

## Mapping Komponen Rangkaian

Sistem menggunakan **tangan kiri** untuk menambahkan komponen dengan menghitung jumlah jari yang terentang.

### 📋 Tabel Mapping

| Jumlah Jari | Komponen              | Icon | Gesture                                                                  |
| ----------- | --------------------- | ---- | ------------------------------------------------------------------------ |
| **1** 👆    | **Battery (Baterai)** | 🔋   | Tunjukkan 1 jari (telunjuk) selama 3 detik                               |
| **2** ✌️    | **Lamp (Lampu)**      | 💡   | Tunjukkan 2 jari (telunjuk + tengah) selama 3 detik                      |
| **3** 🤟    | **Resistor**          | ⚡   | Tunjukkan 3 jari (telunjuk + tengah + manis) selama 3 detik              |
| **4** 🖖    | **Switch (Saklar)**   | 🔘   | Tunjukkan 4 jari (telunjuk + tengah + manis + kelingking) selama 3 detik |
| **5** 🖐️    | **Wire (Kabel)**      | ━    | Tunjukkan 5 jari (semua jari terentang) selama 3 detik                   |

## 🎯 Cara Menggunakan

1. **Gunakan Tangan Kiri** untuk menambahkan komponen
2. **Tunjukkan jumlah jari** sesuai komponen yang diinginkan
3. **Tahan selama 3 detik** hingga progress bar penuh
4. **Komponen akan ditambahkan** di posisi tangan Anda

### ⚠️ Tips Penting untuk Menunjukkan Jari:

- **Untuk 1 jari**: Tunjukkan **hanya telunjuk**, pastikan ibu jari **tertekuk ke dalam** telapak tangan
- **Untuk 2 jari**: Tunjukkan **telunjuk + jari tengah**, ibu jari tetap tertekuk
- **Untuk 3 jari**: Tunjukkan **telunjuk + tengah + manis**, ibu jari tetap tertekuk
- **Untuk 4 jari**: Tunjukkan **telunjuk + tengah + manis + kelingking**, ibu jari tetap tertekuk
- **Untuk 5 jari**: Buka **semua jari** termasuk ibu jari (telapak tangan terbuka penuh)

**PENTING:** Jika ibu jari tidak tertekuk dengan baik, sistem akan menghitung +1 jari ekstra!

## 🔧 Implementasi Kode

### File: `CircuitController.ts` (Baris 337-343)

```typescript
const componentMap: { [key: number]: ComponentType } = {
  1: "battery", // 🔋 Baterai
  2: "lamp", // 💡 Lampu
  3: "resistor", // ⚡ Resistor
  4: "switch", // 🔘 Saklar
  5: "wire", // ━ Kabel
};
```

### File: `GestureDetector.ts` (Baris 177-183)

```typescript
const componentNames: { [key: number]: string } = {
  1: "🔋 BATTERY",
  2: "💡 LAMP",
  3: "⚡ RESISTOR",
  4: "🔘 SWITCH",
  5: "━ WIRE",
};
```

### File: `WebCVPracticum.tsx` (Baris 1958-1962)

```tsx
{
  fingerCountSelection.fingerCount === 1 && " 🔋 Baterai";
}
{
  fingerCountSelection.fingerCount === 2 && " 💡 Lampu";
}
{
  fingerCountSelection.fingerCount === 3 && " ⚡ Resistor";
}
{
  fingerCountSelection.fingerCount === 4 && " 🔘 Saklar";
}
{
  fingerCountSelection.fingerCount === 5 && " ━ Kabel";
}
```

## ✅ Verifikasi dari Log

Dari log debugging (`cv-practicum-debug.log`):

```
[15:11:01.722] ACTION: ADD: resistor  ✅ (3 jari)
[15:11:05.904] ACTION: ADD: battery   ✅ (1 jari)
[15:11:11.363] ACTION: ADD: switch    ✅ (4 jari)
[15:11:26.716] ACTION: ADD: switch    ✅ (4 jari)
```

**Semua mapping sudah bekerja dengan benar!** ✨

## 🐛 Troubleshooting

Jika komponen yang ditambahkan tidak sesuai:

1. **Pastikan menggunakan tangan kiri** (sistem membedakan tangan kiri dan kanan)
2. **Tahan gesture selama 3 detik penuh** (lihat progress bar)
3. **Pastikan jari terentang dengan jelas** (tidak setengah tertekuk)
4. **Periksa pencahayaan** (kamera perlu melihat tangan dengan jelas)
5. **Jaga tangan tetap stabil** (gerakan terlalu cepat akan reset timer)

## 📝 Catatan Teknis

- **Hold Duration**: 3 detik (3000ms) - dapat diubah di `GestureDetector.ts` → `fingerCountHoldDuration`
- **Hand Stability**: Tangan harus stabil (movement < 3% frame) agar timer tidak reset
- **Confidence Threshold**: Gesture harus memiliki confidence > 0.75
- **Detection Method**: Menggunakan MediaPipe Hands untuk deteksi landmark tangan
