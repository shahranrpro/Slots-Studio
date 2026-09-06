import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type CreditSummary } from "@/lib/billing/types";
import { Zap, Box, Eye, FileText, Megaphone, Scissors } from "lucide-react";

export interface CreditUsageMeterProps {
  credits: CreditSummary;
}

export function CreditUsageMeter({ credits }: CreditUsageMeterProps) {
  const resetDateFormatted = new Date(credits.resetDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card variant="subtle" className="p-5 border-[var(--border)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            AI STUDIO CREDIT ALLOCATION
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent" dot>
            CYCLE ACTIVE
          </Badge>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {`Resets ${resetDateFormatted}`}
          </span>
        </div>
      </div>

      {/* Credit Balance Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3 rounded-[var(--radius-md)] border border-[var(--border)]/60">
          <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Total Monthly</p>
          <p className="text-xl font-display font-bold text-white mt-1">
            {credits.totalMonthlyCredits.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 p-3 rounded-[var(--radius-md)] border border-[var(--border)]/60">
          <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Consumed</p>
          <p className="text-xl font-display font-bold text-[var(--accent)] mt-1">
            {credits.usedCredits.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 p-3 rounded-[var(--radius-md)] border border-[var(--border)]/60">
          <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Remaining</p>
          <p className="text-xl font-display font-bold text-emerald-400 mt-1">
            {credits.remainingCredits.toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 p-3 rounded-[var(--radius-md)] border border-[var(--border)]/60">
          <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Usage Meter</p>
          <p className="text-xl font-display font-bold text-white mt-1">
            {`${credits.usagePercentage}%`}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="w-full bg-[var(--surface-3)] h-2.5 rounded-full overflow-hidden border border-[var(--border)]">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(2, credits.usagePercentage))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span>{`${credits.usedCredits} credits used`}</span>
          <span>{`${credits.remainingCredits} credits available`}</span>
        </div>
      </div>

      {/* Studio Breakdown */}
      <div className="pt-2 border-t border-[var(--border)]/60">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2.5">
          CREDIT CONSUMPTION BY STUDIO
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]/40">
            <Box className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">Product Studio</p>
              <p className="text-xs font-mono font-bold text-white">{credits.byStudio.PRODUCT} cr</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]/40">
            <Eye className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">Visual Studio</p>
              <p className="text-xs font-mono font-bold text-white">{credits.byStudio.VISUAL} cr</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]/40">
            <FileText className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">Content Studio</p>
              <p className="text-xs font-mono font-bold text-white">{credits.byStudio.CONTENT} cr</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]/40">
            <Megaphone className="h-3.5 w-3.5 text-pink-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">Campaign Studio</p>
              <p className="text-xs font-mono font-bold text-white">{credits.byStudio.CAMPAIGN} cr</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]/40">
            <Scissors className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">Production Studio</p>
              <p className="text-xs font-mono font-bold text-white">{credits.byStudio.PRODUCTION} cr</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
