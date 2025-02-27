
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { AIResponse } from "@/types/ai";

interface ResponseCardProps {
  response: AIResponse;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ResponseCard({ response, isExpanded, onToggle }: ResponseCardProps) {
  return (
    <Card className="w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-50/50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg"
        onClick={onToggle}
      >
        <CardTitle className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            {response.model}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {response.error ? (
            <p className="text-red-500 dark:text-red-400">{response.error}</p>
          ) : (
            <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">
              {response.response}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
