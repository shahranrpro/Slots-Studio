"use client";

import React from "react";
import Link from "next/link";
import { type ApprovedProductContext } from "@/lib/content/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Box, ArrowUpRight, AlertCircle } from "lucide-react";

export interface ContentContextPanelProps {
  projectId: string;
  context: ApprovedProductContext;
}

export function ContentContextPanel({ projectId, context }: ContentContextPanelProps) {
  if (!context.isApproved) {
    return (
      <Card variant="subtle" className="p-4 border-amber-500/30 bg-amber-500/5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            PRODUCT CONTEXT INCOMPLETE
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          This project has not approved a product concept in Product Studio. Content Studio will use preliminary brief parameters.
        </p>
        <Link
          href={`/app/studio/product?projectId=${projectId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] font-bold hover:underline"
        >
          <span>Approve Direction in Product Studio</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-4 space-y-3.5">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-[var(--accent)]" />
          <CardTitle className="text-xs font-mono tracking-wider uppercase">
            APPROVED PRODUCT CONTEXT
          </CardTitle>
        </div>
        <Badge variant="accent" dot>
          LOCKED
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {/* Product Identity */}
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] font-display truncate">
            {context.productName}
          </h2>
          <p className="text-[11px] font-mono text-[var(--text-muted)]">
            {context.category} • {context.silhouette}
          </p>
        </div>

        {/* Silhouette & Concept Summary */}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed italic">
          &ldquo;{context.description}&rdquo;
        </p>

        {/* Swatches & Materials */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)]/60 text-xs">
          {/* Swatches */}
          {context.colorways && context.colorways.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
                Palette:
              </span>
              <div className="flex items-center gap-1.5">
                {context.colorways.map((color, idx) => (
                  <span
                    key={idx}
                    className="h-3.5 w-3.5 rounded-full border border-[var(--border-strong)] shadow-xs shrink-0"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {context.materials && context.materials.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {context.materials.map((mat, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)]"
                >
                  {mat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Link back to Product Studio */}
        <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span>Source: Product Studio</span>
          <Link
            href={`/app/studio/product?projectId=${projectId}`}
            className="flex items-center gap-1 text-[var(--accent)] hover:underline font-semibold"
          >
            <span>Inspect Spec</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
