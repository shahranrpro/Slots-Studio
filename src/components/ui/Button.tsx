import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_MAP: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold shadow-xs hover:brightness-105 active:scale-[0.98] border border-transparent",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] active:scale-[0.98] border border-[var(--border)]",
  outline:
    "bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border-strong)] active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] active:scale-[0.98] border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] border border-transparent font-medium",
};

const SIZE_MAP: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none",
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size={size === "lg" ? "md" : "sm"} className="shrink-0" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
});
