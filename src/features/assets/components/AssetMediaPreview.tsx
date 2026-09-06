"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { FileText, Video, Box, File } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssetMediaPreviewProps {
  asset: Asset;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AssetMediaPreview({
  asset,
  className,
  size = "md",
}: AssetMediaPreviewProps) {
  // 1. Direct Image URL
  if (asset.previewUrl) {
    return (
      <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.previewUrl}
          alt={asset.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // 2. Vector SVG Preview
  if (asset.previewSvg) {
    const iconSize = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-48 h-48 sm:w-56 sm:h-56" : "w-24 h-24";
    return (
      <div className={cn("w-full h-full flex items-center justify-center", className)}>
        <div
          className={cn(iconSize, "flex items-center justify-center text-[var(--accent)]")}
          dangerouslySetInnerHTML={{ __html: asset.previewSvg }}
        />
      </div>
    );
  }

  // 3. Video Asset Slate
  if (asset.assetType === "VIDEO" || asset.mimeType.startsWith("video/")) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2 p-3 select-none text-center", className)}>
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          <Video className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        {size !== "sm" && (
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] text-[var(--accent)] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] inline-block">
              {asset.metadata?.durationSeconds ? `${asset.metadata.durationSeconds}s • ` : ""}VIDEO
            </span>
            <span className="block font-mono text-[10px] text-[var(--text-muted)]">
              {asset.width && asset.height ? `${asset.width}×${asset.height}` : "HD Motion"}
            </span>
          </div>
        )}
      </div>
    );
  }

  // 4. Document / Tech Pack
  if (asset.assetType === "DOCUMENT" || asset.mimeType.includes("pdf") || asset.mimeType.includes("document")) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2 p-3 select-none text-center", className)}>
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        {size !== "sm" && (
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] text-[var(--text-primary)] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] inline-block">
              {asset.mimeType.split("/")[1]?.toUpperCase() || "DOC"}
            </span>
            {asset.metadata?.pages ? (
              <span className="block font-mono text-[10px] text-[var(--text-muted)]">
                {String(asset.metadata.pages)} Pages
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // 5. Design / Blueprint
  if (asset.assetType === "DESIGN") {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2 p-3 select-none text-center", className)}>
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          <Box className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        {size !== "sm" && (
          <span className="font-mono text-[9px] text-[var(--text-muted)]">
            DESIGN SPEC
          </span>
        )}
      </div>
    );
  }

  // 6. Generic Fallback
  return (
    <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2 p-3 select-none text-center", className)}>
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--text-muted)] border border-[var(--border)]">
        <File className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      {size !== "sm" && (
        <span className="font-mono text-[9px] text-[var(--text-muted)]">
          {asset.mimeType || "GENERIC FILE"}
        </span>
      )}
    </div>
  );
}
