"use client";

import React from "react";
import { type UsageData } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sliders, Check } from "lucide-react";

export interface UsageSummaryProps {
  usage: UsageData;
}

export function UsageSummary({ usage }: UsageSummaryProps) {
  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-3.5 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">WORKSPACE CAPACITY</CardTitle>
          </div>
        </div>

        <Badge variant={usage.status === "Inactive" ? "outline" : "success"} dot={usage.status !== "Inactive"}>
          {usage.status.toUpperCase()}
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5 text-xs font-mono">
        <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
          <span className="text-[var(--text-muted)]">Active Workspace Tier:</span>
          <span className="font-bold text-[var(--text-primary)]">{usage.plan}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
          <span className="text-[var(--text-muted)]">Generative Concurrency:</span>
          <span className="text-[var(--text-secondary)]">{usage.activeJobsCapacity}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-[var(--text-muted)]">Studio Allocation:</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="h-3 w-3" />
            5 Studios Connected
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
