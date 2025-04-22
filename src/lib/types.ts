export interface AIModel {
  id: string;
  name: string;
  queryFn: (prompt: string) => Promise<AIResponse>;
}

export interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

// Make sure ViewLayout doesn't include 'tiles'
export type ViewLayout = "columns" | "rows";

export interface Task {
  name: string;
  description: string;
}
