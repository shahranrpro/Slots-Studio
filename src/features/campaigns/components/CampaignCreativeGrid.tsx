"use client";

import React from "react";
import { type CampaignOutput } from "@/lib/campaigns/types";
import { CampaignCreativeCard } from "./CampaignCreativeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Megaphone } from "lucide-react";

export interface CampaignCreativeGridProps {
  outputs: CampaignOutput[];
  onInspect: (output: CampaignOutput) => void;
  onApprove: (outputId: string) => Promise<void>;
  onReject: (outputId: string) => Promise<void>;
  onSaveToAssets: (outputId: string) => Promise<void>;
}

export function CampaignCreativeGrid({
  outputs,
  onInspect,
  onApprove,
  onReject,
  onSaveToAssets,
}: CampaignCreativeGridProps) {
  if (outputs.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface-1)]">
        <EmptyState
          title="NO CAMPAIGN DELIVERABLES YET"
          description="Configure your target channels and aspect ratios above, then click 'Generate Campaign Kit' to synthesize deliverables."
          icon={<Megaphone className="h-10 w-10 text-[var(--accent)]" />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {outputs.map((output) => (
        <CampaignCreativeCard
          key={output.id}
          output={output}
          onInspect={onInspect}
          onApprove={onApprove}
          onReject={onReject}
          onSaveToAssets={onSaveToAssets}
        />
      ))}
    </div>
  );
}
