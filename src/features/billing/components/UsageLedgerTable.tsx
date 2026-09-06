"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  type UsageLedgerEntry,
  type UsageStudio,
} from "@/lib/billing/types";
import { History, Search, Box, Eye, FileText, Megaphone, Scissors, Settings, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UsageLedgerTableProps {
  entries: UsageLedgerEntry[];
}

const STUDIOS: { id: UsageStudio | "ALL"; label: string }[] = [
  { id: "ALL", label: "All Studios" },
  { id: "PRODUCT", label: "Product Studio" },
  { id: "VISUAL", label: "Visual Studio" },
  { id: "CONTENT", label: "Content Studio" },
  { id: "CAMPAIGN", label: "Campaign Studio" },
  { id: "PRODUCTION", label: "Production Studio" },
  { id: "SYSTEM", label: "System / Refills" },
];

export function UsageLedgerTable({ entries }: UsageLedgerTableProps) {
  const [selectedStudio, setSelectedStudio] = useState<UsageStudio | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = entries.filter((entry) => {
    if (selectedStudio !== "ALL" && entry.studio !== selectedStudio) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        entry.description.toLowerCase().includes(q) ||
        entry.userName.toLowerCase().includes(q) ||
        entry.eventType.toLowerCase().includes(q) ||
        (entry.jobId && entry.jobId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStudioIcon = (studio: UsageStudio) => {
    switch (studio) {
      case "PRODUCT":
        return <Box className="h-3.5 w-3.5 text-blue-400" />;
      case "VISUAL":
        return <Eye className="h-3.5 w-3.5 text-purple-400" />;
      case "CONTENT":
        return <FileText className="h-3.5 w-3.5 text-amber-400" />;
      case "CAMPAIGN":
        return <Megaphone className="h-3.5 w-3.5 text-pink-400" />;
      case "PRODUCTION":
        return <Scissors className="h-3.5 w-3.5 text-[var(--accent)]" />;
      default:
        return <Settings className="h-3.5 w-3.5 text-[var(--text-muted)]" />;
    }
  };

  return (
    <Card variant="subtle" className="p-5 border-[var(--border-strong)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <History className="h-4 w-4 text-[var(--accent)]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            AI USAGE LEDGER (DEVELOPMENT)
          </h3>
          <Badge variant="outline">{`${filteredEntries.length} SIMULATED EVENTS`}</Badge>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search events, jobs, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
          />
        </div>
      </div>

      {/* Studio Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {STUDIOS.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setSelectedStudio(st.id)}
            className={cn(
              "px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-mono whitespace-nowrap transition-colors",
              selectedStudio === st.id
                ? "bg-[var(--accent)] text-black font-bold"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-3)]"
            )}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border)]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-black text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Studio</th>
              <th className="py-2.5 px-3">Event / Description</th>
              <th className="py-2.5 px-3">Operator</th>
              <th className="py-2.5 px-3 text-right">Units</th>
              <th className="py-2.5 px-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/40 bg-[var(--surface-1)]">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  No usage events found for the selected studio or filter.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => {
                const isDeduction = entry.units < 0;
                const formattedDate = new Date(entry.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={entry.id} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-[var(--text-muted)]">
                      {formattedDate}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getStudioIcon(entry.studio)}
                        <span className="font-semibold text-white">{entry.studio}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        <p className="text-white font-sans text-xs">{entry.description}</p>
                        {entry.jobId && (
                          <span className="text-[10px] text-[var(--accent)] opacity-80">
                            {`Job: ${entry.jobId}`}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-[var(--text-secondary)]">
                      {entry.userName}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-right font-bold">
                      <div className="flex items-center justify-end gap-1">
                        {isDeduction ? (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-red-400" />
                            <span className="text-red-400">{`${entry.units} cr`}</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">{`+${entry.units} cr`}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap text-right font-semibold text-white">
                      {`${entry.balanceAfter.toLocaleString()} cr`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
