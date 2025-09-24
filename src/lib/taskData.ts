
import { AIModel } from "./types";

export interface Task {
  name: string;
  description: string;
}

export const tasks: Task[] = [
  { name: "Search", description: "Retrieve factual or real-time information from the web or AI knowledge base." },
  { name: "Write", description: "Create blog posts, stories, essays, marketing copy, or other content." },
  { name: "Summarize", description: "Condense long articles, documents, or transcripts into key points." },
  { name: "Translate", description: "Convert text from one language to another accurately." },
  { name: "Code", description: "Help with writing, debugging, or explaining code." },
  { name: "Reason", description: "Assist with math, puzzles, or structured reasoning tasks." }
];

export const taskModelMapping: Record<string, string[]> = {
  "Search": ["Gemini", "Grok", "Deepseek"],
  "Write": ["GPT-4", "Claude", "Llama", "Mistral"],
  "Summarize": ["Claude", "GPT-4", "Gemini"],
  "Translate": ["Deepseek", "Mistral", "Llama"],
  "Code": ["GPT-4", "Deepseek", "Gemini"],
  "Reason": ["GPT-4", "Claude", "Deepseek"]
};

export const preselectModelsForTask = (taskName: string, availableModels: AIModel[]): string[] => {
  const recommendedModelNames = taskModelMapping[taskName] || [];
  return availableModels
    .filter(model => recommendedModelNames.includes(model.name))
    .map(model => model.id);
};
