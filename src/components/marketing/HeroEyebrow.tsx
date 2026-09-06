import React from "react";
import { cn } from "@/lib/utils";

export interface HeroEyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function HeroEyebrow({
  label = "AI CREATIVE WORKFLOW",
  className,
  ...props
}: HeroEyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)]/80 px-3.5 py-1 text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)] shadow-2xs backdrop-blur-xs select-none",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </span>
      <span className="font-semibold text-[var(--text-primary)]">{label}</span>
    </div>
  );
}
