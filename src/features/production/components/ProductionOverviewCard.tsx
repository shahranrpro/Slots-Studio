"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type TechPack } from "@/lib/production/types";
import { FileText, Edit3, Bookmark } from "lucide-react";

export interface ProductionOverviewCardProps {
  techPack: TechPack;
  onOpenEdit: () => void;
  onSaveToAssets: () => Promise<void>;
  isSavingAsset: boolean;
}

export function ProductionOverviewCard({
  techPack,
  onOpenEdit,
  onSaveToAssets,
  isSavingAsset,
}: ProductionOverviewCardProps) {
  return (
    <Card variant="subtle" className="p-4 border-[var(--border)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border-strong)]">
            <FileText className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-mono text-xs font-bold text-white">
              {techPack.version}
            </span>
          </div>

          <Badge
            variant={
              techPack.status === "APPROVED"
                ? "success"
                : techPack.status === "REJECTED"
                ? "danger"
                : "accent"
            }
          >
            {techPack.status}
          </Badge>

          <span className="text-xs font-mono text-[var(--accent)] font-semibold">
            {techPack.season}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {`• ${techPack.targetRegion}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenEdit}
            leftIcon={<Edit3 className="h-3.5 w-3.5" />}
          >
            Edit Specification
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={isSavingAsset}
            onClick={onSaveToAssets}
            leftIcon={<Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />}
          >
            {techPack.savedAssetId ? "Saved in Assets" : "Save as Asset"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
            BILL OF MATERIALS:
          </span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
            {techPack.materials.length} Textiles
          </span>
        </div>

        <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
            TRIMS & HARDWARE:
          </span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
            {techPack.trims.length} Components
          </span>
        </div>

        <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
            GRADING POINTS:
          </span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
            {techPack.measurements.length} POMs (XS-XXL)
          </span>
        </div>

        <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] border border-[var(--border)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
            QUALITY CONTROL:
          </span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
            AQL 1.5 Protocol
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)] leading-relaxed">
        <span className="font-mono font-semibold text-[var(--text-primary)] uppercase mr-1">
          CHANGELOG:
        </span>
        {techPack.changelog}
      </div>
    </Card>
  );
}
