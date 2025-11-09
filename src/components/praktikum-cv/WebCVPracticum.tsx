"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Hands, Results, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { GestureDetector } from "./GestureDetector";
import { CircuitController } from "./CircuitController";
import {
  CVPracticumState,
  GestureResult,
  CircuitAction,
  HandLandmark,
  ComponentType,
} from "./types";
import {
  Camera as CameraIcon,
  XCircle,
  Activity,
  Hand,
  Zap,
  Battery,
  Lightbulb,
  ToggleLeft,
  Cable,
  RotateCw,
  ThumbsUp,
  Info,
  Download,
  Copy,
  Trash2,
} from "lucide-react";
import { debugLogger } from "@/lib/debug-logger";

interface WebCVPracticumProps {
  onCircuitAction?: (action: CircuitAction) => void;
  onGestureDetected?: (gesture: GestureResult) => void;
  className?: string;
}

const WebCVPracticum: React.FC<WebCVPracticumProps> = ({
  onCircuitAction,
  onGestureDetected,
  className = "",
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const gestureDetectorRef = useRef<GestureDetector>(new GestureDetector());
  const circuitControllerRef = useRef<CircuitController>(
    new CircuitController()
  );
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [state, setState] = useState<CVPracticumState>({
    isActive: false,
    cameraReady: false,
    handDetected: false,
    currentGesture: null,
    selectedComponentType: "battery",
    error: null,
    fps: 0,
  });

  // Circuit components state
  interface CircuitComponent {
    id: string;
    type: ComponentType;
    position: { x: number; y: number };
    rotation: number;
  }

  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const componentsRef = useRef<CircuitComponent[]>([]); // 🔧 FIX: Always get latest components

  // Sync components state to ref
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  // NEW: Finger count selection state
  const [fingerCountSelection, setFingerCountSelection] = useState<{
    active: boolean;
    fingerCount: number;
    timestamp: number;
  } | null>(null);

  // NEW: Wire connection state
  const [wireConnection, setWireConnection] = useState<{
    isActive: boolean;
    startComponentId: string | null;
    endPosition: { x: number; y: number } | null;
  }>({
    isActive: false,
    startComponentId: null,
    endPosition: null,
  });

  // Hand position state for circuit canvas
  const [handPosition, setHandPosition] = useState<{
    x: number;
    y: number;
    landmarks: HandLandmark[];
  } | null>(null);

  // 🆕 Selected component ID for move action
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );

  // 🆕 Gesture reset delay ref
  const gestureResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // FPS counter
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  /**
   * Update FPS counter
   */
  const updateFPS = () => {
    fpsCounterRef.current.frames++;
    const now = Date.now();
    const elapsed = now - fpsCounterRef.current.lastTime;

    if (elapsed >= 1000) {
      const fps = Math.round((fpsCounterRef.current.frames * 1000) / elapsed);
      setState((prev) => ({ ...prev, fps }));
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }
  };

  /**
   * Draw gesture label on canvas
   */
  const drawGestureLabel = (
    ctx: CanvasRenderingContext2D,
    gesture: GestureResult,
    landmarks: HandLandmark[]
  ) => {
    const wrist = landmarks[0];
    const x = wrist.x * ctx.canvas.width;
    const y = wrist.y * ctx.canvas.height - 40;

    // Background with gradient
    const gradient = ctx.createLinearGradient(x - 80, y - 30, x + 80, y + 10);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.95)");
    gradient.addColorStop(1, "rgba(147, 51, 234, 0.95)");

    ctx.fillStyle = gradient;
    ctx.roundRect(x - 80, y - 30, 160, 45, 10);
    ctx.fill();

    // Border glow
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 10;
    ctx.roundRect(x - 80, y - 30, 160, 45, 10);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gesture name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(gesture.name.replace("_", " ").toUpperCase(), x, y - 5);

    // Confidence bar
    const confidence = gesture.confidence * 100;
    const barWidth = 140;
    const barX = x - 70;
    const barY = y + 5;

    // Bar background
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(barX, barY, barWidth, 6);

    // Bar fill
    const barGradient = ctx.createLinearGradient(
      barX,
      barY,
      barX + barWidth,
      barY
    );
    barGradient.addColorStop(0, "#10B981");
    barGradient.addColorStop(1, "#3B82F6");
    ctx.fillStyle = barGradient;
    ctx.fillRect(barX, barY, (confidence / 100) * barWidth, 6);
  };

  /**
   * Handle circuit actions from gestures
   */
  const handleCircuitAction = useCallback(
    (action: CircuitAction) => {
      console.log("🎮 Circuit Action:", action.type, action.handedness);

      // 🔄 HELPER: Mirror X coordinate untuk front camera
      const mirrorX = (x: number) => 1 - x;

      // 🆕 LEFT HAND: Direct add component
      if (
        action.type === "add_direct" &&
        action.componentType &&
        action.position
      ) {
        const newComponent: CircuitComponent = {
          id: `${action.componentType}_${Date.now()}`,
          type: action.componentType,
          position: {
            x: mirrorX(action.position.x) * 1200, // 🔄 Mirror X
            y: action.position.y * 700,
          },
          rotation: 0,
        };
        setComponents((prev) => {
          const updated = [...prev, newComponent];
          console.log(
            `➕ ADD: ${action.componentType} | Total components: ${updated.length}`
          );
          debugLogger.log("action", `ADD: ${action.componentType}`, {
            id: newComponent.id,
            position: newComponent.position,
            totalComponents: updated.length,
          });
          return updated;
        });

        // Show notification
        setFingerCountSelection({
          active: true,
          fingerCount:
            action.componentType === "battery"
              ? 1
              : action.componentType === "lamp"
              ? 2
              : action.componentType === "resistor"
              ? 3
              : action.componentType === "switch"
              ? 4
              : 5,
          timestamp: Date.now(),
        });

        setTimeout(() => setFingerCountSelection(null), 2000);
        return;
      }

      // 🆕 RIGHT HAND: Start wire connection
      if (action.type === "start_wire" && action.componentId) {
        setWireConnection({
          isActive: true,
          startComponentId: action.componentId,
          endPosition: action.position
            ? {
                x: mirrorX(action.position.x) * 1200,
                y: action.position.y * 700,
              }
            : null,
        });
        console.log("🔌 WIRE START");
        return;
      }

      // 🆕 RIGHT HAND: Complete wire connection
      if (
        action.type === "complete_wire" &&
        action.componentId &&
        action.targetComponentId
      ) {
        console.log("🔌 WIRE COMPLETE");

        // Reset wire state
        setWireConnection({
          isActive: false,
          startComponentId: null,
          endPosition: null,
        });
        return;
      }

      // 👉 RIGHT HAND: Select component (PINCH START)
      if (action.type === "select" && action.position) {
        const cursorX = mirrorX(action.position.x) * 1200; // 🔄 Mirror X
        const cursorY = action.position.y * 700;

        // 🔧 FIX: Use componentsRef.current to get latest state
        const currentComponents = componentsRef.current;

        console.log(
          `🔍 SELECT at (${cursorX.toFixed(0)}, ${cursorY.toFixed(
            0
          )}) | Components: ${currentComponents.length}`
        );
        debugLogger.log(
          "info",
          `SELECT at cursor (${cursorX.toFixed(0)}, ${cursorY.toFixed(0)})`,
          {
            totalComponents: currentComponents.length,
            components: currentComponents.map((c) => ({
              id: c.id,
              type: c.type,
              pos: c.position,
            })),
          }
        );

        // Find component under cursor (80px radius)
        const SELECTION_RADIUS = 80;
        const clickedComponent = currentComponents.find((c) => {
          const dx = c.position.x - cursorX;
          const dy = c.position.y - cursorY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          console.log(
            `   📦 ${c.type} at (${c.position.x.toFixed(
              0
            )}, ${c.position.y.toFixed(0)}) → distance: ${distance.toFixed(
              1
            )}px`
          );
          return distance < SELECTION_RADIUS;
        });

        if (clickedComponent) {
          circuitControllerRef.current.setSelectedComponent(
            clickedComponent.id
          );
          setSelectedComponentId(clickedComponent.id);
          debugLogger.log("action", `SELECTED: ${clickedComponent.type}`, {
            id: clickedComponent.id,
          });
        } else {
          circuitControllerRef.current.setSelectedComponent(null);
          setSelectedComponentId(null);
          debugLogger.log(
            "error",
            `NO COMPONENT (${currentComponents.length} total)`
          );
        }
        return;
      }

      // 👉 RIGHT HAND: Move component (PINCH HOLD - DRAG)
      if (action.type === "move" && action.position) {
        const cursorX = mirrorX(action.position.x) * 1200; // 🔄 Mirror X
        const cursorY = action.position.y * 700;

        // 🔧 FIX: Use componentsRef.current to get latest state
        const currentComponents = componentsRef.current;

        // Use selectedComponentId from state
        const targetId = selectedComponentId || action.componentId;

        if (!targetId) {
          // If no component selected but PINCH is held, try to grab component under cursor
          const SELECTION_RADIUS = 80;
          const componentUnderCursor = currentComponents.find((c) => {
            const dx = c.position.x - cursorX;
            const dy = c.position.y - cursorY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < SELECTION_RADIUS;
          });

          if (componentUnderCursor) {
            // Auto-grab component under cursor
            circuitControllerRef.current.setSelectedComponent(
              componentUnderCursor.id
            );
            setSelectedComponentId(componentUnderCursor.id);
            debugLogger.log(
              "action",
              `AUTO-GRAB: ${componentUnderCursor.type}`,
              { id: componentUnderCursor.id }
            );
          }
          return;
        }

        // Update component position to follow cursor (DRAG)
        setComponents((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  position: {
                    x: cursorX,
                    y: cursorY,
                  },
                }
              : c
          )
        );
        return;
      }

      // 👉 RIGHT HAND: Delete component
      if (action.type === "delete" && action.componentId) {
        setComponents((prev) =>
          prev.filter((c) => c.id !== action.componentId)
        );
        console.log("�️ DELETE");
        return;
      }

      // 👉 RIGHT HAND: Rotate component
      if (action.type === "rotate" && action.componentId) {
        setComponents((prev) =>
          prev.map((c) =>
            c.id === action.componentId
              ? { ...c, rotation: (c.rotation + 90) % 360 }
              : c
          )
        );
        console.log("� ROTATE 90°");
        return;
      }

      // NEW: Handle smooth rotation
      if (action.type === "rotate_smooth" && action.position) {
        // Find component near cursor
        const targetComponent = components.find((c) => {
          const dx = c.position.x - mirrorX(action.position!.x) * 1200;
          const dy = c.position.y - action.position!.y * 700;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 80;
        });

        if (targetComponent && action.absoluteRotation !== undefined) {
          setComponents((prev) =>
            prev.map((c) => {
              if (c.id === targetComponent.id) {
                return {
                  ...c,
                  rotation: Math.round(action.absoluteRotation! / 15) * 15,
                };
              }
              return c;
            })
          );
        }
        return;
      }

      if (action.type === "toggle" && action.componentId) {
        console.log("⚡ TOGGLE");
      }
    },
    [components, selectedComponentId]
  );

  /**
   * Process hand detection results
   */
  const onResults = useCallback(
    (results: Results) => {
      if (!canvasRef.current) return;

      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;

      // Update FPS
      updateFPS();

      // Clear canvas
      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // Draw video frame (mirrored)
      canvasCtx.translate(canvasRef.current.width, 0);
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasCtx.setTransform(1, 0, 0, 1, 0, 0);

      // Process hands
      let detectedGesture: GestureResult | null = null;

      if (results.multiHandLandmarks && results.multiHandedness) {
        setState((prev) => ({ ...prev, handDetected: true }));

        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i];
          const handedness = results.multiHandedness[i].label as
            | "Left"
            | "Right";

          // Draw hand connections
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 3,
          });

          // Draw landmarks
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 1,
            radius: 4,
            fillColor: "#FF0000",
          });

          // Convert landmarks to our format
          const formattedLandmarks: HandLandmark[] = landmarks.map(
            (lm: any) => ({
              x: lm.x,
              y: lm.y,
              z: lm.z,
              visibility: lm.visibility,
            })
          );

          // Detect gesture - CORRECTED: Pass isFrontCamera flag
          const gesture = gestureDetectorRef.current.detectGesture(
            formattedLandmarks,
            handedness,
            true // 🔄 isFrontCamera = true (laptop camera = mirror)
          );

          // Smooth gesture
          const smoothGesture =
            gestureDetectorRef.current.getSmoothGesture(gesture);

          detectedGesture = smoothGesture;

          // Update hand position for circuit canvas (use wrist position as center)
          const wrist = formattedLandmarks[0];
          setHandPosition({
            x: wrist.x,
            y: wrist.y,
            landmarks: formattedLandmarks,
          });

          // Draw gesture label
          if (smoothGesture.name !== "unknown") {
            drawGestureLabel(canvasCtx, smoothGesture, formattedLandmarks);
          }

          // Convert gesture to circuit action
          if (
            smoothGesture.confidence > 0.75 &&
            smoothGesture.name !== "unknown"
          ) {
            const action =
              circuitControllerRef.current.gestureToAction(smoothGesture);
            if (action) {
              // Handle action locally
              handleCircuitAction(action);

              // Also callback to parent
              if (onCircuitAction) {
                onCircuitAction(action);
              }
            }
          }

          // 🔄 Reset PINCH state if RIGHT hand but NOT pinching
          // IMPROVED: Add delay tolerance to prevent premature reset
          if (
            smoothGesture.handedness === "Right" &&
            smoothGesture.name !== "pinch"
          ) {
            // Clear any pending reset timeout
            if (gestureResetTimeoutRef.current) {
              clearTimeout(gestureResetTimeoutRef.current);
            }

            // Set timeout with 150ms delay tolerance
            gestureResetTimeoutRef.current = setTimeout(() => {
              // Double-check gesture is still not PINCH after delay
              if (
                state.currentGesture?.handedness === "Right" &&
                state.currentGesture?.name !== "pinch"
              ) {
                // Log DROP action if component was selected
                if (selectedComponentId) {
                  console.log("📍 DROP");
                }

                circuitControllerRef.current.resetPinchState();
                setSelectedComponentId(null);
              }
            }, 150); // 150ms delay tolerance
          } else if (
            smoothGesture.handedness === "Right" &&
            smoothGesture.name === "pinch"
          ) {
            // Cancel reset if PINCH is detected again
            if (gestureResetTimeoutRef.current) {
              clearTimeout(gestureResetTimeoutRef.current);
              gestureResetTimeoutRef.current = null;
            }
          }
        }
      } else {
        setState((prev) => ({ ...prev, handDetected: false }));
        setHandPosition(null);
        setSelectedComponentId(null); // 🆕 Clear when hand not detected
        circuitControllerRef.current.resetPinchState();
      }

      // Update state with current gesture and component type
      setState((prev) => ({
        ...prev,
        currentGesture: detectedGesture,
        selectedComponentType:
          circuitControllerRef.current.getCurrentComponentType(),
      }));

      // Callback for gesture detection
      if (
        detectedGesture &&
        detectedGesture.name !== "unknown" &&
        onGestureDetected
      ) {
        onGestureDetected(detectedGesture);
      }

      canvasCtx.restore();
    },
    [
      onCircuitAction,
      onGestureDetected,
      handleCircuitAction,
      selectedComponentId,
      // Removed 'components' - now using componentsRef.current
      state.currentGesture?.handedness,
      state.currentGesture?.name,
    ]
  );

  /**
   * Initialize MediaPipe Hands
   */
  const initializeHands = useCallback(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);
    handsRef.current = hands;

    console.log("✅ MediaPipe Hands initialized");
  }, [onResults]);

  /**
   * Start camera and hand tracking
   */
  const startTracking = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      if (!handsRef.current) {
        initializeHands();
      }

      if (!videoRef.current || !handsRef.current) {
        throw new Error("Video element or Hands not initialized");
      }

      // Start camera
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720,
      });

      await camera.start();
      cameraRef.current = camera;

      setState((prev) => ({
        ...prev,
        isActive: true,
        cameraReady: true,
      }));

      console.log("✅ Camera started successfully");
    } catch (error) {
      console.error("❌ Error starting camera:", error);
      setState((prev) => ({
        ...prev,
        error:
          "Failed to access camera. Please check permissions and try again.",
        isActive: false,
      }));
    }
  }, [initializeHands]);

  /**
   * Render circuit components on separate canvas
   */
  useEffect(() => {
    if (!circuitCanvasRef.current) return;

    const canvas = circuitCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw components
    components.forEach((component) => {
      ctx.save();
      ctx.translate(component.position.x, component.position.y);
      ctx.rotate((component.rotation * Math.PI) / 180);

      // Draw based on type
      switch (component.type) {
        case "battery":
          // Battery symbol with + and - terminals
          // Main body
          ctx.fillStyle = "#1E40AF";
          ctx.fillRect(-35, -20, 70, 40);
          ctx.strokeStyle = "#3B82F6";
          ctx.lineWidth = 3;
          ctx.strokeRect(-35, -20, 70, 40);

          // Positive terminal
          ctx.fillStyle = "#FCD34D";
          ctx.fillRect(-15, -25, 10, 10);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("+", -10, -20);

          // Negative terminal
          ctx.fillStyle = "#94A3B8";
          ctx.fillRect(5, -25, 10, 10);
          ctx.fillStyle = "#000000";
          ctx.fillText("-", 10, -20);

          // Label
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 12px Arial";
          ctx.fillText("🔋", 0, 0);
          break;

        case "resistor":
          // Resistor box with zigzag pattern
          ctx.fillStyle = "#7C2D12";
          ctx.fillRect(-40, -15, 80, 30);

          // Color bands (Red, Yellow, Orange)
          ctx.fillStyle = "#EF4444";
          ctx.fillRect(-30, -15, 8, 30);
          ctx.fillStyle = "#EAB308";
          ctx.fillRect(-10, -15, 8, 30);
          ctx.fillStyle = "#F97316";
          ctx.fillRect(10, -15, 8, 30);

          // Border
          ctx.strokeStyle = "#92400E";
          ctx.lineWidth = 2;
          ctx.strokeRect(-40, -15, 80, 30);

          // Terminals
          ctx.strokeStyle = "#94A3B8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-60, 0);
          ctx.lineTo(-40, 0);
          ctx.moveTo(40, 0);
          ctx.lineTo(60, 0);
          ctx.stroke();

          // Label
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("RESISTOR", 0, 0);
          break;

        case "lamp":
          // Lamp/bulb with glow effect
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fillStyle = "#FCD34D";
          ctx.fill();
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner glow
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fillStyle = "#FEF3C7";
          ctx.fill();

          // Filament
          ctx.strokeStyle = "#92400E";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-10, -10);
          ctx.lineTo(10, 10);
          ctx.moveTo(10, -10);
          ctx.lineTo(-10, 10);
          ctx.stroke();

          // Label
          ctx.fillStyle = "#000000";
          ctx.font = "25px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💡", 0, 0);
          break;

        case "switch":
          // Switch box
          ctx.fillStyle = "#1E3A8A";
          ctx.fillRect(-40, -20, 80, 40);
          ctx.strokeStyle = "#3B82F6";
          ctx.lineWidth = 3;
          ctx.strokeRect(-40, -20, 80, 40);

          // Switch lever (OFF position - angled)
          ctx.strokeStyle = "#94A3B8";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-30, 0);
          ctx.lineTo(-10, 0);
          ctx.lineTo(20, -12);
          ctx.stroke();

          // Terminals
          ctx.fillStyle = "#94A3B8";
          ctx.beginPath();
          ctx.arc(-30, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(30, 0, 5, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.fillStyle = "#EF4444";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("OFF", 0, 0);
          break;

        case "wire":
          // Wire/cable
          ctx.strokeStyle = "#F97316";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-60, 0);
          ctx.lineTo(60, 0);
          ctx.stroke();

          // Connectors
          ctx.fillStyle = "#94A3B8";
          ctx.beginPath();
          ctx.arc(-60, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(60, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      // Component label background
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(-45, -50, 90, 20);
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 1;
      ctx.strokeRect(-45, -50, 90, 20);

      // Component label text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(component.type.toUpperCase(), 0, -40);

      ctx.restore();
    });

    // 🆕 Draw wire connection preview
    if (
      wireConnection.isActive &&
      wireConnection.startComponentId &&
      handPosition
    ) {
      const startComponent = components.find(
        (c) => c.id === wireConnection.startComponentId
      );

      if (startComponent) {
        // 🔄 MIRROR CORRECTION: Flip X coordinate untuk cursor
        const cursorX = (1 - handPosition.landmarks[8].x) * canvas.width;
        const cursorY = handPosition.landmarks[8].y * canvas.height;

        // Draw dashed line from component to cursor
        ctx.beginPath();
        ctx.setLineDash([10, 5]);
        ctx.strokeStyle = "#FCD34D";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#FCD34D";
        ctx.shadowBlur = 10;
        ctx.moveTo(startComponent.position.x, startComponent.position.y);
        ctx.lineTo(cursorX, cursorY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;

        // Draw connection indicator at start
        ctx.fillStyle = "#10B981";
        ctx.shadowColor = "#10B981";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
          startComponent.position.x,
          startComponent.position.y,
          12,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connection indicator at cursor
        ctx.fillStyle = "#F59E0B";
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw instruction text
        ctx.fillStyle = "rgba(252, 211, 77, 0.9)";
        ctx.fillRect(cursorX + 20, cursorY - 20, 180, 30);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("FIST lagi untuk connect", cursorX + 25, cursorY - 5);
      }
    }

    // Draw hand landmarks on circuit canvas
    if (handPosition && handPosition.landmarks.length > 0) {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // 🔄 MIRROR CORRECTION: Flip X coordinates untuk match camera mirror
      const mirrorLandmarks = handPosition.landmarks.map((lm) => ({
        ...lm,
        x: 1 - lm.x, // Flip horizontal: 0.2 becomes 0.8, etc.
      }));

      // Define finger connections (same as MediaPipe HAND_CONNECTIONS)
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4], // Thumb
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8], // Index
        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12], // Middle
        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16], // Ring
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20], // Pinky
        [5, 9],
        [9, 13],
        [13, 17], // Palm
      ];

      // Draw connections
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00FF00";
      ctx.shadowBlur = 10;

      connections.forEach(([start, end]) => {
        const startPoint = mirrorLandmarks[start];
        const endPoint = mirrorLandmarks[end];

        ctx.beginPath();
        ctx.moveTo(startPoint.x * canvasWidth, startPoint.y * canvasHeight);
        ctx.lineTo(endPoint.x * canvasWidth, endPoint.y * canvasHeight);
        ctx.stroke();
      });

      ctx.shadowBlur = 0;

      // Draw landmarks (finger joints)
      mirrorLandmarks.forEach((landmark, index) => {
        const x = landmark.x * canvasWidth;
        const y = landmark.y * canvasHeight;

        // Fingertips are larger
        const radius = [4, 8, 12, 16, 20].includes(index) ? 8 : 5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 🆕 ONLY DRAW CURSOR WHEN PINCH IS DETECTED
      const isPinchActive =
        state.currentGesture?.name === "pinch" &&
        state.currentGesture?.handedness === "Right";

      if (isPinchActive) {
        // Draw cursor crosshair at index fingertip (landmark 8)
        const indexTip = mirrorLandmarks[8];
        const thumbTip = mirrorLandmarks[4];

        // Use PINCH center (between thumb and index) as cursor position
        const cursorX = ((indexTip.x + thumbTip.x) / 2) * canvasWidth;
        const cursorY = ((indexTip.y + thumbTip.y) / 2) * canvasHeight;

        // Crosshair
        ctx.strokeStyle = "#22D3EE"; // Cyan
        ctx.lineWidth = 3;
        ctx.shadowColor = "#22D3EE";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(cursorX - 25, cursorY);
        ctx.lineTo(cursorX + 25, cursorY);
        ctx.moveTo(cursorX, cursorY - 25);
        ctx.lineTo(cursorX, cursorY + 25);
        ctx.stroke();

        // Cursor circle
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 18, 0, Math.PI * 2);
        ctx.strokeStyle = "#22D3EE";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pulsing outer circle
        const pulseRadius = 30 + Math.sin(Date.now() / 200) * 5;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        ctx.shadowBlur = 0;

        // Cursor position label with rounded background
        const labelText = `(${Math.round(cursorX)}, ${Math.round(cursorY)})`;
        const labelWidth = 120;
        const labelHeight = 28;
        const labelX = cursorX + 30;
        const labelY = cursorY - 35;

        // Background
        ctx.fillStyle = "#22D3EE";
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 6);
        ctx.fill();

        // Border
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.fillStyle = "#000000";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(labelText, labelX + 8, labelY + labelHeight / 2);

        // Draw "PINCH ACTIVE" indicator
        ctx.fillStyle = "#10B981";
        ctx.beginPath();
        ctx.roundRect(labelX, labelY + labelHeight + 5, labelWidth, 24, 6);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "🤏 PINCH ACTIVE",
          labelX + labelWidth / 2,
          labelY + labelHeight + 17
        );

        // 🆕 Draw selection radius indicator (50px radius)
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 50, 0, Math.PI * 2);
        ctx.strokeStyle = "#FCD34D"; // Yellow
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;

        // Highlight components within selection radius (INCREASED to 80px)
        const SELECTION_RADIUS = 80;
        components.forEach((comp) => {
          // Skip if this is the currently selected component
          if (comp.id === selectedComponentId) {
            return; // Don't show "READY TO SELECT" on already selected component
          }

          const dx = comp.position.x - cursorX;
          const dy = comp.position.y - cursorY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < SELECTION_RADIUS) {
            // Draw highlight circle around selectable component
            ctx.beginPath();
            ctx.arc(comp.position.x, comp.position.y, 45, 0, Math.PI * 2);
            ctx.strokeStyle = "#10B981"; // Green
            ctx.lineWidth = 4;
            ctx.shadowColor = "#10B981";
            ctx.shadowBlur = 15;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw "READY TO SELECT" label (GREEN)
            ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
            ctx.beginPath();
            ctx.roundRect(
              comp.position.x - 70,
              comp.position.y + 50,
              140,
              28,
              8
            );
            ctx.fill();

            // Border
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              "READY TO SELECT",
              comp.position.x,
              comp.position.y + 64
            );
          }
        });

        // 🆕 Highlight currently selected component with different color
        if (selectedComponentId) {
          const selectedComp = components.find(
            (c) => c.id === selectedComponentId
          );

          if (selectedComp) {
            // Draw ORANGE/AMBER pulsing circle for selected component
            const pulseRadius = 55 + Math.sin(Date.now() / 150) * 10;
            ctx.beginPath();
            ctx.arc(
              selectedComp.position.x,
              selectedComp.position.y,
              pulseRadius,
              0,
              Math.PI * 2
            );
            ctx.strokeStyle = "#F97316"; // Orange (changed from blue)
            ctx.lineWidth = 6; // Thicker line
            ctx.shadowColor = "#F97316";
            ctx.shadowBlur = 25; // More glow
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Draw "READY TO MOVE" label above component (ORANGE)
            ctx.fillStyle = "rgba(249, 115, 22, 0.95)"; // Orange background
            ctx.beginPath();
            ctx.roundRect(
              selectedComp.position.x - 80,
              selectedComp.position.y - 72,
              160,
              34,
              10
            );
            ctx.fill();

            // Border
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
              "READY TO MOVE",
              selectedComp.position.x,
              selectedComp.position.y - 54
            );

            // Draw connection line from cursor to selected component (ORANGE)
            ctx.beginPath();
            ctx.setLineDash([8, 4]);
            ctx.moveTo(cursorX, cursorY);
            ctx.lineTo(selectedComp.position.x, selectedComp.position.y);
            ctx.strokeStyle = "#F97316"; // Orange - matching the "READY TO MOVE" color
            ctx.lineWidth = 4; // Thicker line
            ctx.globalAlpha = 0.7;
            ctx.shadowColor = "#F97316";
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;

            // Draw distance from cursor to component
            const distance = Math.sqrt(
              Math.pow(selectedComp.position.x - cursorX, 2) +
                Math.pow(selectedComp.position.y - cursorY, 2)
            );
            ctx.fillStyle = "rgba(59, 130, 246, 0.9)";
            ctx.beginPath();
            ctx.roundRect(
              (cursorX + selectedComp.position.x) / 2 - 40,
              (cursorY + selectedComp.position.y) / 2 - 12,
              80,
              24,
              6
            );
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.fillText(
              `${distance.toFixed(0)}px`,
              (cursorX + selectedComp.position.x) / 2,
              (cursorY + selectedComp.position.y) / 2 + 2
            );
          }
        }
      }
    }
  }, [
    components,
    handPosition,
    wireConnection,
    state.currentGesture,
    selectedComponentId,
  ]);

  /**
   * Stop camera and hand tracking
   */
  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }

    circuitControllerRef.current.reset();
    gestureDetectorRef.current.reset();

    setState({
      isActive: false,
      cameraReady: false,
      handDetected: false,
      currentGesture: null,
      selectedComponentType: "resistor",
      error: null,
      fps: 0,
    });

    console.log("🛑 Tracking stopped");
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopTracking();
      // Clear gesture reset timeout
      if (gestureResetTimeoutRef.current) {
        clearTimeout(gestureResetTimeoutRef.current);
      }
    };
  }, [stopTracking]);

  /**
   * Get component icon
   */
  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case "battery":
        return <Battery className="w-5 h-5" />;
      case "resistor":
        return <Zap className="w-5 h-5" />;
      case "lamp":
        return <Lightbulb className="w-5 h-5" />;
      case "switch":
        return <ToggleLeft className="w-5 h-5" />;
      case "wire":
        return <Cable className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border-2 border-blue-400/30 shadow-2xl ${className}`}
    >
      {/* Error Message */}
      {state.error && (
        <div className="mb-4 bg-red-500/20 border-2 border-red-400 rounded-xl p-3 animate-pulse">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-semibold text-sm">
                ⚠️ {state.error}
              </p>
              <p className="text-red-300 text-xs mt-1">
                Please allow camera access in your browser settings and refresh
                the page.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Component Toolbar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-3 mb-4 border border-blue-400/30">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <span className="text-yellow-400">⚡</span> KOMPONEN LISTRIK
          </h4>
          <div className="flex gap-3">
            {!state.isActive ? (
              <button
                onClick={startTracking}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:scale-105"
              >
                <CameraIcon className="w-4 h-4" />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:scale-105"
              >
                <XCircle className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Component Selection Bar */}
        <div className="grid grid-cols-5 gap-2 mt-3">
          {[
            {
              type: "battery",
              icon: "🔋",
              label: "Baterai",
              fingerCount: 1,
              color: "from-blue-500 to-blue-600",
            },
            {
              type: "lamp",
              icon: "💡",
              label: "Lampu",
              fingerCount: 2,
              color: "from-yellow-500 to-orange-500",
            },
            {
              type: "resistor",
              icon: "⚡",
              label: "Resistor",
              fingerCount: 3,
              color: "from-orange-500 to-red-500",
            },
            {
              type: "switch",
              icon: "🔘",
              label: "Saklar",
              fingerCount: 4,
              color: "from-green-500 to-emerald-600",
            },
            {
              type: "wire",
              icon: "━",
              label: "Kabel",
              fingerCount: 5,
              color: "from-gray-500 to-gray-600",
            },
          ].map((comp) => (
            <button
              key={comp.type}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  selectedComponentType: comp.type as ComponentType,
                }))
              }
              className={`
                relative bg-gradient-to-br ${
                  comp.color
                } rounded-lg p-3 border-2 transition-all duration-200 hover:scale-105
                ${
                  state.selectedComponentType === comp.type
                    ? "border-white shadow-lg shadow-white/50 ring-2 ring-white"
                    : "border-transparent hover:border-white/50"
                }
                ${
                  fingerCountSelection &&
                  fingerCountSelection.fingerCount === comp.fingerCount
                    ? "animate-pulse border-cyan-400 ring-4 ring-cyan-400"
                    : ""
                }
              `}
            >
              <div className="text-center">
                <div className="text-3xl mb-1">{comp.icon}</div>
                <div className="text-white text-xs font-bold uppercase">
                  {comp.label}
                </div>
                {/* NEW: Finger count indicator */}
                <div className="text-cyan-400 text-xs mt-1 font-bold">
                  {comp.fingerCount} 👆
                </div>
              </div>
              {state.selectedComponentType === comp.type && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* NEW: Left Hand - Component Added Feedback (Success) */}
        {fingerCountSelection && (
          <div className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 border-2 border-white animate-pulse">
            <div className="text-center text-white">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-sm font-bold">
                {fingerCountSelection.fingerCount} Jari - Komponen Ditambahkan!
              </div>
              <div className="text-xs mt-1">
                Tangan Kiri:
                {fingerCountSelection.fingerCount === 1 && " 🔋 Baterai"}
                {fingerCountSelection.fingerCount === 2 && " 💡 Lampu"}
                {fingerCountSelection.fingerCount === 3 && " ⚡ Resistor"}
                {fingerCountSelection.fingerCount === 4 && " 🔘 Saklar"}
                {fingerCountSelection.fingerCount === 5 && " ━ Kabel"}
              </div>
            </div>
          </div>
        )}

        {/* NEW: Right Hand - Wire Connection Feedback */}
        {wireConnection.isActive && (
          <div className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-3 border-2 border-white animate-pulse">
            <div className="text-center text-white">
              <div className="text-2xl mb-1">👉🔌</div>
              <div className="text-sm font-bold">
                Sedang Membuat Koneksi Wire
              </div>
              <div className="text-xs mt-1">
                Drag ke komponen tujuan, lalu FIST lagi
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout: Circuit Area + Camera */}
      <div className="grid grid-cols-12 gap-4">
        {/* Circuit Building Area - Large */}
        <div className="col-span-9">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 border border-blue-400/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <span className="text-orange-400">🔧</span> AREA PRAKTIKUM
              </h4>
              <div className="text-blue-300 text-xs">
                {components.length} komponen
              </div>
            </div>

            <div
              className="relative bg-slate-900 rounded-lg border-2 border-blue-400/50 overflow-hidden"
              style={{ height: "500px" }}
            >
              <canvas
                ref={circuitCanvasRef}
                width={1200}
                height={700}
                className="w-full h-full cursor-crosshair"
              />
              {components.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
                    <p className="text-blue-300 font-bold mb-2">
                      PINCH: Pilih & drag komponen dari panel atas
                    </p>
                    <p className="text-blue-200 text-sm">
                      ✋ TELUNJUK: Hidupkan saklar (ON)
                      <br />
                      ✌️ PEACE: Matikan saklar (OFF)
                      <br />
                      👊 ESC: Keluar | R: Reset rangkaian
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Calculation Results */}
            <div className="mt-3 bg-slate-800 rounded-lg p-3 border border-orange-400/30">
              <h5 className="text-orange-400 font-bold text-sm mb-2">
                HASIL PERHITUNGAN HUKUM OHM
              </h5>
              <div className="grid grid-cols-5 gap-3 text-sm">
                <div>
                  <span className="text-blue-300">V = </span>
                  <span className="text-white font-bold">0V</span>
                </div>
                <div>
                  <span className="text-blue-300">I = </span>
                  <span className="text-white font-bold">0A</span>
                </div>
                <div>
                  <span className="text-blue-300">R = </span>
                  <span className="text-white font-bold">0Ω</span>
                </div>
                <div>
                  <span className="text-blue-300">P = </span>
                  <span className="text-white font-bold">0W</span>
                </div>
                <div>
                  <span className="text-blue-300">Rangkaian: </span>
                  <span className="text-red-500 font-bold">OPEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Feed - Small (Right Side) */}
        <div className="col-span-3">
          {/* Hidden video element */}
          <video ref={videoRef} className="hidden" autoPlay playsInline muted />

          {/* Camera View */}
          <div className="relative bg-black rounded-xl overflow-hidden border-2 border-blue-400/50 shadow-inner mb-3">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-auto"
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Overlay - Status Indicators */}
            {state.isActive && (
              <>
                {/* FPS Counter */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1 border border-green-400/50">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-mono text-xs font-bold">
                      {state.fps} FPS
                    </span>
                  </div>
                </div>

                {/* Hand Detection Status */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1 border border-blue-400/50">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        state.handDetected
                          ? "bg-green-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-white text-xs font-semibold">
                      {state.handDetected ? "Hand OK" : "No Hand"}
                    </span>
                  </div>
                </div>

                {/* Debug Logger Controls */}
                <div className="absolute bottom-2 left-2 flex gap-1">
                  <button
                    onClick={() => debugLogger.exportLogs()}
                    className="bg-blue-600/90 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Download debug logs"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <button
                    onClick={() => debugLogger.copyToClipboard()}
                    className="bg-purple-600/90 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Copy logs to clipboard"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      debugLogger.clear();
                      alert("✅ Logs cleared");
                    }}
                    className="bg-red-600/90 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Clear logs"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
              </>
            )}

            {/* Loading/Placeholder */}
            {!state.isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="text-center p-4">
                  <CameraIcon className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-50 animate-pulse" />
                  <p className="text-white text-sm font-semibold mb-1">
                    Camera Off
                  </p>
                  <p className="text-blue-300 text-xs">
                    Start to detect gestures
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Gesture Guide Panel */}
          <div className="bg-slate-800 rounded-xl p-3 border border-purple-400/30">
            <h5 className="text-white font-bold text-xs mb-2 flex items-center gap-1">
              <span>🖐️</span> PANDUAN 2 TANGAN
            </h5>
            <div className="space-y-1.5 text-xs">
              {/* LEFT HAND: Component Adder */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 rounded p-2 mb-2">
                <div className="text-blue-300 font-bold mb-1 flex items-center gap-1">
                  👈 TANGAN KIRI (Tambah Komponen):
                </div>
                <div className="space-y-0.5 text-blue-200">
                  <div>1️⃣ Jari = 🔋 Baterai langsung muncul!</div>
                  <div>2️⃣ Jari = 💡 Lampu langsung muncul!</div>
                  <div>3️⃣ Jari = ⚡ Resistor langsung muncul!</div>
                  <div>4️⃣ Jari = 🔘 Saklar langsung muncul!</div>
                  <div>5️⃣ Jari = ━ Kabel langsung muncul!</div>
                </div>
              </div>

              {/* RIGHT HAND: Component Manipulator */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded p-2">
                <div className="text-purple-300 font-bold mb-1 flex items-center gap-1">
                  👉 TANGAN KANAN (Manipulasi):
                </div>
                <div className="space-y-0.5 text-purple-200">
                  <div>
                    🤏 <span className="font-semibold">PINCH (Jepit):</span>{" "}
                    Drag & Drop komponen
                  </div>
                  <div className="ml-4 text-xs text-cyan-300">
                    → Jepit (ibu jari + telunjuk dekat) di atas komponen
                    <br />
                    → Tahan PINCH, gerakkan tangan = komponen ikut!
                    <br />→ Lepas PINCH = DROP komponen
                  </div>
                  <div>
                    ✌️ <span className="font-semibold">PEACE:</span> Rotate 90°
                  </div>
                  <div>
                    🔄 <span className="font-semibold">PUTAR TANGAN:</span>{" "}
                    Smooth rotation
                  </div>
                  <div>
                    ✊ <span className="font-semibold">FIST + DRAG:</span> Buat
                    koneksi wire
                  </div>
                  <div className="ml-4 text-xs text-purple-300">
                    → FIST di komponen A → DRAG ke B → FIST lagi
                  </div>
                  <div>
                    ✋ <span className="font-semibold">BUKA TELAPAK:</span>{" "}
                    Delete komponen
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-300 text-xs mt-2 pt-2 border-t border-gray-600">
                <span className="text-yellow-400">�</span>
                <div>
                  <span className="font-semibold text-yellow-400">TIP:</span>{" "}
                  Gunakan tangan kiri untuk add, tangan kanan untuk manipulate!
                </div>
              </div>
            </div>
          </div>

          {/* Current Gesture Indicator */}
          {state.currentGesture && state.currentGesture.name !== "unknown" && (
            <div className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-3 border-2 border-white/30 animate-pulse">
              <div className="text-center">
                <div className="text-3xl mb-1">
                  {state.currentGesture.name === "pinch" && "🤏"}
                  {state.currentGesture.name === "point" && "☝️"}
                  {state.currentGesture.name === "peace" && "✌️"}
                  {state.currentGesture.name === "grab" && "✊"}
                  {state.currentGesture.name === "open_palm" && "✋"}
                  {state.currentGesture.name === "thumbs_up" && "👍"}
                  {state.currentGesture.name === "swipe_left" && "👈"}
                  {state.currentGesture.name === "swipe_right" && "👉"}
                  {state.currentGesture.name === "finger_count" && "🖐️"}
                  {state.currentGesture.name === "rotate" && "🔄"}
                </div>
                <div className="text-white font-bold text-sm uppercase">
                  {state.currentGesture.name.replace("_", " ")}
                  {state.currentGesture.name === "finger_count" &&
                    ` (${state.currentGesture.metadata?.fingerCount || 0})`}
                </div>
                <div className="text-white/80 text-xs mt-1">
                  <div>
                    Hand: {state.currentGesture.handedness}
                    {state.currentGesture.handedness === "Left" ? " 👈" : " 👉"}
                  </div>
                  <div>
                    Confidence:{" "}
                    {(state.currentGesture.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebCVPracticum;
