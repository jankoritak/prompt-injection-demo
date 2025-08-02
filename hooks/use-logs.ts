/**
 * Custom hook for managing logs with real-time updates
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { LogEntry, SSEMessage, ApiResponse } from "@/types";
import { LogLevel } from "@/types";
import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import { log } from "@/lib/utils";

interface UseLogsReturn {
  logs: LogEntry[];
  isConnected: boolean;
  error: string | null;
  clearLogs: () => Promise<void>;
  retryConnection: () => void;
}

export function useLogs(): UseLogsReturn {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const logIdsRef = useRef<Set<string>>(new Set());

  const connectToSSE = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource(API_ENDPOINTS.LOGS_STREAM);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        log(LogLevel.INFO, "SSE connection established");
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = JSON.parse(event.data);

          switch (message.type) {
            case "connected":
              log(LogLevel.DEBUG, "SSE connected message received");
              break;

            case "newLog":
              if (message.data && !logIdsRef.current.has(message.data.id)) {
                logIdsRef.current.add(message.data.id);
                setLogs((prev) => [...prev, message.data!]);
              }
              break;

            case "logsCleared":
              setLogs([]);
              logIdsRef.current.clear();
              break;

            case "error":
              setError(message.message || "Unknown SSE error");
              break;

            default:
              log(LogLevel.WARN, "Unknown SSE message type", message);
          }
        } catch (parseError) {
          log(LogLevel.ERROR, "Failed to parse SSE message", parseError);
        }
      };

      eventSource.onerror = (event) => {
        setIsConnected(false);
        const errorMessage = "SSE connection error";
        setError(errorMessage);
        log(LogLevel.ERROR, errorMessage, event);

        // Attempt reconnection
        if (reconnectAttempts.current < APP_CONFIG.reconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            log(
              LogLevel.INFO,
              `Attempting SSE reconnection (${reconnectAttempts.current}/${APP_CONFIG.reconnectAttempts})`
            );
            connectToSSE();
          }, APP_CONFIG.reconnectDelay);
        } else {
          setError("Failed to connect after multiple attempts");
        }
      };
    } catch (connectionError) {
      log(LogLevel.ERROR, "Failed to create SSE connection", connectionError);
      setError("Failed to establish connection");
      setIsConnected(false);
    }
  }, []);

  const retryConnection = useCallback(() => {
    reconnectAttempts.current = 0;
    setError(null);
    connectToSSE();
  }, [connectToSSE]);

  const clearLogs = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.CLEAR_LOGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to clear logs: ${response.statusText}`);
      }

      // Logs will be cleared via SSE message
      log(LogLevel.INFO, "Logs cleared successfully");
    } catch (clearError) {
      const errorMessage =
        clearError instanceof Error
          ? clearError.message
          : "Failed to clear logs";
      setError(errorMessage);
      log(LogLevel.ERROR, "Error clearing logs", clearError);
    }
  }, []);

  // Load initial logs and set up SSE connection
  useEffect(() => {
    const loadInitialLogs = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.LOGS);
        if (response.ok) {
          const apiResponse: ApiResponse<LogEntry[]> = await response.json();
          if (apiResponse.success && apiResponse.data) {
            setLogs(apiResponse.data);
            // Initialize the log IDs set with existing logs
            logIdsRef.current = new Set(apiResponse.data.map((log) => log.id));
          } else {
            setLogs([]);
            logIdsRef.current.clear();
            if (apiResponse.error) {
              setError(apiResponse.error);
            }
          }
        } else {
          setLogs([]);
          setError("Failed to load logs");
        }
      } catch (loadError) {
        log(LogLevel.ERROR, "Failed to load initial logs", loadError);
        setLogs([]);
        setError("Failed to load logs");
      }
    };

    loadInitialLogs();
    connectToSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectToSSE]);

  return {
    logs,
    isConnected,
    error,
    clearLogs,
    retryConnection,
  };
}
