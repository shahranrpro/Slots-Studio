import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "interactive" | "outlined" | "subtle";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  as?: React.ElementType;
}

const VARIANT_MAP: Record<CardVariant, string> = {
  default:
    "bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-primary)]",
  interactive:
    "bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-primary)] cursor-pointer transition-all duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
  outlined:
    "bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)]",
  subtle:
    "bg-[var(--surface-2)] border border-transparent text-[var(--text-primary)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", as: Component = "div", className, children, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      tabIndex={variant === "interactive" ? (props.tabIndex ?? 0) : props.tabIndex}
      className={cn(
        "rounded-[var(--radius-lg)] p-6 overflow-hidden",
        VARIANT_MAP[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-bold tracking-tight text-[var(--text-primary)]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--text-secondary)] leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-[var(--border)] mt-4", className)} {...props}>
      {children}
    </div>
  );
}
