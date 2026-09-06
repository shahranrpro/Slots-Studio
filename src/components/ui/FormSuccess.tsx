import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormSuccessProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormSuccess({ message, children, className, ...props }: FormSuccessProps) {
  const content = message || children;
  if (!content) return null;

  return (
    <p
      className={cn("flex items-center gap-1.5 text-xs font-medium text-emerald-400", className)}
      {...props}
    >
      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{content}</span>
    </p>
  );
}
