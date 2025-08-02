/**
 * Prompt configuration panel component
 * Handles system prompt and user input configuration
 */

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PromptPanelProps {
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
  userInput: string;
  setUserInput: (value: string) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export const PromptPanel = memo(function PromptPanel({
  systemPrompt,
  setSystemPrompt,
  userInput,
  setUserInput,
  onSimulate,
  isSimulating,
}: PromptPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Prompt Configuration</CardTitle>
        <CardDescription>
          Configure the system and user prompts for the AI simulation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Section - Always Visible */}
        <div className="pt-2 border-t border-border">
          <Button
            onClick={onSimulate}
            disabled={isSimulating}
            size="lg"
            className="w-full"
          >
            {isSimulating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Simulating AI Response...
              </>
            ) : (
              <>🚀 Simulate AI Response</>
            )}
          </Button>

          {!isSimulating && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              This will process both prompts and trigger the injection attack
            </p>
          )}
        </div>

        {/* System Prompt Section */}
        <div className="space-y-2">
          <label
            htmlFor="system-prompt"
            className="text-sm font-medium leading-none"
          >
            System Prompt
          </label>
          <Textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system-level instructions..."
            className="min-h-[80px] font-mono text-sm resize-none"
            disabled={isSimulating}
          />
        </div>

        {/* User Input Section */}
        <div className="space-y-2">
          <label
            htmlFor="user-input"
            className="text-sm font-medium leading-none"
          >
            User Input{" "}
            <span className="text-destructive font-medium">
              (Contains Injection)
            </span>
          </label>
          <Textarea
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter user prompt with injection..."
            className="min-h-[80px] font-mono text-sm resize-none border-destructive/20 focus-visible:ring-destructive/20"
            disabled={isSimulating}
          />
        </div>
      </CardContent>
    </Card>
  );
});
