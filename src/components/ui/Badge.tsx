import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "accent" | "outline" | "success" | "warning" | "danger";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const VARIANT_MAP: Record<BadgeVariant, { container: string; dot: string }> = {
  default: {
    container: "bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)]",
    dot: "bg-[var(--text-secondary)]",
  },
  accent: {
    container: "bg-[var(--accent)] text-[var(--accent-foreground)] font-bold border border-transparent",
    dot: "bg-black",
  },
  outline: {
    container: "bg-transparent text-[var(--text-secondary)] border border-[var(--border-strong)]",
    dot: "bg-[var(--text-muted)]",
  },
  success: {
    container: "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40",
    dot: "bg-emerald-400",
  },
  warning: {
    container: "bg-amber-950/40 text-amber-300 border border-amber-800/40",
    dot: "bg-amber-400",
  },
  danger: {
    container: "bg-rose-950/40 text-rose-300 border border-rose-800/40",
    dot: "bg-rose-400",
  },
};

const SIZE_MAP: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1.5 rounded-[var(--radius-sm)]",
  md: "px-2.5 py-1 text-xs gap-2 rounded-[var(--radius-sm)]",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  children,
  className,
  ...props
}: BadgeProps) {
  const styles = VARIANT_MAP[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium tracking-wide uppercase shrink-0 select-none",
        styles.container,
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", styles.dot)} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
