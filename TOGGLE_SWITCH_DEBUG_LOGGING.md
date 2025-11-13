# 🐛 Toggle Switch Debug Logging

## 📋 Overview

Dokumentasi lengkap untuk debugging toggle switch menggunakan computer vision (THUMBS UP gesture dengan hold 3 detik).

---

## 🔍 Logging Flow

### 1️⃣ **GestureDetector.ts** - Deteksi Gesture Level Rendah

#### Log: Thumbs Up Check
```
👍 [GESTURE DETECTOR DEBUG] THUMBS_UP check: {
  thumbUp: true/false,
  thumbTipY: "0.234",
  thumbIPY: "0.345",
  wristY: "0.567",
  fingersState: {
    index: "EXTENDED" | "closed",
    middle: "EXTENDED" | "closed",
    ring: "EXTENDED" | "closed",
    pinky: "EXTENDED" | "closed"
  },
  otherFingersClosed: true/false,
  result: "✅ THUMBS_UP" | "❌ NOT THUMBS_UP"
}
```

**Kapan muncul**: Setiap kali ada potensi thumbs_up (jempol naik atau ada jari extended)

#### Log: Thumbs Up Confirmed
```
✅ [GESTURE DETECTOR] THUMBS_UP gesture CONFIRMED: {
  gesture: "thumbs_up",
  handedness: "Left" | "Right",
  confidence: 0.85,
  thumbTipPosition: { x: "0.456", y: "0.234" }
}
```

**Kapan muncul**: Saat thumbs_up gesture berhasil dideteksi

---

### 2️⃣ **CircuitController.ts** - Routing Gesture ke Action

#### Log: Thumbs Up Detected
```
👍 [CONTROLLER DEBUG] THUMBS_UP detected: {
  gesture: "thumbs_up",
  handedness: "Left" | "Right",
  position: { x: "0.456", y: "0.234" } | "no position",
  confidence: 0.85,
  willTriggerToggle: true | false
}
```

**Kapan muncul**: Setiap kali gesture thumbs_up masuk ke controller

#### Log: Toggle Action Created (RIGHT hand)
```
✅ [CONTROLLER DEBUG] Toggle action created for RIGHT hand
```

**Kapan muncul**: Hanya untuk tangan KANAN

#### Log: Thumbs Up Ignored (NOT RIGHT hand)
```
❌ [CONTROLLER DEBUG] THUMBS_UP ignored - not RIGHT hand (handedness: Left)
```

**Kapan muncul**: Untuk tangan KIRI atau handedness lain

---

### 3️⃣ **WebCVPracticum.tsx** - Eksekusi Toggle Logic

#### Log: Action Detected
```
🔍 [TOGGLE DEBUG] Action detected: {
  actionType: "toggle",
  position: { x: "600", y: "350" },
  componentId: "switch-abc123" | undefined
}
```

**Kapan muncul**: Saat action.type === "toggle"

#### Log: Switches Found
```
🔍 [TOGGLE DEBUG] Found 2 switch(es) in circuit
```

**Kapan muncul**: Setelah filter switches dari components

#### Log: Distance Calculation
```
🔍 [TOGGLE DEBUG] Distance to switch-abc123: 150px
🔍 [TOGGLE DEBUG] Distance to switch-def456: 320px
```

**Kapan muncul**: Untuk setiap switch dalam circuit

#### Log: Closest Switch Selected
```
🎯 [TOGGLE DEBUG] Closest switch: switch-abc123 at 150px, state: open
```

**Kapan muncul**: Setelah menemukan switch terdekat

#### Log: Starting New Hold
```
🆕 [TOGGLE DEBUG] Starting NEW hold: {
  switchId: "switch-abc123",
  switchState: "open",
  position: { x: "600", y: "350" },
  distance: "150px",
  startTime: 1699680123456,
  previousHoldActive: false,
  previousSwitchId: null
}

👍 THUMBS UP START at (600, 350) on switch: switch-abc123 (distance: 150px)
```

**Kapan muncul**: Saat mulai hold baru pada switch

