
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AIModel } from "@/lib/types";
import { Bot, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

// Model descriptions for tooltips
const modelDescriptions: Record<string, string> = {
  gpt4: "Powerful language model for complex reasoning and creative tasks",
  gemini: "Google's large language model with strong reasoning capabilities",
  claude: "Anthropic's AI assistant with detailed writing and reasoning",
  deepseek: "Advanced model optimized for coding and technical tasks",
  grok: "Witty and conversational model with real-time information",
  llama: "Meta's large language model with broad capabilities",
  mistral: "High-performance model with excellent reasoning abilities",
  gemma: "Google's lightweight yet powerful open model"
};

export default function ModelSelector({
  availableModels,
  selectedModels,
  onToggleModel,
}: ModelSelectorProps) {
  const sortedModels = availableModels.sort((a, b) => {
    const aSelected = selectedModels.includes(a.id);
    const bSelected = selectedModels.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <TooltipProvider>
      <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon h-auto max-h-[30vh]">
        <CardContent className="p-4">
          <h4 className="text-base font-semibold mb-3 text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text text-center">
            <Bot className="h-4 w-4 text-pink-500 pixel-art flex-shrink-0" />
            <span className="truncate tracking-wider">Choose Bots</span>
          </h4>
          <div className="space-y-3 max-h-[calc(30vh-80px)] overflow-y-auto pr-2 custom-scrollbar">
            {sortedModels.map((model) => (
              <Tooltip key={model.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center space-x-2 hover:bg-indigo-800/40 dark:hover:bg-gray-800/40 p-2 rounded-md transition-colors ${
                      selectedModels.includes(model.id)
                        ? "bg-indigo-800/50 dark:bg-gray-800/50 border-l-4 border-cyan-400"
                        : ""
                    }`}
                  >
                    <Checkbox
                      id={model.id}
                      checked={selectedModels.includes(model.id)}
                      onCheckedChange={() => onToggleModel(model.id)}
                      className="border-pink-400 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <label
                      htmlFor={model.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-cyan-200 flex-1"
                    >
                      {model.name}
                    </label>
                    <HelpCircle className="h-3 w-3 text-pink-400/70 opacity-50 hover:opacity-100 transition-opacity" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-indigo-950/90 border-pink-500/30 text-cyan-100 max-w-[200px]">
                  {modelDescriptions[model.id] || `${model.name} AI assistant`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
