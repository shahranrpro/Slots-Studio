"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { type CreationIntent, type TeamStructure } from "@/lib/workspace/types";

export interface OnboardingReadyProps {
  workspaceName: string;
  intent: CreationIntent;
  team: TeamStructure;
}

export function OnboardingReady({
  workspaceName,
  intent,
  team,
}: OnboardingReadyProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await fetch("/api/workspace/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });

      window.location.href = "/app/projects";
    } catch {
      window.location.href = "/app/projects";
    }
  };

  return (
    <div className="space-y-8 text-center sm:text-left">
      {/* Eyebrow & Title */}
      <div className="space-y-2">
        <Badge variant="accent" dot>
          SETUP COMPLETE
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          READY TO CREATE
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Your workspace is configured and ready for its first project.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] p-5 space-y-4 text-left font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[var(--accent)]" />
            <span className="font-bold text-[var(--text-primary)] text-sm">{workspaceName || "My Creative Workspace"}</span>
          </div>
          <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
            ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Your Role</span>
            <p className="font-semibold text-[var(--text-primary)] mt-0.5">OWNER</p>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Focus Area</span>
            <p className="font-semibold text-[var(--text-primary)] mt-0.5">{intent || "Products"}</p>
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase">Team Scale</span>
            <p className="font-semibold text-[var(--text-primary)] mt-0.5">{team || "Small Team"}</p>
          </div>
        </div>
      </div>

      {/* Next Step Feature Card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-4 flex items-start gap-3.5 text-left">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Next: Launch Your First Project
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            In the upcoming project creation step, you will define your product concept and carry its design parameters across all 5 studios.
          </p>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleFinish}
          isLoading={isFinishing}
          className="w-full justify-center text-sm font-bold"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create First Project
        </Button>
      </div>
    </div>
  );
}
