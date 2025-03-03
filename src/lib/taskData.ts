
import { AIModel } from "./types";

export interface Task {
  name: string;
  description: string;
}

export const tasks: Task[] = [
  { name: "Search for Information", description: "Retrieve factual or real-time information from the web or AI knowledge base." },
  { name: "Generate Text", description: "Create blog posts, stories, essays, marketing copy, or other content." },
  { name: "Summarize Text", description: "Condense long articles, documents, or transcripts into key points." },
  { name: "Translate Text", description: "Convert text from one language to another accurately." },
  { name: "Code Assistance", description: "Help with writing, debugging, or explaining code." },
  { name: "Logical Problem-Solving", description: "Assist with math, puzzles, or structured reasoning tasks." }
];

export const taskModelMapping: Record<string, string[]> = {
  "Search for Information": ["Gemini", "Grok", "Deepseek"],
  "Generate Text": ["GPT-4", "Claude", "Llama"],
  "Summarize Text": ["Claude", "GPT-4", "Gemini"],
  "Translate Text": ["Deepseek", "Llama"],
  "Code Assistance": ["GPT-4", "Deepseek", "Gemini"],
  "Logical Problem-Solving": ["GPT-4", "Claude", "Deepseek"]
};

export const preselectModelsForTask = (taskName: string, availableModels: AIModel[]): string[] => {
  const recommendedModelNames = taskModelMapping[taskName] || [];
  return availableModels
    .filter(model => recommendedModelNames.includes(model.name))
    .map(model => model.id);
};
