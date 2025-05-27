
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { tasks, preselectModelsForTask } from "@/lib/taskData";
import { AIModel } from "@/lib/types";
import { ChevronDown, LightbulbIcon } from "lucide-react";

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
        <h4 className="text-lg font-semibold mb-3 text-cyan-300 dark:text-cyan-400 flex items-center gap-2 retro-text">
          <LightbulbIcon className="h-4 w-4 text-pink-500 pixel-art" />
          Suggested Tasks
        </h4>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50"
            >
              Select a task...
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-full min-w-[250px] bg-indigo-950/95 border-pink-300/30 backdrop-blur-sm"
            align="start"
          >
            {tasks.map((task) => (
              <DropdownMenuItem
                key={task.name}
                onClick={() => handleTaskSelect(task.name)}
                className="text-cyan-200 hover:bg-indigo-800/50 focus:bg-indigo-800/50 cursor-pointer p-3"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold">{task.name}</span>
                  <span className="text-xs text-cyan-300/70">{task.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
