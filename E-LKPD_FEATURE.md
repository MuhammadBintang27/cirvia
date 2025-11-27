# 📋 E-LKPD (Electronic Lembar Kerja Peserta Didik) Feature

## 🎯 Overview

E-LKPD adalah Lembar Kerja Peserta Didik Digital yang terintegrasi dengan halaman praktikum CIRVIA. Fitur ini menggantikan chatbot pada halaman praktikum untuk memberikan pengalaman pembelajaran yang lebih terstruktur dan fokus.

## ✨ Features

### 1. **Floating Interface**
- Interface mengambang di pojok kanan bawah layar
- Dapat diminimize/maximize sesuai kebutuhan
- Dapat ditutup dan dibuka kembali dengan tombol

### 2. **Progress Tracking**
- Progress bar menampilkan persentase penyelesaian LKPD
- Checkbox untuk menandai setiap bagian yang sudah diselesaikan
- Counter menunjukkan jumlah bagian yang sudah diselesaikan

### 3. **6 Bagian LKPD Lengkap**

#### 🎯 Tujuan Praktikum
- Memahami konsep dasar rangkaian listrik
- Menganalisis hubungan V, I, R (Hukum Ohm)
- Membedakan rangkaian seri dan paralel
- Melakukan perhitungan nilai arus dan tegangan

#### 📚 Dasar Teori
- Penjelasan komponen rangkaian listrik
- Rumus Hukum Ohm: V = I × R
- Karakteristik rangkaian seri dan paralel
- Rumus hambatan total untuk setiap jenis rangkaian

#### 📝 Langkah Kerja
- 8 langkah prosedur praktikum yang jelas
- Instruksi untuk mode Drag & Drop dan Computer Vision
- Panduan membuat rangkaian seri dan paralel
- Petunjuk observasi dan pencatatan data

#### 🧪 Tabel Pengamatan
- Tabel terstruktur untuk rangkaian seri
- Tabel terstruktur untuk rangkaian paralel
- Kolom: Tegangan (V), Hambatan (Ω), Arus (A)
- Format tabel ASCII yang rapi

#### 💡 Analisis Data
- 8 pertanyaan analisis kritis
- Perhitungan teoritis vs hasil simulasi
- Perbandingan karakteristik rangkaian seri dan paralel
- Analisis "what-if" scenarios

#### ✅ Kesimpulan
- 4 pertanyaan refleksi komprehensif
- Ruang untuk menulis jawaban siswa
- Menguji pemahaman konseptual
- Aplikasi praktis dalam kehidupan sehari-hari

### 4. **Visual Design**
- Setiap bagian memiliki warna identitas berbeda
- Icon yang sesuai untuk setiap jenis bagian
- Expandable/collapsible sections
- Dark theme dengan glassmorphism effect
- Border gradient yang menarik

### 5. **Color Coding System**
- **Tujuan**: Blue/Cyan (🎯)
- **Teori**: Purple/Indigo (📚)
- **Prosedur**: Emerald/Teal (📋)
- **Observasi**: Orange/Amber (🧪)
- **Analisis**: Pink/Rose (💡)
- **Kesimpulan**: Violet/Purple (✅)

## 🔧 Implementation

### Files Created/Modified:

1. **New Component**: `src/components/ELKPD.tsx`
   - Main E-LKPD component
   - Self-contained with all data and logic
   - Responsive design

2. **Modified**: `src/app/practicum/page.tsx`
   - Added ELKPD import
   - Integrated E-LKPD component at bottom of page

3. **Modified**: `src/components/FloatingChatButton.tsx`
   - Added `/practicum` to hidden pages list
   - Prevents chatbot from appearing on practicum page

## 📱 User Experience

### Desktop View:
- E-LKPD appears as floating panel (450px width)
- Max height: 600px with scrollable content
- Can be maximized to full screen (with margins)

