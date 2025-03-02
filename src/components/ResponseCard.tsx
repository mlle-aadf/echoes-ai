
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AIResponse } from "@/lib/types";
import { useState } from "react";
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
    <Card className={`w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col ${
      isMaximized ? "absolute inset-4 z-10" : "relative"
    }`}>
      <CardHeader className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg flex flex-row items-center justify-between py-3 px-4">
        <div className="flex-1" onClick={onToggleExpand}>
          <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-lg">
            <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            {response.model}
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={onToggleExpand} 
            className="p-1 rounded-md hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            )}
          </button>
          
          <button 
            onClick={onToggleMaximize}
            className="p-1 rounded-md hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isMaximized ? (
              <Minimize className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            ) : (
              <Maximize className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            )}
          </button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="flex-1 overflow-auto">
          {response.error ? (
            <p className="text-red-500 dark:text-red-400">{response.error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">{response.response}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
