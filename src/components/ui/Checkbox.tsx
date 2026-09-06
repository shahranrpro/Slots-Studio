import React, { forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, checked, indeterminate = false, disabled, className, id, ...props },
  ref
) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group relative flex items-start gap-3 select-none cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border transition-all duration-150",
            "border-[var(--border-strong)] bg-[var(--surface-1)]",
            "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-[var(--accent-foreground)]",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
            "group-hover:border-[var(--text-secondary)]"
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3 stroke-[3]" />
          ) : checked ? (
            <Check className="h-3 w-3 stroke-[3]" />
          ) : null}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-medium text-[var(--text-primary)] leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="mt-0.5 text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
});
