# Circuit Builder Enhanced - Fitur Praktikum Drag & Drop

## 🎯 Overview

Komponen `CircuitBuilderEnhanced` adalah simulasi rangkaian listrik interaktif yang realistis dengan fitur drag & drop, visualisasi aliran arus, dan feedback visual/audio yang immersive.

## ✨ Fitur Utama

### 1. **Komponen Realistis dengan Ikon SVG**

#### 🔋 Baterai (Battery)

- Desain realistis dengan gradient kuning/orange
- Terminal positif (+) dan negatif (-) yang jelas
- Label tegangan (V) yang dapat dikustomisasi
- Kabel penghubung ke terminal

#### 💡 Lampu (Lamp)

- **Status OFF**: Lampu redup berwarna abu-abu
- **Status ON**:
  - Lampu bercahaya dengan warna kuning hangat
  - Efek glow dengan `drop-shadow` dan animasi pulse
  - Brightness dinamis berdasarkan daya yang diterima
  - Filamen yang terlihat ketika menyala
  - Display daya (Watt) real-time
- Deteksi otomatis apakah rangkaian tertutup

#### 🔌 Resistor

- Desain dengan color bands (pita warna) yang realistis
- Warna berbeda untuk nilai resistansi
- Label resistansi (Ω)

#### ⚡ Saklar (Switch)

- **Visual State**:
  - OPEN: Tuas merah terangkat 15 derajat
  - CLOSED: Tuas hijau horizontal
- Double-click untuk toggle
- Feedback audio ketika dioperasikan
- Label status yang jelas

### 2. **Kabel Bezier yang Smooth**

- Menggunakan **Cubic Bezier Curves** untuk tampilan fleksibel dan alami
- Auto-adjust control points berdasarkan jarak komponen
- Animasi aliran arus dengan:
  - Garis putus-putus bergerak (dash-offset animation)
  - Partikel elektron yang mengalir
  - Efek glow kuning keemasan
  - Kecepatan animasi konsisten

### 3. **Sistem Validasi Rangkaian (Graph Algorithm)**

#### Graph-Based Circuit Analysis

```typescript
function analyzeCircuit(elements, wires) {
  // Build adjacency graph
  // BFS traversal untuk deteksi konektivitas
  // Validasi closed loop
  // Check open switches
}
```

**Features:**

- Deteksi apakah semua komponen terhubung
- Validasi rangkaian tertutup (closed loop)
- Identifikasi saklar terbuka
- Real-time validation saat komponen diubah

### 4. **Perhitungan Listrik (Hukum Ohm)**

#### Series Circuit (Rangkaian Seri)

```
V_total = V1 + V2 + V3...
R_total = R1 + R2 + R3...
I = V_total / R_total
P = V * I
```

#### Support untuk Rangkaian Paralel

- Deteksi cabang paralel berdasarkan graph topology
- Perhitungan resistansi paralel: `1/R_total = 1/R1 + 1/R2 + ...`
- Distribusi arus pada setiap cabang
- Tegangan sama pada komponen paralel

### 5. **Animasi Aliran Arus**

- Partikel elektron yang bergerak sepanjang kabel
- Kecepatan animasi: 50ms per frame
- 3 partikel per wire dengan offset yang berbeda
- Hanya muncul ketika rangkaian aktif dan tertutup

### 6. **Feedback Visual & Audio**

#### Visual Feedback:

- **Hover**: Scale transform pada button (1.05x)
- **Drag**: Drop shadow yang lebih besar
- **Selection**: Border biru putus-putus dengan pulse animation
- **Terminal Highlight**: Scale 1.25x ketika hover
- **Status Messages**: Gradient background dengan icon

#### Audio Feedback:

```typescript
- Add Component: 600Hz, 50ms
- Connect Wire: 1000Hz, 60ms
- Toggle Switch: 900Hz/600Hz, 80ms
- Delete: 300Hz, 100ms
- Rotate: 650Hz, 40ms
```

### 7. **UI/UX Improvements**

#### Layout & Responsiveness:

- Responsive canvas size (mobile: 360x400, desktop: 1000x600)
- Grid system dengan snap-to-grid (20px)
- Flexbox toolbar dengan wrapping
- Gradient backgrounds dengan Tailwind CSS
- Shadow layers (shadow-lg, shadow-xl, shadow-2xl)
- Border radius besar (rounded-xl, rounded-2xl)

#### Komponen Interaktif:

- Hover states dengan smooth transitions
- Disabled states untuk button yang tidak aktif
- Loading states dengan pulse animation
- Drag handles yang jelas
- Visual indicators untuk connect mode

### 8. **Fitur Tambahan**

#### Reset Circuit

- Menghapus semua komponen dan kabel
- Audio feedback
- Konfirmasi visual

#### Stats Display

- Real-time calculations:
  - Tegangan Total (V)
  - Resistansi Total (Ω)
  - Arus (A)
  - Daya (W)
- Gradient cards dengan color coding
- Responsive grid layout
- Toggle untuk mobile

#### Status Messages:

- "Mulai dengan menambahkan komponen" (empty state)
- "Aktifkan Mode Koneksi" (no wires)
- "Rangkaian belum tertutup" (incomplete circuit)
- "Saklar terbuka" (switch open)
- "Rangkaian tertutup! Arus mengalir" (success)

## 🎨 Design System

### Color Palette:

```css
- Battery: Amber/Orange gradient (#fbbf24 → #f59e0b)
- Lamp: Yellow (#fef3c7, glow: #fbbf24)
- Resistor: Red/Pink gradient (#ef4444 → #ec4899)
- Switch: Green/Red (#10b981 / #ef4444)
- Wire: Dark gray (#1f2937)
- Current Flow: Gold (#fbbf24)
- Selection: Blue (#3b82f6)
```

### Typography:

- Font sizes: 10px (mobile), 12px (desktop), 14px (headers)
- Font weights: medium (500), bold (700)
- Text colors: slate/gray scale

### Spacing:

- Grid: 20px
- Padding: 4-6 (16-24px)
- Gaps: 2-3 (8-12px)
- Border radius: xl (12px), 2xl (16px)

## 🚀 Usage

```tsx
import CircuitBuilderEnhanced from "@/components/CircuitBuilderEnhanced";

export default function PracticumPage() {
  return (
    <div>
      <CircuitBuilderEnhanced />
    </div>
  );
}
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Audio API may not work in some browsers

## 🔧 Technical Stack

- **React 18+** with TypeScript
- **Next.js 14+** (App Router)
- **Tailwind CSS** untuk styling
- **SVG** untuk rendering komponen
- **Web Audio API** untuk sound effects
- **CSS Animations** untuk smooth transitions

## 📊 Performance

- Smooth 60 FPS animations
- Minimal re-renders dengan useMemo
- Efficient graph algorithms (O(V+E))
- Optimized SVG rendering

## 🎓 Educational Value

- Visual pembelajaran Hukum Ohm
- Pemahaman rangkaian seri/paralel
- Konsep aliran arus listrik
- Hands-on experimentation
- Real-time feedback untuk eksperimen

## 🔮 Future Enhancements

- [ ] Voltmeter/Ammeter virtual
- [ ] Capacitor dan Inductor
- [ ] AC circuit simulation
- [ ] Save/Load circuit designs
- [ ] Export to image
- [ ] Undo/Redo functionality
- [ ] Multi-branch parallel circuits
- [ ] Circuit templates
- [ ] Mobile touch gestures (pinch to zoom)
- [ ] Dark mode support

---

**Created by:** CIRVIA Team  
**Version:** 2.0.0  
**Last Updated:** October 24, 2025
