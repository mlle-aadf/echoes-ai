
import { Card, CardContent } from "@/components/ui/card";
import { preselectModelsForTask, tasks } from "@/lib/taskData";
import { AIModel } from "@/lib/types";
import { LightbulbIcon } from "lucide-react";
import { Button } from "./ui/button";

interface TaskSelectorProps {
  availableModels: AIModel[];
  onSelectTask: (modelIds: string[]) => void;
}

export default function TaskSelector({
  availableModels,
  onSelectTask,
}: TaskSelectorProps) {
  const handleTaskSelect = (taskName: string) => {
    const modelIds = preselectModelsForTask(taskName, availableModels);
    onSelectTask(modelIds);
  };

  return (
    <Card className="bg-indigo-900/40 dark:bg-gray-900/70 backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon">
      <CardContent className="p-4">
        <h4 className="text-lg font-semibold mb-3 text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text whitespace-nowrap overflow-hidden text-ellipsis">
          <LightbulbIcon className="h-4 w-4 text-pink-500 pixel-art" />
          Tasks
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-[calc(50vh-80px)] overflow-y-auto pr-2 custom-scrollbar">
          {tasks.map((task) => (
            <Button
              key={task.name}
              onClick={() => handleTaskSelect(task.name)}
              variant="outline"
              className="text-sm p-2 h-auto border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50 flex flex-col items-start"
              title={task.description}
            >
              <span className="font-semibold">{task.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
