"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { AssetMetadata } from "./AssetMetadata";
import { AssetMediaPreview } from "./AssetMediaPreview";
import { Download, Archive } from "lucide-react";

export interface AssetViewerProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (asset: Asset) => void;
  onArchive: (asset: Asset) => void;
}

export function AssetViewer({
  asset,
  isOpen,
  onClose,
  onDownload,
  onArchive,
}: AssetViewerProps) {
  if (!asset || !isOpen) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={asset.name}
      description={
        asset.projectName
          ? `Linked to project ${asset.slotCode ? `${asset.slotCode} • ` : ""}${asset.projectName}`
          : "Workspace creative asset"
      }
      className="max-w-4xl"
    >
      <div className="space-y-6 pt-2 select-none">
        {/* Preview Canvas */}
        <div className="relative h-72 sm:h-96 w-full rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center p-6 overflow-hidden">
          <AssetMediaPreview asset={asset} size="lg" />

          <span className="absolute bottom-2.5 right-3 font-mono text-[9px] text-[var(--text-muted)] bg-[var(--surface-3)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            ASSET PREVIEW
          </span>
        </div>

        {/* Metadata Inspector */}
        <AssetMetadata asset={asset} />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {asset.status !== "ARCHIVED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onArchive(asset);
                  onClose();
                }}
                leftIcon={<Archive className="h-3.5 w-3.5" />}
                className="text-xs text-[var(--text-secondary)] hover:text-red-400"
              >
                Archive Asset
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onDownload(asset)}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Download Asset
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
