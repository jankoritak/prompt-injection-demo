/**
 * Server-Sent Events endpoint for real-time log streaming
 */

import { NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/utils";
import { LogLevel } from "@/types";
import { sseService } from "@/lib/services/sse-service";

/**
 * Handles GET requests for SSE log streaming
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    log(LogLevel.DEBUG, "New SSE connection requested");

    // Create SSE stream
    const stream = sseService.createConnection(request.signal);

    // Set up log service listener for this connection
    // Note: We don't add individual listeners here to avoid duplicate broadcasts
    // The SSE service already receives logs from the log service directly

    // Clean up when connection closes
    request.signal.addEventListener("abort", () => {
      log(LogLevel.DEBUG, "SSE connection closed");
    });

    return new Response(stream, {
      headers: sseService.getSSEHeaders(),
    });
  } catch (error) {
    log(LogLevel.ERROR, "Error creating SSE connection", error);

    // Return error response
    return new NextResponse("SSE connection failed", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
