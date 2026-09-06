import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string | null;
}

export function AuthError({ message, className, ...props }: AuthErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-medium",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}
