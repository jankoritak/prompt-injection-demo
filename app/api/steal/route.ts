/**
 * API route for handling data exfiltration simulation
 * This endpoint simulates how malicious images can steal data
 */

import { NextRequest } from "next/server";
import { logService } from "@/lib/services/log-service";
import { LogLevel } from "@/types";
import {
  getClientIp,
  createLogEntry,
  createTrackingPixel,
  log,
} from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    log(LogLevel.DEBUG, "Steal API endpoint called");

    const searchParams = request.nextUrl.searchParams;
    const data = searchParams.get("data");

    if (!data) {
      log(LogLevel.WARN, "No data parameter provided");
      return createTrackingPixel();
    }

    log(LogLevel.DEBUG, "Processing exfiltration request", {
      dataLength: data.length,
    });

    // Extract client information
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    // Create log entry
    const logEntry = createLogEntry(data, ip, userAgent);
    log(LogLevel.DEBUG, "Log entry created", { id: logEntry.id });

    // Store the log (this will trigger SSE broadcast)
    logService.addLog(logEntry);
    log(LogLevel.DEBUG, "Log stored successfully", { id: logEntry.id });

    log(LogLevel.INFO, "Data exfiltration simulated", {
      id: logEntry.id,
      ip,
      dataLength: data.length,
      hasUserAgent: !!userAgent,
    });

    // Return a 1x1 transparent pixel to simulate image request
    return createTrackingPixel();
  } catch (error) {
    log(LogLevel.ERROR, "Error processing exfiltration request", error);

    // Return a 1x1 transparent pixel anyway
    return createTrackingPixel();
  }
}
