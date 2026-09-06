import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string | null;
}

export function AuthSuccess({ message, className, ...props }: AuthSuccessProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius-md)] border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-medium",
        className
      )}
      {...props}
    >
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}
