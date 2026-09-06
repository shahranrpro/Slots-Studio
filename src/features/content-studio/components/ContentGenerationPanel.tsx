"use client";

import React from "react";
import {
  type ContentType,
  type ContentTone,
  type ContentAudience,
  type ContentTemplate,
} from "@/lib/content/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ContentTemplateSelector } from "./ContentTemplateSelector";
import { Sliders, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContentGenerationPanelProps {
  contentType: ContentType;
  selectedTemplateId?: string;
  tone: ContentTone;
  audience: ContentAudience;
  customInstructions: string;
  isGenerating: boolean;
  onSelectTemplate: (template: ContentTemplate) => void;
  onChangeTone: (tone: ContentTone) => void;
  onChangeAudience: (audience: ContentAudience) => void;
  onChangeInstructions: (text: string) => void;
  onGenerate: () => void;
}

const TONES: { id: ContentTone; label: string; desc: string }[] = [
  { id: "PERFORMANCE", label: "Performance", desc: "High energy athletic drive" },
  { id: "MINIMALIST", label: "Minimalist", desc: "Understated modern luxury" },
  { id: "TECHNICAL", label: "Technical", desc: "Engineering & fabric specs" },
  { id: "EDITORIAL", label: "Editorial", desc: "Narrative & culture story" },
  { id: "PUNCHY", label: "Punchy", desc: "Bold, short conversion hooks" },
];

const AUDIENCES: { id: ContentAudience; label: string; desc: string }[] = [
  { id: "ACTIVE_URBAN", label: "Active Urban", desc: "Daily commuters & city fitness" },
  { id: "ATHLETES", label: "Athletes", desc: "High-performance athletes" },
  { id: "STREETWEAR", label: "Streetwear", desc: "Culture & aesthetic leaders" },
  { id: "OUTDOOR_PRO", label: "Outdoor Pro", desc: "Alpine, trail & all-weather" },
];

export function ContentGenerationPanel({
  contentType,
  selectedTemplateId,
  tone,
  audience,
  customInstructions,
  isGenerating,
  onSelectTemplate,
  onChangeTone,
  onChangeAudience,
  onChangeInstructions,
  onGenerate,
}: ContentGenerationPanelProps) {
  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-5 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[var(--accent)]" />
          <CardTitle className="text-xs font-mono tracking-wider uppercase">
            GENERATION PARAMETERS
          </CardTitle>
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase">
          SLOTS-SYNTHESIS
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* 1. Template Presets */}
        <ContentTemplateSelector
          contentType={contentType}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={onSelectTemplate}
        />

        {/* 2. Tone Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            TONE PROFILE
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
            {TONES.map((t) => {
              const isSelected = t.id === tone;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChangeTone(t.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--accent)] font-bold shadow-xs"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span className="text-xs block truncate leading-none">{t.label}</span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block truncate mt-1">
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Target Demographic */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
            TARGET AUDIENCE
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {AUDIENCES.map((a) => {
              const isSelected = a.id === audience;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onChangeAudience(a.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer",
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--accent)] font-bold shadow-xs"
                      : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span className="text-xs block truncate leading-none">{a.label}</span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] block truncate mt-1">
                    {a.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Custom Directives */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
              CUSTOM DIRECTIVES (OPTIONAL)
            </label>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Inherits Product Context
            </span>
          </div>
          <Textarea
            value={customInstructions}
            onChange={(e) => onChangeInstructions(e.target.value)}
            placeholder="e.g. Highlight the weather-resistant articulated hood and emphasize lightweight packability..."
            rows={2}
            className="text-xs font-mono resize-none"
          />
        </div>

        {/* 5. Primary Generate CTA */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onGenerate}
            isLoading={isGenerating}
            className="w-full justify-center font-bold text-sm"
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {isGenerating ? "Synthesizing Copy..." : "Generate Content"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
