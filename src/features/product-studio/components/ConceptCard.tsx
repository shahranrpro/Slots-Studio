"use client";

import React from "react";
import { type ProductConcept } from "../types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConceptCardProps {
  concept: ProductConcept;
  isSelectedForCompare: boolean;
  onToggleCompare: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenRefine: (concept: ProductConcept) => void;
}

export function ConceptCard({
  concept,
  isSelectedForCompare,
  onToggleCompare,
  onApprove,
  onReject,
  onOpenRefine,
}: ConceptCardProps) {
  const isApproved = concept.status === "APPROVED";
  const isRejected = concept.status === "REJECTED";

  return (
    <Card
      variant="subtle"
      className={cn(
        "flex flex-col justify-between p-4 border transition-all select-none space-y-3",
        isApproved
          ? "border-emerald-500/60 bg-emerald-950/10 shadow-xs"
          : isRejected
          ? "border-red-500/30 bg-red-950/5 opacity-70"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)]"
      )}
    >
      <div className="space-y-3">
        {/* Top Header: Candidate Code & Review Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--accent)]">
              {concept.candidateCode}
            </span>
            {concept.parentConceptId && (
              <span className="inline-flex items-center rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-muted)] border border-[var(--border)]">
                Refined
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                isApproved
                  ? "success"
                  : isRejected
                  ? "danger"
                  : "outline"
              }
              dot={isApproved}
            >
              {concept.status}
            </Badge>

            <button
              type="button"
              onClick={() => onToggleCompare(concept.id)}
              className={cn(
                "h-5 px-1.5 rounded text-[9px] font-mono font-bold transition-colors cursor-pointer border",
                isSelectedForCompare
                  ? "bg-[var(--accent)] text-black border-transparent"
                  : "bg-[var(--surface-3)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)]"
              )}
            >
              {isSelectedForCompare ? "COMPARING" : "COMPARE"}
            </button>
          </div>
        </div>

        {/* Visual Concept Presentation Canvas */}
        <div className="relative h-48 w-full rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center overflow-hidden group">
          {concept.imageUrl && !concept.isDevelopmentPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={concept.imageUrl}
              alt={concept.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="w-32 h-32 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 text-[var(--accent)]"
              dangerouslySetInnerHTML={{ __html: concept.svgWireframe }}
            />
          )}

          {/* Truthful Badge Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
            {concept.imageUrl && !concept.isDevelopmentPreview ? (
              <span className="font-mono text-[9px] font-bold tracking-wider text-black bg-[var(--accent)] px-1.5 py-0.5 rounded shadow-xs">
                REAL AI
              </span>
            ) : (
              <span className="font-mono text-[9px] font-semibold text-[var(--text-muted)] bg-black/60 backdrop-blur-xs border border-white/10 px-1.5 py-0.5 rounded">
                DEV PREVIEW
              </span>
            )}
            {concept.provider && (
              <span className="font-mono text-[8px] text-[var(--text-muted)] bg-black/50 backdrop-blur-xs px-1 rounded truncate max-w-[120px]">
                {concept.provider.replace(/\s*\(Flux\)/i, "")}
              </span>
            )}
          </div>

          {/* Hover Action: Asset Download */}
          {concept.assetId && (
            <a
              href={`/api/assets/${concept.assetId}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] font-semibold bg-black/80 hover:bg-black text-[var(--text-primary)] border border-white/15 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm"
              title="Download full asset"
            >
              <Download className="h-2.5 w-2.5" />
              Download
            </a>
          )}
        </div>

        {/* Concept Title & Summary */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
            {concept.title}
          </h4>
          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {concept.summary}
          </p>
        </div>

        {/* Color Swatches & Suggested Materials */}
        <div className="pt-2 border-t border-[var(--border)]/60 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Colorway</span>
            <div className="flex items-center gap-1">
              {concept.colorPalette.map((col, idx) => (
                <span
                  key={idx}
                  className="h-2.5 w-2.5 rounded-full border border-black/30"
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {concept.suggestedMaterials.slice(0, 2).map((mat, idx) => (
              <span
                key={idx}
                className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[9px] font-mono text-[var(--text-muted)] truncate max-w-[140px]"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Controls (Clean, minimal, functional) */}
      <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenRefine(concept)}
          className="text-[11px] h-7 px-2.5"
        >
          Refine
        </Button>

        <div className="flex items-center gap-1.5">
          {!isRejected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(concept.id)}
              className="text-[11px] h-7 px-2 hover:border-red-500/50 hover:bg-red-950/20 text-red-400"
              title="Reject candidate"
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {!isApproved && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApprove(concept.id)}
              leftIcon={<Check className="h-3 w-3" />}
              className="text-[11px] h-7 px-2.5"
            >
              Approve
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
