# 🚀 Panduan Menjalankan Project Cirvia + CV

## 📋 Prerequisites (Yang Harus Diinstall Dulu)

### 1. Node.js & npm
```bash
# Check apakah sudah terinstall
node --version
npm --version

# Jika belum, download dari: https://nodejs.org
```

### 2. Python 3.11
```bash
# Check versi Python
python --version

# Jika belum, download dari: https://python.org
```

---

## 🔧 Setup Project

### Step 1: Setup Next.js Web Platform
```bash
# Masuk ke folder cirvia
cd "f:\LIDM\20225\project LIDM\cirvia"

# Install dependencies
npm install

# Install additional dependencies if needed
npm install @types/node @types/react @types/react-dom
```

### Step 2: Setup Python CV Environment
```bash
# Masuk ke folder testing CV
cd "f:\LIDM\20225\project LIDM\testing CV"

# Install Python dependencies
pip install -r requirements.txt

# Or install manually:
pip install opencv-python mediapipe pygame flask numpy
```

---

## ▶️ Cara Menjalankan Project

### 🌐 Method 1: Full Integration (Recommended)

#### Step 1: Start Web Platform
```bash
# Terminal 1 - Start Next.js
cd "f:\LIDM\20225\project LIDM\cirvia"
npm run dev
```

#### Step 2: Access Platform
1. Buka browser: `http://localhost:3000`
2. Klik menu: **"Practicum"**
3. Pilih tab: **"CV Mode"**
4. Klik: **"🚀 Launch Python CV Application"**
5. Wait 3-5 detik untuk loading
6. Python CV app akan muncul di iframe!

---

### 💻 Method 2: Python CV Only (Direct)

```bash
# Start Flask server directly
cd "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
python web_cv_server.py

# Akses: http://localhost:5000
```

---

### 🖥️ Method 3: Desktop Application (Separate Window)

```bash
# Run desktop version
cd "f:\LIDM\20225\project LIDM\testing CV"
python main.py
```

---

## 🔍 Troubleshooting

### ❌ Problem: npm run dev error
**Solusi:**
```bash
# Delete node_modules dan reinstall
cd "f:\LIDM\20225\project LIDM\cirvia"
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### ❌ Problem: Python dependency error
**Solusi:**
```bash
# Reinstall Python packages
pip uninstall opencv-python mediapipe pygame flask
pip install opencv-python==4.8.1.78
pip install mediapipe==0.10.8
pip install pygame==2.5.2
pip install flask==2.3.3
pip install numpy
```

### ❌ Problem: Camera tidak terdeteksi
**Solusi:**
1. Pastikan webcam tidak digunakan aplikasi lain
2. Restart browser
3. Allow camera permission
4. Try different browser (Chrome recommended)

### ❌ Problem: Loading stuck forever
**Solusi:**
```bash
# Stop all Python processes
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force

# Restart everything
npm run dev  # Terminal 1
# Then use web interface to launch CV
```

### ❌ Problem: Port already in use
**Solusi:**
```bash
# Check what's using port 3000 or 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

---

## 🎮 Fitur yang Tersedia

### 🌐 Web Platform (localhost:3000)
- ✅ Homepage dengan informasi
- ✅ About page
- ✅ Materials pembelajaran
- ✅ Practicum dengan 2 mode:
  - **Web Mode:** Circuit builder sederhana di browser
  - **CV Mode:** Python CV application embedded

### 🤖 Python CV Application
- ✅ Live camera feed
- ✅ Hand gesture detection (MediaPipe)
- ✅ Circuit building dengan gesture:
  - 🤏 **Pinch:** Select & drag komponen
  - 👆 **Point:** Navigate interface  
  - ✋ **Open:** Release komponen
  - 👊 **Fist:** Delete komponen
- ✅ Real-time calculations
- ✅ Visual feedback

---

## 🎯 Quick Start Commands

### For Development:
```bash
# Terminal 1 - Web Platform
cd "f:\LIDM\20225\project LIDM\cirvia"
npm run dev

# Access: http://localhost:3000/practicum
# Click CV Mode > Launch Python CV
```

### For Testing CV Only:
```bash
# Direct Flask server
cd "f:\LIDM\20225\project LIDM\cirvia\src\app\practicum\cv-circuit"
python web_cv_server.py

# Access: http://localhost:5000
```

---

## 📱 Browser Compatibility

### ✅ Recommended:
- Google Chrome (best performance)
- Microsoft Edge
- Firefox

### ⚠️ Notes:
- Allow camera permission
- Use latest browser version
- Disable ad blockers for localhost

---

## 🆘 Emergency Reset

Jika semua bermasalah:
```bash
# 1. Stop semua process
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# 2. Clean install
cd "f:\LIDM\20225\project LIDM\cirvia"
rm -rf node_modules
npm install

# 3. Reinstall Python deps
pip install -r requirements.txt

# 4. Restart
npm run dev
```

---

## 🎉 Expected Result

Jika semua berjalan lancar:
```
✅ Next.js running at: http://localhost:3000
✅ Python CV embedded in: http://localhost:3000/practicum  
✅ Camera feed active with hand tracking
✅ Gesture controls working
✅ Circuit builder functional
✅ Real-time calculations
```

**Happy Coding! 🚀**
