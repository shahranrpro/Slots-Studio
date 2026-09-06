"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

export interface JobSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function JobSearch({
  value,
  onChange,
  placeholder = "Search jobs by project, SLOT ID, studio, or type...",
  className,
}: JobSearchProps) {
  return (
    <div className={`relative flex-1 ${className || ""}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4 text-[var(--text-muted)]" />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5 rounded focus:outline-none"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
        className="h-9 text-xs"
      />
    </div>
  );
}
