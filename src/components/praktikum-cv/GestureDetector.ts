import { HandLandmark, GestureResult, GestureName } from "./types";

export class GestureDetector {
  private previousGesture: GestureResult | null = null;
  private gestureHistory: Array<{
    landmarks: HandLandmark[];
    timestamp: number;
  }> = [];
  private readonly historySize = 5;
  private readonly minConfidence = 0.7;
  private previousHandAngle: number | null = null; // NEW: For rotation detection

  // NEW: Finger count hold detection
  private fingerCountStartTime: number | null = null;
  private lastFingerCount: number | null = null;
  private readonly fingerCountHoldDuration = 3000; // 3 seconds

  // 🔧 PINCH DETECTION THRESHOLD - Matched with Python version
  // Python: 40px / 640px = 0.0625 (6.25% of screen width)
  // JS: Target 40-50px equivalent at typical resolutions
  // At 1280px: 0.05 * 1280 = 64px (similar to Python's 40px)
  private readonly PINCH_THRESHOLD = 0.05; // Lowered from 0.10 to match Python

  constructor() {
    // Log initialization info
    console.log(
      `🎯 GestureDetector initialized:
      - PINCH Threshold: ${this.PINCH_THRESHOLD} (normalized)
      - At 1280px width: ${(this.PINCH_THRESHOLD * 1280).toFixed(0)}px
      - At 1920px width: ${(this.PINCH_THRESHOLD * 1920).toFixed(0)}px
      - Python equivalent: ~40px @ 640px
      - Finger count hold: ${this.fingerCountHoldDuration}ms`
    );
  }

