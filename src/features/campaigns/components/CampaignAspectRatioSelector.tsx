"use client";

import React from "react";
import { type CampaignAspectRatio } from "@/lib/campaigns/types";

export interface CampaignAspectRatioSelectorProps {
  selectedRatio: CampaignAspectRatio | "ALL";
  onRatioChange: (ratio: CampaignAspectRatio | "ALL") => void;
  aspectCounts: Record<CampaignAspectRatio | "ALL", number>;
}

const RATIOS: { id: CampaignAspectRatio; label: string; desc: string }[] = [
  { id: "1:1", label: "1:1", desc: "Square" },
  { id: "4:5", label: "4:5", desc: "Portrait" },
  { id: "9:16", label: "9:16", desc: "Story/Reel" },
  { id: "16:9", label: "16:9", desc: "Banner" },
];

export function CampaignAspectRatioSelector({
  selectedRatio,
  onRatioChange,
  aspectCounts,
}: CampaignAspectRatioSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
      <button
        type="button"
        onClick={() => onRatioChange("ALL")}
        className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-mono font-bold transition-colors whitespace-nowrap border ${
          selectedRatio === "ALL"
            ? "border-[var(--accent)] bg-[var(--accent)] text-black"
            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
        }`}
      >
        ALL FORMATS ({aspectCounts.ALL || 0})
      </button>

      {RATIOS.map((r) => {
        const isSelected = selectedRatio === r.id;
        const count = aspectCounts[r.id] || 0;
        return (
          <button
            type="button"
            key={r.id}
            onClick={() => onRatioChange(r.id)}
            className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-mono font-bold transition-colors whitespace-nowrap border ${
              isSelected
                ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
            }`}
          >
            {r.label} <span className="opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
