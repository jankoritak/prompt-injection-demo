/**
 * Main application page - Prompt Injection Attack Demo
 * Demonstrates how malicious prompts can bypass AI safety measures
 */

"use client";

import { useState } from "react";
import { PromptPanel } from "@/components/prompt-panel";
import { ResponsePanel } from "@/components/response-panel";
import { LogsPanel } from "@/components/logs-panel";
import { MarkdownRendererControl } from "@/components/markdown-renderer-control";
import { useLogs } from "@/hooks/use-logs";
import { useAISimulation } from "@/hooks/use-ai-simulation";
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_USER_INPUT } from "@/lib/constants";

export default function PromptInjectionDemo() {
  // State for prompt configuration
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [userInput, setUserInput] = useState(DEFAULT_USER_INPUT);

  // State for markdown renderer security
  const [isSecureMarkdown, setIsSecureMarkdown] = useState(true);

  // Custom hooks for functionality
  const { logs, isConnected, error, clearLogs } = useLogs();
  const { aiResponse, isSimulating, simulateAIResponse, resetResponse } =
    useAISimulation();

  // Combined handler for input changes that resets response
  const handleInputChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      if (aiResponse) {
        resetResponse();
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Prompt Injection Attack Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Demonstrating how malicious prompts can bypass AI safety measures
            and exfiltrate sensitive data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Control Panel */}
        <MarkdownRendererControl
          isSecure={isSecureMarkdown}
          onToggle={setIsSecureMarkdown}
        />

        {/* Three Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Prompt Configuration (Wider) */}
          <div className="lg:col-span-3 flex flex-col">
            <PromptPanel
              systemPrompt={systemPrompt}
              setSystemPrompt={handleInputChange(setSystemPrompt)}
              userInput={userInput}
              setUserInput={handleInputChange(setUserInput)}
              onSimulate={simulateAIResponse}
              isSimulating={isSimulating}
            />
          </div>

          {/* Right Column - Response & Logs (Stacked) */}
          <div className="lg:col-span-2 flex flex-col space-y-6 min-h-0">
            <div className="flex-1 min-h-0">
              <ResponsePanel
                aiResponse={aiResponse}
                isSimulating={isSimulating}
                isSecureMarkdown={isSecureMarkdown}
              />
            </div>
            <div className="flex-1 min-h-0">
              <LogsPanel
                logs={logs}
                connectionStatus={isConnected ? "connected" : "disconnected"}
                error={error}
                onClearLogs={clearLogs}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
