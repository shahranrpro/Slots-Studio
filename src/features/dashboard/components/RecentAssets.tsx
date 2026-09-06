"use client";

import React from "react";
import Link from "next/link";
import { type AssetItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Images, ArrowRight } from "lucide-react";

export interface RecentAssetsProps {
  assets: AssetItem[];
}

export function RecentAssets({ assets }: RecentAssetsProps) {
  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Images className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">RECENT ASSETS</CardTitle>
          </div>
        </div>

        {assets.length > 0 && (
          <Link
            href="/app/assets"
            className="flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline font-semibold"
          >
            <span>ASSET LIBRARY ({assets.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        {assets.length === 0 ? (
          <div className="py-6 text-center space-y-1.5">
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NO RECENT ASSETS</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Generated and uploaded assets will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-2 hover:border-[var(--border-strong)] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[var(--accent)] border border-[var(--border)]">
                      {asset.type}
                    </span>
                    {asset.aspectRatio && (
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">
                        {asset.aspectRatio}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                    {asset.name}
                  </h4>

                  <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                    {asset.projectName}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-[var(--border)]/60 flex items-center justify-between text-[9px] font-mono text-[var(--text-muted)]">
                  <span>{asset.format}</span>
                  <span>{asset.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
