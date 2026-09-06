"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ProductStudioState,
  type ProductBriefData,
  type ProductConcept,
  type ReferenceType,
} from "../types";
import { type Project } from "@/lib/projects/types";
import { ProductStudioShell } from "./ProductStudioShell";
import { ProductReviewBar } from "./ProductReviewBar";
import { ProductBrief } from "./ProductBrief";
import { ReferencePanel } from "./ReferencePanel";
import { GenerationConfig } from "./GenerationConfig";
import { GenerationStatus } from "./GenerationStatus";
import { ConceptGrid } from "./ConceptGrid";
import { ConceptComparison } from "./ConceptComparison";
import { RefineConceptDialog } from "./RefineConceptDialog";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FolderPlus, Plus } from "lucide-react";
import Link from "next/link";

export interface ProductStudioViewProps {
  initialState?: ProductStudioState | null;
  allProjects?: Project[];
}

export function ProductStudioView({
  initialState,
  allProjects = [],
}: ProductStudioViewProps) {
  const router = useRouter();
  const [state, setState] = useState<ProductStudioState | null>(initialState || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [refiningConcept, setRefiningConcept] = useState<ProductConcept | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [activeJobId, setActiveJobId] = useState<string | null>(
    state?.activeJob && (state.activeJob.status === "RUNNING" || state.activeJob.status === "QUEUED")
      ? state.activeJob.id
      : null
  );

  const projectId = state?.project?.id;

  // Poll background job if active
  React.useEffect(() => {
    if (!activeJobId || !projectId) return;
    setIsGenerating(true);

    const interval = setInterval(async () => {
      try {
        const jobRes = await fetch(`/api/jobs/${activeJobId}`);
        const jobData = await jobRes.json();
        if (jobData.success && jobData.data) {
          const job = jobData.data;
          if (job.status === "REVIEW" || job.status === "COMPLETED") {
            clearInterval(interval);
            setActiveJobId(null);
            setIsGenerating(false);

            // Fetch updated product studio state with new concept candidates
            const stateRes = await fetch(`/api/studio/product?projectId=${projectId}`);
            const freshState = await stateRes.json();
            if (freshState.success && freshState.data) {
              setState(freshState.data);
            }
          } else if (job.status === "FAILED" || job.status === "CANCELLED") {
            clearInterval(interval);
            setActiveJobId(null);
            setIsGenerating(false);
          }
        }
      } catch {
        // graceful polling
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJobId, projectId]);

  if (!state) {
    return (
      <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center max-w-2xl mx-auto my-12 select-none">
        <EmptyState
          title="NO PROJECT SELECTED"
          description="Product Studio requires an active project slot to carry unified context."
          icon={<FolderPlus className="h-10 w-10 text-[var(--accent)]" />}
          action={
            <div className="pt-4">
              <Link href="/app/projects">
                <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Go to Projects
                </Button>
              </Link>
            </div>
          }
        />
      </Card>
    );
  }

  const handleSelectProject = (projectId: string) => {
    router.push(`/app/studio/product?projectId=${projectId}`);
  };

  const handleSaveBrief = async (brief: ProductBriefData): Promise<boolean> => {
    try {
      const response = await fetch("/api/studio/product/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: state.project.id, brief }),
      });
      const data = await response.json();
      if (data.success) {
        setState((prev) => prev ? { ...prev, brief } : null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleAddReference = async (input: {
    name: string;
    type: ReferenceType;
    value: string;
    notes?: string;
  }) => {
    const response = await fetch("/api/studio/product/references", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: state.project.id, ...input }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setState((prev) =>
        prev ? { ...prev, references: [...prev.references, data.data] } : null
      );
    }
  };

  const handleRemoveReference = async (id: string) => {
    const response = await fetch(
      `/api/studio/product/references?projectId=${state.project.id}&referenceId=${id}`,
      { method: "DELETE" }
    );
    const data = await response.json();
    if (data.success) {
      setState((prev) =>
        prev
          ? { ...prev, references: prev.references.filter((r) => r.id !== id) }
          : null
      );
    }
  };

  const handleGenerate = async (variantsCount: number) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/studio/product/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: state.project.id, variantsCount }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.jobId && data.status === "QUEUED") {
          setActiveJobId(data.jobId);
        } else if (Array.isArray(data.data)) {
          setState((prev) => (prev ? { ...prev, concepts: data.data } : null));
          setIsGenerating(false);
        }
      } else {
        setIsGenerating(false);
      }
    } catch {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (baseConceptId: string, instructions: string) => {
    const response = await fetch("/api/studio/product/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: state.project.id,
        baseConceptId,
        instructions,
      }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setState((prev) =>
        prev ? { ...prev, concepts: [data.data, ...prev.concepts] } : null
      );
    }
  };

  const handleApprove = async (conceptId: string) => {
    const response = await fetch("/api/studio/product/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: state.project.id, conceptId }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setState((prev) => {
        if (!prev) return null;
        const updatedConcepts = prev.concepts.map((c) =>
          c.id === conceptId
            ? { ...c, status: "APPROVED" as const }
            : c.status === "APPROVED"
            ? { ...c, status: "REVIEW" as const }
            : c
        );
        return {
          ...prev,
          concepts: updatedConcepts,
          approvedConceptId: conceptId,
        };
      });
    }
  };

  const handleReject = async (conceptId: string) => {
    const response = await fetch("/api/studio/product/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: state.project.id, conceptId }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      setState((prev) => {
        if (!prev) return null;
        const updatedConcepts = prev.concepts.map((c) =>
          c.id === conceptId ? { ...c, status: "REJECTED" as const } : c
        );
        return {
          ...prev,
          concepts: updatedConcepts,
          approvedConceptId:
            prev.approvedConceptId === conceptId
              ? undefined
              : prev.approvedConceptId,
        };
      });
    }
  };

  const handleToggleCompare = (id: string) => {
    setSelectedCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const compareConcepts = state.concepts.filter((c) =>
    selectedCompareIds.includes(c.id)
  );

  const approvedConcept = state.concepts.find(
    (c) => c.id === state.approvedConceptId || c.status === "APPROVED"
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* Studio Header Shell */}
      <ProductStudioShell
        project={state.project}
        allProjects={allProjects}
        onSelectProject={handleSelectProject}
      />

      {/* Approved Direction Review Banner */}
      <ProductReviewBar
        approvedConcept={approvedConcept}
        projectId={state.project.id}
      />

      {/* Brief Definition & Reference Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductBrief initialBrief={state.brief} onSaveBrief={handleSaveBrief} />
        <ReferencePanel
          references={state.references}
          onAddReference={handleAddReference}
          onRemoveReference={handleRemoveReference}
        />
      </div>

      {/* Generation Control Bar */}
      <GenerationConfig
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      {/* Generation Status Indicator */}
      <GenerationStatus isGenerating={isGenerating} />

      {/* Comparison Action Trigger */}
      {selectedCompareIds.length >= 2 && (
        <div className="rounded-[var(--radius-md)] border border-[var(--accent)] bg-[var(--surface-2)] p-3 flex items-center justify-between gap-3 text-xs">
          <span className="font-mono text-[var(--accent)] font-bold">
            {selectedCompareIds.length} CONCEPTS SELECTED FOR COMPARISON
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCompareIds([])}
            >
              Clear
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCompareModalOpen(true)}
            >
              Compare Side-by-Side
            </Button>
          </div>
        </div>
      )}

      {/* Generated Concepts Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h3 className="font-mono text-xs font-bold uppercase text-[var(--text-primary)] tracking-wide">
            GENERATED CANDIDATE CONCEPTS ({state.concepts.length})
          </h3>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            STEP 04 • REVIEW & APPROVE
          </span>
        </div>

        <ConceptGrid
          concepts={state.concepts}
          selectedCompareIds={selectedCompareIds}
          onToggleCompare={handleToggleCompare}
          onApprove={handleApprove}
          onReject={handleReject}
          onOpenRefine={setRefiningConcept}
        />
      </div>

      {/* Side-by-Side Comparison Dialog */}
      <ConceptComparison
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        concepts={compareConcepts}
        onApprove={handleApprove}
      />

      {/* Refine Concept Dialog */}
      <RefineConceptDialog
        isOpen={Boolean(refiningConcept)}
        onClose={() => setRefiningConcept(null)}
        concept={refiningConcept}
        onRefine={handleRefine}
      />
    </div>
  );
}
