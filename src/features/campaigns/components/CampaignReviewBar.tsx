"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { type CampaignOutput } from "@/lib/campaigns/types";
import { Check, X, Bookmark, Eye } from "lucide-react";

export interface CampaignReviewBarProps {
  selectedOutput: CampaignOutput | null;
  onInspect: () => void;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onSaveToAssets: () => Promise<void>;
}

export function CampaignReviewBar({
  selectedOutput,
  onInspect,
  onApprove,
  onReject,
  onSaveToAssets,
}: CampaignReviewBarProps) {
  const [isSaving, setIsSaving] = useState(false);

  if (!selectedOutput) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveToAssets();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sticky bottom-4 z-40 w-full max-w-4xl mx-auto rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface-1)]/95 backdrop-blur-md shadow-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-slideUp">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-[var(--radius-sm)] bg-black overflow-hidden shrink-0 border border-[var(--border)]">
          <div
            className="w-full h-full pointer-events-none"
            dangerouslySetInnerHTML={{ __html: selectedOutput.previewSvg }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[var(--accent)] bg-black px-1.5 py-0.5 rounded">
              {`${selectedOutput.channel} • ${selectedOutput.aspectRatio}`}
            </span>
            <span className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate">
              {selectedOutput.headline}
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] truncate block">
            Status: {selectedOutput.status}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onInspect} leftIcon={<Eye className="h-3.5 w-3.5" />}>
          Inspect
        </Button>

        {selectedOutput.status !== "REJECTED" && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            leftIcon={<X className="h-3.5 w-3.5 text-red-400" />}
            className="hover:border-red-500/50 hover:text-red-400"
          >
            Reject
          </Button>
        )}

        {selectedOutput.status !== "APPROVED" && (
          <Button variant="primary" size="sm" onClick={onApprove} leftIcon={<Check className="h-3.5 w-3.5" />}>
            Approve
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          isLoading={isSaving}
          onClick={handleSave}
          leftIcon={<Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />}
        >
          {selectedOutput.savedAssetId ? "Saved in Assets" : "Save to Assets"}
        </Button>
      </div>
    </div>
  );
}