### Interaction Flow:
1. Student opens practicum page
2. E-LKPD automatically appears (open by default)
3. Student can minimize to button if needed
4. Click "Buka E-LKPD" button to reopen
5. Expand/collapse sections as needed
6. Check off completed sections
7. Track progress via progress bar

## 🎓 Pedagogical Benefits

1. **Structured Learning**: 
   - Follows scientific method (objective → theory → procedure → observation → analysis → conclusion)

2. **Self-Paced**:
   - Students can work through sections at their own pace
   - Progress tracking encourages completion

3. **Active Learning**:
   - Requires students to observe, record, calculate, and reflect
   - Combines simulation with written analysis

4. **Assessment Ready**:
   - Clear sections for teacher evaluation
   - Structured data collection
   - Critical thinking questions

5. **Digital Advantage**:
   - Always accessible during practicum
   - No paper/printing needed
   - Progress automatically tracked

## 🚀 Future Enhancements

Potential improvements for future versions:

1. **Save Progress**:
   - Store checkbox states in localStorage or database
   - Allow students to resume where they left off

2. **Export/Print**:
   - Export completed LKPD as PDF
   - Print functionality for documentation

3. **Auto-Fill from Simulation**:
   - Automatically populate observation tables from circuit simulation
   - Real-time data sync

4. **Teacher Dashboard**:
   - View student LKPD completion status
   - Review submitted answers
   - Provide feedback

5. **Answer Input Fields**:
   - Add actual input fields for tables and conclusions
   - Validate and store answers
   - Submit to teacher for grading

6. **Multiple LKPD Templates**:
   - Different LKPD for different practicum topics
   - Customizable based on learning objectives

## 💻 Technical Details

### State Management:
```typescript
const [isOpen, setIsOpen] = useState(true);
const [isMaximized, setIsMaximized] = useState(false);
const [expandedSections, setExpandedSections] = useState<string[]>(["1"]);
const [completedSections, setCompletedSections] = useState<string[]>([]);
```

### Data Structure:
```typescript
interface LKPDSection {
  id: string;
  title: string;
  type: "objective" | "theory" | "procedure" | "observation" | "analysis" | "conclusion";
  content: string | string[];
  isCompleted?: boolean;
}
```

### Styling:
- Tailwind CSS for all styling
- Gradient backgrounds with transparency
- Backdrop blur for glassmorphism
- Custom animations for smooth transitions

## 🎨 Design Philosophy

The E-LKPD design follows CIRVIA's overall aesthetic:
- Dark theme with blue/indigo gradients
- Consistent with practicum page design
- Modern, clean, and professional
- Accessible and user-friendly
- Mobile-responsive (though optimized for desktop use during practicum)

## 📝 Usage Instructions for Students

1. **Opening E-LKPD**: Already open when you load the practicum page
2. **Minimizing**: Click the X button to minimize to floating button
3. **Maximizing**: Click maximize icon for full-screen view
4. **Reading Sections**: Click on any section header to expand/collapse
5. **Marking Complete**: Click the circle icon to mark a section as done
6. **Tracking Progress**: Watch the progress bar fill up as you complete sections

## 🎯 Learning Outcomes

By completing the E-LKPD, students will be able to:

✅ State the objectives of electrical circuit practicum  
✅ Explain Ohm's Law and its application  
✅ Differentiate between series and parallel circuits  
✅ Follow systematic experimental procedures  
✅ Record and organize experimental data  
✅ Calculate theoretical values and compare with simulations  
✅ Analyze circuit behavior and characteristics  
✅ Draw conclusions from experimental results  
✅ Apply concepts to real-world scenarios

## 🔄 Integration with Practicum

The E-LKPD seamlessly integrates with both practicum modes:

- **Drag & Drop Mode**: Students follow LKPD while building circuits manually
- **Computer Vision Mode**: Students use hand gestures while referencing LKPD

The floating design ensures LKPD is always accessible without blocking the simulation area.

---

**Created**: November 2025  
**Version**: 1.0  
**Status**: ✅ Active in Production
