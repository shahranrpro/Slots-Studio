"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Sliders, Sparkles, Sun, Crop, LayoutGrid } from "lucide-react";
import {
  type VisualMode,
  type VisualAspectRatio,
  type VisualSettingsConfig,
  type VisualLighting,
  type VisualBackground,
  type VisualEnvironment,
  type VisualComposition,
  type VisualModelDirection,
} from "../types";

export interface VisualSettingsProps {
  activeMode: VisualMode;
  settings: VisualSettingsConfig;
  onChangeSettings: (updates: Partial<VisualSettingsConfig>) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
}

const ASPECT_RATIOS: { value: VisualAspectRatio; label: string; ratio: string }[] = [
  { value: "1:1", label: "1:1", ratio: "Square" },
  { value: "4:5", label: "4:5", ratio: "Portrait" },
  { value: "9:16", label: "9:16", ratio: "Story" },
  { value: "16:9", label: "16:9", ratio: "Wide" },
];

export function VisualSettings({
  activeMode,
  settings,
  onChangeSettings,
  onGenerate,
  isGenerating = false,
  disabled = false,
}: VisualSettingsProps) {
  const showEnvironment = activeMode === "lifestyle" || activeMode === "editorial";
  const showModelDirection = activeMode === "model" || activeMode === "lifestyle" || activeMode === "editorial";

  return (
    <Card variant="subtle" className="p-4 sm:p-5 border-[var(--border-strong)] space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <CardTitle className="text-xs">VISUAL SETTINGS</CardTitle>
        </div>

        <span className="font-mono text-[10px] uppercase text-[var(--accent)] font-semibold">
          MODE: {activeMode.toUpperCase()}
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-4 text-xs">
        {/* Aspect Ratio Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-mono">
            <Crop className="h-3.5 w-3.5" />
            <span>ASPECT RATIO</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onChangeSettings({ aspectRatio: item.value })}
                disabled={disabled || isGenerating}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-[var(--radius-sm)] border text-xs font-mono transition-all cursor-pointer ${
                  settings.aspectRatio === item.value
                    ? "bg-[var(--surface-3)] border-[var(--accent)] text-[var(--text-primary)] font-bold shadow-xs"
                    : "bg-[var(--surface-1)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span className="text-xs">{item.label}</span>
                <span className="text-[9px] text-[var(--text-muted)]">{item.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Preset */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-mono">
            <Sun className="h-3.5 w-3.5" />
            <span>LIGHTING SETUP</span>
          </div>
          <Select
            value={settings.lighting}
            onChange={(val) => onChangeSettings({ lighting: val as VisualLighting })}
            disabled={disabled || isGenerating}
            options={[
              { value: "key_softbox", label: "Key Studio Softbox (Balanced E-Comm)" },
              { value: "high_contrast_rim", label: "High Contrast Rim Light (Dramatic Edge)" },
              { value: "golden_hour", label: "Golden Hour Natural (Warm Exterior)" },
              { value: "direct_flash", label: "Technical Direct Flash (Sharp Editorial)" },
              { value: "diffused_ambient", label: "Diffused Ambient (Soft Shadowless)" },
            ]}
          />
        </div>

        {/* Background / Cyc */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px] font-mono">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>BACKGROUND & CYC</span>
          </div>
          <Select
            value={settings.background}
            onChange={(val) => onChangeSettings({ background: val as VisualBackground })}
            disabled={disabled || isGenerating}
            options={[
              { value: "dark_cyc", label: "Dark Cyclorama (#0B0F17 Studio Cyc)" },
              { value: "clean_white", label: "Clean Commercial White (#F8FAFC Seamless)" },
              { value: "concrete_gray", label: "Industrial Concrete Gray (#18181B)" },
              { value: "gradient_studio", label: "Electric Studio Gradient (Subtle Accent)" },
              { value: "custom", label: "Minimalist Deep Black (#050505 Stage)" },
            ]}
          />
        </div>

        {/* Environment (Mode-Aware: Lifestyle & Editorial) */}
        {showEnvironment && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[var(--text-muted)] block">
              ENVIRONMENT & SCENE
            </label>
            <Select
              value={settings.environment || "studio_loft"}
              onChange={(val) => onChangeSettings({ environment: val as VisualEnvironment })}
              disabled={disabled || isGenerating}
              options={[
                { value: "studio_loft", label: "Modern Industrial Loft Studio" },
                { value: "minimal_interior", label: "Minimalist Architectural Interior" },
                { value: "urban_architectural", label: "Brutalist Urban Concrete & Glass" },
                { value: "natural_outdoor", label: "Nordic Alpine Natural Exterior" },
              ]}
            />
          </div>
        )}

        {/* Composition & Camera Angle */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-[var(--text-muted)] block">
            CAMERA COMPOSITION
          </label>
          <Select
            value={settings.composition}
            onChange={(val) => onChangeSettings({ composition: val as VisualComposition })}
            disabled={disabled || isGenerating}
            options={[
              { value: "center_hero", label: "Center Hero (Eye-Level 50mm)" },
              { value: "dynamic_angle", label: "Dynamic 3/4 Perspective Angle" },
              { value: "flat_lay", label: "Technical Overhead Flat Lay (90° Top-Down)" },
              { value: "macro_detail", label: "Macro Detail Focus (100mm Close-Up)" },
              { value: "wide_scene", label: "Wide Environmental Establishing View" },
            ]}
          />
        </div>

        {/* Model Direction (Mode-Aware: Model, Lifestyle, Editorial) */}
        {showModelDirection && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[var(--text-muted)] block">
              MODEL STYLING & POSE
            </label>
            <Select
              value={settings.modelDirection || "pose_front"}
              onChange={(val) => onChangeSettings({ modelDirection: val as VisualModelDirection })}
              disabled={disabled || isGenerating}
              options={[
                { value: "pose_front", label: "Neutral Studio Stance (Full Frontal)" },
                { value: "in_motion", label: "Athletic Dynamic Motion (Mid-Stride)" },
                { value: "editorial_gaze", label: "High-Fashion Editorial Gaze (3/4 Turn)" },
                { value: "casual_stance", label: "Relaxed Contemporary Stance" },
                { value: "form_fitting", label: "Tailored Form Silhouette Emphasis" },
              ]}
            />
          </div>
        )}

        {/* Additional Prompt / Lighting Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-[var(--text-muted)] block">
            CUSTOM STYLING GUIDANCE (OPTIONAL)
          </label>
          <Textarea
            value={settings.additionalPrompt || ""}
            onChange={(e) => onChangeSettings({ additionalPrompt: e.target.value })}
            placeholder="e.g. Crisp specular highlights along the collar seam, warm bounce card on left flank"
            rows={2}
            className="text-xs font-mono"
            disabled={disabled || isGenerating}
          />
        </div>

        {/* Generation Primary CTA */}
        <div className="pt-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onGenerate}
            isLoading={isGenerating}
            disabled={disabled}
            className="w-full justify-center"
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {isGenerating ? "Generating Visuals..." : `Generate ${activeMode.toUpperCase()} Visuals`}
          </Button>
          <p className="text-[10px] font-mono text-center text-[var(--text-muted)] mt-1.5">
            Creates 2 high-fidelity visual candidates in shared Jobs
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
