# 📊 Gesture Detection Logger - Usage Guide

## 🎯 Overview

GestureDetectionLogger adalah komponen UI yang menampilkan log real-time dari deteksi gesture dan memungkinkan export data untuk debugging.

---

## 🚀 Cara Menggunakan

### 1. Import Component

Tambahkan di file `WebCVPracticum.tsx` atau halaman practicum:

```tsx
import { GestureDetectionLogger } from "./GestureDetectionLogger";

// Di dalam return component:
<>
  {/* Your existing components */}
  <GestureDetectionLogger />
</>
```

### 2. Akses dari Browser Console

Anda juga bisa mengontrol logger dari browser console (F12):

```javascript
// Get all logs
const logs = GestureDetector.getDetectionLogs();
console.table(logs);

// Get statistics
const stats = GestureDetector.getLogStats();
console.log(stats);

// Export as JSON
const json = GestureDetector.exportLogsAsJSON();
console.log(json);

// Download logs
GestureDetector.downloadLogs("my-logs.json");

// Clear logs
GestureDetector.clearLogs();
```

---

## 📊 Fitur UI Logger

### Floating Button
- **Icon BarChart** di pojok kanan bawah
- **Badge merah** menunjukkan jumlah log entries
- **Click** untuk membuka panel

### Panel Logger

#### 1. **Statistics Dashboard**
```
┌─────────────────────────────────┐
│  Total Logs  │ Fingers │ Actions │
│     150      │   120   │   30    │
└─────────────────────────────────┘
```

#### 2. **Filter & Controls**
- **Dropdown Filter**: All, Finger Detection, Gesture, Action
- **Auto-refresh Toggle**: 👁️ (ON) / 👁️‍🗨️ (OFF)
- **Refresh Button**: Manual refresh
- **Copy Button** 📋: Copy logs as JSON
- **Download Button** ⬇️: Download as `.json` file
- **Clear Button** 🗑️: Clear all logs

#### 3. **Log Entries**
Setiap entry menampilkan:
- **Timestamp**: `15:32:08.771`
- **Type Badge**: `FINGER_DETECTION` / `GESTURE` / `ACTION`
- **Data**: JSON formatted data

**Color Coding:**
- 🔵 **Blue**: Finger Detection
- 🟢 **Green**: Gesture
- 🟣 **Purple**: Action

---

## 📝 Log Entry Types

### 1. `finger_detection`

**Contoh:**
```json
{
  "timestamp": "2025-11-11T15:32:08.771Z",
  "type": "finger_detection",
  "data": {
    "fingerCount": 3,
    "extended": ["index", "middle", "ring"],
    "closed": ["thumb", "pinky"]
  }
}
```

**Thumb-specific log:**
```json
{
  "timestamp": "2025-11-11T15:32:08.771Z",
  "type": "finger_detection",
  "data": {
    "finger": "thumb",
    "tipToWrist": 0.234,
    "mcpToWrist": 0.198,
    "ratio": 1.18,
    "horizontalDistance": 0.042,
    "isExtended": false
  }
}
```

### 2. `gesture`

**Contoh:**
```json
{
  "timestamp": "2025-11-11T15:32:10.500Z",
  "type": "gesture",
  "data": {
    "event": "finger_count_complete",
    "fingerCount": 3,
    "component": "resistor"
  }
}
```

### 3. `action`

**Contoh:**
```json
{
  "timestamp": "2025-11-11T15:32:11.200Z",
  "type": "action",
  "data": {
    "actionType": "add",
    "componentType": "resistor",
    "position": { "x": 287.7, "y": 391.1 }
  }
}
```

---

## 🎨 UI Features

### Auto-Refresh
- **Default**: ON (updates every 1 second)
- **Toggle**: Click 👁️ button
- **OFF**: Manual refresh only

### Filtering
```
All Types          ← Show all logs
Finger Detection   ← Only finger detection logs
Gesture           ← Only gesture logs  
Action            ← Only action logs
```

### Export Options

#### 1. **Copy to Clipboard** 📋
- Click copy button
- Logs copied as JSON string
- Paste anywhere (Excel, text editor, etc.)

#### 2. **Download as File** ⬇️
- Click download button
- File name: `gesture-logs-2025-11-11T15-32-08.json`
- Open in any JSON viewer

#### 3. **Console Export** (Advanced)
```javascript
// Get raw data
const logs = GestureDetector.getDetectionLogs();

// Filter by type
const fingerLogs = logs.filter(l => l.type === 'finger_detection');

// Analyze thumb detections
const thumbLogs = logs.filter(l => 
  l.type === 'finger_detection' && l.data.finger === 'thumb'
);

// Calculate average thumb ratio
const avgRatio = thumbLogs.reduce((sum, log) => 
  sum + log.data.ratio, 0) / thumbLogs.length;

console.log('Average thumb ratio:', avgRatio);
```

---

## 🔍 Debugging Workflows

### Workflow 1: Debug Thumb Detection Issue

