"use client";

import React from "react";
import { type Job } from "@/lib/jobs/types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface JobProgressProps {
  job: Job;
  className?: string;
  showIcon?: boolean;
}

export function JobProgress({ job, className, showIcon = true }: JobProgressProps) {
  const isRunning = job.status === "RUNNING";
  const label = job.progressLabel || (
    job.status === "QUEUED"
      ? "QUEUED IN WORKSPACE"
      : job.status === "RUNNING"
      ? "PROCESSING GENERATION"
      : job.status === "REVIEW"
      ? "AWAITING HUMAN REVIEW"
      : job.status === "COMPLETED"
      ? "COMPLETED SUCCESSFULLY"
      : job.status === "FAILED"
      ? "EXECUTION FAILED"
      : "CANCELLED BY USER"
  );

  return (
    <div className={cn("flex items-center gap-2 text-xs font-mono select-none", className)}>
      {isRunning && showIcon && (
        <Loader2 className="h-3 w-3 animate-spin text-[var(--accent)] shrink-0" />
      )}
      <span
        className={cn(
          "truncate text-[11px]",
          isRunning ? "text-[var(--accent)] font-semibold" : "text-[var(--text-secondary)]"
        )}
      >
        {label}
      </span>
    </div>
  );
}
