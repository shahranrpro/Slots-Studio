import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface AuthShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[var(--background)] p-4 sm:p-6 lg:p-8">
      {/* Background Accent Grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

      {/* Top Bar: Brand Logo & Appearance Switcher */}
      <header className="flex items-center justify-between mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] shadow-2xs">
            <BrandLogo size={22} alt="Slots Studio Logo" priority />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
            {APP_CONFIG.name}
          </span>
        </Link>

        <AppearanceSelector size="sm" />
      </header>

      {/* Center Auth Card Container */}
      <main className="flex flex-1 items-center justify-center py-10">
        <div
          className={cn(
            "w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface-1)] p-6 sm:p-8 shadow-2xl backdrop-blur-xs",
            className
          )}
        >
          {children}
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-[var(--text-muted)] font-mono">
        <p suppressHydrationWarning>© {new Date().getFullYear()} {APP_CONFIG.name} • Creative OS Authentication</p>
      </footer>
    </div>
  );
}
