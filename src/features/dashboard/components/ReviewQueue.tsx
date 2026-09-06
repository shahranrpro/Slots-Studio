"use client";

import React, { useState } from "react";
import { type ReviewItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check, X, CheckCircle2 } from "lucide-react";

export interface ReviewQueueProps {
  initialItems: ReviewItem[];
}

export function ReviewQueue({ initialItems }: ReviewQueueProps) {
  const [items, setItems] = useState<ReviewItem[]>(initialItems);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDecision = (id: string, decision: "Approved" | "Rejected") => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
    setActionNotice(`Candidate marked as ${decision.toUpperCase()}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const pendingItems = items.filter((i) => i.status === "Needs Review");

  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">NEEDS REVIEW</CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionNotice && (
            <span className="text-[10px] font-mono text-[var(--accent)] animate-fade-in font-bold">
              {actionNotice}
            </span>
          )}
          <Badge variant={pendingItems.length > 0 ? "accent" : "outline"}>
            {pendingItems.length} PENDING
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {pendingItems.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NOTHING NEEDS REVIEW</p>
            <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
              Approved outputs and review requests will appear here.
            </p>
          </div>
        ) : (
          pendingItems.map((item) => (
            <div
              key={item.id}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3 transition-colors hover:border-[var(--border-strong)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[var(--accent)] font-semibold">
                      {item.aspectRatio}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">•</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {item.studio}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate">
                    Project: <span className="font-semibold text-[var(--text-primary)]">{item.projectName}</span>
                  </p>
                </div>

                {/* Interactive Action Controls */}
                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<X className="h-3.5 w-3.5 text-red-400" />}
                    onClick={() => handleDecision(item.id, "Rejected")}
                    className="text-xs hover:border-red-500/50 hover:bg-red-950/20"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                    onClick={() => handleDecision(item.id, "Approved")}
                    className="text-xs"
                  >
                    Approve
                  </Button>
                </div>
              </div>

              {/* Metadata Badges */}
              {item.metadata && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]/60 text-[10px] font-mono">
                  {Object.entries(item.metadata).map(([key, val]) => (
                    <span
                      key={key}
                      className="rounded bg-[var(--surface-3)] px-2 py-0.5 text-[var(--text-secondary)] border border-[var(--border)]"
                    >
                      {key}: <span className="font-semibold text-[var(--text-primary)]">{val}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
