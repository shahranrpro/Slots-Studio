"use client";

import React, { useState } from "react";
import { type ProductConcept } from "../types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { GitBranch } from "lucide-react";

export interface RefineConceptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ProductConcept | null;
  onRefine: (baseConceptId: string, instructions: string) => Promise<void>;
}

export function RefineConceptDialog({
  isOpen,
  onClose,
  concept,
  onRefine,
}: RefineConceptDialogProps) {
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!concept) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) return;

    setIsSubmitting(true);
    try {
      await onRefine(concept.id, instructions.trim());
      setInstructions("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Refine Concept ${concept.candidateCode}`}
      description="Create a refined iteration with preserved parent version lineage."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent)] font-bold">
            <GitBranch className="h-3 w-3" />
            <span>PARENT ITERATION: {concept.candidateCode}</span>
          </div>
          <p className="font-bold text-[var(--text-primary)]">{concept.title}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">{concept.summary}</p>
        </div>

        <FormField label="Refinement Guidance" required>
          <Textarea
            placeholder="e.g. Adjust shoulder seam bonding, increase contrast on pocket zippers, streamline chest silhouette..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            required
            autoFocus
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Generate Refined Iteration
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
