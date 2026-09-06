"use client";

import React from "react";
import { type Job } from "@/lib/jobs/types";
import { JobStatusBadge } from "./JobStatus";
import { JobProgress } from "./JobProgress";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RotateCcw, XCircle, Eye, Activity, SearchX } from "lucide-react";

export interface JobListProps {
  jobs: Job[];
  isFiltered: boolean;
  onOpen: (job: Job) => void;
  onRetry: (job: Job) => void;
  onCancel: (job: Job) => void;
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function JobList({
  jobs,
  isFiltered,
  onOpen,
  onRetry,
  onCancel,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <Card variant="subtle" className="p-8 sm:p-12 text-center border-[var(--border)]">
        {isFiltered ? (
          <EmptyState
            title="NO MATCHING JOBS"
            description="No background jobs match your current search or filter criteria. Try adjusting your query."
            icon={<SearchX className="h-10 w-10 text-[var(--text-muted)]" />}
          />
        ) : (
          <EmptyState
            title="NO JOBS YET"
            description="Background work will appear here when you trigger concept generation, refinement, or asset processing."
            icon={<Activity className="h-10 w-10 text-[var(--accent)]" />}
          />
        )}
      </Card>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)]">
      <table className="w-full text-left border-collapse text-xs select-none">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            <th className="py-2.5 px-3">Job Details</th>
            <th className="py-2.5 px-3">Studio</th>
            <th className="py-2.5 px-3">Project</th>
            <th className="py-2.5 px-3">Pipeline Status</th>
            <th className="py-2.5 px-3">Status</th>
            <th className="py-2.5 px-3">Time</th>
            <th className="py-2.5 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {jobs.map((job) => {
            const isRunning = job.status === "RUNNING";
            const isFailed = job.status === "FAILED";
            const isCancelled = job.status === "CANCELLED";
            const canRetry = isFailed || isCancelled;
            const canCancel = isRunning || job.status === "QUEUED";

            return (
              <tr
                key={job.id}
                onClick={() => onOpen(job)}
                className="hover:bg-[var(--surface-2)]/60 transition-colors cursor-pointer"
              >
                {/* Details */}
                <td className="py-2.5 px-3">
                  <div className="space-y-0.5 min-w-[180px]">
                    <span className="font-bold text-[var(--text-primary)] block truncate">
                      {job.jobType.replace(/_/g, " ")}
                    </span>
                    {job.inputSummary && (
                      <span className="font-mono text-[10px] text-[var(--text-muted)] block truncate max-w-[220px]">
                        {job.inputSummary}
                      </span>
                    )}
                  </div>
                </td>

                {/* Studio */}
                <td className="py-2.5 px-3">
                  <span className="font-mono text-[10px] font-bold text-[var(--accent)] px-1.5 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)] whitespace-nowrap">
                    {job.studio}
                  </span>
                </td>

                {/* Project Context */}
                <td className="py-2.5 px-3">
                  {job.projectName ? (
                    <div className="space-y-0.5 min-w-[140px]">
                      <span className="font-semibold text-[var(--text-primary)] block truncate">
                        {job.projectName}
                      </span>
                      {job.slotCode && (
                        <span className="font-mono text-[10px] text-[var(--text-muted)] block">
                          {job.slotCode}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">—</span>
                  )}
                </td>

                {/* Pipeline Progress / Status Description */}
                <td className="py-2.5 px-3 min-w-[160px]">
                  <JobProgress job={job} />
                </td>

                {/* Status Badge */}
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <JobStatusBadge status={job.status} />
                </td>

                {/* Time */}
                <td suppressHydrationWarning className="py-2.5 px-3 whitespace-nowrap font-mono text-[10px] text-[var(--text-muted)]">
                  {formatDate(job.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <div
                    className="inline-flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canRetry && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetry(job)}
                        leftIcon={<RotateCcw className="h-3 w-3" />}
                        className="text-[10px] h-6 px-2 text-[var(--accent)]"
                        title="Retry job"
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
                        className="text-[10px] h-6 px-2 hover:text-red-400"
                        title="Cancel job"
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpen(job)}
                      leftIcon={<Eye className="h-3 w-3" />}
                      className="text-[10px] h-6 px-2"
                      title="Inspect job"
                    >
                      Inspect
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
