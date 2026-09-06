"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ExternalLink, Sparkles, Layers, AlertCircle } from "lucide-react";
import { type ProductConcept } from "@/features/product-studio/types";
import { type Project } from "@/lib/projects/types";

export interface VisualContextPanelProps {
  project: Project;
  approvedConcept: ProductConcept | null;
}

export function VisualContextPanel({
  project,
  approvedConcept,
}: VisualContextPanelProps) {
  if (!approvedConcept) {
    return (
      <Card variant="subtle" className="p-4 border-amber-500/30 bg-amber-950/10 space-y-3 select-none">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-amber-300 font-mono">
              PRODUCT CONTEXT NEEDED
            </h2>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Visual Studio generates connected imagery from an approved product direction.
            </p>
          </div>
        </div>

        <Link href={`/app/studio/product?projectId=${project.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full justify-center text-xs" leftIcon={<Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />}>
            Open Product Studio
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="subtle" className="p-4 border-[var(--border-strong)] space-y-3.5 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <CardTitle className="text-xs">APPROVED CONTEXT</CardTitle>
        </div>

        <Badge variant="accent" size="sm">
          {approvedConcept.candidateCode || "LOCKED SPEC"}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3 text-xs">
        {/* Silhouette Preview Thumbnail */}
        {approvedConcept.svgWireframe && (
          <div className="relative aspect-video w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-3)] overflow-hidden flex items-center justify-center p-2">
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full"
              dangerouslySetInnerHTML={{ __html: approvedConcept.svgWireframe }}
            />
            <div className="absolute top-1.5 right-1.5">
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/80 text-[var(--accent)] border border-[var(--border)] font-bold">
                SPEC 1.0
              </span>
            </div>
          </div>
        )}

        {/* Concept Title & Summary */}
        <div className="space-y-1">
          <span className="font-bold text-[var(--text-primary)] block text-xs truncate">
            {approvedConcept.title}
          </span>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {approvedConcept.summary}
          </p>
        </div>

        {/* Color Palette Swatches */}
        {approvedConcept.colorPalette && approvedConcept.colorPalette.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[var(--border)]/60">
            <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
              CALIBRATED PALETTE
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {approvedConcept.colorPalette.map((color, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-[var(--surface-2)] rounded px-1.5 py-0.5 border border-[var(--border)]">
                  <div
                    className="h-3 w-3 rounded-full border border-black/30 shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Materials / Fabrication Tags */}
        {approvedConcept.suggestedMaterials && approvedConcept.suggestedMaterials.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[var(--border)]/60">
            <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] block">
              MATERIAL SPECIFICATIONS
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {approvedConcept.suggestedMaterials.map((mat, idx) => (
                <span
                  key={idx}
                  className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border)]"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source Link to Product Studio */}
        <div className="pt-2 border-t border-[var(--border)]">
          <Link
            href={`/app/studio/product?projectId=${project.id}`}
            className="flex items-center justify-between text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors select-none"
          >
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              <span>Inspect Full Brief</span>
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
