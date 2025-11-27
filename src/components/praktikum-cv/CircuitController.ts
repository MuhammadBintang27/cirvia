import { GestureResult, CircuitAction, ComponentType } from "./types";

export class CircuitController {
  private selectedComponent: string | null = null;
  private isPinching = false;
  private lastActionTime = 0;
  private readonly actionDebounce = 100; // ms - REDUCED from 300ms for responsive drag
  private componentTypeIndex = 0;
  private readonly componentTypes: ComponentType[] = [
    "battery",
    "resistor",
    "lamp",
    "switch",
    "wire",
  ];

  // 🆕 Gesture reset delay tolerance
  private lastPinchTime = 0;
  private readonly pinchResetDelay = 150; // ms - tolerance before resetting pinch state

  // NEW: Wire connection state with point gesture
  private wireStartComponent: string | null = null;
  private isConnecting = false;
  private pointHoldStartTime = 0; // Track when point gesture started
  private readonly pointHoldDuration = 3000; // 3 seconds hold to start wire
  private lastPointComponent: string | null = null; // Track component under point

  /**
   * Convert gesture to circuit action - ENHANCED with handedness
   */
  gestureToAction(gesture: GestureResult): CircuitAction | null {
    // 🔧 FIXED: Lower confidence threshold for specific gestures
    // PINCH and POINT are high-priority gestures
    const MIN_CONFIDENCE =
      gesture.name === "pinch" || gesture.name === "point" ? 0.7 : 0.75;

    // Only process high confidence gestures
    if (gesture.confidence < MIN_CONFIDENCE) {
      console.log(
        `⚠️ ${gesture.name.toUpperCase()} confidence too low: ${gesture.confidence.toFixed(
          2
        )} (need > ${MIN_CONFIDENCE})`
      );
      return null;
    }

    // Log gesture being processed
    if (gesture.name === "point") {
      console.log(
        `👆 Processing POINT gesture | Confidence: ${gesture.confidence.toFixed(
          2
        )} | Handedness: ${gesture.handedness}`
      );
    }

    // Debug log for open_palm
    if (gesture.name === "open_palm") {
      console.log(
        `🖐️ [CircuitController] Processing OPEN_PALM gesture | Handedness: ${
          gesture.handedness
        } | FingerCount: ${gesture.metadata?.fingerCount || "N/A"}`
      );
    }

    let action: CircuitAction | null = null;

    // 🆕 LEFT HAND ACTIONS (Component Adding & Deleting)
    if (gesture.handedness === "Left") {
      console.log(`👈 [CircuitController] LEFT hand detected: ${gesture.name}`);

      switch (gesture.name) {
        case "finger_count":
          action = this.handleLeftHandFingerCount(gesture);
          break;
        case "open_palm":
          // LEFT hand open_palm is for DELETE with 3-second hold
          console.log(
            `🗑️ [CircuitController] Calling handleLeftHandOpenPalm...`
          );
          action = this.handleLeftHandOpenPalm(gesture);
          console.log(
            `🗑️ [CircuitController] handleLeftHandOpenPalm returned:`,
            action
          );
          break;
        default:
          return null; // Left hand only for finger count and open_palm
      }
    }

    // 🆕 RIGHT HAND ACTIONS (Component Manipulation)
    if (gesture.handedness === "Right") {
      switch (gesture.name) {
        case "pinch":
          action = this.handleRightHandPinch(gesture);
          break;

        case "point":
          // 🆕 POINT gesture now handles wire connection with 3-second hold
          action = this.handleRightHandPoint(gesture);
          break;

        case "grab":
          action = this.handleRightHandGrab(gesture);
          break;

        case "peace":
          action = this.handleRightHandPeace(gesture);
          break;

        case "open_palm":
          action = this.handleRightHandOpenPalm(gesture);
          break;

        case "rotate":
          action = this.handleRotate(gesture);
          break;

        case "thumbs_up":
          // Only allow RIGHT hand for toggle switch
          console.log(`👍 [CONTROLLER DEBUG] THUMBS_UP detected:`, {
            gesture: gesture.name,
            handedness: gesture.handedness,
            position: gesture.position
              ? {
                  x: gesture.position.x.toFixed(3),
                  y: gesture.position.y.toFixed(3),
                }
              : "no position",
            confidence: gesture.confidence,
            willTriggerToggle: gesture.handedness === "Right",
          });

          if (gesture.handedness === "Right") {
            action = this.handleThumbsUp(gesture);
            console.log(
              `✅ [CONTROLLER DEBUG] Toggle action created for RIGHT hand`
            );
          } else {
            console.log(
              `❌ [CONTROLLER DEBUG] THUMBS_UP ignored - not RIGHT hand (handedness: ${gesture.handedness})`
            );
          }
          break;

        default:
          return null;
      }
    }

    // ⚡ Apply debounce ONLY for non-move actions
    if (action && action.type !== "move") {
      const now = Date.now();
      if (now - this.lastActionTime < this.actionDebounce) {
        return null; // Debounce other actions
      }
      this.lastActionTime = now;
    }

    return action;
  }