#### Log: Continuing Hold (Progress Update)
```
⏱️ [TOGGLE DEBUG] Continuing hold: {
  switchId: "switch-abc123",
  elapsed: "1500ms",
  progress: "50.0%",
  startTime: 1699680123456,
  currentTime: 1699680124956
}

🕐 TOGGLE HOLD: 50% on switch-abc123 (1500ms / 3000ms)

⏳ [TOGGLE DEBUG] Still holding... need 1500ms more
```

**Kapan muncul**: Setiap frame saat hold progress < 100%

#### Log: Toggle Completed (100% Progress)
```
🎉 [TOGGLE DEBUG] Progress reached 100%! Toggling switch...

✅ SWITCH TOGGLED: switch-abc123 open → closed

✅ [TOGGLE DEBUG] Toggle executed successfully: {
  switchId: "switch-abc123",
  oldState: "open",
  newState: "closed",
  totalHoldTime: "3050ms"
}

🔄 [TOGGLE DEBUG] Resetting hold state after successful toggle
```

**Kapan muncul**: Saat progress >= 1 (100%)

#### Log: No Switches in Circuit
```
⚠️ [TOGGLE DEBUG] No switches found in circuit

❌ TOGGLE HOLD CANCELLED: No switches in circuit

❌ [TOGGLE DEBUG] Cancelling hold: {
  previousSwitchId: "switch-abc123",
  wasActive: true,
  reason: "No switches in circuit"
}
```

**Kapan muncul**: Saat tidak ada switch di circuit

#### Log: Gesture Changed
```
🔄 [TOGGLE DEBUG] Gesture changed from THUMBS_UP: {
  newActionType: "move" | "add" | etc.,
  wasSwitchId: "switch-abc123",
  wasProgress: "67.5%",
  reason: "Gesture no longer thumbs_up"
}

🔄 TOGGLE HOLD RESET: Gesture changed
```

**Kapan muncul**: Saat gesture berubah dari thumbs_up sebelum 100%

---

## 🚨 Common Issues & Solutions

### Issue 1: Thumbs Up Tidak Terdeteksi

**Cek Console Log**:
```
👍 [GESTURE DETECTOR DEBUG] THUMBS_UP check: {
  thumbUp: false,  // ❌ Problem!
  ...
}
```

**Solusi**:
- Pastikan jempol tegak ke atas (thumbTip.y < thumbIP.y < wrist.y)
- Pastikan 4 jari lain tertutup (index, middle, ring, pinky closed)
- Coba posisikan tangan lebih jelas ke kamera

---

### Issue 2: Thumbs Up Terdeteksi Tapi Tidak Toggle

**Cek Console Log**:
```
✅ [GESTURE DETECTOR] THUMBS_UP gesture CONFIRMED
❌ [CONTROLLER DEBUG] THUMBS_UP ignored - not RIGHT hand (handedness: Left)
```

**Solusi**:
- Gunakan **TANGAN KANAN** untuk toggle
- Pastikan MediaPipe mendeteksi tangan sebagai "Right"
- Coba flip posisi tangan atau kamera mirroring

---

### Issue 3: Toggle Hold Dimulai Tapi Tidak Sampai 100%

**Cek Console Log**:
```
👍 THUMBS UP START at (600, 350) on switch: switch-abc123
🕐 TOGGLE HOLD: 33% on switch-abc123 (1000ms / 3000ms)
🕐 TOGGLE HOLD: 67% on switch-abc123 (2000ms / 3000ms)
🔄 TOGGLE HOLD RESET: Gesture changed  // ❌ Problem!
```

**Solusi**:
- **HOLD gesture steady** selama 3 detik penuh
- Jangan gerakkan tangan atau ubah gesture
- Pastikan thumbs_up konsisten selama 3000ms

---

### Issue 4: Toggle Hold Progress Tidak Update

**Cek Console Log**:
```
👍 THUMBS UP START at (600, 350) on switch: switch-abc123
(tidak ada log progress update)
```

**Kemungkinan Penyebab**:
1. `action.type !== "toggle"` - gesture berubah
2. `toggleHold.switchId !== switchComponent.id` - switch berbeda terdeteksi
3. `useCallback` dependencies kurang - state tidak update

**Solusi**:
- Cek apakah `action.type === "toggle"` terus-menerus
- Pastikan tidak ada switch lain yang lebih dekat
- Verifikasi `toggleHold.isActive === true`

---

## 📊 Expected Log Flow (Success Case)

