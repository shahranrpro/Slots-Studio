"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ProjectSearch({ value, onChange, className }: ProjectSearchProps) {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
      <input
        type="text"
        placeholder="Search projects, SLOT IDs, or briefs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] py-2 pl-9 pr-9 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          aria-label="Clear search query"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
