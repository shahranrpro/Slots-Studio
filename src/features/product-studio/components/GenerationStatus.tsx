"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface GenerationStatusProps {
  isGenerating: boolean;
}

export function GenerationStatus({ isGenerating }: GenerationStatusProps) {
  if (!isGenerating) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--accent)]/40 bg-[var(--surface-2)] p-4 flex items-center justify-between gap-4 animate-fade-in select-none">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>

        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-[var(--text-primary)] font-mono flex items-center gap-2">
            <span>SYNTHESIZING CANDIDATE CONCEPTS</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-ping" />
          </h4>
          <p className="text-[11px] text-[var(--text-muted)]">
            Evaluating silhouette geometry, materials, and reference constraints...
          </p>
        </div>
      </div>

      <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
        PIPELINE ACTIVE
      </span>
    </div>
  );
}
