
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AIResponse } from "@/lib/types";
import { ChevronDown, ChevronUp, Maximize, Minimize, MessageSquare } from "lucide-react";

interface ResponseCardProps {
  response: AIResponse;
  isExpanded: boolean;
  isMaximized: boolean;
  onToggleExpand: () => void;
  onToggleMaximize: () => void;
}

export default function ResponseCard({
  response,
  isExpanded,
  isMaximized,
  onToggleExpand,
  onToggleMaximize,
}: ResponseCardProps) {
  return (
    <Card className={`w-full h-full backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon hover:shadow-neon-lg transition-all duration-300 flex flex-col ${
      isMaximized ? "absolute inset-4 z-10" : "relative"
    } ${isExpanded ? "opacity-100" : "opacity-80 hover:opacity-100"} bg-indigo-900/40 dark:bg-gray-900/70`}>
      <CardHeader className="cursor-pointer hover:bg-indigo-800/50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg flex flex-row items-center justify-between py-3 px-4">
        <div className="flex-1" onClick={onToggleExpand}>
          <CardTitle className="flex items-center gap-2 text-cyan-300 dark:text-cyan-400 text-lg retro-text">
            <MessageSquare className="h-4 w-4 text-pink-500 dark:text-pink-400" />
            {response.model}
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleExpand} 
            className="p-1 rounded-md hover:bg-pink-500/20 dark:hover:bg-pink-900/30 transition-colors"
            aria-label={isExpanded ? "Collapse response" : "Expand response"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
            )}
          </button>
          
          <button 
            onClick={onToggleMaximize}
            className="p-1 rounded-md hover:bg-pink-500/20 dark:hover:bg-pink-900/30 transition-colors"
            aria-label={isMaximized ? "Minimize response" : "Maximize response"}
          >
            {isMaximized ? (
              <Minimize className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
            ) : (
              <Maximize className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
            )}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="flex-1 overflow-auto custom-scrollbar">
          {response.error ? (
            <p className="text-red-400 dark:text-red-300">{response.error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-cyan-100 dark:text-cyan-200 leading-relaxed">{response.response}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
