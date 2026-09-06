import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { OnboardingProgress } from "./OnboardingProgress";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface OnboardingShellProps {
  children: React.ReactNode;
  currentStep: number;
  className?: string;
}

export function OnboardingShell({
  children,
  currentStep,
  className,
}: OnboardingShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[var(--background)] p-4 sm:p-6 lg:p-8">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between mx-auto w-full max-w-4xl">
        <Link
          href="/app"
          className="inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] shadow-2xs">
            <BrandLogo size={22} alt="Slots Studio Logo" priority />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
            {APP_CONFIG.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="rounded bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-black uppercase hidden sm:inline-block">
            ONBOARDING
          </span>
          <AppearanceSelector size="sm" />
        </div>
      </header>

      {/* Center Container with Progress & Step Card */}
      <main className="flex flex-1 flex-col items-center justify-center py-8">
        <div className="w-full max-w-2xl space-y-6">
          <OnboardingProgress currentStep={currentStep} />

          <div
            className={cn(
              "w-full rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-6 sm:p-10 shadow-2xl backdrop-blur-xs",
              className
            )}
          >
            {children}
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="mx-auto w-full max-w-4xl text-center text-xs text-[var(--text-muted)] font-mono">
        <p suppressHydrationWarning>© {new Date().getFullYear()} {APP_CONFIG.name} • Workspace Setup</p>
      </footer>
    </div>
  );
}