  /**
   * Main gesture detection method - ENHANCED with mirror correction
   */
  detectGesture(
    landmarks: HandLandmark[],
    handedness: "Left" | "Right",
    isFrontCamera: boolean = true // NEW: Flag untuk kamera depan (mirror)
  ): GestureResult {
    // 🔄 MIRROR CORRECTION: Flip handedness untuk kamera depan
    // Kamera depan = mirror image, jadi Left <-> Right harus dibalik
    const actualHandedness: "Left" | "Right" = isFrontCamera
      ? handedness === "Left"
        ? "Right"
        : "Left"
      : handedness;

    console.log(
      `👋 Hand detected: ${handedness} → Corrected: ${actualHandedness} (Camera: ${
        isFrontCamera ? "Front/Mirror" : "Back"
      })`
    );

    // Add to history for swipe detection
    this.addToHistory(landmarks);

    // Get key finger tips and base points
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexTip = landmarks[8];
    const indexPIP = landmarks[6];
    const middleTip = landmarks[12];
    const middlePIP = landmarks[10];
    const ringTip = landmarks[16];
    const ringPIP = landmarks[14];
    const pinkyTip = landmarks[20];
    const pinkyPIP = landmarks[18];
    const wrist = landmarks[0];

    // Calculate palm center for position
    const palmCenter = this.calculatePalmCenter(landmarks);

    // Check gestures in priority order

    // 1. PINCH (Thumb + Index close together) - ONLY FOR RIGHT HAND
    const thumbIndexDist = this.calculateDistance(thumbTip, indexTip);

    // 🔧 PINCH hanya untuk TANGAN KANAN (untuk select & move)
    // FIXED: Using 0.05 threshold to match Python's 40px/640px behavior
    if (actualHandedness === "Right") {
      // 🔧 FIX: Check bahwa BUKAN open palm (semua jari extended)
      const isIndexExtended = this.isFingerExtended(landmarks, "index");
      const isMiddleExtended = this.isFingerExtended(landmarks, "middle");
      const isRingExtended = this.isFingerExtended(landmarks, "ring");
      const isPinkyExtended = this.isFingerExtended(landmarks, "pinky");

      const allFingersExtended =
        isIndexExtended &&
        isMiddleExtended &&
        isRingExtended &&
        isPinkyExtended;

      // ✅ PINCH valid HANYA jika:
      // 1. Thumb + index dekat (< 0.05)
      // 2. BUKAN open palm (tidak semua jari extended)
      if (thumbIndexDist < this.PINCH_THRESHOLD && !allFingersExtended) {
        // Use midpoint between thumb and index as PINCH position
        const pinchCenter = {
          x: (thumbTip.x + indexTip.x) / 2,
          y: (thumbTip.y + indexTip.y) / 2,
          z: (thumbTip.z + indexTip.z) / 2,
        };

        console.log(
          `✅ RIGHT HAND PINCH ACTIVE! Distance: ${thumbIndexDist.toFixed(
            4
          )} (Threshold: ${this.PINCH_THRESHOLD}) at (${(
            pinchCenter.x * 1200
          ).toFixed(0)}, ${(pinchCenter.y * 700).toFixed(0)})`
        );
        return this.createGestureResult(
          "pinch",
          0.95,
          actualHandedness,
          landmarks,
          pinchCenter
        );
      } else {
        // Log when right hand detected but not pinching
        if (thumbIndexDist < this.PINCH_THRESHOLD && allFingersExtended) {
          console.log(
            `⚠️ RIGHT HAND - Pinch distance met (${thumbIndexDist.toFixed(
              4
            )}) but all fingers extended (open palm). Skipping PINCH.`
          );
        } else {
          // Show both normalized and pixel equivalent for debugging
          const pixelEquivalent = (thumbIndexDist * 1280).toFixed(0);
          console.log(
            `👉 RIGHT HAND - Not pinching. Distance: ${thumbIndexDist.toFixed(
              4
            )} (${pixelEquivalent}px @ 1280w) | Need < ${
              this.PINCH_THRESHOLD
            } (${(this.PINCH_THRESHOLD * 1280).toFixed(0)}px)`
          );
        }
      }
    }

    // 2. FINGER COUNT (1-5 fingers) - ONLY FOR LEFT HAND with HOLD detection
    const fingerCount = this.countExtendedFingers(landmarks);
    const isHandStable = this.isHandStable(landmarks);

    // ✋ LEFT HAND ONLY: Finger count untuk ADD component langsung (with 3-second hold)
    // RIGHT HAND tidak masuk sini, agar tidak conflict dengan PINCH
    if (
      actualHandedness === "Left" &&
      fingerCount >= 1 &&
      fingerCount <= 5 &&
      isHandStable
    ) {
      const now = Date.now();

      // Check if same finger count is being held
      if (this.lastFingerCount === fingerCount && this.fingerCountStartTime) {
        const holdDuration = now - this.fingerCountStartTime;
        const progress = Math.min(
          holdDuration / this.fingerCountHoldDuration,
          1.0
        );

        console.log(
          `🖐️ HOLDING ${fingerCount} fingers on ${actualHandedness} hand - ${(
            progress * 100
          ).toFixed(0)}% (${(holdDuration / 1000).toFixed(1)}s / 3s)`
        );

        // Only trigger action if held for full duration AND it's left hand
        if (
          holdDuration >= this.fingerCountHoldDuration &&
          actualHandedness === "Left"
        ) {
          const componentNames: { [key: number]: string } = {
            1: "🔋 BATTERY",
            2: "💡 LAMP",
            3: "⚡ RESISTOR",
            4: "🔘 SWITCH",
            5: "━ WIRE",
          };

          console.log(
            `✅ FINGER COUNT COMPLETE! ${fingerCount} fingers (${componentNames[fingerCount]}) held for 3 seconds - ADDING COMPONENT!`
          );

          // Reset to prevent repeated triggers
          this.fingerCountStartTime = null;
          this.lastFingerCount = null;

          return this.createGestureResult(
            "finger_count",
            0.9,
            actualHandedness,
            landmarks,
            palmCenter,
            {
              fingerCount,
              isAddAction: true, // Left hand after 3 seconds
              holdProgress: 1.0,
            }
          );
        }

        // Still holding - return intermediate result with progress
        return this.createGestureResult(
          "finger_count",
          0.9,
          actualHandedness,
          landmarks,
          palmCenter,
          {
            fingerCount,
            isAddAction: false, // Not ready yet
            holdProgress: progress,
          }
        );
      } else {
        // New finger count detected - start timer
        const componentNames: { [key: number]: string } = {
          1: "🔋 BATTERY",
          2: "💡 LAMP",
          3: "⚡ RESISTOR",
          4: "🔘 SWITCH",
          5: "━ WIRE",
        };

        console.log(
          `🖐️ NEW FINGER COUNT: ${fingerCount} fingers (${componentNames[fingerCount]}) on ${actualHandedness} hand - Starting 3s timer`
        );
        this.fingerCountStartTime = now;
        this.lastFingerCount = fingerCount;

        return this.createGestureResult(
          "finger_count",
          0.9,
          actualHandedness,
          landmarks,
          palmCenter,
          {
            fingerCount,
            isAddAction: false, // Not ready yet
            holdProgress: 0.0,
          }
        );
      }
    } else {
      // Hand not stable or finger count changed - reset timer
      if (this.fingerCountStartTime) {
        console.log(`❌ Finger count cancelled (hand moved or count changed)`);
        this.fingerCountStartTime = null;
        this.lastFingerCount = null;
      }
    }

    // 3. HAND ROTATION - NEW: Detect if hand is rotating
    const rotationGesture = this.detectRotation(landmarks, actualHandedness); // Use corrected handedness
    if (rotationGesture) {
      return rotationGesture;
    }

    // 4. PEACE SIGN (Index + Middle extended, others closed)
    const isIndexExtended = this.isFingerExtended(landmarks, "index");
    const isMiddleExtended = this.isFingerExtended(landmarks, "middle");
    const isRingClosed = !this.isFingerExtended(landmarks, "ring");
    const isPinkyClosed = !this.isFingerExtended(landmarks, "pinky");

    if (isIndexExtended && isMiddleExtended && isRingClosed && isPinkyClosed) {
      return this.createGestureResult(
        "peace",
        0.9,
        actualHandedness, // Use corrected handedness
        landmarks,
        middleTip
      );
    }

    // 5. POINT (Only index extended)
    if (isIndexExtended && !isMiddleExtended && isRingClosed && isPinkyClosed) {
      console.log(
        `👆 POINT gesture detected | Handedness: ${actualHandedness} | Confidence: 0.90`
      );
      return this.createGestureResult(
        "point",
        0.9, // Increased from 0.88 to ensure it passes threshold
        actualHandedness, // Use corrected handedness
        landmarks,
        indexTip
      );
    }

    // 6. THUMBS UP
    const isThumbUp = this.isThumbsUp(landmarks);
    if (isThumbUp) {
      return this.createGestureResult(
        "thumbs_up",
        0.85,
        actualHandedness, // Use corrected handedness
        landmarks,
        thumbTip
      );
    }

    // 7. GRAB/FIST (All fingers closed)
    const allFingersClosed =
      !isIndexExtended &&
      !isMiddleExtended &&
      !this.isFingerExtended(landmarks, "ring") &&
      !this.isFingerExtended(landmarks, "pinky");

    if (allFingersClosed) {
      console.log(`✊ FIST/GRAB detected on ${actualHandedness} hand`);
      return this.createGestureResult(
        "grab",
        0.9,
        actualHandedness, // Use corrected handedness
        landmarks,
        palmCenter
      );
    }

    // 8. OPEN PALM (All fingers extended)
    const allFingersExtended =
      isIndexExtended &&
      isMiddleExtended &&
      this.isFingerExtended(landmarks, "ring") &&
      this.isFingerExtended(landmarks, "pinky");

    if (allFingersExtended) {
      return this.createGestureResult(
        "open_palm",
        0.92,
        actualHandedness, // Use corrected handedness
        landmarks,
        palmCenter
      );
    }

    // 9. SWIPE GESTURES (Based on movement)
    const swipeGesture = this.detectSwipe(landmarks, actualHandedness); // Use corrected handedness
    if (swipeGesture) {
      return swipeGesture;
    }

    // Default: unknown
    return this.createGestureResult(
      "unknown",
      0.5,
      actualHandedness, // Use corrected handedness
      landmarks,
      palmCenter
    );
  }

