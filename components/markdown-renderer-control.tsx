/**
 * Markdown Renderer Control Panel
 * Allows toggling between secure and insecure markdown rendering
 */

import { memo } from "react";
import { Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarkdownRendererControlProps {
  isSecure: boolean;
  onToggle: (isSecure: boolean) => void;
  className?: string;
}

export const MarkdownRendererControl = memo(function MarkdownRendererControl({
  isSecure,
  onToggle,
  className = "",
}: MarkdownRendererControlProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isSecure ? (
              <Shield className="h-4 w-4 text-green-600" />
            ) : (
              <ShieldOff className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium text-sm">Markdown Renderer</span>
          </div>
          <Badge
            variant={isSecure ? "default" : "destructive"}
            className="text-xs"
          >
            {isSecure ? "Secure" : "Insecure"}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {isSecure ? "harden-react-markdown" : "react-markdown"}
          </span>
          <Button
            onClick={() => onToggle(!isSecure)}
            variant={isSecure ? "outline" : "default"}
            size="sm"
            className="text-xs px-3 py-1 h-7"
          >
            {isSecure ? "Switch to Insecure" : "Switch to Secure"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
