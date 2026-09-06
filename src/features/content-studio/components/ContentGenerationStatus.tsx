"use client";

import React from "react";
import Link from "next/link";
import { type Job } from "@/lib/jobs/types";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export interface ContentGenerationStatusProps {
  activeJob?: Job | null;
}

export function ContentGenerationStatus({ activeJob }: ContentGenerationStatusProps) {
  if (!activeJob) return null;

  const isRunning = activeJob.status === "RUNNING" || activeJob.status === "QUEUED";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-3 text-xs select-none">
      <div className="flex items-center gap-3">
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)] shrink-0" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        )}

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--accent)]">
              JOB #{activeJob.id.slice(-6)}
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              • {activeJob.jobType}
            </span>
          </div>
          <p className="font-medium text-[var(--text-primary)] truncate">
            {activeJob.progressLabel || "Processing Content Generation Pipeline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-xs">
        <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-secondary)] border border-[var(--border)]">
          {activeJob.status}
        </span>

        <Link
          href="/app/jobs"
          className="flex items-center gap-1 font-mono text-[11px] text-[var(--accent)] hover:underline font-semibold"
        >
          <span>Track in My Jobs</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
