/**
 * Server logs display panel component
 * Shows real-time exfiltrated data entries
 */

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { LogEntry } from "@/types";

interface LogsPanelProps {
  logs: LogEntry[] | null;
  onClearLogs: () => void;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  error: string | null;
}

export const LogsPanel = memo(function LogsPanel({
  logs,
  onClearLogs,
  connectionStatus,
  error,
}: LogsPanelProps) {
  const getStatusDot = () => {
    const dotConfig = {
      connected: {
        color: "bg-green-500",
        animate: "",
        tooltip: "Connected - receiving live data",
      },
      connecting: {
        color: "bg-yellow-500",
        animate: "animate-pulse",
        tooltip: "Connecting to server...",
      },
      disconnected: {
        color: "bg-red-500",
        animate: "",
        tooltip: "Disconnected from server",
      },
      error: {
        color: "bg-red-500",
        animate: "animate-pulse",
        tooltip: "Connection error",
      },
    };

    const config = dotConfig[connectionStatus];

    return (
      <div
        className={`w-2 h-2 rounded-full ${config.color} ${config.animate}`}
        title={config.tooltip}
      />
    );
  };

  const renderLogEntry = (logEntry: LogEntry, index: number) => (
    <div
      key={logEntry.id}
      className="border-l-2 border-destructive/30 bg-destructive/5 p-3 text-xs font-mono"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-destructive font-medium">
          #{index + 1} • {new Date(logEntry.timestamp).toLocaleTimeString()}
        </span>
        <span className="text-muted-foreground">IP: {logEntry.ip}</span>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-destructive font-medium">DATA:</span>
          <div className="bg-muted/50 p-2 rounded mt-1">
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {logEntry.decoded}
            </pre>
          </div>
        </div>

        <div>
          <span className="text-destructive font-medium">RAW:</span>
          <div className="bg-muted/50 p-2 rounded mt-1">
            <pre className="overflow-x-auto break-all whitespace-pre-wrap">
              {logEntry.data}
            </pre>
          </div>
        </div>

        {logEntry.userAgent && (
          <div>
            <span className="text-destructive font-medium">UA:</span>
            <div className="text-muted-foreground break-all bg-muted/30 p-2 rounded mt-1">
              {logEntry.userAgent}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle>Server Logs</CardTitle>
            <div className="flex items-center gap-3">
              <CardDescription>
                Real-time exfiltrated data ({logs?.length || 0} entries)
              </CardDescription>
              {getStatusDot()}
            </div>
          </div>

          <Button
            onClick={onClearLogs}
            disabled={!logs || logs.length === 0}
            variant="destructive"
            size="sm"
          >
            Clear ({logs?.length || 0})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!logs || logs.length === 0 ? (
          <Card className="border-dashed h-full">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-center">
                <p className="text-lg font-medium mb-2">
                  No data exfiltration detected yet
                </p>
                <p className="text-sm">
                  Simulate an AI response to see exfiltrated data appear here
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 h-full overflow-y-auto">
            {logs.map((logEntry, index) => renderLogEntry(logEntry, index))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