  /**
   * PINCH - Select and move components
   */
  private handlePinch(gesture: GestureResult): CircuitAction {
    if (!this.isPinching) {
      // Start pinching - SELECT
      this.isPinching = true;
      return {
        type: "select",
        position: gesture.position,
      };
    } else {
      // Continue pinching - MOVE
      return {
        type: "move",
        position: gesture.position,
        componentId: this.selectedComponent || undefined,
      };
    }
  }

  /**
   * GRAB - Delete component (TEMPORARILY DISABLED TO PREVENT ACCIDENTAL DELETION)
   */
  private handleGrab(gesture: GestureResult): CircuitAction {
    // Release pinch state
    this.isPinching = false;

    console.log(
      "⚠️ GRAB gesture detected - DELETE is DISABLED to prevent accidental deletion"
    );

    // Return move action instead to prevent deletion
    return {
      type: "move",
      position: gesture.position,
      componentId: undefined,
    };
  }

  /**
   * POINT - Connect components (add wire)
   */
  private handlePoint(gesture: GestureResult): CircuitAction {
    return {
      type: "connect",
      position: gesture.position,
    };
  }

  /**
   * OPEN PALM - Add component
   */
  private handleOpenPalm(gesture: GestureResult): CircuitAction {
    const currentType = this.componentTypes[this.componentTypeIndex];

    return {
      type: "add",
      componentType: currentType,
      position: gesture.position,
    };
  }

  /**
   * PEACE - Rotate component
   */
  private handlePeace(gesture: GestureResult): CircuitAction {
    return {
      type: "rotate",
      position: gesture.position,
      componentId: this.selectedComponent || undefined,
    };
  }

  /**
   * THUMBS UP - Toggle switch
   */
  private handleThumbsUp(gesture: GestureResult): CircuitAction {
    return {
      type: "toggle",
      position: gesture.position,
      componentId: this.selectedComponent || undefined,
    };
  }

  /**
   * SWIPE - Change component type
   */
  private handleSwipe(gesture: GestureResult): CircuitAction {
    if (gesture.name === "swipe_right") {
      this.componentTypeIndex =
        (this.componentTypeIndex + 1) % this.componentTypes.length;
    } else {
      this.componentTypeIndex =
        (this.componentTypeIndex - 1 + this.componentTypes.length) %
        this.componentTypes.length;
    }

    // Return select action to show new component type
    return {
      type: "select",
      componentType: this.componentTypes[this.componentTypeIndex],
      position: gesture.position,
    };
  }

  /**
   * Get current selected component type
   */
  getCurrentComponentType(): ComponentType {
    return this.componentTypes[this.componentTypeIndex];
  }

  /**
   * Set selected component
   */
  setSelectedComponent(id: string | null) {
    this.selectedComponent = id;
  }

  /**
   * Reset pinch state (call when hand lost or gesture changed)
   * IMPROVED: Check delay tolerance before resetting
   */
  resetPinchState() {
    const timeSinceLastPinch = Date.now() - this.lastPinchTime;

    // Only reset if enough time has passed (tolerance delay)
    if (timeSinceLastPinch > this.pinchResetDelay) {
      if (this.isPinching) {
        console.log("🔄 RESET");
      }
      this.isPinching = false;
      // 🔧 FIX: Also clear selected component when resetting pinch
      this.selectedComponent = null;
    }
  }