  /**
   * Calculate Euclidean distance between two landmarks
   * 🔧 FIXED: Only use X and Y for 2D pinch detection (ignore Z depth)
   * Z-axis adds noise and makes detection harder, especially with varying camera angles
   * This matches Python OpenCV behavior which uses 2D pixel coordinates
   */
  private calculateDistance(p1: HandLandmark, p2: HandLandmark): number {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
      // Removed Z-axis: Math.pow(p1.z - p2.z, 2)
      // Z causes issues with camera depth perception
    );
  }

  /**
   * Check if specific finger is extended
   */
  private isFingerExtended(landmarks: HandLandmark[], finger: string): boolean {
    const fingerIndices: { [key: string]: number[] } = {
      thumb: [1, 2, 3, 4],
      index: [5, 6, 7, 8],
      middle: [9, 10, 11, 12],
      ring: [13, 14, 15, 16],
      pinky: [17, 18, 19, 20],
    };

    const indices = fingerIndices[finger];
    if (!indices) return false;

    const tip = landmarks[indices[3]];
    const pip = landmarks[indices[2]];
    const mcp = landmarks[indices[0]];

    // For thumb, check horizontal distance
    if (finger === "thumb") {
      return Math.abs(tip.x - mcp.x) > 0.04;
    }

    // For other fingers, tip should be above PIP
    return tip.y < pip.y - 0.02;
  }

  /**
   * Detect thumbs up gesture
   */
  private isThumbsUp(landmarks: HandLandmark[]): boolean {
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexMCP = landmarks[5];
    const wrist = landmarks[0];

    // Thumb pointing up
    const thumbUp = thumbTip.y < thumbIP.y && thumbTip.y < wrist.y;

    // Other fingers closed
    const otherFingersClosed =
      !this.isFingerExtended(landmarks, "index") &&
      !this.isFingerExtended(landmarks, "middle") &&
      !this.isFingerExtended(landmarks, "ring") &&
      !this.isFingerExtended(landmarks, "pinky");

    return thumbUp && otherFingersClosed;
  }

  /**
   * Detect swipe gesture from movement history
   */
  private detectSwipe(
    currentLandmarks: HandLandmark[],
    handedness: "Left" | "Right"
  ): GestureResult | null {
    if (this.gestureHistory.length < 3) return null;

    const firstFrame = this.gestureHistory[0];
    const lastFrame = this.gestureHistory[this.gestureHistory.length - 1];

    // Calculate horizontal movement of wrist
    const deltaX = lastFrame.landmarks[0].x - firstFrame.landmarks[0].x;
    const deltaTime = lastFrame.timestamp - firstFrame.timestamp;

    // Swipe threshold: 0.2 units in less than 500ms
    const swipeThreshold = 0.2;
    const timeThreshold = 500;

    if (Math.abs(deltaX) > swipeThreshold && deltaTime < timeThreshold) {
      const direction: GestureName = deltaX > 0 ? "swipe_right" : "swipe_left";

      // Clear history after swipe
      this.gestureHistory = [];

      const palmCenter = this.calculatePalmCenter(currentLandmarks);
      return this.createGestureResult(
        direction,
        0.85,
        handedness,
        currentLandmarks,
        palmCenter
      );
    }

    return null;
  }

  /**
   * Calculate palm center from landmarks
   */
  private calculatePalmCenter(landmarks: HandLandmark[]): HandLandmark {
    const palmIndices = [0, 1, 5, 9, 13, 17]; // Wrist + all MCPs

    let sumX = 0,
      sumY = 0,
      sumZ = 0;
    palmIndices.forEach((i) => {
      sumX += landmarks[i].x;
      sumY += landmarks[i].y;
      sumZ += landmarks[i].z;
    });

    return {
      x: sumX / palmIndices.length,
      y: sumY / palmIndices.length,
      z: sumZ / palmIndices.length,
    };
  }

  /**
   * Add landmarks to history for temporal analysis
   */
  private addToHistory(landmarks: HandLandmark[]) {
    this.gestureHistory.push({
      landmarks,
      timestamp: Date.now(),
    });

    // Keep only recent history
    if (this.gestureHistory.length > this.historySize) {
      this.gestureHistory.shift();
    }
  }

  /**
   * Create gesture result object - UPDATED with metadata support
   */
  private createGestureResult(
    name: GestureName,
    confidence: number,
    handedness: "Left" | "Right",
    landmarks: HandLandmark[],
    position: HandLandmark,
    metadata?: {
      fingerCount?: number;
      rotationAngle?: number;
      absoluteAngle?: number;
      isAddAction?: boolean;
      holdProgress?: number; // NEW: Hold progress (0.0 - 1.0)
      componentId?: string; // NEW: Component ID at finger position
    }
  ): GestureResult {
    return {
      name,
      confidence,
      handedness,
      landmarks,
      timestamp: Date.now(),
      position: { x: position.x, y: position.y },
      metadata,
    };
  }

  /**
   * Apply smoothing to reduce jitter
   */
  getSmoothGesture(currentGesture: GestureResult): GestureResult {
    // If same gesture as previous, boost confidence
    if (
      this.previousGesture &&
      this.previousGesture.name === currentGesture.name &&
      Date.now() - this.previousGesture.timestamp < 1000
    ) {
      return {
        ...currentGesture,
        confidence: Math.min(1.0, currentGesture.confidence + 0.05),
      };
    }

    this.previousGesture = currentGesture;
    return currentGesture;
  }

  /**
   * Reset detector state
   */
  reset() {
    this.previousGesture = null;
    this.gestureHistory = [];
    this.previousHandAngle = null; // NEW
  }

  /**
   * NEW: Count how many fingers are extended
   */
  private countExtendedFingers(landmarks: HandLandmark[]): number {
    let count = 0;

    const fingers = ["thumb", "index", "middle", "ring", "pinky"];
    fingers.forEach((finger) => {
      if (this.isFingerExtended(landmarks, finger)) {
        count++;
      }
    });

    return count;
  }

  /**
   * NEW: Check if hand is stable (not moving fast)
   */
  private isHandStable(landmarks: HandLandmark[]): boolean {
    if (this.gestureHistory.length < 2) return false;

    const currentWrist = landmarks[0];
    const previousWrist =
      this.gestureHistory[this.gestureHistory.length - 1].landmarks[0];

    const movement = this.calculateDistance(currentWrist, previousWrist);

    // Hand is stable if movement < 3% of frame
    return movement < 0.03;
  }

  /**
   * NEW: Detect hand rotation gesture
   */
  private detectRotation(
    landmarks: HandLandmark[],
    handedness: "Left" | "Right"
  ): GestureResult | null {
    // Need at least 3 frames to detect rotation
    if (this.gestureHistory.length < 3) return null;

    const currentAngle = this.calculateHandAngle(landmarks);

    if (this.previousHandAngle !== null) {
      let angleDelta = currentAngle - this.previousHandAngle;

      // Normalize angle delta to -180 to 180
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;

      // If rotating significantly (> 10 degrees per frame)
      if (Math.abs(angleDelta) > 10) {
        this.previousHandAngle = currentAngle;

        const palmCenter = this.calculatePalmCenter(landmarks);
        return this.createGestureResult(
          "rotate",
          0.85,
          handedness,
          landmarks,
          palmCenter,
          {
            rotationAngle: angleDelta,
            absoluteAngle: currentAngle,
          }
        );
      }
    }

    this.previousHandAngle = currentAngle;
    return null;
  }

  /**
   * NEW: Calculate hand angle/orientation
   */
  private calculateHandAngle(landmarks: HandLandmark[]): number {
    // Use vector from wrist to middle finger MCP
    const wrist = landmarks[0];
    const middleMCP = landmarks[9];

    const dx = middleMCP.x - wrist.x;
    const dy = middleMCP.y - wrist.y;

    // Calculate angle in degrees
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Normalize to 0-360
    if (angle < 0) angle += 360;

    return angle;
  }

  /**
   * 🆕 Get current PINCH threshold value
   */
  getPinchThreshold(): number {
    return this.PINCH_THRESHOLD;
  }

  /**
   * 🆕 Calculate dynamic PINCH threshold based on video resolution
   * Use this to auto-adjust threshold based on camera quality
   *
   * @param videoWidth - Width of video stream in pixels
   * @returns Optimal threshold value (normalized 0-1)
   */
  static calculateDynamicPinchThreshold(videoWidth: number): number {
    // Target: 40-50 pixels (matching Python version)
    const TARGET_PIXELS = 45;
    return TARGET_PIXELS / videoWidth;
  }

  /**
   * 🆕 Get preset thresholds for different sensitivity levels
   */
  static getPinchPresets(): { [key: string]: number } {
    return {
      easy: 0.08, // 8% - Untuk pemula, lebih mudah trigger
      normal: 0.05, // 5% - Default (match Python)
      hard: 0.03, // 3% - Untuk advanced user
      expert: 0.02, // 2% - Butuh presisi tinggi
    };
  }
}
