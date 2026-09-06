"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Layers, ShieldCheck } from "lucide-react";

export interface WorkspaceWelcomeProps {
  userName?: string;
  onNext: () => void;
}

export function WorkspaceWelcome({ userName, onNext }: WorkspaceWelcomeProps) {
  return (
    <div className="space-y-8 text-center sm:text-left">
      {/* Eyebrow & Title */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>FIRST-TIME SETUP</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
          WELCOME TO <br className="hidden sm:block" />
          <span className="text-[var(--accent)]">SLOTS STUDIO</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
          One workspace for turning product ideas into connected creative outputs.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-left pt-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Layers className="h-4 w-4" />
          </div>
          <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
            5 Connected Studios
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Move fluidly from Product briefs to Visuals, Copy, Campaigns, and Production specs.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
            Unified Context Lock
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Preserve your design DNA, colors, materials, and brand rules automatically across every studio.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)]">
          Signed in as <span className="text-[var(--text-primary)] font-medium">{userName || "Creator"}</span>
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className="w-full sm:w-auto justify-center"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create Your Workspace
        </Button>
      </div>
    </div>
  );
}
