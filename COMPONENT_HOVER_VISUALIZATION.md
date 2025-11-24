# 🎨 Visualisasi Komponen: SEBELUM vs SAAT HOVER

## 🔋 **BATERAI (Battery)**

### SEBELUM HOVER (Normal State)

```
┌──────────────────────┐
│                      │
│    ╔════════════╗    │
│    ║  -    🔋  +  ║   │  ← Simbol + dan - tampil
│    ║            ║    │
│    ╚════════════╝    │
│   ●L           ●R    │  ← Terminal L/R (10px radius)
│  (Red)       (Blue)  │
│                      │
└──────────────────────┘

Properties:
- Ukuran: Normal (50x30px)
- Terminal: 10px radius
- Warna: Red/Black dengan simbol +/-
- Font terminal L/R: 12px
- Tidak ada glow
- Scale: 1.0x
```

### SAAT HOVER (Enlarged & Highlighted)

```
╔══════════════════════════════════════╗
║  [OVERLAY GELAP - DIM OTHER]         ║
║                                      ║
║    ┏━━━━━━━━━━━━━━━━━━━━━━┓         ║
║    ┃  ╔═══════════════╗   ┃         ║
║    ┃  ║  -    🔋    +  ║  ┃ GLOW    ║  ← 1.8x LEBIH BESAR
║    ┃  ║                ║   ┃ KUNING  ║  ← Simbol +/- tetap tampil
║    ┃  ╚═══════════════╝   ┃         ║
║    ┗━━━━━━━━━━━━━━━━━━━━━━┛         ║
║      LEFT          RIGHT             ║
║       ⭕L            ⭕R              ║  ← Terminal 24px (2.4x lebih besar)
║      (Red)         (Blue)            ║
║                                      ║
║   👆 Arahkan jari ke terminal L/R   ║  ← Instruction box
╚══════════════════════════════════════╝

Properties:
- Ukuran: BESAR (90x54px) - 1.8x scale
- Terminal: 24px radius (2.4x lebih besar)
- Warna: SAMA seperti asli (Red/Black +/-)
- Font terminal L/R: 18px (1.5x lebih besar)
- Label "LEFT"/"RIGHT" di atas terminal
- Glow kuning (shadowBlur: 25px)
- Overlay gelap 60% opacity
- Scale: 1.8x
```

---

## 🔆 **LAMPU (Lamp)**

### SEBELUM HOVER

```
┌──────────────────────┐
│                      │
│       ⚪💡⚪         │  ← Lampu bulat dengan filament
│      /       \       │
│    ●L         ●R     │  ← Terminal 10px
│  (Red)      (Blue)   │
│                      │
└──────────────────────┘

Properties:
- Diameter: 40px
- Terminal: 10px radius
- Warna: Yellow/White (jika menyala)
- Filament: Terlihat di dalam
- Scale: 1.0x
```

### SAAT HOVER

```
╔══════════════════════════════════════╗
║  [OVERLAY GELAP]                     ║
║                                      ║
║         ┏━━━━━━━━━━━┓                ║
║         ┃    ⚪💡⚪   ┃  GLOW          ║  ← 1.8x LEBIH BESAR (72px)
║         ┃   /     \  ┃  KUNING        ║  ← Filament tetap tampil
║         ┗━━━━━━━━━━━┛                ║
║      LEFT      RIGHT                 ║
║       ⭕L        ⭕R                  ║  ← Terminal 24px
║                                      ║
║   👆 Arahkan jari ke terminal L/R   ║
╚══════════════════════════════════════╝

Properties:
- Diameter: 72px (1.8x lebih besar)
- Terminal: 24px radius
- Warna: SAMA seperti asli
- Filament: Tetap tampil detail
- Glow kuning di sekitar
- Scale: 1.8x
```

---

## ⚡ **RESISTOR (Resistor)**

### SEBELUM HOVER

