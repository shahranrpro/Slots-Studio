"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { VisualOutputCard } from "./VisualOutputCard";
import { Camera } from "lucide-react";
import { type VisualOutput, type VisualMode } from "../types";

export interface VisualOutputGridProps {
  outputs: VisualOutput[];
  selectedOutputId?: string;
  onSelectOutput: (outputId: string) => void;
  onInspectOutput: (output: VisualOutput) => void;
  onApproveOutput: (outputId: string) => void;
  onRejectOutput: (outputId: string) => void;
  onSaveToProject: (outputId: string) => void;
  isLoading?: boolean;
}

export function VisualOutputGrid({
  outputs,
  selectedOutputId,
  onSelectOutput,
  onInspectOutput,
  onApproveOutput,
  onRejectOutput,
  onSaveToProject,
  isLoading = false,
}: VisualOutputGridProps) {
  const [filterMode, setFilterMode] = useState<VisualMode | "all">("all");

  const filteredOutputs = outputs.filter((o) => {
    if (filterMode === "all") return true;
    return o.mode === filterMode;
  });

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
            GENERATED CANDIDATES
          </h2>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            ({filteredOutputs.length} {filteredOutputs.length === 1 ? "output" : "outputs"})
          </span>
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-2 py-1 rounded-[var(--radius-sm)] text-[11px] font-mono transition-colors cursor-pointer ${
              filterMode === "all"
                ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-bold border border-[var(--border-strong)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            ALL
          </button>
          {(["studio", "model", "mannequin", "lifestyle", "detail", "editorial"] as VisualMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilterMode(mode)}
              className={`px-2 py-1 rounded-[var(--radius-sm)] text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                filterMode === mode
                  ? "bg-[var(--surface-3)] text-[var(--accent)] font-bold border border-[var(--border-strong)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Outputs Grid or Empty State */}
      {filteredOutputs.length === 0 ? (
        <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center">
          <EmptyState
            title="NO VISUAL OUTPUTS YET"
            description="Choose a visual mode and generate your first candidate pass using approved product context."
            icon={<Camera className="h-10 w-10 text-[var(--accent)]" />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredOutputs.map((output) => (
            <VisualOutputCard
              key={output.id}
              output={output}
              isSelected={output.id === selectedOutputId}
              onSelect={onSelectOutput}
              onInspect={onInspectOutput}
              onApprove={onApproveOutput}
              onReject={onRejectOutput}
              onSaveToProject={onSaveToProject}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
