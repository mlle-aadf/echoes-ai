
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { queryOpenAI, queryAnthropicClaude, queryGemini } from "@/lib/ai-clients";

interface AIModel {
  id: string;
  name: string;
  queryFn: (prompt: string) => Promise<AIResponse>;
}

interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

export default function MultiAIQuery() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt4", "claude", "gemini"]);
  const { toast } = useToast();

  const availableModels: AIModel[] = [
    { id: "gpt4", name: "GPT-4", queryFn: queryOpenAI },
    { id: "claude", name: "Claude", queryFn: queryAnthropicClaude },
    { id: "gemini", name: "Gemini", queryFn: queryGemini },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (selectedModels.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one AI model",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponses([]);

    try {
      const selectedModelQueries = availableModels
        .filter(model => selectedModels.includes(model.id))
        .map(model => model.queryFn(prompt));

      const results = await Promise.allSettled(selectedModelQueries);

      const formattedResponses = results.map((result, index) => {
        const modelId = selectedModels[index];
        const modelName = availableModels.find(m => m.id === modelId)?.name || "Unknown";
        
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return {
            model: modelName,
            response: "",
            error: "Failed to get response",
          };
        }
      });

      setResponses(formattedResponses);
      setExpandedCards(selectedModels); // Expand all cards by default
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to query AI models",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (modelId: string) => {
    setExpandedCards(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Multi-AI Query</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select AI Models</h2>
          <div className="flex flex-wrap gap-4">
            {availableModels.map((model) => (
              <div key={model.id} className="flex items-center space-x-2">
                <Checkbox
                  id={model.id}
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={() => toggleModel(model.id)}
                />
                <label
                  htmlFor={model.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {model.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px] mb-4"
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Querying Selected AIs...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Query Selected AIs
            </>
          )}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          selectedModels.map((modelId) => (
            <Card key={modelId} className="w-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          responses.map((response, index) => {
            const modelId = selectedModels[index];
            const isExpanded = expandedCards.includes(modelId);

            return (
              <Card key={modelId} className="w-full">
                <CardHeader className="cursor-pointer" onClick={() => toggleCard(modelId)}>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {response.model}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    {response.error ? (
                      <p className="text-destructive">{response.error}</p>
                    ) : (
                      <p className="whitespace-pre-wrap">{response.response}</p>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
}
