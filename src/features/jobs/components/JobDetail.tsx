"use client";

import React from "react";
import { type Job } from "@/lib/jobs/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { JobStatusBadge } from "./JobStatus";
import { JobProgress } from "./JobProgress";
import { RotateCcw, XCircle, ExternalLink, AlertTriangle, Clock, Layers, FolderKanban } from "lucide-react";
import Link from "next/link";

export interface JobDetailProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: (job: Job) => void;
  onCancel: (job: Job) => void;
}

function formatDate(isoString?: string): string {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function JobDetail({
  job,
  isOpen,
  onClose,
  onRetry,
  onCancel,
}: JobDetailProps) {
  if (!job || !isOpen) return null;

  const isRunning = job.status === "RUNNING";
  const isFailed = job.status === "FAILED";
  const isCancelled = job.status === "CANCELLED";
  const canRetry = isFailed || isCancelled;
  const canCancel = isRunning || job.status === "QUEUED";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={job.jobType.replace(/_/g, " ")}
      description={`Job ID: ${job.id}`}
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-2 select-none">
        {/* Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {job.studio} STUDIO
            </span>
            <JobStatusBadge status={job.status} />
          </div>

          <JobProgress job={job} />
        </div>

        {/* Safe Error Alert if Failed */}
        {isFailed && (
          <div className="p-3 rounded-[var(--radius-md)] border border-red-500/30 bg-red-950/10 text-red-400 space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{job.errorCode || "PIPELINE_EXECUTION_ERROR"}</span>
            </div>
            <p className="text-[11px] text-red-300/80">
              {job.errorMessageSafe || "We could not complete this job. Your project parameters and context are safe."}
            </p>
          </div>
        )}

        {/* Context & Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Project Info */}
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>PROJECT CONTEXT</span>
            </div>
            {job.projectName ? (
              <div className="space-y-1">
                <span className="text-[var(--text-primary)] font-bold block truncate">
                  {job.projectName}
                </span>
                {job.slotCode && (
                  <span className="text-[var(--accent)] block text-[11px]">
                    {job.slotCode}
                  </span>
                )}
                {job.projectId && (
                  <Link
                    href={`/app/projects/${job.projectId}`}
                    className="inline-flex items-center gap-1 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] pt-1"
                  >
                    Open Project <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            ) : (
              <span className="text-[var(--text-muted)]">No project linked</span>
            )}
          </div>

          {/* Engine / Provider Info */}
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-2">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
              <Layers className="h-3.5 w-3.5" />
              <span>PIPELINE ENGINE</span>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-primary)] font-bold block truncate">
                {job.provider || "SlotsStudio-DevEngine"}
              </span>
              {job.retryCount ? (
                <span className="text-[var(--text-muted)] block text-[11px]">
                  Retry Attempt #{job.retryCount}
                </span>
              ) : null}
              {job.sourceJobId && (
                <span className="text-[var(--text-muted)] block text-[10px] truncate">
                  Source: {job.sourceJobId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timing Audit */}
        <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-2.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[10px]">
            <Clock className="h-3.5 w-3.5" />
            <span>EXECUTION TIMING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-[var(--text-muted)] block text-[10px]">CREATED</span>
              <span suppressHydrationWarning className="text-[var(--text-primary)]">{formatDate(job.createdAt)}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[10px]">STARTED</span>
              <span suppressHydrationWarning className="text-[var(--text-primary)]">{formatDate(job.startedAt)}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] block text-[10px]">COMPLETED</span>
              <span suppressHydrationWarning className="text-[var(--text-primary)]">{formatDate(job.completedAt)}</span>
            </div>
          </div>
        </div>

        {/* Input Summary */}
        {job.inputSummary && (
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-1.5 text-xs">
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              INPUT PARAMETERS SUMMARY
            </span>
            <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
              {job.inputSummary}
            </p>
          </div>
        )}

        {/* Linked Output Assets */}
        {job.outputIds && job.outputIds.length > 0 && (
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] space-y-2 text-xs">
            <span className="font-mono text-[10px] text-[var(--text-muted)] block">
              GENERATED OUTPUT ASSETS ({job.outputIds.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {job.outputIds.map((outputId) => (
                <Link
                  key={outputId}
                  href="/app/assets"
                  className="font-mono text-[10px] px-2 py-1 rounded bg-[var(--surface-3)] border border-[var(--border)] text-[var(--accent)] hover:border-[var(--accent)] transition-colors inline-flex items-center gap-1"
                >
                  {outputId} <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRetry(job);
                  onClose();
                }}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs text-[var(--accent)]"
              >
                Retry Job
              </Button>
            )}

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCancel(job);
                  onClose();
                }}
                leftIcon={<XCircle className="h-3.5 w-3.5" />}
                className="text-xs text-red-400"
              >
                Cancel Job
              </Button>
            )}
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
