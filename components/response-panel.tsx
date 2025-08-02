/**
 * AI response display panel component
 * Shows the compromised AI response with embedded exfiltration
 */

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import HardenReactMarkdown from "harden-react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResponsePanelProps {
  aiResponse: string;
  isSimulating: boolean;
  isSecureMarkdown: boolean;
}

export const ResponsePanel = memo(function ResponsePanel({
  aiResponse,
  isSimulating,
  isSecureMarkdown,
}: ResponsePanelProps) {
  // Create the secure markdown component using harden-react-markdown
  const SecureMarkdown = HardenReactMarkdown(ReactMarkdown);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>AI Response</CardTitle>
        <CardDescription>
          Watch the compromised AI response with hidden exfiltration
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {(() => {
          if (isSimulating) {
            return (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    Generating AI response...
                  </p>
                </CardContent>
              </Card>
            );
          }

          if (!aiResponse) {
            return (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-muted-foreground text-center">
                    <p className="text-lg font-medium mb-2">
                      Ready for simulation
                    </p>
                    <p className="text-sm">
                      Click &ldquo;Simulate AI Response&rdquo; to see the
                      compromised output
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {isSecureMarkdown ? (
                    <SecureMarkdown key="secure-mode">
                      {aiResponse}
                    </SecureMarkdown>
                  ) : (
                    <ReactMarkdown key="insecure-mode">
                      {aiResponse}
                    </ReactMarkdown>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </CardContent>
    </Card>
  );
});
