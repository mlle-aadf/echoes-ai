
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string }) => Promise<any>;
      };
    };
  }
}

export async function queryPuter(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt);
    return {
      model: "Puter GPT-4o mini",
      response: response,
    };
  } catch (error) {
    console.error("Puter Error:", error);
    throw error;
  }
}

export async function queryGemini(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt, {
      model: 'gemini-2.0-flash'
    });
    return {
      model: "Gemini via Puter",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function queryAnthropicClaude(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt, {
      model: 'claude-3-5-sonnet'
    });
    return {
      model: "Claude via Puter",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
}

export async function queryPerplexity(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt, {
      model: 'perplexity-7b-chat'
    });
    return {
      model: "Perplexity via Puter",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Perplexity Error:", error);
    throw error;
  }
}

export async function queryDeepL(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt, {
      model: 'deepl-translator'
    });
    return {
      model: "DeepL via Puter",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("DeepL Error:", error);
    throw error;
  }
}

// Simple in-memory cache for responses
const responseCache = new Map<string, AIResponse>();

export async function queryCachedAI(
  prompt: string, 
  queryFn: (prompt: string) => Promise<AIResponse>
): Promise<AIResponse> {
  const cacheKey = `${queryFn.name}-${prompt}`;
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  const response = await queryFn(prompt);
  responseCache.set(cacheKey, response);
  return response;
}
