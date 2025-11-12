"use client";

import { Button } from "@/app/v2/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-500" />
      )}
      <span className="sr-only">
        {theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      </span>
    </Button>
  );
}
