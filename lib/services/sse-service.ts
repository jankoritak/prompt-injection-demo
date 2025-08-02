/**
 * Server-Sent Events service for real-time communication
 */

import type { LogEntry, SSEMessage } from "@/types";
import { LogLevel } from "@/types";
import { log } from "@/lib/utils";
import { CONTENT_TYPES } from "@/lib/constants";

class SSEService {
  private controllers: Set<ReadableStreamDefaultController> = new Set();

  createConnection(signal: AbortSignal): ReadableStream {
    return new ReadableStream({
      start: (controller) => {
        // Add controller to active connections
        this.controllers.add(controller);

        // Send initial connection message
        this.sendMessage(controller, {
          type: "connected",
          message: "SSE connection established",
        });

        // Handle client disconnect
        signal.addEventListener("abort", () => {
          this.removeConnection(controller);
        });

        log(LogLevel.DEBUG, "New SSE connection established");
      },
    });
  }

  /**
   * Broadcasts a new log entry to all connected clients
   */
  broadcastLog(logEntry: LogEntry): void {
    const message: SSEMessage = {
      type: "newLog",
      data: logEntry,
    };

    this.broadcast(message);
  }

  /**
   * Broadcasts logs cleared event to all connected clients
   */
  broadcastLogsCleared(): void {
    const message: SSEMessage = {
      type: "logsCleared",
      message: "All logs have been cleared",
    };

    this.broadcast(message);
  }

  /**
   * Broadcasts an error to all connected clients
   */
  broadcastError(error: string): void {
    const message: SSEMessage = {
      type: "error",
      message: error,
    };

    this.broadcast(message);
  }

  /**
   * Gets the number of active connections
   */
  getConnectionCount(): number {
    return this.controllers.size;
  }

  /**
   * Creates SSE response headers
   */
  getSSEHeaders(): HeadersInit {
    return {
      "Content-Type": CONTENT_TYPES.EVENT_STREAM,
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    };
  }

  /**
   * Broadcasts a message to all connected clients
   */
  private broadcast(message: SSEMessage): void {
    const controllers = Array.from(this.controllers);

    controllers.forEach((controller) => {
      try {
        this.sendMessage(controller, message);
      } catch (error) {
        log(LogLevel.ERROR, "Failed to send SSE message", error);
        this.removeConnection(controller);
      }
    });

    log(
      LogLevel.DEBUG,
      `Broadcasted message to ${controllers.length} clients`,
      message
    );
  }

  /**
   * Sends a message to a specific controller
   */
  private sendMessage(
    controller: ReadableStreamDefaultController,
    message: SSEMessage
  ): void {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    const encoder = new TextEncoder();
    controller.enqueue(encoder.encode(data));
  }

  /**
   * Removes a connection and cleans up
   */
  private removeConnection(controller: ReadableStreamDefaultController): void {
    this.controllers.delete(controller);

    try {
      controller.close();
    } catch (error) {
      // Controller might already be closed
      log(LogLevel.DEBUG, "Controller already closed", error);
    }

    log(LogLevel.DEBUG, "SSE connection removed");
  }
}

// Use global to persist singleton across hot reloads in development
const globalForSSEService = globalThis as unknown as {
  sseService: SSEService | undefined;
};

export const sseService = globalForSSEService.sseService ?? new SSEService();

// Store on global for development hot reload persistence
globalForSSEService.sseService = sseService;
