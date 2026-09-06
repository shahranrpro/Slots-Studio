import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

const STEPS = [
  { step: 1, label: "Welcome" },
  { step: 2, label: "Workspace" },
  { step: 3, label: "Intent" },
  { step: 4, label: "Ready" },
];

export function OnboardingProgress({
  currentStep,
  className,
}: OnboardingProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={4}
      aria-label={`Onboarding progress: step ${currentStep} of 4`}
      className={cn("w-full py-4", className)}
    >
      <div className="flex items-center justify-between">
        {STEPS.map((s, idx) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              {/* Step Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-mono font-bold transition-all duration-200",
                    isCompleted &&
                      "border-[var(--accent)] bg-[var(--accent)] text-black",
                    isCurrent &&
                      "border-[var(--accent)] bg-[var(--surface-3)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30 ring-offset-2 ring-offset-[var(--background)]",
                    !isCompleted &&
                      !isCurrent &&
                      "border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : s.step}
                </div>
                <span
                  className={cn(
                    "hidden sm:block text-[11px] font-medium tracking-tight",
                    isCurrent ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors duration-200",
                    currentStep > s.step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
