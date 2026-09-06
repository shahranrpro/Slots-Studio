"use client";

import React, { useState } from "react";
import { type ContentOutput, type ContentType } from "@/lib/content/types";
import { ContentResultCard } from "./ContentResultCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentResultGridProps {
  outputs: ContentOutput[];
  activeType: ContentType;
  selectedOutputId?: string;
  onSelectOutput: (output: ContentOutput) => void;
  onApproveOutput: (output: ContentOutput) => void;
  onRejectOutput: (output: ContentOutput) => void;
  onSaveToAssets: (output: ContentOutput) => void;
  onTriggerGenerate: () => void;
}

export function ContentResultGrid({
  outputs,
  activeType,
  selectedOutputId,
  onSelectOutput,
  onApproveOutput,
  onRejectOutput,
  onSaveToAssets,
  onTriggerGenerate,
}: ContentResultGridProps) {
  const [filterMode, setFilterMode] = useState<"ACTIVE_TYPE" | "ALL">("ACTIVE_TYPE");

  void onSaveToAssets;

  const displayedOutputs =
    filterMode === "ACTIVE_TYPE"
      ? outputs.filter((o) => o.contentType === activeType)
      : outputs;

  return (
    <div className="space-y-4 select-none">
      {/* Grid Header & Filter Controls */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            GENERATED CANDIDATES ({displayedOutputs.length})
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterMode("ACTIVE_TYPE")}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer",
              filterMode === "ACTIVE_TYPE"
                ? "bg-[var(--accent)] text-black"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Current Mode ({outputs.filter((o) => o.contentType === activeType).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer",
              filterMode === "ALL"
                ? "bg-[var(--accent)] text-black"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            All Outputs ({outputs.length})
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {displayedOutputs.length === 0 ? (
        <div className="py-12 px-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] text-center">
          <EmptyState
            title="NO CONTENT GENERATED YET"
            description="Select a template or configure your tone profile on the right to synthesize your first content draft."
            icon={<FileText className="h-10 w-10 text-[var(--accent)]" />}
            action={
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onTriggerGenerate}
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Generate First Draft
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedOutputs.map((output) => (
            <ContentResultCard
              key={output.id}
              output={output}
              isSelected={output.id === selectedOutputId}
              onSelect={onSelectOutput}
              onApprove={onApproveOutput}
              onReject={onRejectOutput}
            />
          ))}
        </div>
      )}
    </div>
  );
}
