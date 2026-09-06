"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VisualStudioShell } from "./VisualStudioShell";
import { VisualContextPanel } from "./VisualContextPanel";
import { VisualReferencePanel } from "./VisualReferencePanel";
import { VisualModeSelector } from "./VisualModeSelector";
import { VisualSettings } from "./VisualSettings";
import { VisualGenerationStatus } from "./VisualGenerationStatus";
import { VisualOutputGrid } from "./VisualOutputGrid";
import { VisualOutputDetail } from "./VisualOutputDetail";
import { VisualReviewBar } from "./VisualReviewBar";
import {
  type VisualStudioState,
  type VisualOutput,
  type VisualMode,
  type VisualSettingsConfig,
} from "../types";
import { type Project } from "@/lib/projects/types";

export interface VisualStudioViewProps {
  initialState: VisualStudioState | null;
  allProjects: Project[];
}

export function VisualStudioView({
  initialState,
  allProjects,
}: VisualStudioViewProps) {
  const router = useRouter();

  const [state, setState] = useState<VisualStudioState | null>(initialState);
  const [activeMode, setActiveMode] = useState<VisualMode>(
    initialState?.activeMode || "studio"
  );
  const [settings, setSettings] = useState<VisualSettingsConfig>(
    initialState?.settings || {
      aspectRatio: "1:1",
      lighting: "key_softbox",
      background: "dark_cyc",
      environment: "studio_loft",
      composition: "center_hero",
      modelDirection: "pose_front",
    }
  );
  const [selectedOutputId, setSelectedOutputId] = useState<string | undefined>(
    initialState?.selectedOutputId || initialState?.outputs[0]?.id
  );
  const [inspectOutput, setInspectOutput] = useState<VisualOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const projectId = state?.project?.id;

  const [activeJobId, setActiveJobId] = useState<string | null>(
    state?.activeJob && (state.activeJob.status === "RUNNING" || state.activeJob.status === "QUEUED")
      ? state.activeJob.id
      : null
  );

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

            // Fetch updated visual studio state with new outputs
            const stateRes = await fetch(`/api/studio/visual?projectId=${projectId}`);
            const freshState = await stateRes.json();
            if (freshState.success && freshState.data) {
              setState(freshState.data);
              if (freshState.data.outputs?.[0]) {
                setSelectedOutputId(freshState.data.outputs[0].id);
              }
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
    return null;
  }

  const { project, approvedConcept, references, outputs, activeJob } = state;

  const handleSelectProject = (projectId: string) => {
    router.push(`/app/studio/visual?projectId=${projectId}`);
  };

  const handleToggleReference = (refId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        references: prev.references.map((r) =>
          r.id === refId ? { ...r, selected: !r.selected } : r
        ),
      };
    });
  };

  const handleAddReference = async (name: string, type: string) => {
    try {
      const res = await fetch("/api/studio/visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_reference",
          projectId: project.id,
          referenceName: name,
          referenceType: type,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            references: [...prev.references, data.data],
          };
        });
      }
    } catch {
      // Error handled gracefully
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const selectedRefIds = references.filter((r) => r.selected).map((r) => r.id);
      const res = await fetch("/api/studio/visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          mode: activeMode,
          settings,
          selectedReferenceIds: selectedRefIds,
          variantsCount: 2,
          async: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.data)) {
          setState((prev) => {
            if (!prev) return prev;
            const newOutputs = [...data.data, ...prev.outputs];
            return {
              ...prev,
              outputs: newOutputs,
              selectedOutputId: data.data[0]?.id || prev.selectedOutputId,
            };
          });
          setSelectedOutputId(data.data[0]?.id);
          setIsGenerating(false);
        } else if (data.data?.jobId || data.jobId) {
          const jId = data.data?.jobId || data.jobId;
          setActiveJobId(jId);
        } else {
          setIsGenerating(false);
        }
      } else {
        setIsGenerating(false);
      }
    } catch {
      setIsGenerating(false);
    }
  };

  const handleApproveOutput = async (outputId: string) => {
    setIsLoadingAction(true);
    try {
      const res = await fetch("/api/studio/visual/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          outputId,
          status: "APPROVED",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            outputs: prev.outputs.map((o) => (o.id === outputId ? data.data : o)),
          };
        });
        if (inspectOutput?.id === outputId) {
          setInspectOutput(data.data);
        }
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRejectOutput = async (outputId: string) => {
    setIsLoadingAction(true);
    try {
      const res = await fetch("/api/studio/visual/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          outputId,
          status: "REJECTED",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            outputs: prev.outputs.map((o) => (o.id === outputId ? data.data : o)),
          };
        });
        if (inspectOutput?.id === outputId) {
          setInspectOutput(data.data);
        }
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleSaveToProject = async (outputId: string) => {
    setIsLoadingAction(true);
    try {
      const res = await fetch("/api/studio/visual/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          outputId,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            outputs: prev.outputs.map((o) => (o.id === outputId ? data.data : o)),
          };
        });
        if (inspectOutput?.id === outputId) {
          setInspectOutput(data.data);
        }
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const selectedOutput = outputs.find((o) => o.id === selectedOutputId) || outputs[0] || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Project Switcher */}
      <VisualStudioShell
        currentProject={project}
        allProjects={allProjects}
        onSelectProject={handleSelectProject}
        activeJobCount={activeJob ? 1 : 0}
      />

      {/* 2. Visual Mode Selector Bar */}
      <VisualModeSelector
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        disabled={isGenerating}
      />

      {/* 3. Generation Status Banner */}
      <VisualGenerationStatus activeJob={activeJob} />

      {/* 4. Three-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context & Reference Panels (3 cols) */}
        <div className="lg:col-span-3 space-y-5 order-2 lg:order-1">
          <VisualContextPanel
            project={project}
            approvedConcept={approvedConcept}
          />
          <VisualReferencePanel
            references={references}
            onToggleReference={handleToggleReference}
            onAddReference={handleAddReference}
            isLoading={isGenerating}
          />
        </div>

        {/* Center Column: Visual Outputs Grid (6 cols) */}
        <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
          <VisualOutputGrid
            outputs={outputs}
            selectedOutputId={selectedOutputId}
            onSelectOutput={(id) => setSelectedOutputId(id)}
            onInspectOutput={(output) => setInspectOutput(output)}
            onApproveOutput={handleApproveOutput}
            onRejectOutput={handleRejectOutput}
            onSaveToProject={handleSaveToProject}
            isLoading={isLoadingAction}
          />
        </div>

        {/* Right Column: Visual Settings & Prompt Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-5 order-3">
          <VisualSettings
            activeMode={activeMode}
            settings={settings}
            onChangeSettings={(updates) => setSettings((prev) => ({ ...prev, ...updates }))}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            disabled={!approvedConcept}
          />
        </div>
      </div>

      {/* 5. Sticky Operator Review Decision Bar */}
      {selectedOutput && (
        <VisualReviewBar
          selectedOutput={selectedOutput}
          onInspect={(output) => setInspectOutput(output)}
          onApprove={handleApproveOutput}
          onReject={handleRejectOutput}
          onRegenerate={handleGenerate}
          onSaveToProject={handleSaveToProject}
          isLoading={isLoadingAction || isGenerating}
        />
      )}

      {/* 6. High-Resolution Output Inspector Modal */}
      <VisualOutputDetail
        output={inspectOutput}
        isOpen={Boolean(inspectOutput)}
        onClose={() => setInspectOutput(null)}
        onApprove={handleApproveOutput}
        onReject={handleRejectOutput}
        onSaveToProject={handleSaveToProject}
        isLoading={isLoadingAction}
      />
    </div>
  );
}
