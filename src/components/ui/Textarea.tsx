import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, disabled, id, rows = 3, ...props },
  ref
) {
  const hasError = Boolean(error);

  return (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      disabled={disabled}
      aria-invalid={hasError ? "true" : undefined}
      className={cn(
        "w-full rounded-[var(--radius-md)] border bg-[var(--surface-1)] p-3 text-sm text-[var(--text-primary)] transition-all duration-150",
        "placeholder:text-[var(--text-muted)]",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-2)]",
        hasError
          ? "border-red-500/80 focus-visible:outline-red-500"
          : "border-[var(--border-strong)] hover:border-[var(--border-strong)]",
        className
      )}
      {...props}
    />
  );
});
