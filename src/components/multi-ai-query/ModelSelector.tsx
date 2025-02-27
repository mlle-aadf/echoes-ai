
import { Checkbox } from "@/components/ui/checkbox";
import { AIModel } from "@/types/ai";

interface ModelSelectorProps {
  models: AIModel[];
  selectedModels: string[];
  onModelToggle: (modelId: string) => void;
}

export default function ModelSelector({ models, selectedModels, onModelToggle }: ModelSelectorProps) {
  const sortedModels = models.sort((a, b) => {
    const aSelected = selectedModels.includes(a.id);
    const bSelected = selectedModels.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="mb-6 overflow-y-auto max-h-50 pr-2 custom-scrollbar">
      <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select AI Models</h2>
      <div className="space-y-3">
        {sortedModels.map((model) => (
          <div 
            key={model.id} 
            className={`flex items-center space-x-2 hover:bg-purple-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors ${
              selectedModels.includes(model.id) ? 'bg-purple-50 dark:bg-gray-800' : ''
            }`}
          >
            <Checkbox
              id={model.id}
              checked={selectedModels.includes(model.id)}
              onCheckedChange={() => onModelToggle(model.id)}
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
  );
}
