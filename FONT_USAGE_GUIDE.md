# 🎨 Font Usage Guide - CIRVIA

## Fonts Implemented:
- **Poppins**: Main font untuk semua text (headings, body, UI)
- **Fira Code**: Monospace font untuk angka, formula, code, badges

---

## 📝 Usage Examples:

### Headings (Default - Poppins)
```tsx
<h1 className="text-4xl font-bold">Dashboard Guru</h1>
<h2 className="text-3xl font-semibold">Tambah Soal Baru</h2>
<h3 className="text-2xl font-medium">Informasi Dasar</h3>
```

### Body Text (Default - Poppins)
```tsx
<p className="text-base">Selamat datang di CIRVIA</p>
<span className="text-sm">Deskripsi soal...</span>
```

### Numbers & Formulas (Fira Code - Monospace)
```tsx
<span className="font-mono">V = I × R</span>
<span className="font-mono">200Ω</span>
<span className="font-mono">0.05A</span>
<span className="font-mono">12V</span>
<span className="font-mono text-xl font-bold">3.14159</span>
```

### Badges & Tags (Fira Code looks cool!)
```tsx
<span className="font-mono text-sm px-3 py-1 bg-green-500/20 rounded-full">
  EASY
</span>
<span className="font-mono text-xs uppercase tracking-wider">
  MEDIUM
</span>
```

### Circuit Values
```tsx
<div className="font-mono">
  <div>Voltage: <span className="text-green-400">12V</span></div>
  <div>Current: <span className="text-yellow-400">0.05A</span></div>
  <div>Resistance: <span className="text-blue-400">200Ω</span></div>
</div>
```

### Question Numbers
```tsx
<span className="font-mono text-2xl font-bold">01</span>
<span className="font-mono text-lg">Soal #15</span>
```

### Timer/Counter
```tsx
<div className="font-mono text-3xl font-bold tabular-nums">
  00:45:30
</div>
```

### Code Blocks
```tsx
<pre className="font-mono text-sm bg-slate-900/50 p-4 rounded-lg">
  <code>const voltage = 12; // Volts</code>
</pre>
```

---

## 🎯 Best Practices:

1. **Default = Poppins** - Tidak perlu `font-sans`, sudah default
2. **Numbers/Formula = Fira Code** - Selalu pakai `font-mono`
3. **Tabular Numbers** - Tambah `tabular-nums` untuk alignment angka
4. **Weight Poppins**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
5. **Antialiasing** - Sudah di-set di layout.tsx

---

## 🔄 Migration Notes:

Semua komponen otomatis pakai Poppins (karena `font-sans` default).
Hanya perlu tambah `font-mono` untuk:
- Angka (voltage, current, resistance)
- Formula fisika (V=IR, P=VI)
- Badges/tags
- Timer/counter
- Code snippets

---

## ✅ Updated Files:
- `src/app/layout.tsx` - Import Poppins + Fira Code
- `tailwind.config.js` - Configure font families

---

Enjoy the new typography! 🚀
