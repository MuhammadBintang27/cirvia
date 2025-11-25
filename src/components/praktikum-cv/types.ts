// Type definitions for Computer Vision Practicum

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type GestureName =
  | "pinch" // Select & Move component
  | "grab" // Delete component
  | "point" // Add wire/connection
  | "open_palm" // Add component
  | "swipe_left" // Previous component type
  | "swipe_right" // Next component type
  | "peace" // Rotate component
  | "thumbs_up" // Toggle switch
  | "finger_count" // NEW: Finger count (1-5) for quick select
  | "rotate" // NEW: Hand rotation for smooth rotation
  | "unknown";

export interface GestureResult {
  name: GestureName;
  confidence: number;
  handedness: "Left" | "Right";
  landmarks: HandLandmark[];
  timestamp: number;
  position?: { x: number; y: number };
  metadata?: {
    fingerCount?: number; // NEW: Number of extended fingers (1-5)
    rotationAngle?: number; // NEW: Delta angle for rotation
    absoluteAngle?: number; // NEW: Absolute hand orientation
    nodeId?: string; // NEW: ID of nearest node
    componentId?: string;
    isAddAction?: boolean; // NEW: True if should ADD component (Left hand)
    holdProgress?: number; // NEW: Progress of 3-second hold (0.0 - 1.0)
  };
}

export type ComponentType = "battery" | "resistor" | "lamp" | "switch" | "wire";

// NEW: Node system for component connections
export interface CircuitNode {
  id: string;
  componentId: string;
  position: { x: number; y: number };
  type: "positive" | "negative" | "terminal";
  isConnected: boolean;
  connectedTo: string[]; // Array of wire IDs
}

// NEW: Wire for connections
export interface Wire {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  points: { x: number; y: number }[];
}

export interface CircuitAction {
  type:
    | "select"
    | "move"
    | "add"
    | "delete"
    | "connect"
    | "rotate"
    | "toggle"
    | "select_component" // NEW: Select component type by finger count
    | "rotate_smooth" // NEW: Smooth rotation
    | "start_connection" // NEW: Start wire connection
    | "update_connection" // NEW: Update wire preview
    | "complete_connection" // NEW: Complete wire connection
    | "highlight_node" // NEW: Highlight node on hover
    | "start_wire" // NEW: Start wire connection (right hand)
    | "update_wire" // NEW: Update wire position
    | "complete_wire" // NEW: Complete wire connection
    | "add_direct" // NEW: Direct add from left hand
    | "wire_dragging" // NEW: Wire following finger
    | "point_hold_progress" // NEW: Hold progress feedback for starting wire (0.0 - 1.0)
    | "wire_target_hold_progress" // NEW: Hold progress on target component (0.0 - 1.0)
    | "open_palm_delete"; // NEW: Delete component with left hand open palm (5 fingers + 3s hold)
  componentType?: ComponentType;
  position?: { x: number; y: number };
  componentId?: string;
  targetComponentId?: string; // NEW: For wire connections
  nodeId?: string; // NEW
  fromNodeId?: string; // NEW
  toNodeId?: string; // NEW
  rotation?: number; // Changed to number for smooth rotation
  absoluteRotation?: number; // NEW
  handedness?: "Left" | "Right"; // NEW: Track which hand
  holdProgress?: number; // NEW: Progress of hold (0.0 - 1.0) for visual feedback
}

export interface CVPracticumState {
  isActive: boolean;
  cameraReady: boolean;
  handDetected: boolean;
  currentGesture: GestureResult | null;
  selectedComponentType: ComponentType;
  error: string | null;
  fps: number;
}

export interface GestureConfig {
  minConfidence: number;
  debounceTime: number;
  smoothingFrames: number;
}
