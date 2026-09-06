"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type ApprovedProductContext } from "@/lib/campaigns/types";
import { ChevronDown, ChevronUp, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

export interface CampaignContextPanelProps {
  context: ApprovedProductContext;
  projectId: string;
}

export function CampaignContextPanel({ context, projectId }: CampaignContextPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!context.isApproved) {
    return (
      <Card variant="subtle" className="p-5 border-dashed border-amber-500/30 bg-amber-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[var(--radius-sm)] bg-amber-500/10 text-amber-400 mt-0.5">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-amber-300 uppercase tracking-wide">
                  PRODUCT CONTEXT NEEDED
                </span>
                <Badge variant="warning">AWAITING APPROVAL</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Campaign Studio builds deliverables directly from an approved product concept. Please approve a concept in Product Studio to unlock campaign generation.
              </p>
            </div>
          </div>
          <Link href={`/app/studio/product?projectId=${projectId}`}>
            <Button variant="primary" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
              Open Product Studio
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="subtle" className="border-[var(--border)] overflow-hidden">
      <div className="flex items-center justify-between p-3.5 bg-[var(--surface-2)]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
            APPROVED PRODUCT CONTEXT
          </span>
          <Badge variant="success">CONTEXT LOCKED</Badge>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          aria-label={isExpanded ? "Collapse context panel" : "Expand context panel"}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">PRODUCT NAME:</span>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5">{context.productName}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">CATEGORY:</span>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5">{context.category}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">SILHOUETTE / FIT:</span>
              <p className="font-semibold text-[var(--text-primary)] mt-0.5">{context.silhouette}</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">CANONICAL STATEMENT:</span>
            <p className="text-[var(--text-secondary)] mt-0.5 leading-relaxed">{context.description}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
            {/* Colorway Swatches */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">PALETTE:</span>
              <div className="flex items-center gap-1.5">
                {context.colorways.map((hex, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-[var(--surface-3)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Materials Matrix */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">MATERIALS:</span>
              {context.materials.map((mat, idx) => (
                <span key={idx} className="font-mono text-[10px] bg-[var(--surface-3)] px-2 py-0.5 rounded text-[var(--text-secondary)] border border-[var(--border)]">
                  {mat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
