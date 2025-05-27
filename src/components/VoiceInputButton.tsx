
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export default function VoiceInputButton({ onTranscript, disabled = false }: VoiceInputButtonProps) {
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClick}
            disabled={disabled}
            className={`p-2 ${isListening ? 'bg-red-500/20 text-red-400' : 'text-cyan-400'} hover:bg-pink-500/20 dark:hover:bg-pink-900/30 transition-colors`}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Stop voice input" : "Start voice input"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
