/**
 * CircuitComponentRenderer.ts
 * Realistic circuit component rendering on Canvas (adapted from CircuitBuilderEnhanced SVG)
 * Provides visual parity between drag-n-drop and CV practicum
 */

import { ComponentType } from "./types";

interface RenderOptions {
  isSelected: boolean;
  isMobile: boolean;
  isOn?: boolean; // For lamp
  brightness?: number; // For lamp (0-1)
  lampPower?: number; // For lamp power display
  switchState?: "open" | "closed"; // For switch
}

export class CircuitComponentRenderer {
  /**
   * Render a circuit component on canvas context
   */
  static renderComponent(
    ctx: CanvasRenderingContext2D,
    type: ComponentType,
    x: number,
    y: number,
    rotation: number,
    options: RenderOptions
  ): void {
    const {
      isSelected,
      isMobile,
      isOn = false,
      brightness = 1,
      lampPower = 0,
      switchState = "open",
    } = options;

    const fontSize = isMobile ? 10 : 12;
    const terminalOffset = isMobile ? 37 : 52;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);

    switch (type) {
      case "battery":
        this.renderBattery(ctx, isSelected, terminalOffset);
        break;
      case "resistor":
        this.renderResistor(ctx, isSelected, terminalOffset, fontSize);
        break;
      case "lamp":
        this.renderLamp(
          ctx,
          isSelected,
          terminalOffset,
          fontSize,
          isOn,
          brightness,
          lampPower
        );
        break;
      case "switch":
        this.renderSwitch(
          ctx,
          isSelected,
          terminalOffset,
          fontSize,
          switchState
        );
        break;
      case "wire":
        this.renderWire(ctx, terminalOffset);
        break;
    }

    // Draw terminal points (connection points at both ends)
    this.renderTerminalPoints(ctx, terminalOffset, isSelected);