  /**
   * Force reset pinch state (no delay tolerance)
   */
  forceResetPinchState() {
    this.isPinching = false;
    this.selectedComponent = null;
    console.log("🔄 FORCE RESET");
  }

  /**
   * Reset all state
   */
  reset() {
    this.selectedComponent = null;
    this.isPinching = false;
    this.lastActionTime = 0;
    this.componentTypeIndex = 0;
    this.wireStartComponent = null;
    this.isConnecting = false;
    this.pointHoldStartTime = 0;
    this.lastPointComponent = null;
  }

  /**
   * NEW: Handle finger count gesture - Quick select component by finger count
   */
  private handleFingerCount(gesture: GestureResult): CircuitAction | null {
    const fingerCount = gesture.metadata?.fingerCount || 0;

    // Mapping: 1 finger = Battery, 2 = Lamp, 3 = Resistor, 4 = Switch, 5 = Wire
    const componentMap: { [key: number]: ComponentType } = {
      1: "battery",
      2: "lamp",
      3: "resistor",
      4: "switch",
      5: "wire",
    };

    const componentType = componentMap[fingerCount];

    if (componentType) {
      // Update internal index to match selected component
      this.componentTypeIndex = this.componentTypes.indexOf(componentType);

      this.lastActionTime = Date.now();

      return {
        type: "select_component",
        componentType,
        position: gesture.position,
      };
    }

    return null;
  }

  /**
   * NEW: Handle rotation gesture - Smooth rotation
   */
  private handleRotate(gesture: GestureResult): CircuitAction | null {
    if (!gesture.metadata?.rotationAngle) return null;

    this.lastActionTime = Date.now();

    return {
      type: "rotate_smooth",
      componentId: this.selectedComponent || undefined,
      rotation: gesture.metadata.rotationAngle,
      absoluteRotation: gesture.metadata.absoluteAngle,
      position: gesture.position,
    };
  }

  /**
   * 👈 LEFT HAND: Finger count to ADD component directly (after 3-second hold)
   */
  private handleLeftHandFingerCount(
    gesture: GestureResult
  ): CircuitAction | null {
    const fingerCount = gesture.metadata?.fingerCount || 0;
    const isAddAction = gesture.metadata?.isAddAction || false;

    // 🔒 ONLY trigger action after 3-second hold is complete
    if (!isAddAction) {
      return null; // Don't trigger action until hold is complete
    }

    const componentMap: { [key: number]: ComponentType } = {
      1: "battery",
      2: "lamp",
      3: "resistor",
      4: "switch",
    };

    const componentType = componentMap[fingerCount];

    if (componentType) {
      return {
        type: "add_direct", // NEW: Direct add action
        componentType,
        position: gesture.position,
        handedness: "Left",
      };
    }

    return null;
  }

  /**
   * 👈 LEFT HAND: Open palm (5 fingers) to DELETE component (with 3-second hold)
   */
  private handleLeftHandOpenPalm(gesture: GestureResult): CircuitAction | null {
    const fingerCount = gesture.metadata?.fingerCount || 0;

    console.log(
      `🗑️ [LEFT HAND] OPEN PALM detected with ${fingerCount} fingers - triggering delete action`
    );

    // Only trigger delete if it's truly 5 fingers (open palm)
    if (fingerCount === 5) {
      return {
        type: "open_palm_delete",
        position: gesture.position,
        handedness: "Left",
      };
    }

    return null; // Not 5 fingers, ignore
  }

  /**
   * 👉 RIGHT HAND: Pinch to select & move
   * IMPROVED: Better select/move logic with timestamp tracking
   */
  private handleRightHandPinch(gesture: GestureResult): CircuitAction {
    // Update last pinch time
    this.lastPinchTime = Date.now();

    // 🔧 FIX: Always trigger SELECT when starting a new PINCH
    // Even if isPinching is true, if no component is selected yet, we need to SELECT first
    if (!this.selectedComponent) {
      // No component selected yet → SELECT action (start new grab)
      this.isPinching = true;
      console.log("🤏 PINCH → SELECT (new grab)");
      return {
        type: "select",
        position: gesture.position,
        handedness: "Right",
      };
    } else if (!this.isPinching) {
      // Component was selected but pinch was released → Start new SELECT
      this.isPinching = true;
      console.log("🤏 PINCH → SELECT (after release)");
      return {
        type: "select",
        position: gesture.position,
        handedness: "Right",
      };
    } else {
      // Continue PINCH with selected component → MOVE action (drag)
      return {
        type: "move",
        position: gesture.position,
        componentId: this.selectedComponent,
        handedness: "Right",
      };
    }
  }

