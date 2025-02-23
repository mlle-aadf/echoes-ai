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
        chat: (prompt: string) => Promise<string>;
      };
    };
  }
}

const MAX_TOKENS = 100; // Limit token output for cost control

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

export async function queryOpenAI(prompt: string, requireAdvanced = false): Promise<AIResponse> {
  if (!localStorage.getItem("OPENAI_API_KEY")) {
    throw new Error("OpenAI API key not found");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: requireAdvanced ? "gpt-4-turbo-preview" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) throw new Error("Failed to query OpenAI");
    const data = await response.json();
    
    return {
      model: requireAdvanced ? "GPT-4" : "GPT-3.5",
      response: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
}

export async function queryAnthropicClaude(prompt: string): Promise<AIResponse> {
  const apiKey = localStorage.getItem("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("Anthropic API key not found");
  }

  const anthropic = new Anthropic({
    apiKey,
  });

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    });

    return {
      model: "Claude",
      response: message.content[0].text,
    };
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
}

export async function queryGemini(prompt: string, requireAdvanced = false): Promise<AIResponse> {
  const apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = requireAdvanced ? "gemini-pro" : "gemini-1.0-pro";
  const model = genAI.getGenerativeModel({ model: modelName });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let responseText = '';
    
    if (response.text && typeof response.text === 'function') {
      responseText = response.text();
    } else if (response.candidates && response.candidates[0].content.parts[0].text) {
      responseText = response.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini");
    }
    
    return {
      model: requireAdvanced ? "Gemini Advanced" : "Gemini",
      response: responseText,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function queryPerplexity(prompt: string): Promise<AIResponse> {
  const apiKey = localStorage.getItem("PERPLEXITY_API_KEY");
  if (!apiKey) {
    throw new Error("Perplexity API key not found");
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Using the smaller model for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) throw new Error("Failed to query Perplexity");
    const data = await response.json();
    
    return {
      model: "Perplexity",
      response: data.choices[0].message.content,
    };
  } catch (error) {
    console.error("Perplexity Error:", error);
    throw error;
  }
}

export async function queryDeepL(prompt: string): Promise<AIResponse> {
  const apiKey = localStorage.getItem("DEEPL_API_KEY");
  if (!apiKey) {
    throw new Error("DeepL API key not found");
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: prompt,
        target_lang: 'EN',
      }),
    });

    if (!response.ok) throw new Error("Failed to query DeepL");
    const data = await response.json();
    
    return {
      model: "DeepL",
      response: data.translations[0].text,
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
