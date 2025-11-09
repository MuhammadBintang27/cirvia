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

  // NEW: Wire connection state
  private wireStartComponent: string | null = null;
  private isConnecting = false;

  /**
   * Convert gesture to circuit action - ENHANCED with handedness
   */
  gestureToAction(gesture: GestureResult): CircuitAction | null {
    // 🔧 FIXED: Lower confidence threshold for PINCH gesture
    // PINCH is high-priority and 0.95 confidence from detector, so 0.70 is safe
    const MIN_CONFIDENCE = gesture.name === "pinch" ? 0.7 : 0.75;

    // Only process high confidence gestures
    if (gesture.confidence < MIN_CONFIDENCE) {
      if (gesture.name === "pinch") {
        console.log(
          `🤏 PINCH confidence too low: ${gesture.confidence.toFixed(
            2
          )} (need > ${MIN_CONFIDENCE})`
        );
      }
      return null;
    }

    let action: CircuitAction | null = null;

    // 🆕 LEFT HAND ACTIONS (Component Adding)
    if (gesture.handedness === "Left") {
      switch (gesture.name) {
        case "finger_count":
          action = this.handleLeftHandFingerCount(gesture);
          break;
        default:
          return null; // Left hand only for finger count
      }
    }

    // 🆕 RIGHT HAND ACTIONS (Component Manipulation)
    if (gesture.handedness === "Right") {
      switch (gesture.name) {
        case "pinch":
          action = this.handleRightHandPinch(gesture);
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

        case "point":
          action = this.handlePoint(gesture);
          break;

        case "thumbs_up":
          action = this.handleThumbsUp(gesture);
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
      5: "wire",
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
   * 👉 RIGHT HAND: Pinch to select & move
   * IMPROVED: Better select/move logic with timestamp tracking
   */
  private handleRightHandPinch(gesture: GestureResult): CircuitAction {
    // Update last pinch time
    this.lastPinchTime = Date.now();

    // 🔧 FIX: If no component selected, always trigger SELECT first (even if isPinching is true)
    if (!this.isPinching || !this.selectedComponent) {
      // First PINCH detected OR no component selected → SELECT action
      this.isPinching = true;
      console.log("🤏 PINCH → SELECT");
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
   * 👉 RIGHT HAND: Grab (FIST) to start wire connection or delete
   */
  private handleRightHandGrab(gesture: GestureResult): CircuitAction {
    this.isPinching = false;

    if (!this.isConnecting && this.selectedComponent) {
      // Start wire from selected component
      this.wireStartComponent = this.selectedComponent;
      this.isConnecting = true;

      return {
        type: "start_wire",
        componentId: this.selectedComponent,
        position: gesture.position,
        handedness: "Right",
      };
    } else if (this.isConnecting) {
      // Complete wire to target component
      const action: CircuitAction = {
        type: "complete_wire",
        componentId: this.wireStartComponent || undefined,
        targetComponentId: this.selectedComponent || undefined,
        position: gesture.position,
        handedness: "Right",
      };

      // Reset wire state
      this.wireStartComponent = null;
      this.isConnecting = false;

      return action;
    }

    // No connection in progress - DELETE DISABLED to prevent accidental deletion
    console.log("⚠️ RIGHT HAND GRAB (no wire) - DELETE is DISABLED");

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
   * 👉 RIGHT HAND: Open palm to delete (TEMPORARILY DISABLED)
   */
  private handleRightHandOpenPalm(gesture: GestureResult): CircuitAction {
    console.log(
      "⚠️ OPEN PALM gesture detected - DELETE is DISABLED to prevent accidental deletion"
    );

    // Return move action instead to prevent deletion
    return {
      type: "move",
      position: gesture.position,
      componentId: undefined, // No component selected
      handedness: "Right",
    };
  }

  /**
   * Reset wire connection state
   */
  cancelWireConnection() {
    this.wireStartComponent = null;
    this.isConnecting = false;
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
}
