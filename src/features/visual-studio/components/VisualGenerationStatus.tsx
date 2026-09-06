"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { type Job } from "@/lib/jobs/types";

export interface VisualGenerationStatusProps {
  activeJob?: Job | null;
}

export function VisualGenerationStatus({ activeJob }: VisualGenerationStatusProps) {
  if (!activeJob) return null;

  const isRunning = activeJob.status === "RUNNING" || activeJob.status === "QUEUED";
  const isReview = activeJob.status === "REVIEW";
  const isFailed = activeJob.status === "FAILED";

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-2)] p-3 flex items-center justify-between gap-3 text-xs select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
          {isRunning ? (
            <Activity className="h-3.5 w-3.5 animate-pulse" />
          ) : isReview ? (
            <Clock className="h-3.5 w-3.5" />
          ) : isFailed ? (
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
          )}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              PIPELINE JOB #{activeJob.id.substring(activeJob.id.length - 6).toUpperCase()}
            </span>
            <Badge
              variant={
                isRunning
                  ? "warning"
                  : isReview
                  ? "accent"
                  : isFailed
                  ? "danger"
                  : "success"
              }
              dot={isRunning}
            >
              {activeJob.status}
            </Badge>
          </div>
          <p className="font-bold text-[var(--text-primary)] truncate text-xs">
            {activeJob.progressLabel ||
              (isRunning
                ? "SYNTHESIZING VISUAL CANDIDATES"
                : isReview
                ? "AWAITING HUMAN REVIEW"
                : "PIPELINE COMPLETED")}
          </p>
        </div>
      </div>

      {activeJob.inputSummary && (
        <span className="hidden md:inline-block font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[280px]">
          {activeJob.inputSummary}
        </span>
      )}
    </div>
  );
}
