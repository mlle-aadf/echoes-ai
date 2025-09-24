
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Bot, Command, MessageSquare, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface CommandPaletteProps {
  onSelectTheme: (theme: "light" | "dark") => void;
  onSelectAction: (action: string) => void;
  availableModels: string[];
}

export function CommandPalette({ onSelectTheme, onSelectAction, availableModels }: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);
  const { theme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectTheme = (selectedTheme: "light" | "dark") => {
    onSelectTheme(selectedTheme);
    setOpen(false);
  };

  const handleSelectAction = (action: string) => {
    onSelectAction(action);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center p-2 rounded-md bg-indigo-900/30 dark:bg-gray-800/30 border border-pink-300/30 dark:border-pink-800/30 text-cyan-300 dark:text-cyan-400 hover:bg-indigo-800/40 dark:hover:bg-gray-700/40 transition-colors"
        aria-label="Open command palette"
      >
        <Command className="h-4 w-4" />
        <span className="sr-only">Command palette</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="custom-scrollbar">
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={() => handleSelectTheme("light")}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
              {theme === "light" && <span className="ml-auto text-pink-500">✓</span>}
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectTheme("dark")}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
              {theme === "dark" && <span className="ml-auto text-pink-500">✓</span>}
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => handleSelectAction("new-query")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>New Query</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelectAction("settings")}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Available Bots">
            {availableModels.map((model) => (
              <CommandItem
                key={model}
                onSelect={() => handleSelectAction(`select-model-${model}`)}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                <span>{model}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
