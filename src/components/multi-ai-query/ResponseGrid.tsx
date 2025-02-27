
import { Skeleton } from "@/components/ui/skeleton";
import ResponseCard from "./ResponseCard";
import { AIResponse } from "@/types/ai";

interface ResponseGridProps {
  isLoading: boolean;
  selectedModels: string[];
  responses: AIResponse[];
  expandedCards: string[];
  layout: "vertical" | "horizontal";
  onCardToggle: (modelId: string) => void;
}

export default function ResponseGrid({
  isLoading,
  selectedModels,
  responses,
  expandedCards,
  layout,
  onCardToggle,
}: ResponseGridProps) {
  return (
    <div 
      className={`grid gap-6 ${
        layout === "vertical" 
          ? `grid-cols-1 ${selectedModels.length > 0 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`
          : `grid-cols-${Math.max(1, selectedModels.length)}`
      }`}
    >
      {isLoading ? (
        selectedModels.map((modelId) => (
          <Card key={modelId} className="w-full h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-purple-100 dark:border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))
      ) : (
        responses.map((response, index) => {
          const modelId = selectedModels[index];
          return (
            <ResponseCard
              key={modelId}
              response={response}
              isExpanded={expandedCards.includes(modelId)}
              onToggle={() => onCardToggle(modelId)}
            />
          );
        })
      )}
    </div>
  );
}
