"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

export interface HeroLogoRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function HeroLogoReveal({
  size = 32,
  className,
  ...props
}: HeroLogoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (!logoWrapperRef.current) return;

    const timeline = anime.timeline({
      easing: "cubicBezier(0.16, 1, 0.3, 1)",
    });

    timeline
      .add({
        targets: logoWrapperRef.current,
        opacity: [0, 1],
        scale: [0.9, 1],
        translateY: [6, 0],
        duration: 700,
      })
      .add(
        {
          targets: signalRef.current,
          opacity: [0, 1],
          scale: [0.6, 1],
          duration: 400,
        },
        "-=300"
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("inline-flex items-center gap-3 select-none", className)}
      {...props}
    >
      <div
        ref={logoWrapperRef}
        className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-2)] shadow-xs transition-colors hover:border-[var(--accent)]"
      >
        <BrandLogo size={size} priority alt="Slots Studio S Mark" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
            Slots Studio
          </span>
          <span
            ref={signalRef}
            className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
            title="Engine Ready"
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          Context Engine OS
        </span>
      </div>
    </div>
  );
}
