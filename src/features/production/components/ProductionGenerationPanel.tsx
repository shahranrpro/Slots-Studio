"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type GenerateTechPackRequest } from "@/lib/production/types";
import { Sparkles, Sliders, Layers } from "lucide-react";

export interface ProductionGenerationPanelProps {
  projectId: string;
  projectName: string;
  slotCode: string;
  parentVersionId?: string;
  onGenerate: (req: GenerateTechPackRequest) => Promise<void>;
  isGenerating: boolean;
}

const SEASONS = [
  "FW26 / Main Drop 01",
  "SS27 / High-Performance Lab",
  "Core Continuous Line",
  "Limited Experimental Capsule",
];

const TARGET_REGIONS = [
  "Portugal / High-Performance Athletic Lab",
  "Italy / Technical Sportswear Facilities",
  "Vietnam / Sealed Seams & Outerwear Lab",
  "Japan / Specialized Micro-Ripstop Mill",
];

export function ProductionGenerationPanel({
  projectId,
  projectName,
  slotCode,
  parentVersionId,
  onGenerate,
  isGenerating,
}: ProductionGenerationPanelProps) {
  const [season, setSeason] = useState(SEASONS[0]);
  const [targetRegion, setTargetRegion] = useState(TARGET_REGIONS[0]);
  const [customDirectives, setCustomDirectives] = useState("");

  const handleGenerate = async () => {
    await onGenerate({
      projectId,
      season,
      targetRegion,
      customDirectives: customDirectives.trim() || undefined,
      parentVersionId,
    });
  };

  return (
    <Card variant="subtle" className="p-4 space-y-4 border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            MANUFACTURING TECH PACK SYNTHESIS
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">
          {`${slotCode} • ${projectName}`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            TARGET SEASON / DROP:
          </span>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full h-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            {SEASONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            TARGET MANUFACTURING LAB:
          </span>
          <select
            value={targetRegion}
            onChange={(e) => setTargetRegion(e.target.value)}
            className="w-full h-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            {TARGET_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
          CUSTOM FACTORY & CONSTRUCTION DIRECTIVES (OPTIONAL):
        </span>
        <textarea
          rows={2}
          value={customDirectives}
          onChange={(e) => setCustomDirectives(e.target.value)}
          placeholder="e.g. Specify YKK AquaGuard zips on all exterior pockets. Require 14 SPI on armhole seams. Reinforce rear drop-tail hem."
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-xs text-[var(--text-primary)] focus:outline-none resize-none"
        />
      </div>

      <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Generates BOM, trims, size grading matrix & seam specs</span>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isGenerating}
          onClick={handleGenerate}
          leftIcon={<Sparkles className="h-4 w-4" />}
          className="font-bold tracking-wider"
        >
          {parentVersionId ? "SYNTHESIZE NEW REVISION" : "SYNTHESIZE TECH PACK"}
        </Button>
      </div>
    </Card>
  );
}
