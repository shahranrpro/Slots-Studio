"use client";

import React from "react";
import Link from "next/link";
import { type Job } from "@/lib/jobs/types";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpRight, CheckCircle2, AlertTriangle } from "lucide-react";

export interface CampaignGenerationStatusProps {
  activeJob: Job | null;
}

export function CampaignGenerationStatus({ activeJob }: CampaignGenerationStatusProps) {
  if (!activeJob) return null;

  const isRunning = activeJob.status === "RUNNING" || activeJob.status === "QUEUED";
  const isReview = activeJob.status === "REVIEW";
  const isFailed = activeJob.status === "FAILED";

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface-2)] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        {isRunning && <Spinner size="sm" className="text-[var(--accent)]" />}
        {isReview && <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />}
        {isFailed && <AlertTriangle className="h-4 w-4 text-red-400" />}

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[var(--text-primary)]">
              {activeJob.progressLabel || "CAMPAIGN SYNTHESIS PIPELINE"}
            </span>
            <Badge
              variant={
                isReview ? "success" : isRunning ? "accent" : isFailed ? "danger" : "default"
              }
            >
              {activeJob.status}
            </Badge>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            {activeJob.inputSummary || "Multi-aspect creative campaign kit."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <span className="font-mono text-[11px] text-[var(--text-muted)]">
          JOB: {activeJob.id.slice(0, 16)}...
        </span>
        <Link
          href="/app/jobs"
          className="flex items-center gap-1 font-mono text-[11px] text-[var(--accent)] hover:underline"
        >
          <span>VIEW ALL JOBS</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
