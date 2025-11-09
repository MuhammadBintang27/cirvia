/**
 * Debug Logger for CV Practicum
 * Logs events to console and stores them in memory for export
 */

export interface LogEntry {
  timestamp: number;
  time: string;
  type: "gesture" | "action" | "state" | "error" | "info";
  message: string;
  data?: any;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs
  private isEnabled = true;

  /**
   * Log a message
   */
  log(type: LogEntry["type"], message: string, data?: any) {
    if (!this.isEnabled) return;

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const time = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;

    const entry: LogEntry = {
      timestamp,
      time,
      type,
      message,
      data,
    };

    // Add to memory
    this.logs.push(entry);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console with emoji
    const emoji = this.getEmoji(type);
    const consoleMessage = `${emoji} [${time}] ${message}`;

    if (data) {
      console.log(consoleMessage, data);
    } else {
      console.log(consoleMessage);
    }
  }

  /**
   * Get emoji for log type
   */
  private getEmoji(type: LogEntry["type"]): string {
    switch (type) {
      case "gesture":
        return "👋";
      case "action":
        return "🎮";
      case "state":
        return "🔄";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📝";
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs as text
   */
  getLogsAsText(): string {
    return this.logs
      .map((log) => {
        const dataStr = log.data ? ` | ${JSON.stringify(log.data)}` : "";
        return `[${log.time}] ${log.type.toUpperCase()}: ${
          log.message
        }${dataStr}`;
      })
      .join("\n");
  }

  /**
   * Export logs as downloadable file
   */
  exportLogs(filename = "cv-practicum-debug.log") {
    const text = this.getLogsAsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`✅ Logs exported to ${filename}`);
  }

  /**
   * Copy logs to clipboard
   */
  async copyToClipboard(): Promise<boolean> {
    try {
      const text = this.getLogsAsText();
      await navigator.clipboard.writeText(text);
      console.log("✅ Logs copied to clipboard");
      return true;
    } catch (error) {
      console.error("❌ Failed to copy logs:", error);
      return false;
    }
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
    console.log("🗑️ Logs cleared");
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    console.log(enabled ? "✅ Logging enabled" : "⏸️ Logging disabled");
  }

  /**
   * Get logs filtered by type
   */
  getLogsByType(type: LogEntry["type"]): LogEntry[] {
    return this.logs.filter((log) => log.type === type);
  }

  /**
   * Get logs in time range
   */
  getLogsInRange(startTime: number, endTime: number): LogEntry[] {
    return this.logs.filter(
      (log) => log.timestamp >= startTime && log.timestamp <= endTime
    );
  }

  /**
   * Print summary
   */
  printSummary() {
    const summary = {
      total: this.logs.length,
      gestures: this.getLogsByType("gesture").length,
      actions: this.getLogsByType("action").length,
      states: this.getLogsByType("state").length,
      errors: this.getLogsByType("error").length,
      info: this.getLogsByType("info").length,
    };

    console.log("📊 Debug Log Summary:", summary);
    return summary;
  }
}

// Export singleton instance
export const debugLogger = new DebugLogger();

// Make it available globally for debugging in browser console
if (typeof window !== "undefined") {
  (window as any).debugLogger = debugLogger;
}
