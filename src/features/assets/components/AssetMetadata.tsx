"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { Badge } from "@/components/ui/Badge";

export interface AssetMetadataProps {
  asset: Asset;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function AssetMetadata({ asset }: AssetMetadataProps) {
  return (
    <div className="space-y-3 text-xs select-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold text-[var(--text-primary)]">
          METADATA ATTRIBUTES
        </span>
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 font-mono text-[11px]">
        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">ASSET NAME</span>
          <span className="text-[var(--text-primary)] font-semibold truncate block">
            {asset.name}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">ASSET TYPE</span>
          <span className="text-[var(--accent)] font-semibold">
            {asset.assetType}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">SOURCE PROVENANCE</span>
          <span className="text-[var(--text-primary)]">
            {asset.source.replace("_", " ")}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">MIME TYPE</span>
          <span className="text-[var(--text-secondary)]">
            {asset.mimeType}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">DIMENSIONS</span>
          <span className="text-[var(--text-primary)]">
            {asset.width && asset.height
              ? `${asset.width} × ${asset.height} px`
              : asset.previewSvg
              ? "Vector / Scalable"
              : "Not applicable"}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">FILE SIZE</span>
          <span className="text-[var(--text-primary)]">
            {formatBytes(asset.sizeBytes)}
          </span>
        </div>

        {asset.projectName && (
          <div>
            <span className="text-[var(--text-muted)] block text-[10px]">PROJECT</span>
            <span className="text-[var(--text-primary)] truncate block">
              {asset.projectName}
            </span>
          </div>
        )}

        {asset.slotCode && (
          <div>
            <span className="text-[var(--text-muted)] block text-[10px]">SLOT ID</span>
            <span className="text-[var(--accent)] font-bold">
              {asset.slotCode}
            </span>
          </div>
        )}

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">CREATED</span>
          <span suppressHydrationWarning className="text-[var(--text-secondary)]">
            {formatDate(asset.createdAt)}
          </span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px]">UPDATED</span>
          <span suppressHydrationWarning className="text-[var(--text-secondary)]">
            {formatDate(asset.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
