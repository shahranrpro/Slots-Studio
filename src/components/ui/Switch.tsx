"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    label,
    description,
    id,
    className,
    "aria-label": ariaLabel,
  },
  ref
) {
  const [internalChecked, setInternalChecked] = React.useState<boolean>(checked ?? defaultChecked);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onCheckedChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 select-none",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-colors duration-150 cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
          isChecked ? "bg-[var(--accent)]" : "bg-[var(--surface-3)] border-[var(--border-strong)]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-xs transition-transform duration-150",
            isChecked
              ? "translate-x-4 bg-black"
              : "translate-x-0.5 bg-[var(--text-secondary)]"
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col cursor-pointer" onClick={toggle}>
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
    </div>
  );
});
