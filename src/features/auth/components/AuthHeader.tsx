import React from "react";
import { cn } from "@/lib/utils";

export interface AuthHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export function AuthHeader({
  title,
  subtitle,
  eyebrow = "SLOTS STUDIO AUTH",
  className,
  ...props
}: AuthHeaderProps) {
  // Ensure no accidental trailing period in title
  const cleanTitle = title.endsWith(".") ? title.slice(0, -1) : title;

  return (
    <div className={cn("space-y-2 text-center pb-6", className)} {...props}>
      {eyebrow && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
        {cleanTitle}
      </h1>
      {subtitle && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
