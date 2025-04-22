
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AIResponse, ViewLayout } from "@/lib/types";
import { ChevronDown, ChevronUp, Maximize, Minimize, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponseCardProps {
  response: AIResponse;
  isExpanded: boolean;
  isMaximized: boolean;
  onToggleExpand: () => void;
  onToggleMaximize: () => void;
  viewLayout: ViewLayout;
}

export default function ResponseCard({
  response,
  isExpanded,
  isMaximized,
  onToggleExpand,
  onToggleMaximize,
  viewLayout,
}: ResponseCardProps) {
  const isVerticalTab = viewLayout === "columns" && !isExpanded;

  return (
    <Card 
      className={cn(
        "w-full backdrop-blur-sm border-pink-300/30 dark:border-pink-800/30 shadow-neon transition-all duration-300 flex relative",
        isVerticalTab ? 'flex-row' : 'flex-col',
        isMaximized ? "absolute inset-4 z-10 overflow-hidden animate-scale-in" : "relative",
        isExpanded ? "opacity-100 h-full gradient-border" : "opacity-80 hover:opacity-100 h-auto",
        "bg-indigo-900/40 dark:bg-gray-900/70 focus-within:ring-2 focus-within:ring-cyan-500/50"
      )}
      tabIndex={0}
      aria-expanded={isExpanded}
      role="region"
    >
      <CardHeader 
        className={cn(
          "cursor-pointer hover:bg-indigo-800/50 dark:hover:bg-gray-800/50 transition-colors",
          isVerticalTab ? 'rounded-l-lg py-2 px-1 flex flex-col items-center justify-center w-8 animate-fade-in' : 
                         'rounded-t-lg flex flex-row items-center justify-between py-3 px-4'
        )}
        onClick={isVerticalTab ? onToggleExpand : undefined}
      >
        <div 
          className={cn(
            isVerticalTab ? 'flex-1 -rotate-90 whitespace-nowrap transform origin-center' : 'flex-1'
          )} 
          onClick={isVerticalTab ? undefined : onToggleExpand}
        >
          <CardTitle className={cn(
            "flex text-cyan-300 dark:text-cyan-400 retro-text",
            isVerticalTab ? 'items-end justify-center text-base' : 'items-center gap-2 text-lg'
          )}>
            {!isVerticalTab && <MessageSquare className="h-4 w-4 text-pink-500 dark:text-pink-400" />}
            {response.model}
          </CardTitle>
        </div>
        
        {!isVerticalTab && (
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleExpand} 
              className="p-1 rounded-md hover:bg-pink-500/20 dark:hover:bg-pink-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label={isExpanded ? "Collapse response" : "Expand response"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
              )}
            </button>
            
            {isExpanded && (
              <button 
                onClick={onToggleMaximize}
                className="p-1 rounded-md hover:bg-pink-500/20 dark:hover:bg-pink-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                aria-label={isMaximized ? "Minimize response" : "Maximize response"}
              >
                {isMaximized ? (
                  <Minimize className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
                ) : (
                  <Maximize className="h-4 w-4 text-cyan-400 dark:text-cyan-500" />
                )}
              </button>
            )}
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="flex-1 overflow-auto custom-scrollbar animate-fade-in">
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
