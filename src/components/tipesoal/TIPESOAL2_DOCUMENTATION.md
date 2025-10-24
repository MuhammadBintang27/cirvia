# TipeSoal2 - Circuit Ordering Implementation

## Overview
TipeSoal2 adalah komponen untuk soal ordering rangkaian listrik dengan drag & drop functionality. User diminta untuk mengurutkan 3 rangkaian berdasarkan tingkat kecerahan lampu (dari paling terang ke paling redup).

## Features

### 🎯 Core Functionality
- **Drag & Drop Interface**: User dapat drag rangkaian ke slot urutan
- **Visual Circuit Cards**: Setiap rangkaian ditampilkan sebagai kartu dengan diagram SVG
- **Brightness Indicators**: Indikator kecerahan lampu (hanya tampil setelah submit)
- **Real-time Validation**: Cek urutan jawaban user vs jawaban benar
- **Keyboard Support**: Aksesibilitas keyboard untuk drag & drop

### 🎨 UI Components Used
- `CircuitCard.tsx` - Kartu rangkaian dengan visualisasi SVG
- `DropSlot.tsx` - Slot target untuk drop dengan visual feedback
- Icons dari Lucide React (CheckCircle, XCircle, Lightbulb, dll)

### 📱 Responsive Design
- Grid layout adaptive (desktop vs mobile)
- Glass morphism design dengan backdrop blur
- Gradient backgrounds dan borders

## Data Structure

### CircuitOrderingQuestion Interface
```typescript
interface CircuitOrderingQuestion extends BaseQuestion {
  questionType: 'circuitOrdering';
  instruction: string;
  circuits: CircuitConfig[];
  correctOrder: string[];
  hint: string;
  explanation: string;
}

interface CircuitConfig {
  id: string;
  name: string;
  resistorValue: number;
  brightnessLevel: 'high' | 'medium' | 'low';
}
```

### Sample Data
```typescript
{
  id: 'order-brightness-1',
  questionType: 'circuitOrdering',
  title: 'Urutan Kecerahan Lampu',
  description: 'Urutkanlah rangkaian berikut berdasarkan tingkat kecerahan lampu',
  instruction: 'Drag dan drop rangkaian ke slot urutan dari yang paling terang ke paling redup',
  circuits: [
    { id: 'A', name: 'Rangkaian A', resistorValue: 100, brightnessLevel: 'high' },
    { id: 'B', name: 'Rangkaian B', resistorValue: 500, brightnessLevel: 'low' },
    { id: 'C', name: 'Rangkaian C', resistorValue: 300, brightnessLevel: 'medium' }
  ],
  correctOrder: ['A', 'C', 'B'],
  hint: 'Semakin kecil resistansi, semakin besar arus, semakin terang lampunya',
  explanation: 'Rangkaian A memiliki resistansi terkecil (100Ω) sehingga arus terbesar dan lampu paling terang...',
  difficulty: 'medium'
}
```

## Component Props

### TipeSoal2Props
```typescript
interface TipeSoal2Props {
  question: CircuitOrderingQuestion;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  showResult: boolean;
  isLastQuestion: boolean;
  disabled?: boolean;
}
```

## State Management

### DragDropState
```typescript
interface DragDropState {
  draggedCircuit: string | null;     // ID rangkaian yang sedang di-drag
  dragOverSlot: number | null;       // Index slot yang sedang di-hover
  slotAssignments: (string | null)[]; // Assignment rangkaian ke slot [slot1, slot2, slot3]
  showHint: boolean;                 // Toggle hint visibility
}
```

## Key Functions

### Drag & Drop Handlers
- `handleDragStart()` - Mulai drag operation
- `handleDragOver()` - Handle drag over slot dengan visual feedback
- `handleDrop()` - Drop rangkaian ke slot dengan logic swap
- `handleRemoveFromSlot()` - Remove rangkaian dari slot

### Answer Validation
- `handleSubmitAnswer()` - Compare user order dengan correct order
- `getResultInfo()` - Get result info untuk display
- `canSubmit` - Check apakah semua slot terisi

### Utility Functions
- `getAvailableCircuits()` - Get rangkaian yang belum assigned
- `getCircuitById()` - Get circuit data by ID
- `handleReset()` - Reset semua slot assignments

## Accessibility Features

### Keyboard Navigation
- **Enter/Space**: Assign circuit ke slot kosong pertama
- **Backspace/Delete**: Remove circuit dari slot
- Fokus visual pada elemen aktif

### Screen Reader Support
- Semantic HTML struktur
- ARIA labels untuk drag & drop
- Descriptive text untuk actions

## Integration with Test System

### QuestionRenderer Integration
```typescript
case 'circuitOrdering':
  return (
    <TipeSoal2
      question={question}
      onAnswerSubmit={onAnswer}
      onNextQuestion={onNextQuestion}
      showResult={showResult}
      isLastQuestion={isLastQuestion}
      disabled={disabled}
    />
  );
```

### Pretest/Posttest Usage
- Compatible dengan existing test workflow
- Menggunakan SupabaseTestService untuk save results
- Progress tracking terintegrasi

## Visual Design

### Color Scheme
- **Correct Answer**: Green gradient (`from-green-500/10 to-emerald-500/10`)
- **Wrong Answer**: Red gradient (`from-red-500/10 to-pink-500/10`)
- **Drag Over**: Blue border dan background highlight
- **Brightness Indicators**: Traffic light colors (Green/Yellow/Red)

### Animations
- Smooth hover transitions
- Scale transform pada buttons
- Backdrop blur effects
- Gradient animations

## File Structure
```
src/components/
├── tipesoal/
│   ├── TipeSoal2.tsx              # Main component
│   └── QuestionRenderer.tsx       # Updated with circuitOrdering case
├── componentSoal/
│   ├── CircuitCard.tsx            # Rangkaian card component
│   └── DropSlot.tsx              # Drop target component
└── lib/
    └── questions.ts               # Data structure dan sample data
```

## Testing Considerations

### Manual Testing Checklist
- [ ] Drag & drop functionality works
- [ ] Visual feedback pada drag over
- [ ] Slot swapping logic correct
- [ ] Answer validation accurate
- [ ] Reset functionality works
- [ ] Keyboard navigation accessible
- [ ] Responsive design pada berbagai screen size
- [ ] Integration dengan test flow

### Edge Cases
- [ ] Drop pada slot yang sudah terisi (swap logic)
- [ ] Drag circuit yang sudah di slot ke slot lain
- [ ] Submit dengan slot kosong (should be disabled)
- [ ] Keyboard navigation edge cases

## Future Enhancements

### Possible Improvements
1. **Animation Improvements**: Smooth drag animations, better transition effects
2. **More Circuit Types**: Support untuk rangkaian seri/paralel yang kompleks
3. **Hint System**: Progressive hints berdasarkan attempts
4. **Timer Feature**: Optional timer untuk challenge mode
5. **Sound Effects**: Audio feedback untuk drag & drop
6. **Multi-touch**: Touch gesture support untuk mobile

### Performance Optimizations
1. **Memoization**: React.memo untuk component optimization
2. **Virtual Scrolling**: Untuk banyak rangkaian
3. **Lazy Loading**: Circuit SVG generation on demand

## Dependencies
- React 18+ dengan TypeScript
- Lucide React untuk icons
- Tailwind CSS untuk styling
- Next.js 13+ App Router

---

**Status**: ✅ Complete - Ready for testing and integration
**Author**: GitHub Copilot Assistant
**Created**: December 2024