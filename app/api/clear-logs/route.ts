/**
 * API route for clearing all log entries
 */

import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import { HTTP_STATUS, CONTENT_TYPES } from "@/lib/constants";
import { log } from "@/lib/utils";
import { LogLevel } from "@/types";
import { logService } from "@/lib/services/log-service";

/**
 * Handles POST requests to clear all logs
 */
export async function POST(): Promise<
  NextResponse<ApiResponse<{ cleared: number }>>
> {
  try {
    const currentCount = logService.getLogsCount();

    // Clear logs in service (this will automatically broadcast via SSE)
    logService.clearLogs();

    log(LogLevel.INFO, "Logs cleared", { clearedCount: currentCount });

    const response: ApiResponse<{ cleared: number }> =
      logService.createApiResponse(true, { cleared: currentCount });

    return NextResponse.json(response, {
      status: HTTP_STATUS.OK,
      headers: {
        "Content-Type": CONTENT_TYPES.JSON,
      },
    });
  } catch (error) {
    log(LogLevel.ERROR, "Error clearing logs", error);

    const errorResponse: ApiResponse<{ cleared: number }> =
      logService.createApiResponse(
        false,
        { cleared: 0 },
        "Failed to clear logs"
      );

    return NextResponse.json(errorResponse, {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    });
  }
}
