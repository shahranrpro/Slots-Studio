"use client";

import React, { useRef } from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { useAppearance } from "./ThemeProvider";
import { THEME_MODES, type AppearanceMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

export interface AppearanceSelectorProps {
  /**
   * Optional custom classes for the selector container.
   */
  className?: string;
  /**
   * Layout orientation. Default is "horizontal".
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Size variant of the control buttons.
   */
  size?: "sm" | "md";
}

const ICONS: Record<AppearanceMode, React.ElementType> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

/**
 * Accessible, technical segmented appearance selector for Slots Studio.
 * Supports exactly three modes: Default (System), Light, and Dark.
 */
export function AppearanceSelector({
  className,
  orientation = "horizontal",
  size = "md",
}: AppearanceSelectorProps) {
  const { appearance, setAppearance } = useAppearance();
  const containerRef = useRef<HTMLDivElement>(null);

  const options = Object.values(THEME_MODES);

  // Handle keyboard navigation between options
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (orientation === "horizontal") {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (index + 1) % options.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (index - 1 + options.length) % options.length;
      }
    } else {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        nextIndex = (index + 1) % options.length;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = (index - 1 + options.length) % options.length;
      }
    }

    if (nextIndex !== index) {
      const targetOption = options[nextIndex];
      setAppearance(targetOption.value);
      // Focus target element
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Appearance Mode"
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-1",
        orientation === "vertical" ? "flex-col gap-1 w-full" : "flex-row gap-1",
        className
      )}
    >
      {options.map((option, index) => {
        const isSelected = appearance === option.value;
        const IconComponent = ICONS[option.value];

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => setAppearance(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "group relative flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium transition-all duration-150",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs",
              orientation === "vertical" && "w-full justify-start",
              isSelected
                ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold shadow-xs"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-secondary)]",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
            )}
          >
            {/* Active Accent Indicator Dot */}
            {isSelected && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            )}

            <IconComponent
              className={cn(
                "shrink-0 transition-colors",
                size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
                isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
              )}
              aria-hidden="true"
            />

            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
