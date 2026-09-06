"use client";

import React from "react";
import { type ActivityItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Clock, Box, Activity, CheckCircle2, Images } from "lucide-react";

const TYPE_ICONS = {
  project: Box,
  job: Activity,
  review: CheckCircle2,
  asset: Images,
};

export interface ActivityFeedProps {
  activity: ActivityItem[];
}

export function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-3.5 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">RECENT ACTIVITY</CardTitle>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          WORKSPACE TIMELINE
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {activity.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NO RECENT ACTIVITY</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Workspace activity will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => {
              const Icon = TYPE_ICONS[item.type] || Activity;
              return (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--accent)] mt-0.5 border border-[var(--border)]">
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-semibold text-[var(--text-primary)] truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                    {item.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
