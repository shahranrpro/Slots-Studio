import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  description?: string;
  error?: string;
  success?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  required,
  description,
  error,
  success,
  htmlFor,
  children,
  className,
  ...props
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;

  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && <span className="text-[var(--accent)] font-bold">*</span>}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="text-[11px] text-[var(--text-secondary)] leading-relaxed pb-0.5">
          {description}
        </p>
      )}

      {children}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-500 pt-0.5">
          {error}
        </p>
      )}

      {success && !error && (
        <p className="text-xs font-medium text-emerald-400 pt-0.5">
          {success}
        </p>
      )}
    </div>
  );
}
