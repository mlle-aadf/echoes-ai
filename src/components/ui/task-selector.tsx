
import React, { useState, useEffect } from 'react';

const taskAIPairings: { [key: string]: string[] } = {
    "Search for Info": ["perplexity", "bingchat", "googlebard"],
    "Generate Text": ["gpt4", "claude", "gemini"],
    "Summarize": ["claude", "gpt4", "mistral"],
    "Translate": ["deepl", "googletranslate", "gpt4"],
    "Generate Code": ["openai_codex", "deepseek_coder", "gemini"],
    "Analyze Data": ["gpt4_code_interpreter", "ibm_watsonx"]
};

interface TaskSelectorProps {
  onSelectedModelsChange: (models: string[]) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ onSelectedModelsChange }) => {
    const [selectedTask, setSelectedTask] = useState<string>('');

    const handleTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const task = event.target.value;
        setSelectedTask(task);
        onSelectedModelsChange(task ? taskAIPairings[task] : []);
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select a Task</h2>
            <select 
                value={selectedTask} 
                onChange={handleTaskChange} 
                className="w-full border border-purple-200 rounded-md p-2 bg-white/50 dark:bg-gray-900/50 focus-visible:ring-purple-400"
            >
                <option value="">--Select a Task--</option>
                {Object.keys(taskAIPairings).map(task => (
                    <option key={task} value={task}>{task}</option>
                ))}
            </select>
        </div>
    );
};

export default TaskSelector;
