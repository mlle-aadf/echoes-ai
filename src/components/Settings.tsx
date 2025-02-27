
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Sun, Moon, LayoutGrid, LayoutList } from "lucide-react";

interface SettingsProps {
  onLayoutChange: (layout: "vertical" | "horizontal") => void;
}

export default function Settings({ onLayoutChange }: SettingsProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [layout, setLayout] = useState<"vertical" | "horizontal">(
    localStorage.getItem("layout") as "vertical" | "horizontal" || "vertical"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("layout", layout);
    onLayoutChange(layout);
  }, [layout, onLayoutChange]);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple-100 dark:hover:bg-purple-900/30"
        >
          <Settings2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 animate-in fade-in-0 zoom-in-95 bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              ) : (
                <Sun className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Dark Mode
              </span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>
        <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-900" />
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Layout
          </p>
          <div className="space-y-1">
            <DropdownMenuItem
              className={`flex items-center space-x-2 cursor-pointer ${
                layout === "vertical"
                  ? "bg-purple-50 dark:bg-purple-900/30"
                  : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
              }`}
              onClick={() => setLayout("vertical")}
            >
              <LayoutList className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Vertical
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`flex items-center space-x-2 cursor-pointer ${
                layout === "horizontal"
                  ? "bg-purple-50 dark:bg-purple-900/30"
                  : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
              }`}
              onClick={() => setLayout("horizontal")}
            >
              <LayoutGrid className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Horizontal
              </span>
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
