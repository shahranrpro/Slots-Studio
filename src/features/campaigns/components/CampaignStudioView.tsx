"use client";

import React, { useState } from "react";
import {
  type CampaignStudioState,
  type Campaign,
  type CampaignOutput,
  type CampaignChannel,
  type CampaignAspectRatio,
  type CampaignObjective,
  type GenerateCampaignRequest,
} from "@/lib/campaigns/types";
import { type Project } from "@/lib/projects/types";
import { CampaignStudioShell } from "./CampaignStudioShell";
import { CampaignContextPanel } from "./CampaignContextPanel";
import { CampaignCreateModal } from "./CampaignCreateModal";
import { CampaignChannelSelector } from "./CampaignChannelSelector";
import { CampaignAspectRatioSelector } from "./CampaignAspectRatioSelector";
import { CampaignGenerationPanel } from "./CampaignGenerationPanel";
import { CampaignGenerationStatus } from "./CampaignGenerationStatus";
import { CampaignCreativeGrid } from "./CampaignCreativeGrid";
import { CampaignCreativeDetail } from "./CampaignCreativeDetail";
import { CampaignReviewBar } from "./CampaignReviewBar";

export interface CampaignStudioViewProps {
  initialState: CampaignStudioState;
  projects: Project[];
}

export function CampaignStudioView({ initialState, projects }: CampaignStudioViewProps) {
  const [state, setState] = useState<CampaignStudioState>(initialState);
  const [activeCampaignId, setActiveCampaignId] = useState<string>(
    initialState.activeCampaign?.id || (initialState.campaigns[0]?.id ?? "")
  );

  const [selectedChannel, setSelectedChannel] = useState<CampaignChannel | "ALL">("ALL");
  const [selectedRatio, setSelectedRatio] = useState<CampaignAspectRatio | "ALL">("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inspectingOutput, setInspectingOutput] = useState<CampaignOutput | null>(null);
  const [focusedOutput, setFocusedOutput] = useState<CampaignOutput | null>(null);

  const activeCampaign =
    state.campaigns.find((c) => c.id === activeCampaignId) || state.campaigns[0] || null;

  // Filter outputs by active campaign, channel, and aspect ratio
  const campaignOutputs = activeCampaign
    ? state.outputs.filter((o) => o.campaignId === activeCampaign.id)
    : state.outputs;

  const filteredOutputs = campaignOutputs.filter((o) => {
    if (selectedChannel !== "ALL" && o.channel !== selectedChannel) return false;
    if (selectedRatio !== "ALL" && o.aspectRatio !== selectedRatio) return false;
    return true;
  });

  // Calculate channel & aspect ratio counts
  const channelCounts: Record<CampaignChannel | "ALL", number> = {
    ALL: campaignOutputs.length,
    INSTAGRAM: campaignOutputs.filter((o) => o.channel === "INSTAGRAM").length,
    TIKTOK: campaignOutputs.filter((o) => o.channel === "TIKTOK").length,
    PAID_SOCIAL: campaignOutputs.filter((o) => o.channel === "PAID_SOCIAL").length,
    WEBSITE: campaignOutputs.filter((o) => o.channel === "WEBSITE").length,
    EMAIL: campaignOutputs.filter((o) => o.channel === "EMAIL").length,
    PRINT: campaignOutputs.filter((o) => o.channel === "PRINT").length,
  };

  const aspectCounts: Record<CampaignAspectRatio | "ALL", number> = {
    ALL: campaignOutputs.length,
    "1:1": campaignOutputs.filter((o) => o.aspectRatio === "1:1").length,
    "4:5": campaignOutputs.filter((o) => o.aspectRatio === "4:5").length,
    "9:16": campaignOutputs.filter((o) => o.aspectRatio === "9:16").length,
    "16:9": campaignOutputs.filter((o) => o.aspectRatio === "16:9").length,
  };

  // Switch active campaign
  const handleCampaignChange = (campaignId: string) => {
    setActiveCampaignId(campaignId);
    setFocusedOutput(null);
  };

  // Create Campaign
  const handleCreateCampaign = async (data: {
    name: string;
    objective: CampaignObjective;
    targetChannels: CampaignChannel[];
    supportedAspectRatios: CampaignAspectRatio[];
  }) => {
    try {
      const response = await fetch("/api/studio/campaign/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: state.projectId,
          ...data,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const newCampaign: Campaign = resData.data;
        setState((prev) => ({
          ...prev,
          campaigns: [newCampaign, ...prev.campaigns],
          activeCampaign: newCampaign,
        }));
        setActiveCampaignId(newCampaign.id);
      }
    } catch (err) {
      console.error("Failed to create campaign:", err);
    }
  };

  // Generate Deliverables
  const handleGenerate = async (req: GenerateCampaignRequest) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/studio/campaign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      const resData = await response.json();
      if (resData.success && Array.isArray(resData.data)) {
        const newOutputs: CampaignOutput[] = resData.data;
        setState((prev) => ({
          ...prev,
          outputs: [...newOutputs, ...prev.outputs],
          campaigns: prev.campaigns.map((c) =>
            c.id === req.campaignId
              ? { ...c, deliverableCount: c.deliverableCount + newOutputs.length }
              : c
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to generate campaign:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Approve Output
  const handleApprove = async (outputId: string) => {
    try {
      const response = await fetch("/api/studio/campaign/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: CampaignOutput = resData.data;
        setState((prev) => ({
          ...prev,
          outputs: prev.outputs.map((o) => (o.id === outputId ? updated : o)),
        }));
        if (inspectingOutput?.id === outputId) setInspectingOutput(updated);
        if (focusedOutput?.id === outputId) setFocusedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to approve output:", err);
    }
  };

  // Reject Output
  const handleReject = async (outputId: string) => {
    try {
      const response = await fetch("/api/studio/campaign/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: CampaignOutput = resData.data;
        setState((prev) => ({
          ...prev,
          outputs: prev.outputs.map((o) => (o.id === outputId ? updated : o)),
        }));
        if (inspectingOutput?.id === outputId) setInspectingOutput(updated);
        if (focusedOutput?.id === outputId) setFocusedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to reject output:", err);
    }
  };

  // Save Output to Assets Library
  const handleSaveToAssets = async (outputId: string) => {
    try {
      const response = await fetch("/api/studio/campaign/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputId }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const updated: CampaignOutput = resData.data;
        setState((prev) => ({
          ...prev,
          outputs: prev.outputs.map((o) => (o.id === outputId ? updated : o)),
        }));
        if (inspectingOutput?.id === outputId) setInspectingOutput(updated);
        if (focusedOutput?.id === outputId) setFocusedOutput(updated);
      }
    } catch (err) {
      console.error("Failed to save to assets:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Studio Header & Project / Campaign Switcher */}
      <CampaignStudioShell
        slotCode={state.slotCode}
        projectName={state.projectName}
        projects={projects}
        activeProjectId={state.projectId}
        campaigns={state.campaigns}
        activeCampaign={activeCampaign}
        onCampaignChange={handleCampaignChange}
        onOpenCreateCampaign={() => setIsCreateModalOpen(true)}
      />

      {/* Inherited Product Context Summary */}
      <CampaignContextPanel context={state.approvedContext} projectId={state.projectId} />

      {/* Generation Pipeline Status */}
      <CampaignGenerationStatus activeJob={state.activeJob || null} />

      {/* Generator Controls (Only visible if a campaign exists & context is approved) */}
      {state.approvedContext.isApproved && activeCampaign && (
        <CampaignGenerationPanel
          campaign={activeCampaign}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}

      {/* Filter Toolbar (Channels & Aspect Ratios) */}
      {state.approvedContext.isApproved && campaignOutputs.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <CampaignChannelSelector
              selectedChannel={selectedChannel}
              onChannelChange={setSelectedChannel}
              channelCounts={channelCounts}
            />
            <CampaignAspectRatioSelector
              selectedRatio={selectedRatio}
              onRatioChange={setSelectedRatio}
              aspectCounts={aspectCounts}
            />
          </div>
        </div>
      )}

      {/* Creative Deliverables Grid */}
      {state.approvedContext.isApproved && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[var(--text-secondary)]">
              CAMPAIGN DELIVERABLES ({filteredOutputs.length})
            </span>
          </div>

          <CampaignCreativeGrid
            outputs={filteredOutputs}
            onInspect={(output) => {
              setInspectingOutput(output);
              setFocusedOutput(output);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
            onSaveToAssets={handleSaveToAssets}
          />
        </div>
      )}

      {/* Inspect & Edit Modal */}
      <CampaignCreativeDetail
        output={inspectingOutput}
        onClose={() => setInspectingOutput(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onSaveToAssets={handleSaveToAssets}
      />

      {/* Sticky Bottom Review Decision Bar */}
      {focusedOutput && (
        <CampaignReviewBar
          selectedOutput={focusedOutput}
          onInspect={() => setInspectingOutput(focusedOutput)}
          onApprove={() => handleApprove(focusedOutput.id)}
          onReject={() => handleReject(focusedOutput.id)}
          onSaveToAssets={() => handleSaveToAssets(focusedOutput.id)}
        />
      )}

      {/* Create Campaign Dialog */}
      <CampaignCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCampaign}
        defaultProductName={state.projectName}
      />
    </div>
  );
}
