
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIResponse } from "@/lib/types";
import { useExport } from "@/hooks/useExport";
import { Download, FileText, Code, Copy } from "lucide-react";

interface ExportDropdownProps {
  prompt: string;
  responses: AIResponse[];
  disabled?: boolean;
}

export default function ExportDropdown({ prompt, responses, disabled = false }: ExportDropdownProps) {
  const { exportToMarkdown, exportToJSON, exportToText, copyToClipboard } = useExport();

  if (!prompt.trim() || responses.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="border-pink-300/30 dark:border-pink-800/30 bg-indigo-800/30 dark:bg-gray-800/30 text-cyan-200 hover:bg-indigo-700/50 dark:hover:bg-gray-700/50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-indigo-950/95 border-pink-300/30 backdrop-blur-sm"
        align="end"
      >
        <DropdownMenuItem
          onClick={() => exportToMarkdown(prompt, responses)}
          className="text-cyan-200 hover:bg-indigo-800/50 focus:bg-indigo-800/50 cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportToJSON(prompt, responses)}
          className="text-cyan-200 hover:bg-indigo-800/50 focus:bg-indigo-800/50 cursor-pointer"
        >
          <Code className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => exportToText(prompt, responses)}
          className="text-cyan-200 hover:bg-indigo-800/50 focus:bg-indigo-800/50 cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => copyToClipboard(prompt, responses)}
          className="text-cyan-200 hover:bg-indigo-800/50 focus:bg-indigo-800/50 cursor-pointer"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
