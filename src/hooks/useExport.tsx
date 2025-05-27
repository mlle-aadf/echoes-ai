
import { useCallback } from 'react';
import { AIResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useExport = () => {
  const { toast } = useToast();

  const exportToMarkdown = useCallback((prompt: string, responses: AIResponse[]) => {
    let markdown = `# AI Query Results\n\n**Prompt:** ${prompt}\n\n`;
    
    responses.forEach((response, index) => {
      markdown += `## ${response.model}\n\n`;
      if (response.error) {
        markdown += `**Error:** ${response.error}\n\n`;
      } else {
        markdown += `${response.response}\n\n`;
      }
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-query-results-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Results exported as Markdown file",
    });
  }, [toast]);

  const exportToJSON = useCallback((prompt: string, responses: AIResponse[]) => {
    const data = {
      timestamp: new Date().toISOString(),
      prompt,
      responses,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-query-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Results exported as JSON file",
    });
  }, [toast]);

  const exportToText = useCallback((prompt: string, responses: AIResponse[]) => {
    let text = `AI Query Results\n${'='.repeat(50)}\n\nPrompt: ${prompt}\n\n`;
    
    responses.forEach((response, index) => {
      text += `${response.model}\n${'-'.repeat(response.model.length)}\n`;
      if (response.error) {
        text += `Error: ${response.error}\n\n`;
      } else {
        text += `${response.response}\n\n`;
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-query-results-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Results exported as text file",
    });
  }, [toast]);

  const copyToClipboard = useCallback(async (prompt: string, responses: AIResponse[]) => {
    let text = `Prompt: ${prompt}\n\n`;
    
    responses.forEach((response, index) => {
      text += `${response.model}: `;
      if (response.error) {
        text += `Error - ${response.error}\n\n`;
      } else {
        text += `${response.response}\n\n`;
      }
    });

    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Results copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    exportToMarkdown,
    exportToJSON,
    exportToText,
    copyToClipboard,
  };
};
