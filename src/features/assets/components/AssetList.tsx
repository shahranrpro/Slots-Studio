"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eye, Download, Archive, Images, SearchX } from "lucide-react";
import { AssetMediaPreview } from "./AssetMediaPreview";

export interface AssetListProps {
  assets: Asset[];
  isFiltered: boolean;
  onOpen: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
  onArchive: (asset: Asset) => void;
}

export function AssetList({
  assets,
  isFiltered,
  onOpen,
  onDownload,
  onArchive,
}: AssetListProps) {
  if (assets.length === 0) {
    return (
      <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center select-none">
        {isFiltered ? (
          <EmptyState
            title="NO MATCHES"
            description="Try adjusting your filters or search."
            icon={<SearchX className="h-10 w-10 text-[var(--accent)]" />}
          />
        ) : (
          <EmptyState
            title="NO ASSETS YET"
            description="Generated and uploaded assets will appear here."
            icon={<Images className="h-10 w-10 text-[var(--accent)]" />}
          />
        )}
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] select-none">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            <th className="py-2.5 px-3">Asset</th>
            <th className="py-2.5 px-3">Type</th>
            <th className="py-2.5 px-3">Project</th>
            <th className="py-2.5 px-3">Source</th>
            <th className="py-2.5 px-3">Status</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              onClick={() => onOpen(asset)}
              className="hover:bg-[var(--surface-2)]/60 transition-colors cursor-pointer"
            >
              {/* Name & Mini Preview */}
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2.5 min-w-[200px]">
                  <div className="h-8 w-8 shrink-0 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center p-0.5 overflow-hidden">
                    <AssetMediaPreview asset={asset} size="sm" />
                  </div>
                  <span className="font-bold text-[var(--text-primary)] truncate max-w-[240px]">
                    {asset.name}
                  </span>
                </div>
              </td>

              {/* Asset Type */}
              <td className="py-2.5 px-3 font-mono text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] text-[var(--accent)] font-bold">
                  {asset.assetType}
                </span>
              </td>

              {/* Project & SLOT ID */}
              <td className="py-2.5 px-3 font-mono text-[11px] text-[var(--text-secondary)]">
                {asset.slotCode ? (
                  <span className="font-bold text-[var(--text-primary)]">
                    {asset.slotCode}
                  </span>
                ) : (
                  "—"
                )}
              </td>

              {/* Source */}
              <td className="py-2.5 px-3 text-[11px] text-[var(--text-muted)]">
                {asset.source.replace("_", " ")}
              </td>

              {/* Status */}
              <td className="py-2.5 px-3">
                <Badge
                  variant={
                    asset.status === "APPROVED"
                      ? "success"
                      : asset.status === "ARCHIVED"
                      ? "outline"
                      : asset.status === "REJECTED"
                      ? "danger"
                      : "outline"
                  }
                  dot={asset.status === "APPROVED"}
                >
                  {asset.status}
                </Badge>
              </td>

              {/* Actions */}
              <td
                className="py-2.5 px-3 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpen(asset)}
                    className="text-[11px] h-7 px-2"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  {asset.status !== "ARCHIVED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onArchive(asset)}
                      className="text-[11px] h-7 px-2 hover:text-red-400"
                      title="Archive"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(asset)}
                    className="text-[11px] h-7 px-2 text-[var(--accent)]"
                    title="Download"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
