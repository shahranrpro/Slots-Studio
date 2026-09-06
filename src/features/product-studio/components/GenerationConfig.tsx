"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface GenerationConfigProps {
  isGenerating: boolean;
  onGenerate: (variantsCount: number) => Promise<void>;
}

export function GenerationConfig({ isGenerating, onGenerate }: GenerationConfigProps) {
  const [variantsCount, setVariantsCount] = useState<number>(3);

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <CardTitle className="text-sm">CONCEPT GENERATION</CardTitle>
        <span className="text-[10px] font-mono text-[var(--accent)]">
          AI CONCEPT PIPELINE
        </span>
      </CardHeader>

      <CardContent className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Candidates:
          </span>
          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-0.5">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setVariantsCount(num)}
                className={cn(
                  "px-3 py-1 text-xs font-mono font-bold rounded-[var(--radius-sm)] transition-colors cursor-pointer",
                  variantsCount === num
                    ? "bg-[var(--surface-1)] text-[var(--accent)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {num} Passes
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isGenerating}
          onClick={() => onGenerate(variantsCount)}
          className="shrink-0"
        >
          Generate Concepts
        </Button>
      </CardContent>
    </Card>
  );
}
