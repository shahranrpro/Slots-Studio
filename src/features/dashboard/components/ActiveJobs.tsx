"use client";

import React from "react";
import Link from "next/link";
import { type JobItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveJobsProps {
  jobs: JobItem[];
}

export function ActiveJobs({ jobs }: ActiveJobsProps) {
  const activeCount = jobs.filter((j) => j.status === "Running" || j.status === "Queued").length;

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">ACTIVE JOBS</CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={activeCount > 0 ? "accent" : "outline"} dot={activeCount > 0}>
            {activeCount} RUNNING
          </Badge>
          <Link href="/app/jobs" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {jobs.length === 0 ? (
          <div className="py-6 text-center space-y-1.5">
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NO ACTIVE JOBS</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Background work will appear here when available.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-3.5 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] px-1 rounded bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
                      {job.studioCode}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {job.studio}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {job.title}
                  </h4>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                    Target: {job.projectName}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {job.status === "Running" && (
                    <Loader2 className="h-3 w-3 animate-spin text-[var(--accent)]" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded",
                      job.status === "Running"
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "bg-[var(--surface-3)] text-[var(--text-muted)]"
                    )}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              {job.status === "Running" ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Progress</span>
                    <span className="font-bold text-[var(--text-primary)]">{job.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-3)]">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300 rounded-full"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-[var(--text-muted)] flex justify-between">
                  <span>Queued in pipeline</span>
                  <span>{job.startedAt}</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
