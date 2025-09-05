# CV Circuit Practicum - Integration Guide

## Overview
Praktikum Computer Vision terintegrasi dalam platform pembelajaran fisika Cirvia. Praktikum ini menggunakan deteksi gesture tangan untuk berinteraksi dengan komponen rangkaian listrik secara real-time.

## Struktur Integrasi

```
cirvia/
├── src/app/practicum/
│   ├── page.tsx                     # Main practicum page with tabs
│   └── cv-circuit/                  # CV practicum files
│       ├── main.py                  # Main CV application
│       ├── setup_dependencies.py   # Python dependencies installer
│       ├── setup.bat               # Windows setup script
│       ├── requirements.txt        # Python requirements
│       └── src/                    # CV application source code
├── src/components/
│   └── CVPracticumLauncher.tsx     # React component to launch CV app
└── src/app/api/
    ├── launch-cv-app/
    │   └── route.ts                # API to launch Python CV app
    └── stop-cv-app/
        └── route.ts                # API to stop Python CV app
```

## Setup Instructions

### 1. Install Python Dependencies

#### Option A: Automatic Setup (Windows)
```bash
cd src/app/practicum/cv-circuit
./setup.bat
```

#### Option B: Manual Setup
```bash
cd src/app/practicum/cv-circuit
pip install -r requirements.txt
```

### 2. Test CV Application
```bash
cd src/app/practicum/cv-circuit
python main.py
```

### 3. Run Cirvia Platform
```bash
# In the main cirvia directory
npm run dev
```

## Features

### Web Practicum (💻 Praktikum Web)
- Interactive circuit builder in browser
- Real-time calculations
- Hand gesture control using MediaPipe
- Drag and drop components

### CV Practicum (📷 Praktikum Computer Vision)  
- Desktop Python application
- Advanced computer vision using OpenCV + MediaPipe
- Pinch gesture detection for precise control
- 3D-like component manipulation
- Real-time circuit calculations

## How It Works

1. **Web Interface**: Students access the practicum through the Cirvia web platform
2. **Tab Selection**: Choose between Web or CV practicum modes
3. **CV Launcher**: Click "Mulai Praktikum CV" to launch the Python application
4. **Process Management**: Next.js API routes handle starting/stopping the Python process
5. **Hand Tracking**: MediaPipe detects hand gestures in real-time
6. **Circuit Building**: Pinch gestures allow students to manipulate circuit components

## Architecture

### Frontend (React/Next.js)
- `page.tsx`: Main practicum page with tab navigation
- `CVPracticumLauncher.tsx`: Component to launch CV app with status tracking

### Backend (Next.js API Routes)
- `/api/launch-cv-app`: Spawns Python subprocess for CV application
- `/api/stop-cv-app`: Terminates the CV application process

### CV Application (Python)
- `main.py`: Main application entry point
- `src/hand_detection/`: Hand tracking and gesture detection
- `src/ui/`: User interface components and rendering
- `src/circuit_logic/`: Circuit calculations and wire management

## Dependencies

### Web Platform
- React 18+
- Next.js 14+
- TailwindCSS
- TypeScript

### CV Application  
- Python 3.8+
- OpenCV 4.8+
- MediaPipe 0.10+
- Pygame 2.5+
- NumPy 1.24+

## Usage Instructions

### For Students
1. Navigate to Praktikum page
2. Choose "📷 Praktikum Computer Vision" tab
3. Click "Mulai Praktikum CV" 
4. Allow camera access when prompted
5. Use pinch gestures to interact with circuit components
6. View real-time calculations and circuit analysis

### Gesture Controls
- **🤏 Pinch**: Select and drag components
- **✋ Open Hand**: Release component
- **👆 Point**: Navigate interface

### For Educators
- Monitor student progress through the web interface
- Access both web and CV practicum modes
- View real-time calculation results
- Provide guided instructions through integrated UI

## Troubleshooting

### Common Issues
1. **Camera not detected**: Check camera permissions and hardware
2. **Python not found**: Ensure Python is installed and in PATH
3. **Import errors**: Run setup script to install dependencies
4. **Process won't start**: Check file permissions and Python path

### Debug Mode
Enable debug logging in `main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Development

### Adding New Features
1. Modify Python CV application in `cv-circuit/src/`
2. Update React components in `src/components/`
3. Add new API routes if needed in `src/app/api/`

### Testing
1. Test CV application standalone: `python main.py`
2. Test web integration: `npm run dev`
3. Verify API endpoints work correctly

## License
This integrated practicum system is part of the Cirvia educational platform.
