
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { AIModel } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface ModelSelectorProps {
  availableModels: AIModel[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

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
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-md h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          Select AI Models
        </h2>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {sortedModels.map((model) => (
            <div
              key={model.id}
              className={`flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors ${
                selectedModels.includes(model.id)
                  ? "bg-purple-50 dark:bg-gray-800"
                  : ""
              }`}
            >
              <Checkbox
                id={model.id}
                checked={selectedModels.includes(model.id)}
                onCheckedChange={() => onToggleModel(model.id)}
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
      </CardContent>
    </Card>
  );
}
