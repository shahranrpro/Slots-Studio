"use client";

import React from "react";
import Link from "next/link";
import { type ProductConcept } from "../types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export interface ProductReviewBarProps {
  approvedConcept?: ProductConcept;
  projectId: string;
}

export function ProductReviewBar({ approvedConcept, projectId }: ProductReviewBarProps) {
  if (!approvedConcept) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-emerald-500/40 bg-emerald-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in select-none">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-500/40">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-emerald-400">
              CANONICAL DIRECTION LOCKED
            </span>
            <Badge variant="success">
              {approvedConcept.candidateCode}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-primary)] font-bold truncate">
            {approvedConcept.title}
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] truncate">
            {approvedConcept.summary}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/app/projects/${projectId}`}>
          <Button variant="outline" size="sm">
            View in Project
          </Button>
        </Link>
        <Link href="/app/studio/visual">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Carry to Visual Studio
          </Button>
        </Link>
      </div>
    </div>
  );
}
