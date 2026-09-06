"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Layers,
  Wand2,
  Compass,
  FileCheck2,
  Box,
  Eye,
  Sliders,
  CheckCircle2,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type StudioTab = "product" | "visual" | "content" | "campaign" | "production";

const STUDIO_TABS: { id: StudioTab; label: string; icon: React.ReactNode }[] = [
  { id: "product", label: "Product Studio", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: "visual", label: "Visual Studio", icon: <Layers className="h-3.5 w-3.5" /> },
  { id: "content", label: "Content Studio", icon: <Wand2 className="h-3.5 w-3.5" /> },
  { id: "campaign", label: "Campaign Studio", icon: <Compass className="h-3.5 w-3.5" /> },
  { id: "production", label: "Production Studio", icon: <FileCheck2 className="h-3.5 w-3.5" /> },
];

export function HeroApplicationPreview() {
  const [activeStudio, setActiveStudio] = useState<StudioTab>("product");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-2 sm:p-3 shadow-2xl overflow-hidden"
    >
      {/* Decorative Outer Aura */}
      <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl pointer-events-none" />

      {/* Workstation Outer Container */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
        {/* Workstation Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-1)] px-4 py-3">
          {/* Slot & Project Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40" />
            </div>

            <div className="h-4 w-px bg-[var(--border)]" />

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                SLOT-SS-02481
              </span>
              <span className="text-xs text-[var(--text-muted)]">•</span>
              <span className="font-display text-xs font-bold text-[var(--text-primary)]">
                Technical Training Jacket
              </span>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            <Badge variant="warning" dot size="sm">
              IN REVIEW
            </Badge>
            <span className="hidden sm:inline-flex text-[11px] font-mono text-[var(--text-muted)]">
              18 Assets Active
            </span>
          </div>
        </div>

        {/* Studio Tabs Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 scrollbar-none">
          {STUDIO_TABS.map((tab) => {
            const isActive = activeStudio === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStudio(tab.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-all duration-150 select-none cursor-pointer",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]",
                  isActive
                    ? "bg-[var(--surface-1)] text-[var(--text-primary)] font-semibold shadow-2xs border border-[var(--border)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
                )}
              >
                <span className={isActive ? "text-[var(--accent)]" : "text-current"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Workstation Interactive Workspace */}
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-12 sm:p-4">
          {/* Left Canvas: Product Visualization */}
          <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-4 sm:col-span-8 min-h-[280px]">
            {/* Viewport Action Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  VIEWPORT // GENERATIVE MESH
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              </div>
              <div className="flex items-center gap-1 text-[var(--text-muted)]">
                <button
                  type="button"
                  aria-label="Refresh preview"
                  className="rounded p-1 hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  aria-label="Expand viewport"
                  className="rounded p-1 hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Central Schematic Mockup / Wireframe */}
            <div className="my-4 flex flex-col items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] bg-[var(--surface-2)]/50 py-8 px-4 text-center">
              <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-3)] shadow-inner">
                <Box className="h-10 w-10 text-[var(--accent)] stroke-[1.5]" />
                <span className="absolute -bottom-1 -right-1 rounded bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold font-mono text-black">
                  4K
                </span>
              </div>

              <div className="space-y-1 max-w-xs">
                <p className="font-display text-xs font-bold text-[var(--text-primary)]">
                  {activeStudio === "product" && "Silhouettes & Functional Architecture"}
                  {activeStudio === "visual" && "Studio Lookbook & Lighting Rig"}
                  {activeStudio === "content" && "Multi-Language Technical Copy"}
                  {activeStudio === "campaign" && "Omnichannel Marketing Kit"}
                  {activeStudio === "production" && "Vector Tech-Pack & Measurement Spec"}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Context synced across all active pipeline nodes
                </p>
              </div>
            </div>

            {/* Bottom Mini Asset Reel */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-[11px] text-[var(--text-muted)] font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[var(--text-primary)]">
                  <Eye className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Interactive 3D</span>
                </span>
                <span>•</span>
                <span>Color: Stealth Black</span>
              </div>
              <span className="text-[var(--accent)]">SYNCHRONIZED</span>
            </div>
          </div>

          {/* Right Sidebar: Context Parameters */}
          <div className="flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-4 sm:col-span-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
                  PARAMETERS
                </span>
                <Sliders className="h-3 w-3 text-[var(--text-muted)]" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Material Shell</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    Ripstop Nylon 240 GSM
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Thermal Rating</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    Windproof / Sub-zero
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">Trims & Hardware</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    YKK AquaGuard Matte
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Context Lock Active</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-tight">
                All 5 studios automatically inherit spec updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