```
┌──────────────────────┐
│                      │
│    ┌─/\/\/\/\/\─┐    │  ← Zigzag resistor
│    │  ≈≈≈≈≈≈≈≈  │    │  ← Pattern garis
│    └───────────┘     │
│   ●L           ●R    │  ← Terminal 10px
│  (Red)       (Blue)  │
│                      │
└──────────────────────┘

Properties:
- Ukuran: 60x20px
- Terminal: 10px radius
- Warna: Orange dengan zigzag pattern
- Scale: 1.0x
```

### SAAT HOVER

```
╔══════════════════════════════════════╗
║  [OVERLAY GELAP]                     ║
║                                      ║
║    ┏━━━━━━━━━━━━━━━━━━━━━━┓         ║
║    ┃  ┌───/\/\/\/\/\───┐  ┃ GLOW    ║  ← 1.8x LEBIH BESAR
║    ┃  │   ≈≈≈≈≈≈≈≈≈≈   │  ┃ KUNING  ║  ← Zigzag tetap tampil
║    ┃  └──────────────┘   ┃         ║
║    ┗━━━━━━━━━━━━━━━━━━━━━━┛         ║
║      LEFT          RIGHT             ║
║       ⭕L            ⭕R              ║  ← Terminal 24px
║                                      ║
║   👆 Arahkan jari ke terminal L/R   ║
╚══════════════════════════════════════╝

Properties:
- Ukuran: 108x36px (1.8x scale)
- Terminal: 24px radius
- Warna: SAMA (Orange dengan zigzag)
- Pattern: Tetap detail
- Glow kuning
- Scale: 1.8x
```

---

## 🔘 **SAKLAR (Switch)**

### SEBELUM HOVER

```
┌──────────────────────┐
│                      │
│    ┌─────────┐       │  ← Switch box
│    │  [ON]   │       │  ← Status ON/OFF
│    └─────────┘       │
│   ●L         ●R      │  ← Terminal 10px
│  (Red)     (Blue)    │
│                      │
└──────────────────────┘

Properties:
- Ukuran: 40x16px
- Terminal: 10px radius
- Status: ON (closed) atau OFF (open)
- Warna: Purple
- Scale: 1.0x
```

### SAAT HOVER

```
╔══════════════════════════════════════╗
║  [OVERLAY GELAP]                     ║
║                                      ║
║    ┏━━━━━━━━━━━━━━━━━━━━━━┓         ║
║    ┃  ┌─────────────┐     ┃ GLOW    ║  ← 1.8x LEBIH BESAR
║    ┃  │   [ON]      │     ┃ KUNING  ║  ← Status tetap tampil
║    ┃  └─────────────┘     ┃         ║
║    ┗━━━━━━━━━━━━━━━━━━━━━━┛         ║
║      LEFT          RIGHT             ║
║       ⭕L            ⭕R              ║  ← Terminal 24px
║                                      ║
║   👆 Arahkan jari ke terminal L/R   ║
╚══════════════════════════════════════╝

Properties:
- Ukuran: 72x29px (1.8x scale)
- Terminal: 24px radius
- Status: SAMA seperti asli (ON/OFF)
- Warna: Purple
- Glow kuning
- Scale: 1.8x
```

---

## 📊 **PERBANDINGAN UKURAN**

| Komponen     | SEBELUM (px) | SAAT HOVER (px) | Scale | Terminal |
| ------------ | ------------ | --------------- | ----- | -------- |
| **Baterai**  | 50 x 30      | 90 x 54         | 1.8x  | 10→24px  |
| **Lampu**    | Ø 40         | Ø 72            | 1.8x  | 10→24px  |
| **Resistor** | 60 x 20      | 108 x 36        | 1.8x  | 10→24px  |
| **Saklar**   | 40 x 16      | 72 x 29         | 1.8x  | 10→24px  |

---

## 🎨 **EFEK VISUAL SAAT HOVER**

### 1. **Overlay Gelap (Background Dimming)**

```css
Background: rgba(0, 0, 0, 0.6)
Effect: Komponen lain menjadi redup 60%
```

### 2. **Glow Kuning (Yellow Glow)**

```css
strokeStyle: #FBBF24 (Kuning)
shadowColor: #FBBF24
shadowBlur: 25px
lineWidth: 3px
```

### 3. **Terminal Enlargement**

