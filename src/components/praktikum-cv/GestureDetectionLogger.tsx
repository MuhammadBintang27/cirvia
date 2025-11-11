"use client";

import React, { useState, useEffect } from "react";
import { GestureDetector } from "./GestureDetector";
import { Download, Trash2, BarChart3, Eye, EyeOff } from "lucide-react";

interface LogEntry {
  timestamp: string;
  type: string;
  data: any;
}

interface LogStats {
  totalEntries: number;
  byType: { [key: string]: number };
  oldestEntry: string | null;
  newestEntry: string | null;
}

export const GestureDetectionLogger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    totalEntries: 0,
    byType: {},
    oldestEntry: null,
    newestEntry: null,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh logs
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshLogs();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const refreshLogs = () => {
    const newLogs = GestureDetector.getDetectionLogs();
    const newStats = GestureDetector.getLogStats();
    setLogs(newLogs);
    setStats(newStats);
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    GestureDetector.downloadLogs(`gesture-logs-${timestamp}.json`);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      GestureDetector.clearLogs();
      refreshLogs();
    }
  };

  const handleCopyJSON = () => {
    const json = GestureDetector.exportLogsAsJSON();
    navigator.clipboard.writeText(json);
    alert("Logs copied to clipboard!");
  };

  const getFilteredLogs = () => {
    if (filterType === "all") return logs;
    return logs.filter((log) => log.type === filterType);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const ms = date.getMilliseconds().toString().padStart(3, "0");
    return `${timeStr}.${ms}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "finger_detection":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "gesture":
        return "bg-green-100 text-green-800 border-green-200";
      case "action":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatLogData = (data: any): string => {
    if (typeof data === "object") {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      {!isExpanded && (
        <button
          onClick={() => {
            setIsExpanded(true);
            refreshLogs();
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
          title="Open Gesture Logs"
        >
          <BarChart3 size={24} />
          {stats.totalEntries > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
              {stats.totalEntries}
            </span>
          )}
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl w-[600px] max-h-[80vh] flex flex-col border-2 border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={24} />
              <h3 className="text-lg font-bold">Gesture Detection Logs</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalEntries}
                </div>
                <div className="text-xs text-gray-600">Total Logs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.byType.finger_detection || 0}
                </div>
                <div className="text-xs text-gray-600">Finger Detections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.byType.action || 0}
                </div>
                <div className="text-xs text-gray-600">Actions</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="finger_detection">Finger Detection</option>
                <option value="gesture">Gesture</option>
                <option value="action">Action</option>
              </select>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autoRefresh
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
                title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
              >
                {autoRefresh ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={refreshLogs}
                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleCopyJSON}
                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                title="Copy as JSON"
              >
                📋
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                title="Download Logs"
              >
                <Download size={16} />
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                title="Clear Logs"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {getFilteredLogs().length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                <p>No logs yet. Start using gestures!</p>
              </div>
            ) : (
              getFilteredLogs()
                .slice()
                .reverse()
                .map((log, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 ${getTypeColor(
                      log.type
                    )} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white/50">
                        {log.type}
                      </span>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono bg-white/50 p-2 rounded">
                      {formatLogData(log.data)}
                    </pre>
                  </div>
                ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-center text-gray-600">
            {stats.oldestEntry && (
              <div>
                Oldest: {formatTimestamp(stats.oldestEntry)} | Newest:{" "}
                {stats.newestEntry ? formatTimestamp(stats.newestEntry) : "-"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
