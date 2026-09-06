"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2, Box, Layers, Megaphone, Palette, HelpCircle, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { type CreationIntent, type TeamStructure } from "@/lib/workspace/types";

export interface OnboardingIntentProps {
  initialIntent?: CreationIntent;
  initialTeam?: TeamStructure;
  onBack: () => void;
  onNext: (answers: { creationIntent: CreationIntent; teamStructure: TeamStructure }) => void;
}

const INTENT_OPTIONS: { id: CreationIntent; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: "Products",
    label: "Products",
    desc: "Apparel, footwear, physical goods & tech packs",
    icon: Box,
  },
  {
    id: "Collections",
    label: "Collections",
    desc: "Seasonal lines, concept drops & lookbooks",
    icon: Layers,
  },
  {
    id: "Campaigns",
    label: "Campaigns",
    desc: "Multi-channel ad imagery & marketing visuals",
    icon: Megaphone,
  },
  {
    id: "Brand Assets",
    label: "Brand Assets",
    desc: "3D renders, synthetic photography & mockups",
    icon: Palette,
  },
  {
    id: "Other",
    label: "Other",
    desc: "Custom creative and experimental workflows",
    icon: HelpCircle,
  },
];

const TEAM_OPTIONS: { id: TeamStructure; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Solo", label: "Solo", desc: "Just me", icon: User },
  { id: "Small Team", label: "Small Team", desc: "2–10 members", icon: Users },
  { id: "Studio", label: "Studio", desc: "Agency / studio", icon: Layers },
  { id: "Growing Team", label: "Growing Team", desc: "10+ members", icon: Users },
];

export function OnboardingIntent({
  initialIntent = "Products",
  initialTeam = "Small Team",
  onBack,
  onNext,
}: OnboardingIntentProps) {
  const [intent, setIntent] = useState<CreationIntent>(initialIntent);
  const [team, setTeam] = useState<TeamStructure>(initialTeam);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/workspace/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 3,
          answers: { creationIntent: intent, teamStructure: team },
        }),
      });

      onNext({ creationIntent: intent, teamStructure: team });
    } catch {
      onNext({ creationIntent: intent, teamStructure: team });
    }
  };

  return (
    <div className="space-y-6">
      {/* Eyebrow & Title */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">
          STEP 3 OF 4 • WORKSPACE GOALS
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          WHAT ARE YOU CREATING
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Select what best describes your primary creative focus and team structure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Section 1: Intent Options */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
            Primary Creative Focus
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {INTENT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = intent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntent(opt.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-[var(--radius-lg)] border p-3.5 text-left transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface-3)] ring-1 ring-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border",
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                        : "border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-muted)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug mt-0.5 truncate">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Team Structure */}
        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
          <label className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider font-mono">
            How Do You Work
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TEAM_OPTIONS.map((opt) => {
              const isSelected = team === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTeam(opt.id)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-[var(--radius-md)] border p-3 text-center transition-all duration-150 cursor-pointer",
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--surface-3)] ring-1 ring-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onBack}
            disabled={isSubmitting}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
