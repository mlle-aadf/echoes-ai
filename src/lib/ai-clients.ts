
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

export async function queryOpenAI(prompt: string): Promise<AIResponse> {
  try {
    const response = await window.puter.ai.chat(prompt, {
      model: 'gpt-4'
    });
    return {
      model: "GPT-4 via Puter",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
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