### Full Successful Toggle Flow:

```
1. 👍 [GESTURE DETECTOR DEBUG] THUMBS_UP check: { result: "✅ THUMBS_UP" }
2. ✅ [GESTURE DETECTOR] THUMBS_UP gesture CONFIRMED: { handedness: "Right" }
3. 👍 [CONTROLLER DEBUG] THUMBS_UP detected: { willTriggerToggle: true }
4. ✅ [CONTROLLER DEBUG] Toggle action created for RIGHT hand
5. 🔍 [TOGGLE DEBUG] Action detected: { actionType: "toggle" }
6. 🔍 [TOGGLE DEBUG] Found 1 switch(es) in circuit
7. 🔍 [TOGGLE DEBUG] Distance to switch-abc123: 150px
8. 🎯 [TOGGLE DEBUG] Closest switch: switch-abc123 at 150px
9. 🆕 [TOGGLE DEBUG] Starting NEW hold: { switchId: "switch-abc123" }
10. 👍 THUMBS UP START at (600, 350) on switch: switch-abc123
11. ⏱️ [TOGGLE DEBUG] Continuing hold: { progress: "33.3%" }
12. 🕐 TOGGLE HOLD: 33% on switch-abc123 (1000ms / 3000ms)
13. ⏱️ [TOGGLE DEBUG] Continuing hold: { progress: "66.7%" }
14. 🕐 TOGGLE HOLD: 67% on switch-abc123 (2000ms / 3000ms)
15. ⏱️ [TOGGLE DEBUG] Continuing hold: { progress: "100.0%" }
16. 🕐 TOGGLE HOLD: 100% on switch-abc123 (3000ms / 3000ms)
17. 🎉 [TOGGLE DEBUG] Progress reached 100%! Toggling switch...
18. ✅ SWITCH TOGGLED: switch-abc123 open → closed
19. ✅ [TOGGLE DEBUG] Toggle executed successfully
20. 🔄 [TOGGLE DEBUG] Resetting hold state after successful toggle
```

---

## 🎯 Debugging Checklist

### ✅ Gesture Detection Level
- [ ] `👍 [GESTURE DETECTOR DEBUG]` muncul saat thumbs up
- [ ] `thumbUp: true` (jempol tegak)
- [ ] `otherFingersClosed: true` (4 jari lain tutup)
- [ ] `result: "✅ THUMBS_UP"` (gesture confirmed)

### ✅ Controller Level
- [ ] `👍 [CONTROLLER DEBUG] THUMBS_UP detected` muncul
- [ ] `handedness: "Right"` (tangan kanan)
- [ ] `willTriggerToggle: true`
- [ ] `✅ [CONTROLLER DEBUG] Toggle action created`

### ✅ Toggle Logic Level
- [ ] `🔍 [TOGGLE DEBUG] Action detected` dengan `actionType: "toggle"`
- [ ] `🔍 [TOGGLE DEBUG] Found X switch(es)` (ada switch di circuit)
- [ ] `🎯 [TOGGLE DEBUG] Closest switch` teridentifikasi
- [ ] `🆕 [TOGGLE DEBUG] Starting NEW hold` (hold dimulai)
- [ ] `⏱️ [TOGGLE DEBUG] Continuing hold` (progress update setiap frame)
- [ ] `🎉 [TOGGLE DEBUG] Progress reached 100%!` (toggle execute)
- [ ] `✅ SWITCH TOGGLED` (state berubah)

---

## 🔧 Testing Steps

1. **Open browser console** (F12)
2. **Add switch** to circuit (left hand, 4 fingers, hold 3s)
3. **Show thumbs up** with RIGHT hand
4. **Watch console logs** for detection flow
5. **Hold steady** for 3 seconds
6. **Verify toggle** at 100% progress
7. **Check state change** in UI and logs

---

## 📝 Notes

- Console logging sangat verbose untuk debugging
- Semua log memiliki prefix `[GESTURE DETECTOR DEBUG]`, `[CONTROLLER DEBUG]`, atau `[TOGGLE DEBUG]`
- Progress update muncul setiap frame (~60fps) selama hold
- Log dapat di-comment setelah debugging selesai untuk production

---

**Last Updated**: 2025-11-11
**Author**: Circuit CV Practicum Team
