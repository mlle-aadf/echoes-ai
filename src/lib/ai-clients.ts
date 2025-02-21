
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export async function queryOpenAI(prompt: string) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("Failed to query OpenAI");
    const data = await response.json();
    
    return {
      model: "GPT-4",
      response: data.generatedText,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
}

export async function queryAnthropicClaude(prompt: string) {
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

export async function queryGemini(prompt: string) {
  const genAI = new GoogleGenerativeAI(localStorage.getItem("GEMINI_API_KEY") || "");
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