```
Normal: 10px radius, font 12px
Hover:  24px radius, font 18px (2.4x & 1.5x bigger)
```

### 4. **Label Addition**

```
LEFT (di atas terminal L)
RIGHT (di atas terminal R)
Font: bold 12px Arial
Color: White dengan shadow hitam
```

### 5. **Instruction Box**

```
Box: 360x45px, rounded 10px
Background: rgba(0, 0, 0, 0.85)
Border: #FBBF24, 2px
Text: "👆 Arahkan jari ke terminal L atau R, tahan 2 detik"
```

---

## 🔑 **KUNCI PERUBAHAN**

### ✅ **YANG SAMA (Konsisten)**

- ✅ Warna komponen (baterai merah/hitam, resistor orange, lampu kuning, saklar ungu)
- ✅ Simbol dan detail (simbol +/- pada baterai, zigzag pada resistor, filament pada lampu)
- ✅ Orientasi dan rotasi komponen
- ✅ Status komponen (switch ON/OFF, lampu menyala/mati)

### ⬆️ **YANG BERUBAH (Saat Hover)**

- ⬆️ **Ukuran komponen**: 1.0x → 1.8x (80% lebih besar)
- ⬆️ **Ukuran terminal**: 10px → 24px (140% lebih besar)
- ⬆️ **Font terminal**: 12px → 18px (50% lebih besar)
- ⭐ **Glow effect**: Shadow blur 0 → 25px (kuning)
- 📦 **Overlay**: Background 0% → 60% opacity (dim)
- 🏷️ **Labels**: Tambah "LEFT" dan "RIGHT" di atas terminal
- 📝 **Instruction**: Tambah kotak instruksi di atas komponen

---

## 🎯 **IMPLEMENTASI KODE**

### SEBELUM HOVER (Lines 2553-2643)

```typescript
// Render komponen normal
components.forEach((component) => {
  CircuitComponentRenderer.renderComponent(
    ctx,
    component.type,
    component.position.x,
    component.position.y,
    component.rotation,
    { isSelected, isMobile: false, isOn, brightness, lampPower, switchState }
  );

  // Terminal kecil (10px)
  ctx.arc(terminalA.x, terminalA.y, 10, 0, Math.PI * 2);
  ctx.arc(terminalB.x, terminalB.y, 10, 0, Math.PI * 2);
});
```

### SAAT HOVER (Lines 2800-2920)

```typescript
// Terminal selection active
if (terminalSelection.isActive && terminalSelection.componentId) {
  // Overlay gelap
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Scale 1.8x + Render komponen asli
  ctx.scale(1.8, 1.8);
  CircuitComponentRenderer.renderComponent(
    ctx, component.type, 0, 0, 0,
    { isSelected: true, ... } // Highlight mode
  );

  // Glow kuning
  ctx.strokeStyle = "#FBBF24";
  ctx.shadowBlur = 25;

  // Terminal besar (24px)
  ctx.arc(terminalA.x, terminalA.y, 24, 0, Math.PI * 2);
  ctx.arc(terminalB.x, terminalB.y, 24, 0, Math.PI * 2);

  // Label LEFT/RIGHT
  ctx.font = "bold 12px Arial";
  ctx.fillText("LEFT", terminalA.x, terminalA.y - 40);
  ctx.fillText("RIGHT", terminalB.x, terminalB.y - 40);
}
```

---

## 💡 **KESIMPULAN**

**SEMUA KOMPONEN** (Baterai, Lampu, Resistor, Saklar) menggunakan **sistem yang sama**:

1. **SEBELUM HOVER**: Ukuran normal dengan terminal kecil (10px)
2. **SAAT HOVER**: Diperbesar 1.8x dengan terminal besar (24px), glow kuning, dan label LEFT/RIGHT

**DETAIL ASLI TETAP TAMPIL**:

- ✅ Simbol +/- pada baterai
- ✅ Zigzag pattern pada resistor
- ✅ Filament pada lampu
- ✅ Status ON/OFF pada saklar

Semua detail ini dirender oleh `CircuitComponentRenderer` yang sudah ada, hanya di-scale 1.8x saat hover! 🎨✨
