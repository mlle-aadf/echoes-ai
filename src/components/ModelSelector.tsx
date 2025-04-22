
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AIModel } from "@/lib/types";
import { Bot, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Expanded model descriptions with more context
const modelDescriptions: Record<string, { description: string; strengths: string[] }> = {
  gpt4: {
    description: "Advanced language model by OpenAI",
    strengths: ["Complex reasoning", "Creative tasks", "Multitask capabilities"]
  },
  gemini: {
    description: "Google's large language model",
    strengths: ["Broad knowledge", "Reasoning", "Multimodal understanding"]
  },
  claude: {
    description: "Anthropic's AI assistant",
    strengths: ["Detailed writing", "Ethical reasoning", "Long context understanding"]
  },
  deepseek: {
    description: "Specialized coding and technical model",
    strengths: ["Code generation", "Technical problem-solving", "Programming tasks"]
  },
  grok: {
    description: "Witty AI with real-time information",
    strengths: ["Conversational style", "Up-to-date knowledge", "Humor"]
  },
  llama: {
    description: "Meta's open-source language model",
    strengths: ["Open research", "Broad capabilities", "Customizability"]
  },
  mistral: {
    description: "High-performance European AI model",
    strengths: ["Efficient reasoning", "Multilingual support", "Compact design"]
  },
  gemma: {
    description: "Google's lightweight open model",
    strengths: ["Efficient processing", "Versatile tasks", "Accessible AI"]
  }
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
    <TooltipProvider delayDuration={100}>
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
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-pink-400/70 opacity-50 hover:opacity-100 transition-opacity" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        className="bg-indigo-950/90 border-pink-500/30 text-cyan-100 max-w-[250px] p-3 rounded-lg shadow-neon"
                      >
                        <div className="space-y-2">
                          <h4 className="font-bold text-pink-400 mb-1">{model.name}</h4>
                          <p className="text-sm opacity-80 mb-2">
                            {modelDescriptions[model.id]?.description || `${model.name} AI assistant`}
                          </p>
                          {modelDescriptions[model.id]?.strengths && (
                            <div>
                              <h5 className="text-xs text-cyan-300 mb-1">Strengths:</h5>
                              <ul className="list-disc list-inside text-xs space-y-1 opacity-70">
                                {modelDescriptions[model.id].strengths.map((strength, index) => (
                                  <li key={index}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-indigo-950/90 border-pink-500/30 text-cyan-100 max-w-[200px]"
                >
                  {modelDescriptions[model.id]?.description || `${model.name} AI assistant`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

