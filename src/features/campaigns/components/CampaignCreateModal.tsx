"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  type CampaignObjective,
  type CampaignChannel,
  type CampaignAspectRatio,
} from "@/lib/campaigns/types";
import { X, Sparkles, Megaphone, Check } from "lucide-react";

export interface CampaignCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    objective: CampaignObjective;
    targetChannels: CampaignChannel[];
    supportedAspectRatios: CampaignAspectRatio[];
  }) => Promise<void>;
  defaultProductName: string;
}

const OBJECTIVES: { id: CampaignObjective; label: string; desc: string }[] = [
  { id: "PRODUCT_LAUNCH", label: "Product Launch", desc: "Global debut and hero momentum." },
  { id: "SEASONAL_DROP", label: "Seasonal Drop", desc: "Limited edition urgency and seasonal colorways." },
  { id: "PERFORMANCE_ACQUISITION", label: "Performance Ads", desc: "High-conversion direct response formats." },
  { id: "BRAND_AWARENESS", label: "Brand Awareness", desc: "Cultural resonance and aesthetic editorial." },
  { id: "TECHNICAL_SHOWCASE", label: "Tech & Material Lab", desc: "Engineering specs and textile details." },
];

const CHANNELS: { id: CampaignChannel; label: string; ratio: string }[] = [
  { id: "INSTAGRAM", label: "Instagram", ratio: "Feed (1:1), Story (9:16), Portrait (4:5)" },
  { id: "TIKTOK", label: "TikTok", ratio: "Full Screen Vertical (9:16)" },
  { id: "PAID_SOCIAL", label: "Meta / Paid Social", ratio: "Carousel & Feed (1:1, 4:5, 9:16)" },
  { id: "WEBSITE", label: "E-Commerce Web", ratio: "Hero Banners (16:9, 1:1)" },
  { id: "EMAIL", label: "Email Marketing", ratio: "Promo Headers (16:9, 1:1)" },
  { id: "PRINT", label: "Print & Posters", ratio: "Editorial Posters (4:5, 1:1)" },
];

const ASPECT_RATIOS: CampaignAspectRatio[] = ["1:1", "4:5", "9:16", "16:9"];

export function CampaignCreateModal({
  isOpen,
  onClose,
  onSubmit,
  defaultProductName,
}: CampaignCreateModalProps) {
  const [name, setName] = useState(`Fall/Winter Drop — ${defaultProductName}`);
  const [objective, setObjective] = useState<CampaignObjective>("PRODUCT_LAUNCH");
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>([
    "INSTAGRAM",
    "PAID_SOCIAL",
    "WEBSITE",
  ]);
  const [selectedAspects, setSelectedAspects] = useState<CampaignAspectRatio[]>([
    "1:1",
    "4:5",
    "9:16",
    "16:9",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleChannel = (channel: CampaignChannel) => {
    if (selectedChannels.includes(channel)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== channel));
      }
    } else {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const toggleAspect = (aspect: CampaignAspectRatio) => {
    if (selectedAspects.includes(aspect)) {
      if (selectedAspects.length > 1) {
        setSelectedAspects(selectedAspects.filter((a) => a !== aspect));
      }
    } else {
      setSelectedAspects([...selectedAspects, aspect]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        objective,
        targetChannels: selectedChannels,
        supportedAspectRatios: selectedAspects,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[var(--surface-1)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3.5">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
              CREATE NEW CAMPAIGN
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campaign Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
              CAMPAIGN NAME:
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Global Release — Velocity Jacket"
              required
              className="bg-[var(--surface-2)]"
            />
          </div>

          {/* Objective Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
              CAMPAIGN OBJECTIVE:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OBJECTIVES.map((obj) => (
                <button
                  type="button"
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`p-3 text-left rounded-[var(--radius-md)] border transition-all ${
                    objective === obj.id
                      ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{obj.label}</span>
                    {objective === obj.id && <Check className="h-3.5 w-3.5 text-[var(--accent)]" />}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{obj.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Target Channels Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
              TARGET CHANNELS:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CHANNELS.map((ch) => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    type="button"
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`p-2.5 text-left rounded-[var(--radius-md)] border transition-all ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--text-primary)]"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{ch.label}</span>
                      {isSelected && <Check className="h-3 w-3 text-[var(--accent)]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Aspect Ratios */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-[var(--text-secondary)]">
              SUPPORTED ASPECT RATIOS:
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = selectedAspects.includes(ratio);
                return (
                  <button
                    type="button"
                    key={ratio}
                    onClick={() => toggleAspect(ratio)}
                    className={`px-3 py-1.5 rounded-[var(--radius-sm)] border font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                        : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {ratio}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Initialize Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
