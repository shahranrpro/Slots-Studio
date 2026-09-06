import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { type ButtonVariant, type ButtonSize } from "./Button";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Accessible text description for screen readers.
   */
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-xs hover:brightness-105 active:scale-95 border border-transparent",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] active:scale-95 border border-[var(--border)]",
  outline:
    "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border-strong)] active:scale-95",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] active:scale-95 border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-95 border border-transparent",
};

const SIZE_MAP: Record<ButtonSize, string> = {
  sm: "h-8 w-8 text-xs rounded-[var(--radius-sm)]",
  md: "h-10 w-10 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 w-12 text-base rounded-[var(--radius-md)]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    variant = "secondary",
    size = "md",
    isLoading = false,
    children,
    className,
    disabled,
    type = "button",
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer shrink-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none",
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner size={size === "lg" ? "md" : "sm"} /> : children}
    </button>
  );
});
