
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { usePuter } from "@/hooks/usePuter";
import { queryClaude, queryDeepseek, queryGemini, queryGrok, queryOpenAI } from "@/lib/ai-clients";
import { Loader, MessageSquare, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import ModelSelector from "./ModelSelector";
import ResponseCard from "./ResponseCard";
import ViewControls from "./ViewControls";
import SettingsDropdown from "./SettingsDropdown";
import { AIModel, AIResponse, ViewLayout } from "@/lib/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function MultiAIQuery() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [maximizedCard, setMaximizedCard] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useLocalStorage<string[]>("selectedModels", ["gpt4"]);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("columns");
  const { toast } = useToast();
  const { isPuterReady, error: puterError } = usePuter();

  const availableModels: AIModel[] = [
    { id: "gpt4", name: "GPT-4", queryFn: queryOpenAI },
    { id: "gemini", name: "Gemini", queryFn: queryGemini },
    { id: "claude", name: "Claude", queryFn: queryClaude },
    { id: "deepseek", name: "Deepseek", queryFn: queryDeepseek },
    { id: "grok", name: "Grok", queryFn: queryGrok },
    // { id: "llama", name: "Meta Llama", queryFn: queryLlama },
    // { id: "mistral", name: "Mistral", queryFn: queryMistral },
    // { id: "codestral", name: "Codestral", queryFn: queryCodestral },
    // { id: "gemma", name: "Gemma", queryFn: queryGemma }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPuterReady) {
      toast({
        title: "Error",
        description: "Puter API is not ready yet. Please wait...",
        variant: "destructive",
      });
      return;
    }

    if (puterError) {
      toast({
        title: "Error",
        description: "Failed to initialize Puter API. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

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

    await queryModels();
  };

  const queryModels = async () => {
    setIsLoading(true);
    setResponses([]);
    setMaximizedCard(null);

    try {
      const selectedModelQueries = availableModels
        .filter(model => selectedModels.includes(model.id))
        .map(model => model.queryFn(prompt));

      const results = await Promise.allSettled(selectedModelQueries);

      const formattedResponses = results.map((result, index) => {
        const modelId = selectedModels[index];
        const modelName = availableModels.find(m => m.id === modelId)?.name || "Unknown";
        
        if (result.status === "fulfilled") {
          console.log("RESULTS: ", result.value);
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
      setExpandedCards(selectedModels);
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

  const toggleMaximize = (modelId: string) => {
    setMaximizedCard(prev => prev === modelId ? null : modelId);
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const getLayoutClass = () => {
    switch (viewLayout) {
      case "columns":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case "rows":
        return "grid-cols-1";
      case "tiles":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Left sidebar for model selection and input */}
      <div className="w-full lg:w-80 p-4 lg:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Multi-AI Query
          </h1>
          <SettingsDropdown viewLayout={viewLayout} setViewLayout={setViewLayout} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          <ModelSelector 
            availableModels={availableModels} 
            selectedModels={selectedModels}
            onToggleModel={toggleModel}
          />

          <div className="flex-grow flex flex-col min-h-0 mt-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="flex-grow mb-4 resize-none border-purple-200 focus-visible:ring-purple-400 min-h-[120px] bg-white/90 dark:bg-gray-900/90 shadow-md"
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

      {/* Main content area for responses */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 relative">
        {/* View controls */}
        <ViewControls 
          viewLayout={viewLayout}
          setViewLayout={setViewLayout}
          onRefresh={queryModels}
          isLoading={isLoading}
        />

        {/* Response grid */}
        <div className={`grid gap-4 ${getLayoutClass()} flex-1 overflow-y-auto relative`}>
          {isLoading ? (
            selectedModels.map((modelId) => (
              <div key={modelId} className="min-h-[200px]">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          ) : (
            responses.map((response, index) => {
              const modelId = selectedModels[index];
              const isExpanded = expandedCards.includes(modelId);
              const isMaximized = maximizedCard === modelId;

              return (
                <div 
                  key={modelId} 
                  className={`min-h-[200px] ${isMaximized ? 'col-span-full row-span-full' : ''}`}
                  style={{ zIndex: isMaximized ? 10 : 1 }}
                >
                  <ResponseCard
                    response={response}
                    isExpanded={isExpanded}
                    isMaximized={isMaximized}
                    onToggleExpand={() => toggleCard(modelId)}
                    onToggleMaximize={() => toggleMaximize(modelId)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
