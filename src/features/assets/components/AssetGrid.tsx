"use client";

import React from "react";
import { type Asset } from "@/lib/assets/types";
import { AssetCard } from "./AssetCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Images, SearchX } from "lucide-react";

export interface AssetGridProps {
  assets: Asset[];
  isFiltered: boolean;
  onOpen: (asset: Asset) => void;
  onDownload: (asset: Asset) => void;
  onArchive: (asset: Asset) => void;
}

export function AssetGrid({
  assets,
  isFiltered,
  onOpen,
  onDownload,
  onArchive,
}: AssetGridProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onOpen={onOpen}
          onDownload={onDownload}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
