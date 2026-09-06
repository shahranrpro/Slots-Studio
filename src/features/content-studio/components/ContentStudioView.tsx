"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { type Project } from "@/lib/projects/types";
import {
  type ContentStudioState,
  type ContentOutput,
  type ContentType,
  type ContentTone,
  type ContentAudience,
  type ContentTemplate,
} from "@/lib/content/types";
import { ContentStudioShell } from "./ContentStudioShell";
import { ContentContextPanel } from "./ContentContextPanel";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { ContentGenerationPanel } from "./ContentGenerationPanel";
import { ContentGenerationStatus } from "./ContentGenerationStatus";
import { ContentResultGrid } from "./ContentResultGrid";
import { ContentResultDetail } from "./ContentResultDetail";
import { ContentReviewBar } from "./ContentReviewBar";

export interface ContentStudioViewProps {
  initialState: ContentStudioState | null;
  allProjects: Project[];
}

export function ContentStudioView({
  initialState,
  allProjects,
}: ContentStudioViewProps) {
  const router = useRouter();

  // Active Project & State
  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialState?.projectId || allProjects[0]?.id || ""
  );

  const currentProject = allProjects.find((p) => p.id === activeProjectId);

  // Generation Controls
  const [selectedType, setSelectedType] = useState<ContentType>("PRODUCT_DESCRIPTION");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>("tpl_ecom_hero");
  const [tone, setTone] = useState<ContentTone>("PERFORMANCE");
  const [audience, setAudience] = useState<ContentAudience>("ACTIVE_URBAN");
  const [customInstructions, setCustomInstructions] = useState<string>("");

  // Outputs & Lifecycle
  const [outputs, setOutputs] = useState<ContentOutput[]>(initialState?.outputs || []);
  const [selectedOutput, setSelectedOutput] = useState<ContentOutput | null>(
    initialState?.outputs?.[0] || null
  );
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleProjectChange = (projectId: string) => {
    setActiveProjectId(projectId);
    router.push(`/app/studio/content?projectId=${projectId}`);
  };

  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplateId(template.id);
    setSelectedType(template.contentType);
    setTone(template.defaultTone);
    setAudience(template.defaultAudience);
  };

  const handleGenerate = async () => {
    if (!activeProjectId) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/studio/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          contentType: selectedType,
          templateId: selectedTemplateId,
          tone,
          audience,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const newOutput = data.data as ContentOutput;
        setOutputs((prev) => [newOutput, ...prev]);
        setSelectedOutput(newOutput);
      }
    } catch (err) {
      console.error("Failed to generate content:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (output: ContentOutput) => {
    try {
      const res = await fetch("/api/studio/content/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId: output.id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data as ContentOutput;
        setOutputs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        if (selectedOutput?.id === updated.id) setSelectedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to approve output:", err);
    }
  };

  const handleReject = async (output: ContentOutput) => {
    try {
      const res = await fetch("/api/studio/content/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId: output.id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data as ContentOutput;
        setOutputs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        if (selectedOutput?.id === updated.id) setSelectedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to reject output:", err);
    }
  };

  const handleSaveToAssets = async (output: ContentOutput) => {
    try {
      const res = await fetch("/api/studio/content/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId: output.id }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data as ContentOutput;
        setOutputs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        if (selectedOutput?.id === updated.id) setSelectedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to save content to assets:", err);
    }
  };

  const handleSaveContent = async (outputId: string, updatedContent: string) => {
    const res = await fetch("/api/studio/content/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outputId, content: updatedContent }),
    });
    const data = await res.json();
    if (data.success && data.data) {
      const updated = data.data as ContentOutput;
      setOutputs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOutput?.id === updated.id) setSelectedOutput(updated);
    }
  };

  const handleRefine = async (output: ContentOutput, notes: string) => {
    const res = await fetch("/api/studio/content/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outputId: output.id, refinementNotes: notes }),
    });
    const data = await res.json();
    if (data.success && data.data) {
      const refined = data.data as ContentOutput;
      setOutputs((prev) => [refined, ...prev]);
      setSelectedOutput(refined);
    }
  };

  const approvedContext = initialState?.approvedContext || {
    productName: currentProject?.name || "Product Slot",
    category: currentProject?.category || "Apparel",
    description: currentProject?.description || "Technical product description",
    silhouette: "Articulated Athletic",
    colorways: ["#000000", "#B7FF00", "#FFFFFF"],
    materials: ["Engineered Tech Poly"],
    isApproved: false,
  };

  return (
    <ContentStudioShell
      currentProject={currentProject}
      allProjects={allProjects}
      slotCode={initialState?.slotCode || currentProject?.slotCode || "SS-00000"}
      onProjectChange={handleProjectChange}
    >
      <div className="space-y-6">
        {/* Active Pipeline Tracker */}
        <ContentGenerationStatus activeJob={initialState?.activeJob} />

        {/* 1. Format Selection Tabs */}
        <ContentTypeSelector
          selectedType={selectedType}
          onSelectType={(type) => setSelectedType(type)}
          outputs={outputs}
        />

        {/* 2. Main Studio Workstation (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Content Result Grid */}
          <div className="lg:col-span-7 space-y-6">
            <ContentResultGrid
              outputs={outputs}
              activeType={selectedType}
              selectedOutputId={selectedOutput?.id}
              onSelectOutput={(output) => {
                setSelectedOutput(output);
                setIsDetailOpen(true);
              }}
              onApproveOutput={handleApprove}
              onRejectOutput={handleReject}
              onSaveToAssets={handleSaveToAssets}
              onTriggerGenerate={handleGenerate}
            />
          </div>

          {/* Right Column (5 cols): Context & Generation Parameters */}
          <div className="lg:col-span-5 space-y-6">
            {/* Approved Context Panel */}
            <ContentContextPanel
              projectId={activeProjectId}
              context={approvedContext}
            />

            {/* Generation Settings Panel */}
            <ContentGenerationPanel
              contentType={selectedType}
              selectedTemplateId={selectedTemplateId}
              tone={tone}
              audience={audience}
              customInstructions={customInstructions}
              isGenerating={isGenerating}
              onSelectTemplate={handleSelectTemplate}
              onChangeTone={setTone}
              onChangeAudience={setAudience}
              onChangeInstructions={setCustomInstructions}
              onGenerate={handleGenerate}
            />
          </div>
        </div>

        {/* 3. Sticky Operator Decision Review Bar */}
        <ContentReviewBar
          selectedOutput={selectedOutput}
          onInspect={() => setIsDetailOpen(true)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSaveToAssets={handleSaveToAssets}
        />

        {/* 4. Slide-Over Detail Inspector Modal */}
        <ContentResultDetail
          output={selectedOutput}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSaveToAssets={handleSaveToAssets}
          onSaveContent={handleSaveContent}
          onRefine={handleRefine}
        />
      </div>
    </ContentStudioShell>
  );
}