  /**
   * 👉 RIGHT HAND: Point (1 finger) - Wire connection with 3-second hold
   * NEW: Simplified wire connection using point gesture
   * - Hold point on component A for 3 seconds → Start wire
   * - Move finger → Wire follows
   * - Point at component B → Auto-connect wire
   */
  private handleRightHandPoint(gesture: GestureResult): CircuitAction {
    this.isPinching = false;

    const now = Date.now();
    const holdProgress = gesture.metadata?.holdProgress || 0;
    const componentAtPosition = gesture.metadata?.componentId || null;

    console.log(
      `👆 handleRightHandPoint called | Component: ${
        componentAtPosition || "none"
      } | Connecting: ${this.isConnecting}`
    );

    // 🔌 CASE 1: Wire is already connecting (dragging wire)
    if (this.isConnecting) {
      // Check if pointing at a valid component (not the start component)
      if (
        componentAtPosition &&
        componentAtPosition !== this.wireStartComponent
      ) {
        // � TARGET COMPONENT HOLD: Must hold 3 seconds to complete connection

        // Check if this is the same target component being held
        if (this.lastPointComponent !== componentAtPosition) {
          // New target component - reset hold timer
          this.pointHoldStartTime = now;
          this.lastPointComponent = componentAtPosition;
          console.log(
            `👆 POINT → Hold started on TARGET component: ${componentAtPosition}`
          );
        }

        const holdDuration = now - this.pointHoldStartTime;
        const currentProgress = Math.min(
          holdDuration / this.pointHoldDuration,
          1.0
        );

        console.log(
          `🕐 TARGET Hold: ${holdDuration}ms / ${this.pointHoldDuration}ms (${(
            currentProgress * 100
          ).toFixed(0)}%)`
        );

        // Check if 3-second hold on target is complete
        if (holdDuration >= this.pointHoldDuration || currentProgress >= 1.0) {
          // ✅ COMPLETE WIRE after 3-second hold on target
          console.log(
            `✅ POINT → COMPLETE WIRE: ${this.wireStartComponent} → ${componentAtPosition} (held for ${holdDuration}ms)`
          );

          const action: CircuitAction = {
            type: "complete_wire",
            componentId: this.wireStartComponent || undefined,
            targetComponentId: componentAtPosition,
            position: gesture.position,
            handedness: "Right",
          };

          // Reset wire state
          this.wireStartComponent = null;
          this.isConnecting = false;
          this.pointHoldStartTime = 0;
          this.lastPointComponent = null;

          return action;
        }

        // 🕐 Still holding on target - return hold progress for visual feedback
        console.log(
          `   📊 TARGET hold progress: ${(currentProgress * 100).toFixed(0)}%`
        );

        return {
          type: "wire_target_hold_progress",
          componentId: this.wireStartComponent || undefined,
          targetComponentId: componentAtPosition,
          position: gesture.position,
          holdProgress: currentProgress,
          handedness: "Right",
        };
      } else {
        // Reset hold timer when not pointing at any valid component
        if (this.pointHoldStartTime > 0) {
          console.log(
            "👆 POINT → Target hold cancelled (moved away from target component)"
          );
          this.pointHoldStartTime = 0;
          this.lastPointComponent = null;
        }
      }

      // 📍 Wire is connecting but no valid target component - show wire following finger
      return {
        type: "wire_dragging",
        componentId: this.wireStartComponent || undefined,
        position: gesture.position,
        handedness: "Right",
      };
    }

    // 🔌 CASE 2: Starting new wire connection (3-second hold on component)
    if (componentAtPosition) {
      // Check if this is the same component being held
      if (this.lastPointComponent !== componentAtPosition) {
        // New component - reset hold timer
        this.pointHoldStartTime = now;
        this.lastPointComponent = componentAtPosition;
        console.log(
          `👆 POINT → Hold started on component: ${componentAtPosition}`
        );
      }

      const holdDuration = now - this.pointHoldStartTime;
      const currentProgress = Math.min(
        holdDuration / this.pointHoldDuration,
        1.0
      );

      console.log(
        `🕐 Hold duration: ${holdDuration}ms / ${this.pointHoldDuration}ms (${(
          currentProgress * 100
        ).toFixed(0)}%)`
      );

      // Check if 3-second hold is complete
      if (holdDuration >= this.pointHoldDuration || holdProgress >= 1.0) {
        // ✅ START WIRE after 3-second hold
        this.wireStartComponent = componentAtPosition;
        this.isConnecting = true;
        this.pointHoldStartTime = 0; // Reset hold timer

        console.log(
          `✅ POINT → START WIRE from component: ${componentAtPosition} (held for ${holdDuration}ms)`
        );

        return {
          type: "start_wire",
          componentId: componentAtPosition,
          position: gesture.position,
          handedness: "Right",
        };
      }

      // 🕐 Still holding - return hold progress for visual feedback
      console.log(
        `   📊 Returning hold progress: ${(currentProgress * 100).toFixed(0)}%`
      );

      return {
        type: "point_hold_progress",
        componentId: componentAtPosition,
        position: gesture.position,
        holdProgress: currentProgress,
        handedness: "Right",
      };
    }

    // 🔌 CASE 3: Pointing at empty space (no component) - reset hold timer
    if (this.pointHoldStartTime > 0) {
      console.log("👆 POINT → Hold cancelled (moved away from component)");
      this.pointHoldStartTime = 0;
      this.lastPointComponent = null;
    }

    // Neutral action - just tracking finger position
    return {
      type: "move",
      position: gesture.position,
      componentId: undefined,
      handedness: "Right",
    };
  }

