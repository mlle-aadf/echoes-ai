import React, { useState } from 'react';

const taskAIPairings: { [key: string]: string[] } = {
    "Search for Info": ["Perplexity AI", "Bing Chat", "Google Bard"],
    "Generate Text": ["ChatGPT", "Claude", "Gemini"],
    "Summarize": ["Claude", "ChatGPT", "Mistral"],
    "Translate": ["DeepL", "Google Translate", "ChatGPT"],
    "Generate Code": ["OpenAI Codex", "DeepSeek Coder", "Gemini"],
    "Analyze Data": ["GPT-4 (Code Interpreter)", "IBM Watsonx"]
};

const TaskSelector: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<string>('');
    const [recommendedAIs, setRecommendedAIs] = useState<string[]>([]);

    const handleTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const task = event.target.value;
        setSelectedTask(task);
        setRecommendedAIs(taskAIPairings[task] || []);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Select a Task</h1>
            <select 
                value={selectedTask} 
                onChange={handleTaskChange} 
                className="border p-2 rounded mb-4"
            >
                <option value="">--Select a Task--</option>
                {Object.keys(taskAIPairings).map(task => (
                    <option key={task} value={task}>{task}</option>
                ))}
            </select>
            <h2 className="text-xl font-semibold mb-2">Recommended AIs</h2>
            <ul className="list-disc pl-5">
                {recommendedAIs.map(ai => (
                    <li key={ai}>{ai}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskSelector;
