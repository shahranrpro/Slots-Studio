import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-8 text-xs px-2.5",
  md: "h-10 text-sm px-3.5",
  lg: "h-12 text-base px-4",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    error,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    inputSize = "md",
    className,
    disabled,
    id,
    ...props
  },
  ref
) {
  const hasError = Boolean(error);

  return (
    <div className="relative flex w-full items-center">
      {leftAddon && (
        <span className="inline-flex h-full items-center rounded-l-[var(--radius-md)] border border-r-0 border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-xs text-[var(--text-muted)] select-none">
          {leftAddon}
        </span>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={hasError ? "true" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-md)] border bg-[var(--surface-1)] text-[var(--text-primary)] transition-all duration-150",
            "placeholder:text-[var(--text-muted)]",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-2)]",
            hasError
              ? "border-red-500/80 focus-visible:outline-red-500"
              : "border-[var(--border-strong)] hover:border-[var(--border-strong)]",
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            leftAddon && "rounded-l-none",
            rightAddon && "rounded-r-none",
            SIZE_MAP[inputSize],
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)]">
            {rightIcon}
          </div>
        )}
      </div>

      {rightAddon && (
        <span className="inline-flex h-full items-center rounded-r-[var(--radius-md)] border border-l-0 border-[var(--border-strong)] bg-[var(--surface-2)] px-3 text-xs text-[var(--text-muted)] select-none">
          {rightAddon}
        </span>
      )}
    </div>
  );
});
