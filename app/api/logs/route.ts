/**
 * API route for retrieving all log entries
 */

import { NextResponse } from "next/server";
import type { ApiResponse, LogEntry } from "@/types";
import { HTTP_STATUS, CONTENT_TYPES } from "@/lib/constants";
import { log } from "@/lib/utils";
import { LogLevel } from "@/types";
import { logService } from "@/lib/services/log-service";

/**
 * Handles GET requests to retrieve all logs
 */
export async function GET(): Promise<NextResponse<ApiResponse<LogEntry[]>>> {
  try {
    const logs = logService.getAllLogs();

    log(LogLevel.DEBUG, "Logs retrieved", { count: logs.length });

    const response: ApiResponse<LogEntry[]> = logService.createApiResponse(
      true,
      logs
    );

    return NextResponse.json(response, {
      status: HTTP_STATUS.OK,
      headers: {
        "Content-Type": CONTENT_TYPES.JSON,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    log(LogLevel.ERROR, "Error retrieving logs", error);

    const errorResponse: ApiResponse<LogEntry[]> = logService.createApiResponse(
      false,
      [],
      "Failed to retrieve logs"
    );

    return NextResponse.json(errorResponse, {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}
