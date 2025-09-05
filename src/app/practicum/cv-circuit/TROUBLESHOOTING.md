# TROUBLESHOOTING - Circuit Builder CV

## ❌ Masalah Umum & Solusi

### 1. **Icon/Symbol Komponen Tidak Terlihat**

**Masalah**: Panel komponen di atas terlihat kosong atau icon tidak jelas

```
❌ Problem: Icon emoji tidak tampil atau terlalu kecil
✅ Solusi: Menggunakan symbol text yang lebih besar dan jelas
```

**Penyelesaian yang Sudah Diterapkan**:

- ✅ Mengubah emoji (🔋💡) menjadi symbol text (+|-, (o), ~~~)
- ✅ Ukuran font diperbesar (32px untuk nama, 36px untuk symbol)
- ✅ Warna kontras yang lebih terang
- ✅ Background dengan shadow effect
- ✅ Border yang lebih tebal

**Hasil**:

```
SEBELUM: [🔋] [💡] [🔲] [🔘] [〰️]  ← Tidak terlihat jelas
SESUDAH: [+|-] [(o)] [~~~] [|/|] [---]  ← Terlihat jelas
```

### 2. **Pinch Detection Tidak Responsif**

**Gejala**:

- Gesture pinch tidak terdeteksi
- Komponen tidak bisa dipilih

**Solusi**:

```python
# 1. Cek pencahayaan
- Pastikan ruangan cukup terang
- Hindari backlight yang kuat

# 2. Posisi tangan
- Jarak 30-60cm dari kamera
- Tangan sejajar dengan layar

# 3. Kalibrasi threshold
- Buka src/hand_detection/pinch_detector.py
- Sesuaikan self.pinch_threshold (default: 40)
```

### 3. **Komponen Tidak Bisa Ditempatkan**

**Masalah**: Komponen terpilih tapi tidak bisa diletakkan

**Penyebab & Solusi**:

```python
# ❌ Melepas pinch di area panel
# ✅ Drag komponen ke AREA PRAKTIKUM (area abu-abu dengan grid)

# ❌ Posisi di luar batas layar
# ✅ Letakkan dalam area workspace yang terlihat
```

### 4. **Kamera Tidak Muncul**

**Error**: Camera feed tidak tampil di sudut kanan atas

**Solusi Bertahap**:

```powershell
# 1. Cek kamera tersedia
python -c "import cv2; print('Kamera:', cv2.VideoCapture(0).isOpened())"

# 2. Coba camera index lain
# Edit main.py, ganti:
self.cap = cv2.VideoCapture(0)  # Coba 1, 2, dst
```

### 5. **Performance Lambat**

**Gejala**: Aplikasi lag atau frame rate rendah

**Optimisasi**:

```python
# 1. Kurangi resolusi kamera
# Di pinch_detector.py, tambahkan:
self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 2. Kurangi detection confidence
# Ubah min_detection_confidence dari 0.8 ke 0.6
```

### 6. **Gesture Salah Deteksi**

**Masalah**: Saklar nyala/mati tidak sesuai gesture

**Solusi Kalibrasi Gesture**:

```python
# Untuk debug, tambahkan print di calculator.py:
def detect_switch_control(self, hand_landmarks):
    # ... existing code ...
    print(f"Index up: {index_up}, Middle up: {middle_up}")

    if index_up and middle_up and ring_down and pinky_down:
        print("✌️ PEACE detected - OFF")
        return 'OFF'
    elif index_up and not middle_up and ring_down and pinky_down:
        print("☝️ INDEX detected - ON")
        return 'ON'
```

## 🔧 **Konfigurasi Manual**

### Mengubah Threshold Pinch

```python
# File: src/hand_detection/pinch_detector.py
# Line: ~20
self.pinch_threshold = 40  # Ubah nilai ini
# Nilai kecil = lebih sensitif
# Nilai besar = kurang sensitif
```

### Mengubah Ukuran Komponen

```python
# File: src/ui/interface.py
# Function: _render_single_component
component_styles = {
    'battery': {'size': (80, 40)},  # Ubah ukuran di sini
    'lamp': {'size': (60, 60)},
    # dst...
}
```

### Mengubah Warna Panel

```python
# File: src/ui/component_panel.py
# Function: __init__
self.components = {
    'battery': {
        'color': (255, 80, 80),  # RGB - ubah warna di sini
        # dst...
    }
}
```

## 📊 **Testing Components**

### Test Manual Komponen

```python
# Jalankan di terminal untuk test individual:
python -c "
from src.hand_detection.pinch_detector import PinchDetector
detector = PinchDetector()
print('PinchDetector initialized successfully!')
"
```

### Test Gesture Recognition

```python
# Test file terpisah
import cv2
from src.hand_detection.pinch_detector import PinchDetector

cap = cv2.VideoCapture(0)
detector = PinchDetector()

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)

    result = detector.detect_pinch(frame)
    if result:
        print(f"Pinch: {result['is_pinching']}, Distance: {result['distance']}")

    cv2.imshow('Test', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

## 🚀 **Performance Tips**

### Untuk Komputer Specs Rendah:

1. **Kurangi FPS**: Ubah `self.clock.tick(30)` ke `self.clock.tick(15)`
2. **Disable shadows**: Comment shadow rendering di interface.py
3. **Simplify graphics**: Kurangi effect visual

### Untuk Akurasi Maksimal:

1. **Tingkatkan confidence**: Ubah `min_detection_confidence=0.9`
2. **Stabilkan kamera**: Gunakan tripod
3. **Lighting setup**: Lampu LED dari depan

## 📞 **Support**

Jika masih ada masalah:

1. Cek file log error di terminal
2. Screenshot tampilan yang bermasalah
3. Catat spesifikasi hardware (OS, RAM, GPU)
4. Test dengan kamera external jika built-in bermasalah

---

**💡 Tips**: Restart aplikasi jika gesture detection menjadi tidak akurat setelah penggunaan lama.