  /**
   * 👉 RIGHT HAND: Grab (FIST) - DEPRECATED for wire connection
   * Now only used for potential future features
   */
  private handleRightHandGrab(gesture: GestureResult): CircuitAction {
    this.isPinching = false;

    console.log(
      "⚠️ GRAB (FIST) gesture detected - Wire connection now uses POINT gesture (1 finger)"
    );

    return {
      type: "move",
      componentId: undefined,
      position: gesture.position,
      handedness: "Right",
    };
  }

  /**
   * 👉 RIGHT HAND: Peace to rotate
   */
  private handleRightHandPeace(gesture: GestureResult): CircuitAction {
    return {
      type: "rotate",
      position: gesture.position,
      componentId: this.selectedComponent || undefined,
      handedness: "Right",
    };
  }

  /**
   * 👉 RIGHT HAND: Open palm - AUTO-GRAB component (not delete)
   * Note: DELETE is only for LEFT hand open palm (handled in WebCVPracticum directly)
   */
  private handleRightHandOpenPalm(gesture: GestureResult): CircuitAction {
    console.log("✋ RIGHT HAND OPEN PALM - AUTO-GRAB mode (not delete)");

    // Return move action for auto-grab behavior
    return {
      type: "move",
      position: gesture.position,
      componentId: undefined, // No component selected yet - will auto-grab
      handedness: "Right",
    };
  }

  /**
   * Reset wire connection state
   */
  cancelWireConnection() {
    this.wireStartComponent = null;
    this.isConnecting = false;
    this.pointHoldStartTime = 0;
    this.lastPointComponent = null;
    console.log("🔄 Wire connection cancelled");
  }

  /**
   * Check if currently connecting wire
   */
  isWireConnecting(): boolean {
    return this.isConnecting;
  }

  /**
   * Get wire start component
   */
  getWireStartComponent(): string | null {
    return this.wireStartComponent;
  }

  /**
   * Get point hold progress (0.0 to 1.0)
   */
  getPointHoldProgress(): number {
    if (this.pointHoldStartTime === 0) return 0;
    const elapsed = Date.now() - this.pointHoldStartTime;
    return Math.min(elapsed / this.pointHoldDuration, 1.0);
  }

  /**
   * Reset point hold timer when gesture changes
   */
  resetPointHold() {
    this.pointHoldStartTime = 0;
    this.lastPointComponent = null;
  }
}
