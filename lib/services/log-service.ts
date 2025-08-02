/**
 * Service layer for log management
 * Handles in-memory log storage and operations
 */

import type { LogEntry, ApiResponse } from "@/types";
import { LogLevel } from "@/types";
import { APP_CONFIG } from "@/lib/constants";
import { log } from "@/lib/utils";
import { sseService } from "./sse-service";

class LogService {
  private logs: LogEntry[] = [];
  private listeners: Array<(log: LogEntry) => void> = [];

  /**
   * Adds a new log entry
   */
  addLog(logEntry: LogEntry): void {
    try {
      log(LogLevel.DEBUG, "Starting addLog process", { id: logEntry.id });

      // Check for duplicates
      if (this.logs.some((existing) => existing.id === logEntry.id)) {
        log(LogLevel.DEBUG, "Duplicate log entry ignored", { id: logEntry.id });
        return;
      }

      this.logs.push(logEntry);
      log(LogLevel.DEBUG, "Log added to memory", {
        id: logEntry.id,
        totalLogs: this.logs.length,
      });

      // Maintain max logs limit
      if (this.logs.length > APP_CONFIG.maxLogs) {
        this.logs = this.logs.slice(-APP_CONFIG.maxLogs);
      }

      // Notify SSE clients directly
      if (sseService) {
        sseService.broadcastLog(logEntry);
        log(LogLevel.DEBUG, "Log broadcasted via SSE", { id: logEntry.id });
      } else {
        log(LogLevel.WARN, "SSE service not available for broadcasting log", {
          id: logEntry.id,
        });
      }

      // Notify other listeners
      this.notifyListeners(logEntry);

      log(LogLevel.INFO, "Data exfiltrated", logEntry);
    } catch (error) {
      log(LogLevel.ERROR, "Error in addLog", {
        error,
        logEntryId: logEntry.id,
      });
      throw error;
    }
  }

  /**
   * Gets all logs
   */
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clears all logs
   */
  clearLogs(): void {
    this.logs = [];

    // Notify SSE clients
    if (sseService) {
      sseService.broadcastLogsCleared();
    }

    log(LogLevel.INFO, "All logs cleared");
  }

  /**
   * Gets logs count
   */
  getLogsCount(): number {
    return this.logs.length;
  }

  /**
   * Adds a listener for new log entries
   */
  addListener(callback: (log: LogEntry) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifies all listeners of new log entry
   */
  private notifyListeners(logEntry: LogEntry): void {
    this.listeners.forEach((callback) => {
      try {
        callback(logEntry);
      } catch (error) {
        log(LogLevel.ERROR, "Error notifying log listener", error);
      }
    });
  }

  /**
   * Creates a standardized API response
   */
  createApiResponse<T>(
    success: boolean,
    data?: T,
    error?: string
  ): ApiResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}

// Use global to persist singleton across hot reloads in development
const globalForLogService = globalThis as unknown as {
  logService: LogService | undefined;
};

export const logService = globalForLogService.logService ?? new LogService();

// Store on global for development hot reload persistence
globalForLogService.logService = logService;
