"use client";

import React from "react";
import { type CampaignChannel } from "@/lib/campaigns/types";

export interface CampaignChannelSelectorProps {
  selectedChannel: CampaignChannel | "ALL";
  onChannelChange: (channel: CampaignChannel | "ALL") => void;
  channelCounts: Record<CampaignChannel | "ALL", number>;
}

const CHANNELS: { id: CampaignChannel; label: string; dotColor: string }[] = [
  { id: "INSTAGRAM", label: "Instagram", dotColor: "#E1306C" },
  { id: "TIKTOK", label: "TikTok", dotColor: "#00F2FE" },
  { id: "PAID_SOCIAL", label: "Paid Social", dotColor: "#1877F2" },
  { id: "WEBSITE", label: "E-Com Web", dotColor: "#B7FF00" },
  { id: "EMAIL", label: "Email", dotColor: "#FFA500" },
  { id: "PRINT", label: "Print", dotColor: "#FFFFFF" },
];

export function CampaignChannelSelector({
  selectedChannel,
  onChannelChange,
  channelCounts,
}: CampaignChannelSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
      <button
        type="button"
        onClick={() => onChannelChange("ALL")}
        className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 border ${
          selectedChannel === "ALL"
            ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--text-primary)]"
            : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
        }`}
      >
        <span>ALL CHANNELS</span>
        <span className="text-[10px] opacity-70">({channelCounts.ALL || 0})</span>
      </button>

      {CHANNELS.map((ch) => {
        const isSelected = selectedChannel === ch.id;
        const count = channelCounts[ch.id] || 0;
        return (
          <button
            type="button"
            key={ch.id}
            onClick={() => onChannelChange(ch.id)}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 border ${
              isSelected
                ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.dotColor }} />
            <span>{ch.label.toUpperCase()}</span>
            <span className="text-[10px] opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
