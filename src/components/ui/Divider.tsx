import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("inline-block w-px self-stretch bg-[var(--border)]", className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center my-4 select-none", className)}
        {...props}
      >
        <div className="flex-grow border-t border-[var(--border)]" />
        <span className="px-3 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </span>
        <div className="flex-grow border-t border-[var(--border)]" />
      </div>
    );
  }

  return (
    <hr
      className={cn("my-4 w-full border-0 border-t border-[var(--border)]", className)}
      {...props}
    />
  );
}
