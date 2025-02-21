import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

async function fetchAIResponse(url: string, prompt: string, model: string): Promise<AIResponse> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`Failed to query ${model}`);
    const data = await response.json();

    return {
      model,
      response: data.generatedText,
    };
  } catch (error) {
    console.error(`${model} Error:`, error);
    throw error;
  }
}

export async function queryOpenAI(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/generate", prompt, "GPT-4");
}

export async function queryAnthropicClaude(prompt: string): Promise<AIResponse> {
  const anthropic = new Anthropic({
    apiKey: localStorage.getItem("ANTHROPIC_API_KEY") || "",
  });

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
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

export async function queryGemini(prompt: string): Promise<AIResponse> {
  const genAI = new GoogleGenerativeAI(localStorage.getItem("GEMINI_API_KEY") || "");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedText = response.text ? response.text() : "";

    return {
      model: "Gemini",
      response: generatedText,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function queryPerplexity(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/perplexity", prompt, "Perplexity AI");
}

export async function queryBingChat(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/bingchat", prompt, "Bing Chat");
}

export async function queryGoogleBard(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/googlebard", prompt, "Google Bard");
}

export async function queryDeepL(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/deepl", prompt, "DeepL");
}

export async function queryGoogleTranslate(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/googletranslate", prompt, "Google Translate");
}

export async function queryOpenAICodex(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/openai-codex", prompt, "OpenAI Codex");
}

export async function queryDeepSeekCoder(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/deepseek-coder", prompt, "DeepSeek Coder");
}

export async function queryGPT4CodeInterpreter(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/gpt4-code-interpreter", prompt, "GPT-4 (Code Interpreter)");
}

export async function queryIBMWatsonx(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/ibm-watsonx", prompt, "IBM Watsonx");
}

export async function queryMistral(prompt: string): Promise<AIResponse> {
  return fetchAIResponse("/api/mistral", prompt, "Mistral");
}
