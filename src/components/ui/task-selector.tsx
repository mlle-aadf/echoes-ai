import React, { useState } from 'react';

const taskAIPairings: { [key: string]: string[] } = {
    "Search for Information": ["gpt-4o-mini", "gemini-2.0-flash", "grok-beta"],
    "Generate Text": ["gpt-4o", "claude-3-5-sonnet", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"],
    "Summarize Content": ["claude-3-5-sonnet", "gpt-4o-mini", "mistral-large-latest"],
    "Translate Text": ["gpt-4o-mini", "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", "google/gemma-2-27b-it"],
    "Generate Code": ["codestral-latest", "gpt-4o", "deepseek-chat"],
    "Analyze Data": ["gpt-4o-mini", "deepseek-reasoner", "gemini-1.5-flash"],
    "Automate Workflows": ["gpt-4o", "grok-beta", "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo"],
    "Make Predictions": ["gpt-4o-mini", "deepseek-reasoner", "gemini-1.5-flash"],
    "Text-to-Speech": ["claude-3-5-sonnet", "gpt-4o-mini", "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"]
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
