
import { AIResponse } from "@/types/ai";

export async function queryOpenAI(prompt: string): Promise<AIResponse> {
  return {
    model: "GPT-4",
    response: "This is a mock response from GPT-4",
  };
}

export async function queryGemini(prompt: string): Promise<AIResponse> {
  return {
    model: "Gemini",
    response: "This is a mock response from Gemini",
  };
}

export async function queryClaude(prompt: string): Promise<AIResponse> {
  return {
    model: "Claude",
    response: "This is a mock response from Claude",
  };
}

export async function queryDeepseek(prompt: string): Promise<AIResponse> {
  return {
    model: "Deepseek",
    response: "This is a mock response from Deepseek",
  };
}

export async function queryGrok(prompt: string): Promise<AIResponse> {
  return {
    model: "Grok",
    response: "This is a mock response from Grok",
  };
}
