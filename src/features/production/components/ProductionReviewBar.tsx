"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { type TechPack } from "@/lib/production/types";
import { Check, X, Bookmark, Download, Edit3, FileText } from "lucide-react";

export interface ProductionReviewBarProps {
  techPack: TechPack | null;
  onOpenEdit: () => void;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  onSaveToAssets: () => Promise<void>;
  onExport: (format: "MARKDOWN" | "JSON" | "CSV_BOM") => Promise<void>;
}

export function ProductionReviewBar({
  techPack,
  onOpenEdit,
  onApprove,
  onReject,
  onSaveToAssets,
  onExport,
}: ProductionReviewBarProps) {
  const [isSaving, setIsSaving] = useState(false);

  if (!techPack) return null;

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
        <div className="h-9 w-9 rounded-[var(--radius-sm)] bg-black flex items-center justify-center shrink-0 border border-[var(--border)]">
          <FileText className="h-4 w-4 text-[var(--accent)]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[var(--accent)] bg-black px-1.5 py-0.5 rounded">
              {`${techPack.version} • ${techPack.season}`}
            </span>
            <span className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate">
              {techPack.projectName} Tech Pack
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] truncate block">
            Status: {techPack.status} • {techPack.targetRegion}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenEdit}
          leftIcon={<Edit3 className="h-3.5 w-3.5" />}
        >
          Edit
        </Button>

        {techPack.status !== "REJECTED" && (
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

        {techPack.status !== "APPROVED" && (
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove}
            leftIcon={<Check className="h-3.5 w-3.5" />}
          >
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
          {techPack.savedAssetId ? "Saved in Assets" : "Save as Asset"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport("MARKDOWN")}
          leftIcon={<Download className="h-3.5 w-3.5" />}
        >
          Export
        </Button>
      </div>
    </div>
  );
}
