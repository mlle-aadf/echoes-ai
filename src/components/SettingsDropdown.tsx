
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewLayout } from "@/lib/types";
import { Columns, Moon, Rows, Settings, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";

interface SettingsDropdownProps {
  viewLayout: ViewLayout;
  setViewLayout: (layout: ViewLayout) => void;
}

export default function SettingsDropdown({ viewLayout, setViewLayout }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [persistedLayout, setPersistedLayout] = useLocalStorage<ViewLayout>("viewLayout", "columns");

  // Update the view layout when the component mounts
  useEffect(() => {
    if (persistedLayout) {
      setViewLayout(persistedLayout);
    }
  }, [persistedLayout, setViewLayout]);

  // Save the layout to localStorage when it changes
  useEffect(() => {
    setPersistedLayout(viewLayout);
  }, [viewLayout, setPersistedLayout]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDropdown}
              className="text-cyan-400 dark:text-cyan-300 hover:bg-pink-500/20 dark:hover:bg-pink-900/30"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-indigo-900/80 text-cyan-200 border-pink-300/30">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <Card className="absolute right-0 z-50 mt-2 w-64 p-4 bg-indigo-900/80 dark:bg-gray-900/80 border-pink-300/30 dark:border-pink-800/30 shadow-neon backdrop-blur-sm animate-fade-in rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-cyan-300 dark:text-cyan-400">Theme</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-cyan-200">Light</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-cyan-500"
                />
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-300" />
                  <span className="text-sm text-cyan-200">Dark</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-cyan-300 dark:text-cyan-400">Layout</h3>
              <div className="flex flex-col gap-2">
                <Toggle
                  pressed={viewLayout === "columns"}
                  onPressedChange={() => setViewLayout("columns")}
                  className="justify-start data-[state=on]:bg-pink-500/30 data-[state=on]:text-cyan-400 dark:data-[state=on]:bg-pink-900/30 dark:data-[state=on]:text-cyan-300"
                  aria-label="Columns layout"
                >
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                </Toggle>
                <Toggle
                  pressed={viewLayout === "rows"}
                  onPressedChange={() => setViewLayout("rows")}
                  className="justify-start data-[state=on]:bg-pink-500/30 data-[state=on]:text-cyan-400 dark:data-[state=on]:bg-pink-900/30 dark:data-[state=on]:text-cyan-300"
                  aria-label="Rows layout"
                >
                  <Rows className="h-4 w-4 mr-2" />
                  Rows
                </Toggle>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
