"use client";

import React from "react";
import {
  Camera,
  User,
  Shirt,
  Building,
  ZoomIn,
  Sparkles,
} from "lucide-react";
import { type VisualMode } from "../types";

export interface VisualModeSelectorProps {
  activeMode: VisualMode;
  onSelectMode: (mode: VisualMode) => void;
  disabled?: boolean;
}

interface ModeOption {
  id: VisualMode;
  label: string;
  code: string;
  description: string;
  icon: React.ElementType;
}

const MODES: ModeOption[] = [
  {
    id: "studio",
    label: "Studio",
    code: "01",
    description: "Isolated studio photography with clean lighting and neutral cyc.",
    icon: Camera,
  },
  {
    id: "model",
    label: "Model",
    code: "02",
    description: "High-fashion & athletic styling on fit models with dynamic poses.",
    icon: User,
  },
  {
    id: "mannequin",
    label: "Mannequin",
    code: "03",
    description: "Structured tailor forms showing fit tension lines and garment drape.",
    icon: Shirt,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    code: "04",
    description: "Contextual environments highlighting real-world product ergonomics.",
    icon: Building,
  },
  {
    id: "detail",
    label: "Detail",
    code: "05",
    description: "Ultra-fine macro inspection of technical fabrics, seams, and hardware.",
    icon: ZoomIn,
  },
  {
    id: "editorial",
    label: "Editorial",
    code: "06",
    description: "Cinematic narrative lighting and bold asymmetrical campaign compositions.",
    icon: Sparkles,
  },
];

export function VisualModeSelector({
  activeMode,
  onSelectMode,
  disabled = false,
}: VisualModeSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % MODES.length;
      onSelectMode(MODES[nextIndex].id);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + MODES.length) % MODES.length;
      onSelectMode(MODES[nextIndex].id);
    }
  };

  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
          VISUAL MODE
        </h2>
        <span className="font-mono text-[10px] text-[var(--accent)] font-semibold uppercase">
          MODE {MODES.find((m) => m.id === activeMode)?.code} ACTIVE
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Visual Studio Generation Modes"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
      >
        {MODES.map((mode, index) => {
          const isSelected = activeMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
              onClick={() => onSelectMode(mode.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`group relative flex flex-col justify-between p-3 rounded-[var(--radius-md)] border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-[var(--surface-3)] border-[var(--accent)] text-[var(--text-primary)] shadow-xs ring-1 ring-[var(--accent)]/50"
                  : "bg-[var(--surface-1)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]"
              } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              {/* Top Row: Icon & Code */}
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border ${
                    isSelected
                      ? "bg-[var(--accent)] text-black border-[var(--accent)]"
                      : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] group-hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4 stroke-[2.2]" />
                </div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] font-bold">
                  {mode.code}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5">
                <span
                  className={`text-xs font-bold block ${
                    isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {mode.label}
                </span>
                <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-tight">
                  {mode.description}
                </p>
              </div>

              {/* Active Indicator Bar */}
              {isSelected && (
                <div className="absolute -bottom-px left-3 right-3 h-[2px] bg-[var(--accent)] rounded-t" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
