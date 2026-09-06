"use client";

import React from "react";
import { type ProductConcept } from "../types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export interface ConceptComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: ProductConcept[];
  onApprove: (id: string) => void;
}

export function ConceptComparison({
  isOpen,
  onClose,
  concepts,
  onApprove,
}: ConceptComparisonProps) {
  if (!isOpen || concepts.length === 0) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Concept Comparison"
      description="Inspect design parameters and visual silhouettes side-by-side to select the canonical product direction."
      className="max-w-5xl"
    >
      <div className="pt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {concept.candidateCode}
                  </span>
                  <Badge variant={concept.status === "APPROVED" ? "success" : "outline"}>
                    {concept.status}
                  </Badge>
                </div>

                <div className="relative h-40 w-full rounded-[var(--radius-md)] bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                  {concept.imageUrl && !concept.isDevelopmentPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={concept.imageUrl}
                      alt={concept.title}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 flex items-center justify-center text-[var(--accent)]"
                      dangerouslySetInnerHTML={{ __html: concept.svgWireframe }}
                    />
                  )}
                  <span className="absolute bottom-1.5 right-1.5 font-mono text-[8px] px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[var(--text-muted)] border border-white/10">
                    {concept.imageUrl && !concept.isDevelopmentPreview ? "REAL AI" : "DEV PREVIEW"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">
                    {concept.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {concept.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border)]/60 space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Silhouette:</span>
                    <span className="text-[var(--text-primary)] font-semibold truncate max-w-[140px]">
                      {concept.silhouetteDescription}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Materials:</span>
                    <span className="text-[var(--text-primary)] font-semibold truncate max-w-[140px]">
                      {concept.suggestedMaterials.join(", ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)]/60 flex justify-end">
                {concept.status !== "APPROVED" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onApprove(concept.id);
                      onClose();
                    }}
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                    className="w-full text-xs"
                  >
                    Select as Canonical Direction
                  </Button>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-400 py-1">
                    CANONICAL DIRECTION APPROVED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Comparison
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
