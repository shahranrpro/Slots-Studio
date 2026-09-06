"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  type Campaign,
  type CampaignChannel,
  type CampaignAspectRatio,
  type GenerateCampaignRequest,
} from "@/lib/campaigns/types";
import { Sparkles, Layers, Sliders } from "lucide-react";

export interface CampaignGenerationPanelProps {
  campaign: Campaign;
  onGenerate: (request: GenerateCampaignRequest) => Promise<void>;
  isGenerating: boolean;
}

const ALL_CHANNELS: CampaignChannel[] = [
  "INSTAGRAM",
  "TIKTOK",
  "PAID_SOCIAL",
  "WEBSITE",
  "EMAIL",
  "PRINT",
];

const ALL_ASPECTS: CampaignAspectRatio[] = ["1:1", "4:5", "9:16", "16:9"];

const CTA_OPTIONS = [
  "EXPLORE THE DROP",
  "SHOP THE COLLECTION",
  "DISCOVER THE VELOCITY",
  "ORDER NOW // LIMITED RUN",
  "VIEW TECHNICAL SPECS",
];

export function CampaignGenerationPanel({
  campaign,
  onGenerate,
  isGenerating,
}: CampaignGenerationPanelProps) {
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>(campaign.targetChannels);
  const [selectedAspects, setSelectedAspects] = useState<CampaignAspectRatio[]>(campaign.supportedAspectRatios);
  const [ctaVariant, setCtaVariant] = useState(CTA_OPTIONS[0]);
  const [customDirective, setCustomDirective] = useState("");

  const toggleChannel = (ch: CampaignChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const toggleAspect = (ratio: CampaignAspectRatio) => {
    if (selectedAspects.includes(ratio)) {
      if (selectedAspects.length > 1) {
        setSelectedAspects(selectedAspects.filter((r) => r !== ratio));
      }
    } else {
      setSelectedAspects([...selectedAspects, ratio]);
    }
  };

  const handleTriggerGenerate = async () => {
    await onGenerate({
      projectId: campaign.projectId,
      campaignId: campaign.id,
      channels: selectedChannels,
      aspectRatios: selectedAspects,
      ctaVariant,
      customDirective: customDirective.trim() || undefined,
    });
  };

  const deliverableCountEstimate = selectedChannels.length * selectedAspects.length;

  return (
    <Card variant="subtle" className="p-4 space-y-4 border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            CREATIVE DELIVERABLE GENERATOR
          </span>
        </div>
        <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">
          {deliverableCountEstimate} OUTPUTS TARGETED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Channel Selection */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            TARGET CHANNELS ({selectedChannels.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_CHANNELS.map((ch) => {
              const isSelected = selectedChannels.includes(ch);
              return (
                <button
                  type="button"
                  key={ch}
                  onClick={() => toggleChannel(ch)}
                  className={`px-2.5 py-1 rounded-[var(--radius-sm)] font-mono text-[10px] font-bold transition-all border ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            ASPECT RATIOS ({selectedAspects.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ASPECTS.map((ratio) => {
              const isSelected = selectedAspects.includes(ratio);
              return (
                <button
                  type="button"
                  key={ratio}
                  onClick={() => toggleAspect(ratio)}
                  className={`px-2.5 py-1 rounded-[var(--radius-sm)] font-mono text-[10px] font-bold transition-all border ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  }`}
                >
                  {ratio}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Choice & Directive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            CALL TO ACTION BADGE:
          </span>
          <select
            value={ctaVariant}
            onChange={(e) => setCtaVariant(e.target.value)}
            className="w-full h-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
          >
            {CTA_OPTIONS.map((cta) => (
              <option key={cta} value={cta}>
                {cta}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase">
            CUSTOM CREATIVE DIRECTIVE (OPTIONAL):
          </span>
          <input
            type="text"
            value={customDirective}
            onChange={(e) => setCustomDirective(e.target.value)}
            placeholder="e.g. Emphasize high-contrast kinetic shadows and waterproof seals"
            className="w-full h-8 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Generate Action Button */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Multi-channel outputs inherit locked silhouette & colorway tokens</span>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isGenerating}
          onClick={handleTriggerGenerate}
          leftIcon={<Sparkles className="h-4 w-4" />}
          className="font-bold tracking-wider"
        >
          GENERATE CAMPAIGN KIT ({deliverableCountEstimate})
        </Button>
      </div>
    </Card>
  );
}
