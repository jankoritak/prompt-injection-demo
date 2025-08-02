import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LogLevel, LogEntry, ExfiltrationData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique log ID
 */
export function generateLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Encodes data to Base64
 */
export function encodeToBase64(data: ExfiltrationData): string {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    log(LogLevel.ERROR, "Failed to encode data to Base64", error);
    return "";
  }
}

/**
 * Decodes Base64 data
 */
export function decodeFromBase64(base64: string): string {
  try {
    return atob(base64);
  } catch (error) {
    log(LogLevel.ERROR, "Failed to decode Base64 data", error);
    return "Invalid data";
  }
}

/**
 * Gets client IP address from request headers
 */
export function getClientIp(request: Request): string {
  // Check various headers for IP address
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");
  const xClientIp = request.headers.get("x-client-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  if (xRealIp) {
    return xRealIp;
  }

  if (xClientIp) {
    return xClientIp;
  }

  // Fallback for local development
  return "::1";
}

/**
 * Creates a log entry from exfiltration data
 */
export function createLogEntry(
  encodedData: string,
  ip: string,
  userAgent?: string
): LogEntry {
  const decodedData = decodeFromBase64(encodedData);

  return {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    ip,
    data: encodedData,
    decoded: decodedData,
    userAgent,
  };
}

/**
 * Formats timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Creates a 1x1 transparent tracking pixel
 */
export function createTrackingPixel(): Response {
  // 1x1 transparent GIF as base64
  const transparentGif =
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const gifBuffer = Uint8Array.from(atob(transparentGif), (c) =>
    c.charCodeAt(0)
  );

  return new Response(gifBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": gifBuffer.length.toString(),
      "Cache-Control": "no-cache",
    },
  });
}

/**
 * Validates if a string is valid Base64
 */
export function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * Structured logging with different levels
 */
export function log(level: LogLevel, message: string, data?: unknown): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
  const emoji =
    { error: "🚨", warn: "⚠️", debug: "🐛", info: "ℹ️" }[level] || "ℹ️";

  console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
    emoji,
    JSON.stringify(logEntry, null, 2)
  );
}

/**
 * Simple delay utility
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
