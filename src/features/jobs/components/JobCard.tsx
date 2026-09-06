"use client";

import React from "react";
import { type Job } from "@/lib/jobs/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobStatusBadge } from "./JobStatus";
import { JobProgress } from "./JobProgress";
import { RotateCcw, XCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface JobCardProps {
  job: Job;
  onOpen: (job: Job) => void;
  onRetry: (job: Job) => void;
  onCancel: (job: Job) => void;
}

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  } catch {
    return isoString;
  }
}

export function JobCard({
  job,
  onOpen,
  onRetry,
  onCancel,
}: JobCardProps) {
  const isRunning = job.status === "RUNNING";
  const isFailed = job.status === "FAILED";
  const isCancelled = job.status === "CANCELLED";
  const canRetry = isFailed || isCancelled;
  const canCancel = isRunning || job.status === "QUEUED";

  return (
    <Card
      variant="subtle"
      className={cn(
        "flex flex-col justify-between p-4 border transition-all select-none space-y-3 group cursor-pointer",
        isRunning
          ? "border-[var(--accent)]/40 bg-[var(--surface-1)] hover:border-[var(--accent)]/60"
          : isFailed
          ? "border-red-500/40 bg-red-950/5 hover:border-red-500/60"
          : "border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)]"
      )}
      onClick={() => onOpen(job)}
    >
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] font-bold text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {job.studio} STUDIO
            </span>
            {job.slotCode && (
              <span className="font-mono text-[9px] text-[var(--text-secondary)] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                {job.slotCode}
              </span>
            )}
          </div>

          <JobStatusBadge status={job.status} />
        </div>

        {/* Title & Project Meta */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs font-bold text-[var(--text-primary)] truncate" title={job.projectName || job.jobType}>
            {job.projectName ? `${job.projectName} — ${job.jobType.replace(/_/g, " ")}` : job.jobType.replace(/_/g, " ")}
          </h4>

          {job.inputSummary && (
            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
              {job.inputSummary}
            </p>
          )}
        </div>

        {/* Progress / Status Description */}
        <div className="pt-1">
          <JobProgress job={job} />
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div
        className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between gap-1 text-[10px] font-mono text-[var(--text-muted)]"
        onClick={(e) => e.stopPropagation()}
      >
        <span suppressHydrationWarning>{formatTimeAgo(job.createdAt)}</span>

        <div className="flex items-center gap-1">
          {canRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(job)}
              leftIcon={<RotateCcw className="h-3 w-3" />}
              className="text-[10px] h-6 px-1.5 text-[var(--accent)]"
            >
              Retry
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(job)}
              leftIcon={<XCircle className="h-3 w-3" />}
              className="text-[10px] h-6 px-1.5 hover:text-red-400"
            >
              Cancel
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpen(job)}
            leftIcon={<Eye className="h-3 w-3" />}
            className="text-[10px] h-6 px-1.5"
          >
            Inspect
          </Button>
        </div>
      </div>
    </Card>
  );
}
