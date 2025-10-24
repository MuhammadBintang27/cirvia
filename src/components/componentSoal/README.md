# 📁 Components Structure - componentSoal

## 🎯 Tujuan Folder

Folder `components/componentSoal` berisi komponen-komponen yang khusus digunakan untuk **sistem soal/pertanyaan** dalam aplikasi CIRVIA. Komponen di folder ini digunakan oleh berbagai tipe soal melalui sistem modular.

## 📂 Struktur Folder

```
src/components/
├── componentSoal/          # ✨ Komponen khusus soal
│   ├── CircuitDiagram.tsx      # Diagram rangkaian interaktif
│   └── ResistorSelector.tsx    # Selector resistor drag & drop
├── tipesoal/              # 🧩 Komponen tipe soal
│   ├── TipeSoal1.tsx          # Circuit questions
│   ├── TipeSoal2.tsx          # Multiple choice (🔜)
│   ├── TipeSoal3.tsx          # True/False (🔜)
│   ├── TipeSoal4.tsx          # Fill in blank (🔜)
│   └── QuestionRenderer.tsx    # Router komponen
└── ...                    # Komponen umum lainnya
```

## 🔧 Komponen di componentSoal

### 1. **CircuitDiagram.tsx**
**Fungsi**: Menampilkan diagram rangkaian listrik interaktif
```typescript
interface CircuitDiagramProps {
  circuitType: 'series' | 'parallel';
  voltage: number;
  resistorValues: (number | null)[];
  resistorSlots: number;
  onSlotClick?: (slotIndex: number) => void;
  activeSlot?: number;
  showValues?: boolean;
}
```

**Fitur**:
- ✅ Series & parallel circuit visualization
- ✅ Interactive resistor slots (klik untuk pilih)
- ✅ Real-time calculation display
- ✅ Visual feedback untuk active slot
- ✅ SVG-based responsive design

**Digunakan oleh**: 
- `TipeSoal1` (Circuit questions)

### 2. **ResistorSelector.tsx**
**Fungsi**: Interface untuk memilih resistor dengan nilai tertentu
```typescript
interface ResistorSelectorProps {
  availableResistors: Resistor[];
  onResistorSelect: (resistor: Resistor) => void;
  selectedResistor: Resistor | null;
  disabled?: boolean;
}
```

**Fitur**:
- ✅ Grid layout resistor options
- ✅ Color-coded resistor values
- ✅ Visual selection feedback
- ✅ Disabled state support
- ✅ Responsive design

**Digunakan oleh**:
- `TipeSoal1` (Circuit questions)

## 🔄 Alur Penggunaan

### Dalam TipeSoal1:
```typescript
import CircuitDiagram from '@/components/componentSoal/CircuitDiagram';
import ResistorSelector from '@/components/componentSoal/ResistorSelector';

// 1. User pilih resistor di ResistorSelector
// 2. User klik slot di CircuitDiagram
// 3. Resistor terpasang di slot
// 4. CircuitDiagram menampilkan perhitungan real-time
// 5. User submit jawaban
```

## 📈 Roadmap Pengembangan

### 🔜 Komponen Tambahan yang Akan Ditambah:
- **FormulaDisplay.tsx** - Menampilkan rumus dan perhitungan
- **AnswerValidator.tsx** - Validasi jawaban dengan feedback
- **HintPanel.tsx** - Panel petunjuk yang dapat di-toggle
- **ProgressIndicator.tsx** - Indikator progress soal
- **TimerComponent.tsx** - Timer untuk soal
- **ScoreCalculator.tsx** - Kalkulator skor dengan breakdown

### 🎯 Tipe Soal yang Akan Menggunakan:
- **TipeSoal2** (Multiple Choice) - Mungkin perlu FormulaDisplay
- **TipeSoal3** (True/False) - Bisa pakai AnswerValidator
- **TipeSoal4** (Fill in Blank) - Perlu FormulaDisplay & validator
- **TipeSoal5** (Drag & Drop) - Mungkin evolusi dari ResistorSelector

## 🛠️ Guidelines Pengembangan

### 1. **Naming Convention**
```typescript
// ✅ Good
ComponentName.tsx         // PascalCase untuk komponen
interface ComponentProps  // Props interface dengan suffix
```

### 2. **Import Path**
```typescript
// ✅ Untuk komponen dalam componentSoal
import ComponentName from '@/components/componentSoal/ComponentName';

// ✅ Untuk tipe soal menggunakan komponen ini
import TipeSoal1 from '@/components/tipesoal/TipeSoal1';
```

### 3. **Reusability**
- Komponen di folder ini harus **reusable** untuk berbagai tipe soal
- Hindari business logic yang spesifik untuk satu tipe soal
- Gunakan props untuk customization
- Support disabled/readonly states

### 4. **Testing**
- Setiap komponen harus memiliki unit tests
- Test interactive behaviors (click, drag, input)
- Test edge cases (empty data, error states)

## 📝 Contoh Penggunaan

### Menambah Komponen Baru:
```bash
# 1. Buat file baru
touch src/components/componentSoal/NewComponent.tsx

# 2. Implement interface & komponen
export interface NewComponentProps { ... }
const NewComponent: React.FC<NewComponentProps> = ({ ... }) => { ... }

# 3. Update dokumentasi ini
# 4. Import di tipe soal yang membutuhkan
import NewComponent from '@/components/componentSoal/NewComponent';
```

## 🔧 Maintenance

### Update Import Paths:
Jika ada perubahan struktur, update di:
1. `src/components/tipesoal/TipeSoal1.tsx`
2. File tipe soal lain yang menggunakan komponen ini
3. Test files
4. Dokumentasi

### Monitoring Usage:
```bash
# Cek penggunaan komponen
grep -r "from '@/components/componentSoal" src/

# Cek import yang mungkin rusak
grep -r "from '@/components/CircuitDiagram" src/
```

---

✨ **Folder ini membantu menjaga kode tetap terorganisir dan komponen mudah ditemukan!** ✨