# 🔧 TipeSoal2 - Drag & Drop Index Mismatch Fix

## 🐛 **Problem Description:**

User mengalami masalah drag & drop:
1. **Drop di slot 2 → masuk slot 3**
2. **Drop di slot 1 → masuk slot 2** 
3. **Rangkaian terakhir tidak bisa di-drop di manapun**

## 🔍 **Root Cause Analysis:**

### **Index Mismatch Issue:**
- **TipeSoal2** menggunakan **0-based indexing** (`slotIndex: 0, 1, 2`)
- **DropSlot** menggunakan **1-based numbering** (`slotNumber: 1, 2, 3`) untuk display
- **Callback handlers** di DropSlot mengirim `slotNumber` langsung tanpa konversi

### **Flow yang Bermasalah:**
```
User drops pada "Slot 2" (display)
↓
DropSlot.handleDrop() calls onDrop(e, slotNumber) = onDrop(e, 2)
↓  
TipeSoal2.handleDrop() menerima slotIndex = 2
↓
Circuit masuk ke array[2] = "Slot 3" (display)
```

## 🔧 **Solution Applied:**

### **1. Fixed DropSlot Callbacks:**
```typescript
// SEBELUM:
const handleDrop = (e: React.DragEvent) => {
  onDrop?.(e, slotNumber); // Mengirim 1, 2, 3
};

// SETELAH:
const handleDrop = (e: React.DragEvent) => {
  onDrop?.(e, slotNumber - 1); // Convert ke 0, 1, 2
};
```

### **2. Fixed All Callback Handlers:**
- ✅ `handleDrop`: `slotNumber - 1`
- ✅ `handleRemove`: `slotNumber - 1` 
- ✅ `onKeyDown`: `slotNumber - 1`

### **3. Added Debug Logging:**
```typescript
console.log('Drop Debug:', {
  droppedCircuitId,
  targetSlotIndex: slotIndex,
  currentSlotAssignments: state.slotAssignments
});
```

## ✅ **Expected Result:**

### **Correct Mapping:**
- **Slot 1 (display)** → `slotIndex = 0` → `array[0]`
- **Slot 2 (display)** → `slotIndex = 1` → `array[1]`  
- **Slot 3 (display)** → `slotIndex = 2` → `array[2]`

### **Working Behaviors:**
- ✅ Drop pada slot yang benar
- ✅ Swapping circuits antar slot
- ✅ Remove circuit dari slot
- ✅ Keyboard navigation
- ✅ Semua rangkaian bisa di-drop

## 🧪 **Testing Steps:**

1. **Basic Drop:**
   - Drag "Rangkaian A" ke "Slot 1" → harus masuk slot 1
   - Drag "Rangkaian B" ke "Slot 2" → harus masuk slot 2
   - Drag "Rangkaian C" ke "Slot 3" → harus masuk slot 3

2. **Swapping:**
   - Drop rangkaian ke slot yang sudah terisi → swap positions

3. **Remove:**
   - Click X button → rangkaian kembali ke available list

4. **All Circuits:**
   - Semua 3 rangkaian harus bisa di-drop ke semua slot

## 🔍 **Debug Information:**

Check browser console untuk:
```
Drop Debug: {
  droppedCircuitId: "A",
  targetSlotIndex: 0,  // Should be 0 for "Slot 1"
  currentSlotAssignments: [null, null, null]
}
```

## 📊 **Before vs After:**

### **Before (Buggy):**
```
User drops on "Slot 1" → slotIndex = 1 → array[1] = "Slot 2"
User drops on "Slot 2" → slotIndex = 2 → array[2] = "Slot 3"  
User drops on "Slot 3" → slotIndex = 3 → array[3] = undefined!
```

### **After (Fixed):**
```
User drops on "Slot 1" → slotIndex = 0 → array[0] = "Slot 1" ✅
User drops on "Slot 2" → slotIndex = 1 → array[1] = "Slot 2" ✅
User drops on "Slot 3" → slotIndex = 2 → array[2] = "Slot 3" ✅
```

---

*Fix applied: ${new Date().toLocaleDateString('id-ID')}*
*Files modified: TipeSoal2.tsx, DropSlot.tsx*