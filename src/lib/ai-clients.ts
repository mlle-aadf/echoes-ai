
export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options?: { model?: string; stream?: boolean }) => Promise<any>;
      };
    };
  }
}

const ensurePuter = () => {
  if (!window.puter) {
    throw new Error('Puter is not initialized');
  }
};

export async function queryOpenAI(prompt: string): Promise<AIResponse> {
  try {
    ensurePuter();
    const response = await window.puter.ai.chat(prompt, {
      model: 'gpt-4'
    });
    return {
      model: "GPT-4",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
}

export async function queryGemini(prompt: string): Promise<AIResponse> {
  try {
    ensurePuter();
    const response = await window.puter.ai.chat(prompt, {
      model: 'gemini-2.0-flash'
    });
    return {
      model: "Gemini",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function queryClaude(prompt: string): Promise<AIResponse> {
  try {
    ensurePuter();
    const response = await window.puter.ai.chat(prompt, {
      model: 'claude-3-5-sonnet'
    });
    return {
      model: "Claude",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
}

export async function queryDeepseek(prompt: string): Promise<AIResponse> {
  try {
    ensurePuter();
    const response = await window.puter.ai.chat(prompt, {
      model: 'deepseek-coder'
    });
    return {
      model: "Deepseek",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Deepseek Error:", error);
    throw error;
  }
}

export async function queryGrok(prompt: string): Promise<AIResponse> {
  try {
    ensurePuter();
    const response = await window.puter.ai.chat(prompt, {
      model: 'grok-beta',
      stream: true
    });
    return {
      model: "Grok",
      response: response.message.content[0].text,
    };
  } catch (error) {
    console.error("Grok Error:", error);
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
