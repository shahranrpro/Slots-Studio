"use client";

import React, { useState } from "react";
import {
  type ProductionStudioState,
  type TechPack,
  type GenerateTechPackRequest,
  type UpdateTechPackInput,
} from "@/lib/production/types";
import { type Project } from "@/lib/projects/types";
import { ProductionStudioShell } from "./ProductionStudioShell";
import { ProductionContextPanel } from "./ProductionContextPanel";
import { ProductionOverviewCard } from "./ProductionOverviewCard";
import { ProductionGenerationPanel } from "./ProductionGenerationPanel";
import { ProductionGenerationStatus } from "./ProductionGenerationStatus";
import { ProductionTechPackViewer } from "./ProductionTechPackViewer";
import { ProductionEditModal } from "./ProductionEditModal";
import { ProductionVersionDrawer } from "./ProductionVersionDrawer";
import { ProductionReviewBar } from "./ProductionReviewBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Scissors } from "lucide-react";

export interface ProductionStudioViewProps {
  initialState: ProductionStudioState;
  projects: Project[];
}

export function ProductionStudioView({ initialState, projects }: ProductionStudioViewProps) {
  const [state, setState] = useState<ProductionStudioState>(initialState);
  const [activeTechPackId, setActiveTechPackId] = useState<string>(
    initialState.activeTechPack?.id || (initialState.techPacks[0]?.id ?? "")
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingAsset, setIsSavingAsset] = useState(false);

  const activeTechPack =
    state.techPacks.find((tp) => tp.id === activeTechPackId) || state.techPacks[0] || null;

  // Switch active Tech Pack
  const handleTechPackChange = (techPackId: string) => {
    setActiveTechPackId(techPackId);
  };

  // Generate Tech Pack / Revision
  const handleGenerate = async (req: GenerateTechPackRequest) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/studio/production/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const newTechPack: TechPack = resData.data;
        setState((prev) => ({
          ...prev,
          techPacks: [newTechPack, ...prev.techPacks],
          activeTechPack: newTechPack,
        }));
        setActiveTechPackId(newTechPack.id);
      }
    } catch (err) {
      console.error("Failed to generate tech pack:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Approve Tech Pack
  const handleApprove = async () => {
    if (!activeTechPack) return;
    try {
      const response = await fetch("/api/studio/production/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techPackId: activeTechPack.id }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: TechPack = resData.data;
        setState((prev) => ({
          ...prev,
          techPacks: prev.techPacks.map((tp) => (tp.id === updated.id ? updated : tp)),
          activeTechPack: updated,
        }));
      }
    } catch (err) {
      console.error("Failed to approve tech pack:", err);
    }
  };

  // Reject Tech Pack
  const handleReject = async () => {
    if (!activeTechPack) return;
    try {
      const response = await fetch("/api/studio/production/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techPackId: activeTechPack.id }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: TechPack = resData.data;
        setState((prev) => ({
          ...prev,
          techPacks: prev.techPacks.map((tp) => (tp.id === updated.id ? updated : tp)),
          activeTechPack: updated,
        }));
      }
    } catch (err) {
      console.error("Failed to reject tech pack:", err);
    }
  };

  // Update Tech Pack Technical Data
  const handleSaveEdit = async (input: UpdateTechPackInput) => {
    try {
      const response = await fetch("/api/studio/production/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: TechPack = resData.data;
        setState((prev) => ({
          ...prev,
          techPacks: prev.techPacks.map((tp) => (tp.id === updated.id ? updated : tp)),
          activeTechPack: updated,
        }));
      }
    } catch (err) {
      console.error("Failed to update tech pack:", err);
    }
  };

  // Save Tech Pack to Assets Library
  const handleSaveToAssets = async () => {
    if (!activeTechPack) return;
    setIsSavingAsset(true);
    try {
      const response = await fetch("/api/studio/production/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techPackId: activeTechPack.id }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: TechPack = resData.data;
        setState((prev) => ({
          ...prev,
          techPacks: prev.techPacks.map((tp) => (tp.id === updated.id ? updated : tp)),
          activeTechPack: updated,
        }));
      }
    } catch (err) {
      console.error("Failed to save tech pack to assets:", err);
    } finally {
      setIsSavingAsset(false);
    }
  };

  // Export Tech Pack Document
  const handleExport = async (format: "MARKDOWN" | "JSON" | "CSV_BOM") => {
    if (!activeTechPack) return;
    try {
      const response = await fetch("/api/studio/production/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techPackId: activeTechPack.id,
          format,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const { filename, mimeType, content } = resData.data;
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to export tech pack:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Studio Shell Header & Revision Switcher */}
      <ProductionStudioShell
        slotCode={state.slotCode}
        projectName={state.projectName}
        projects={projects}
        activeProjectId={state.projectId}
        techPacks={state.techPacks}
        activeTechPack={activeTechPack}
        onTechPackChange={handleTechPackChange}
        onOpenHistory={() => setIsVersionDrawerOpen(true)}
        onOpenGenerateRevision={() => {
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
      />

      {/* Inherited Product Context Panel */}
      <ProductionContextPanel context={state.approvedContext} projectId={state.projectId} />

      {/* Shared Jobs Subsystem Pipeline Status */}
      <ProductionGenerationStatus activeJob={state.activeJob || null} />

      {/* Generation Panel */}
      {state.approvedContext.isApproved && (
        <ProductionGenerationPanel
          projectId={state.projectId}
          projectName={state.projectName}
          slotCode={state.slotCode}
          parentVersionId={activeTechPack?.id}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}

      {/* Active Tech Pack Workstation */}
      {state.approvedContext.isApproved && activeTechPack && (
        <div className="space-y-6">
          {/* Overview Card */}
          <ProductionOverviewCard
            techPack={activeTechPack}
            onOpenEdit={() => setIsEditModalOpen(true)}
            onSaveToAssets={handleSaveToAssets}
            isSavingAsset={isSavingAsset}
          />

          {/* Master Structured Tech Pack Viewer (6 Tabs) */}
          <ProductionTechPackViewer
            techPack={activeTechPack}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Empty State when no Tech Packs have been generated */}
      {state.approvedContext.isApproved && !activeTechPack && (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface-1)]">
          <EmptyState
            title="NO MANUFACTURING SPECIFICATIONS GENERATED"
            description="Configure your target season and manufacturing facility above, then click 'Synthesize Tech Pack' to generate BOM, size matrix, and seam specs."
            icon={<Scissors className="h-10 w-10 text-[var(--accent)]" />}
          />
        </div>
      )}

      {/* Sticky Bottom Review Decision Bar */}
      {activeTechPack && (
        <ProductionReviewBar
          techPack={activeTechPack}
          onOpenEdit={() => setIsEditModalOpen(true)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSaveToAssets={handleSaveToAssets}
          onExport={handleExport}
        />
      )}

      {/* Edit Tech Pack Specification Modal */}
      {activeTechPack && (
        <ProductionEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          techPack={activeTechPack}
          onSave={handleSaveEdit}
        />
      )}

      {/* Version Lineage Drawer */}
      <ProductionVersionDrawer
        isOpen={isVersionDrawerOpen}
        onClose={() => setIsVersionDrawerOpen(false)}
        techPacks={state.techPacks}
        activeTechPackId={activeTechPackId}
        onSelectVersion={handleTechPackChange}
        onNewRevision={() => {
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
      />
    </div>
  );
}
