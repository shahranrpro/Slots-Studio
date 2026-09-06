"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, Archive, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetMediaPreview } from "./AssetMediaPreview";

export interface AssetCardProps {
  asset: Asset;
  onOpen: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
  onArchive: (asset: Asset) => void;
}

export function AssetCard({
  asset,
  onOpen,
  onDownload,
  onArchive,
}: AssetCardProps) {
  const isApproved = asset.status === "APPROVED";
  const isArchived = asset.status === "ARCHIVED";

  return (
    <Card
      variant="subtle"
      className={cn(
        "flex flex-col justify-between p-3.5 border transition-all select-none space-y-3 group cursor-pointer",
        isApproved
          ? "border-emerald-500/40 bg-emerald-950/5 hover:border-emerald-500/60"
          : isArchived
          ? "border-[var(--border)] opacity-60 bg-[var(--surface-1)]"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)]"
      )}
      onClick={() => onOpen(asset)}
    >
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="font-mono text-[9px] font-bold text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
            {asset.assetType}
          </span>

          <Badge
            variant={
              isApproved
                ? "success"
                : isArchived
                ? "outline"
                : asset.status === "REJECTED"
                ? "danger"
                : "outline"
            }
            dot={isApproved}
          >
            {asset.status}
          </Badge>
        </div>

        {/* Thumbnail Preview */}
        <div className="relative h-36 w-full rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center p-3 overflow-hidden">
          <AssetMediaPreview asset={asset} size="md" />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white font-bold bg-black/70 px-2 py-1 rounded">
              <Eye className="h-3 w-3" /> Inspect
            </span>
          </div>
        </div>

        {/* Title & Project Meta */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate" title={asset.name}>
            {asset.name}
          </h4>

          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span className="truncate">
              {asset.slotCode || asset.source.replace("_", " ")}
            </span>
            <span>
              {asset.sizeBytes ? `${Math.round(asset.sizeBytes / 1024)} KB` : asset.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div
        className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpen(asset)}
          leftIcon={<Eye className="h-3 w-3" />}
          className="text-[11px] h-7 px-2"
        >
          View
        </Button>

        <div className="flex items-center gap-1">
          {asset.status !== "ARCHIVED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onArchive(asset)}
              className="text-[11px] h-7 px-2 hover:text-red-400"
              title="Archive asset"
            >
              <Archive className="h-3 w-3" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(asset)}
            className="text-[11px] h-7 px-2 text-[var(--accent)]"
            title="Download asset"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