    ctx.restore();
  }

  /**
   * Render terminal connection points
   */
  private static renderTerminalPoints(
    ctx: CanvasRenderingContext2D,
    terminalOffset: number,
    isSelected: boolean
  ): void {
    const terminalRadius = isSelected ? 8 : 6;
    
    // Left terminal (terminal A)
    ctx.beginPath();
    ctx.arc(-terminalOffset, 0, terminalRadius, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "#3b82f6" : "#60a5fa";
    ctx.fill();
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right terminal (terminal B)
    ctx.beginPath();
    ctx.arc(terminalOffset, 0, terminalRadius, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "#3b82f6" : "#60a5fa";
    ctx.fill();
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Render battery component
   */
  private static renderBattery(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    terminalOffset: number
  ): void {
    // Battery body with gradient
    const gradient = ctx.createLinearGradient(-25, -18, -25, 18);
    gradient.addColorStop(0, "#f59e0b");
    gradient.addColorStop(1, "#d97706");

    ctx.fillStyle = gradient;
    this.roundRect(ctx, -25, -18, 50, 36, 4);
    ctx.fill();

    ctx.strokeStyle = isSelected ? "#eab308" : "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();

    // + terminal (right side)
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 3;
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(15, -8);
    ctx.lineTo(15, 8);
    ctx.stroke();
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(23, 0);
    ctx.stroke();

    // - terminal (left side)
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-7, 0);
    ctx.stroke();

    // Connecting wires
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-terminalOffset, 0);
    ctx.lineTo(-25, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(25, 0);
    ctx.lineTo(terminalOffset, 0);
    ctx.stroke();

    // Label
    ctx.fillStyle = isSelected ? "#eab308" : "#374151";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔋 12V", 0, -25);
  }

  /**
   * Render resistor component
   */
  private static renderResistor(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    terminalOffset: number,
    fontSize: number
  ): void {
    // Connecting wires
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-terminalOffset, 0);
    ctx.lineTo(-20, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(terminalOffset, 0);
    ctx.stroke();

    // Resistor body
    ctx.fillStyle = "#fef3c7";
    this.roundRect(ctx, -20, -10, 40, 20, 2);
    ctx.fill();

    ctx.strokeStyle = isSelected ? "#dc2626" : "#92400e";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Color bands
    ctx.fillStyle = "#92400e";
    ctx.fillRect(-12, -10, 3, 20);
    ctx.fillStyle = "#000000";
    ctx.fillRect(-4, -10, 3, 20);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(4, -10, 3, 20);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(12, -10, 3, 20);

    // Label
    ctx.fillStyle = isSelected ? "#dc2626" : "#374151";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔌 100Ω", 0, -18);
  }

  /**
   * Render lamp component
   */
  private static renderLamp(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    terminalOffset: number,
    fontSize: number,
    isOn: boolean,
    brightness: number,
    lampPower: number
  ): void {
    // Connecting wires
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-terminalOffset, 0);
    ctx.lineTo(-20, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(terminalOffset, 0);
    ctx.stroke();

    // Glow effect when ON
    if (isOn) {
      // Outer glow
      const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
      outerGlow.addColorStop(0, `rgba(254, 240, 138, ${0.5 * brightness})`);
      outerGlow.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();

      // Middle glow
      const middleGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
      middleGlow.addColorStop(0, `rgba(253, 224, 71, ${0.7 * brightness})`);
      middleGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
      ctx.fillStyle = middleGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bulb body
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    if (isOn) {
      ctx.fillStyle = `rgba(254, 243, 199, ${0.5 + 0.5 * brightness})`;
      ctx.strokeStyle = isSelected ? "#eab308" : "#fbbf24";
      ctx.shadowColor = `rgba(251, 191, 36, ${brightness})`;
      ctx.shadowBlur = 8 + 12 * brightness;
    } else {
      ctx.fillStyle = "#e5e7eb";
      ctx.strokeStyle = isSelected ? "#3b82f6" : "#9ca3af";
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Filament
    if (isOn) {
      ctx.strokeStyle = `rgba(251, 191, 36, ${brightness})`;
      ctx.lineWidth = 2;
      ctx.globalAlpha = brightness;
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.quadraticCurveTo(0, -8, 6, -6);
      ctx.moveTo(-6, 0);
      ctx.quadraticCurveTo(0, 2, 6, 0);
      ctx.moveTo(-6, 6);
      ctx.quadraticCurveTo(0, 8, 6, 6);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.quadraticCurveTo(0, -8, 6, -6);
      ctx.moveTo(-6, 0);
      ctx.quadraticCurveTo(0, 2, 6, 0);
      ctx.moveTo(-6, 6);
      ctx.quadraticCurveTo(0, 8, 6, 6);
      ctx.stroke();
    }

    // Lamp base
    ctx.fillStyle = isSelected ? "#d97706" : "#78716c";
    ctx.strokeStyle = "#57534e";
    ctx.lineWidth = 1;
    this.roundRect(ctx, -8, 18, 16, 8, 1);
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle = isOn ? "#eab308" : isSelected ? "#3b82f6" : "#374151";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isOn ? "💡 ON" : "💡 OFF", 0, -30);

    // Power label
    if (lampPower > 0) {
      ctx.fillStyle = "#6b7280";
      ctx.font = `${fontSize - 2}px Arial`;
      ctx.fillText(`${lampPower.toFixed(2)}W`, 0, 40);
    }
  }

  /**
   * Render switch component
   */
  private static renderSwitch(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    terminalOffset: number,
    fontSize: number,
    state: "open" | "closed"
  ): void {
    const isOpen = state === "open";

    // Connecting wires
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-terminalOffset, 0);
    ctx.lineTo(-15, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(terminalOffset, 0);
    ctx.stroke();

    // Contact points
    ctx.fillStyle = "#374151";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(-15, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(15, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Switch lever
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    if (isOpen) {
      ctx.strokeStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(10, -15);
      ctx.stroke();
    } else {
      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(-15, 0);
      ctx.lineTo(15, 0);
      ctx.stroke();
    }

    // Switch base
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = isSelected ? "#e5e7eb" : "#f3f4f6";
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1;
    this.roundRect(ctx, -20, -4, 40, 8, 2);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Label
    ctx.fillStyle = isOpen ? "#ef4444" : "#10b981";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isOpen ? "⚡ OPEN" : "⚡ CLOSED", 0, -25);
  }

  /**
   * Render wire component
   */
  private static renderWire(
    ctx: CanvasRenderingContext2D,
    terminalOffset: number
  ): void {
    // Main wire
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-terminalOffset, 0);
    ctx.lineTo(terminalOffset, 0);
    ctx.stroke();

    // Connectors
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(-terminalOffset, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(terminalOffset, 0, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Helper: Draw rounded rectangle
   */
  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
