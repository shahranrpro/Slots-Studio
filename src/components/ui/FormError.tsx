import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormError({ message, children, className, ...props }: FormErrorProps) {
  const content = message || children;
  if (!content) return null;

  return (
    <p
      role="alert"
      className={cn("flex items-center gap-1.5 text-xs font-medium text-red-500", className)}
      {...props}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{content}</span>
    </p>
  );
}
