## 🖼️ Flask + iframe Integration Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser Window                              │
│  URL: http://localhost:3000/practicum                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─ Next.js Platform (cirvia) ─────────────────────────────────┐ │
│  │  Header: "Praktikum Computer Vision"                        │ │
│  │  Navigation: Home | About | Materials | Practicum          │ │
│  │                                                             │ │
│  │  ┌─ Tab Selection ─────────────────────────────────────────┐ │ │
│  │  │  [🌐 Web Mode]  [🤖 CV Mode - ACTIVE]                  │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─ EmbeddedPythonCV Component ───────────────────────────┐ │ │
│  │  │                                                         │ │ │
│  │  │  Status: [🟢 Running] [⏹️ Stop]                        │ │ │
│  │  │                                                         │ │ │
│  │  │  ┌─ iframe (Flask App) ─────────────────────────────┐  │ │ │
│  │  │  │  src="http://localhost:5000"                     │  │ │ │
│  │  │  │  ┌───────────────────────────────────────────────┐ │  │ │ │
│  │  │  │  │        PYTHON CV APPLICATION                  │ │  │ │ │
│  │  │  │  │                                               │ │  │ │ │
│  │  │  │  │  ┌─ Camera Feed ────┐  ┌─ Circuit Canvas ───┐ │ │  │ │ │
│  │  │  │  │  │  📹 Live Video    │  │  🔋──🔌──💡──⚡   │ │ │  │ │ │
│  │  │  │  │  │  ✋ Hand Tracking  │  │  Real-time build   │ │ │  │ │ │
│  │  │  │  │  └──────────────────┘  └───────────────────┘ │ │  │ │ │
│  │  │  │  │                                               │ │  │ │ │
│  │  │  │  │  ┌─ Controls Panel ──────────────────────────┐ │ │  │ │ │
│  │  │  │  │  │  🤏 Pinch: Select     ✋ Open: Release    │ │ │  │ │ │
│  │  │  │  │  │  👆 Point: Navigate   👊 Fist: Delete     │ │ │  │ │ │
│  │  │  │  │  └───────────────────────────────────────────┘ │ │  │ │ │
│  │  │  │  │                                               │ │  │ │ │
│  │  │  │  │  ┌─ Live Calculations ───────────────────────┐ │ │  │ │ │
│  │  │  │  │  │  Voltage: 12V    Current: 0.12A           │ │ │  │ │ │
│  │  │  │  │  │  Resistance: 100Ω  Power: 1.44W           │ │ │  │ │ │
│  │  │  │  │  └───────────────────────────────────────────┘ │ │  │ │ │
│  │  │  │  └───────────────────────────────────────────────┘ │  │ │ │
│  │  │  └─────────────────────────────────────────────────────┘  │ │ │
│  │  │                                                         │ │ │
│  │  │  Instructions: "Use hand gestures to build circuits"   │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  Footer: © 2025 Cirvia - Physics Learning Platform         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

Technical Flow:
1. User visits: localhost:3000/practicum 
2. Clicks: "Launch Python CV" button
3. Next.js API starts Flask server at localhost:5000
4. iframe loads Flask content inside the web page
5. Full Python CV app runs embedded in web platform!

```

## 🎯 Key Points:

### ✅ **Advantages:**
- **Single Browser Tab:** Everything in one place
- **Full Python Power:** Complete OpenCV + MediaPipe features  
- **Seamless UX:** No separate windows or apps
- **Platform Integration:** Maintains your web platform context
- **Easy Control:** Start/stop from web interface

### 📋 **What User Sees:**
1. **Before:** Web platform with simple circuit builder
2. **Click Launch:** Loading screen with progress
3. **After:** Full Python CV app embedded in same page
4. **Experience:** Gesture-controlled circuit building with live camera

### 🔧 **Technical Reality:**
- **Flask Server:** Runs at localhost:5000 with full CV features
- **iframe:** Displays Flask app at localhost:3000/practicum
- **APIs:** Next.js controls Python process lifecycle
- **Integration:** Embedded within existing platform design

**Intinya:** Flask menciptakan web server terpisah, tapi ditampilkan di dalam halaman platform Anda menggunakan iframe. User experience tetap seamless!
