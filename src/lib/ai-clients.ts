
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

export async function queryOpenAI(prompt: string): Promise<AIResponse> {
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
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("Failed to query OpenAI");
    const data = await response.json();
    
    return {
      model: "GPT-4",
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
  const apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return {
      model: "Gemini",
      response: text,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
