/**
 * Shared TypeScript definitions for the prompt injection demo
 */

export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  data: string;
  decoded: string;
  userAgent?: string;
}

export interface ExfiltrationData {
  customer: string;
  email: string;
  balance: string;
  ssn: string;
  creditScore: number;
  address: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SSEMessage {
  type: "connected" | "newLog" | "logsCleared" | "error";
  data?: LogEntry;
  message?: string;
}

export interface DemoState {
  systemPrompt: string;
  userInput: string;
  aiResponse: string;
  logs: LogEntry[];
  isSimulating: boolean;
  isConnected: boolean;
  error: string | null;
}

export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  DEBUG = "debug",
}

export interface AppConfig {
  maxLogs: number;
  simulationDelay: number;
  reconnectAttempts: number;
  reconnectDelay: number;
}
