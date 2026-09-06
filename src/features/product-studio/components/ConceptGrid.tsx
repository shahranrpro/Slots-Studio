"use client";

import React from "react";
import { type ProductConcept } from "../types";
import { ConceptCard } from "./ConceptCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sparkles } from "lucide-react";

export interface ConceptGridProps {
  concepts: ProductConcept[];
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenRefine: (concept: ProductConcept) => void;
}

export function ConceptGrid({
  concepts,
  selectedCompareIds,
  onToggleCompare,
  onApprove,
  onReject,
  onOpenRefine,
}: ConceptGridProps) {
  if (concepts.length === 0) {
    return (
      <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center select-none">
        <EmptyState
          title="NO CONCEPTS YET"
          description="Define the product brief and generate your first concept."
          icon={<Sparkles className="h-10 w-10 text-[var(--accent)]" />}
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {concepts.map((concept) => (
        <ConceptCard
          key={concept.id}
          concept={concept}
          isSelectedForCompare={selectedCompareIds.includes(concept.id)}
          onToggleCompare={onToggleCompare}
          onApprove={onApprove}
          onReject={onReject}
          onOpenRefine={onOpenRefine}
        />
      ))}
    </div>
  );
}
