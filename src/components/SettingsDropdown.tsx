
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewLayout } from "@/lib/types";
import { Columns, Grid, Moon, Rows, Settings, Sun } from "lucide-react";
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
              className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-gray-800"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <Card className="absolute right-0 z-50 mt-2 w-64 p-4 bg-white/95 dark:bg-gray-900/95 border-purple-100 dark:border-gray-700 shadow-lg backdrop-blur-sm animate-fade-in rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Theme</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Light</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm">Dark</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Layout</h3>
              <div className="flex items-center justify-between gap-2">
                <Toggle
                  pressed={viewLayout === "columns"}
                  onPressedChange={() => setViewLayout("columns")}
                  className="flex-1 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-purple-400"
                  aria-label="Columns layout"
                >
                  <Columns className="h-4 w-4 mr-2" />
                  Columns
                </Toggle>
                <Toggle
                  pressed={viewLayout === "rows"}
                  onPressedChange={() => setViewLayout("rows")}
                  className="flex-1 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-purple-400"
                  aria-label="Rows layout"
                >
                  <Rows className="h-4 w-4 mr-2" />
                  Rows
                </Toggle>
                <Toggle
                  pressed={viewLayout === "tiles"}
                  onPressedChange={() => setViewLayout("tiles")}
                  className="flex-1 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-600 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-purple-400"
                  aria-label="Tiles layout"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Tiles
                </Toggle>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
