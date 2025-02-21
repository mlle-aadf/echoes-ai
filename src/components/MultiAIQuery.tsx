
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIResponse {
  model: string;
  response: string;
  error?: string;
}

export default function MultiAIQuery() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponses([]);

    try {
      const results = await Promise.allSettled([
        queryOpenAI(prompt),
        queryAnthropicClaude(prompt),
        queryGemini(prompt),
      ]);

      const formattedResponses = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          return {
            model: getModelName(index),
            response: "",
            error: "Failed to get response",
          };
        }
      });

      setResponses(formattedResponses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to query AI models",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getModelName = (index: number) => {
    const models = ["GPT-4", "Claude", "Gemini"];
    return models[index];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Multi-AI Query</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-[100px] mb-4"
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Querying AIs...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Query All AIs
            </>
          )}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="w-full">
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
          responses.map((response, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {response.model}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {response.error ? (
                  <p className="text-destructive">{response.error}</p>
                ) : (
                  <p className="whitespace-pre-wrap">{response.response}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
