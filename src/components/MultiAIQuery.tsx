import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { queryAnthropicClaude, queryBingChat, queryDeepL, queryDeepSeekCoder, queryGemini, queryGoogleBard, queryGoogleTranslate, queryGPT4CodeInterpreter, queryIBMWatsonx, queryMistral, queryOpenAI, queryOpenAICodex, queryPerplexity } from "@/lib/ai-clients";
import { ChevronDown, ChevronUp, Loader, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import TaskSelector from "./ui/task-selector";

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
    { id: "perplexity", name: "Perplexity AI", queryFn: queryPerplexity },
    { id: "bingchat", name: "Bing Chat", queryFn: queryBingChat },
    { id: "googlebard", name: "Google Bard", queryFn: queryGoogleBard },
    { id: "deepl", name: "DeepL", queryFn: queryDeepL },
    { id: "googletranslate", name: "Google Translate", queryFn: queryGoogleTranslate },
    { id: "openai_codex", name: "OpenAI Codex", queryFn: queryOpenAICodex },
    { id: "deepseek_coder", name: "DeepSeek Coder", queryFn: queryDeepSeekCoder },
    { id: "gpt4_code_interpreter", name: "GPT-4 (Code Interpreter)", queryFn: queryGPT4CodeInterpreter },
    { id: "ibm_watsonx", name: "IBM Watsonx", queryFn: queryIBMWatsonx },
    { id: "mistral", name: "Mistral", queryFn: queryMistral }
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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Left Panel */}
      <div className="w-80 border-r bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Multi-AI Query
        </h1>
        
        <TaskSelector/>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select AI Models</h2>
            <div className="space-y-3">
              {availableModels.map((model) => (
                <div key={model.id} className="flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                  <Checkbox
                    id={model.id}
                    checked={selectedModels.includes(model.id)}
                    onCheckedChange={() => toggleModel(model.id)}
                    className="border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label
                    htmlFor={model.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {model.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-grow mb-4 min-h-[200px] resize-none border-purple-200 focus-visible:ring-purple-400 bg-white/50 dark:bg-gray-900/50"
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Querying...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Query Selected AIs
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div 
          className="grid gap-6" 
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, selectedModels.length)}, minmax(0, 1fr))`
          }}
        >
          {isLoading ? (
            selectedModels.map((modelId) => (
              <Card key={modelId} className="w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-lg">
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
                <Card key={modelId} className="w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg" onClick={() => toggleCard(modelId)}>
                    <CardTitle className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        {response.model}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent>
                      {response.error ? (
                        <p className="text-red-500 dark:text-red-400">{response.error}</p>
                      ) : (
                        <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">{response.response}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