**Problem**: Ibu jari selalu terdeteksi

**Steps:**
1. Open logger panel
2. Filter: "Finger Detection"
3. Look for thumb-specific logs
4. Check `ratio` and `horizontalDistance` values
5. Compare with threshold (ratio > 1.3, horizDist > 0.05)
6. Adjust thresholds in `GestureDetector.ts` if needed

**Example Analysis:**
```
👍 THUMB entries showing ratio=1.45 (threshold 1.3) ✅
   horizontalDistance=0.067 (threshold 0.05) ✅
   Result: EXTENDED

❌ Problem: Threshold too low, thumb detected when should be closed
✅ Solution: Increase ratio threshold to 1.5
```

### Workflow 2: Verify Finger Count Accuracy

**Steps:**
1. Open logger panel
2. Show 1 finger gesture
3. Check log entry:
   ```json
   {
     "fingerCount": 1,
     "extended": ["index"],
     "closed": ["thumb", "middle", "ring", "pinky"]
   }
   ```
4. If incorrect, check which fingers are wrongly extended/closed
5. Download logs for detailed analysis

### Workflow 3: Track Component Addition

**Steps:**
1. Enable auto-refresh
2. Perform gesture (e.g., 3 fingers for resistor)
3. Watch logs in real-time:
   - `finger_detection`: 3 fingers
   - `gesture`: finger_count_complete
   - `action`: add resistor
4. Export logs to verify timing and sequence

---

## 💾 Log Storage

### Memory Management
- **Max Entries**: 500 logs
- **Auto-cleanup**: Oldest entries removed when limit reached
- **Storage**: In-memory only (cleared on page refresh)

### Best Practices
1. **Export regularly** if you need history across sessions
2. **Clear logs** after debugging to free memory
3. **Use filters** to reduce visual clutter
4. **Auto-refresh OFF** when analyzing specific entries

---

## 🎯 Advanced Usage

### Custom Log Analysis Script

Create a script to analyze exported logs:

```javascript
// Load exported JSON file
const logs = JSON.parse(/* your exported JSON */);

// Count finger detection accuracy
const fingerDetections = logs.filter(l => l.type === 'finger_detection');
const fingerCounts = {};

fingerDetections.forEach(log => {
  const count = log.data.fingerCount || 'unknown';
  fingerCounts[count] = (fingerCounts[count] || 0) + 1;
});

console.log('Finger count distribution:', fingerCounts);

// Analyze thumb false positives
const thumbLogs = logs.filter(l => 
  l.data.finger === 'thumb' && l.data.isExtended === true
);

console.log(`Thumb detected ${thumbLogs.length} times`);
console.log('Average ratio:', 
  thumbLogs.reduce((s, l) => s + l.data.ratio, 0) / thumbLogs.length
);
```

### Integration with Testing

```typescript
// In your test file
import { GestureDetector } from './GestureDetector';

describe('Finger Detection', () => {
  beforeEach(() => {
    GestureDetector.clearLogs();
  });

  it('should detect 1 finger correctly', () => {
    // ... perform gesture ...
    
    const logs = GestureDetector.getDetectionLogs();
    const lastLog = logs[logs.length - 1];
    
    expect(lastLog.data.fingerCount).toBe(1);
    expect(lastLog.data.extended).toEqual(['index']);
  });
});
```

---

## 🐛 Troubleshooting

### Logger not appearing
- Check if `<GestureDetectionLogger />` is imported
- Ensure component is rendered in JSX
- Check console for React errors

### No logs showing
- Verify debug mode is enabled: `GestureDetector.setDebugMode(true)`
- Check if gestures are being detected (console logs)
- Try manual refresh button

### Performance issues
- Disable auto-refresh if too many logs
- Clear old logs regularly
- Use filters to reduce displayed entries

### Export not working
- Check browser console for errors
- Verify popup blockers not interfering
- Try "Copy" instead of "Download"

---

## 📚 API Reference

### Static Methods

```typescript
// Enable/disable debug logging
GestureDetector.setDebugMode(enabled: boolean, thumbOnly?: boolean): void

// Get current debug mode
GestureDetector.getDebugMode(): { enabled: boolean; thumbOnly: boolean }

// Get all logs
GestureDetector.getDetectionLogs(): LogEntry[]

// Export as JSON string
GestureDetector.exportLogsAsJSON(): string

// Download logs file
GestureDetector.downloadLogs(filename?: string): void

// Clear all logs
GestureDetector.clearLogs(): void

// Get statistics
GestureDetector.getLogStats(): LogStats
```

### Types

```typescript
interface LogEntry {
  timestamp: string;  // ISO 8601 format
  type: "finger_detection" | "gesture" | "action";
  data: any;         // Type-specific data
}

interface LogStats {
  totalEntries: number;
  byType: { [key: string]: number };
  oldestEntry: string | null;
  newestEntry: string | null;
}
```

---

**Happy Debugging! 🚀**
