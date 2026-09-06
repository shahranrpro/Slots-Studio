"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, FolderKanban } from "lucide-react";

export interface DashboardHeaderProps {
  userName?: string;
  workspaceName?: string;
}

export function DashboardHeader({
  userName = "Creator",
  workspaceName = "Slots Studio Workspace",
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("WELCOME");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("GOOD MORNING");
    else if (hour < 18) setGreeting("GOOD AFTERNOON");
    else setGreeting("GOOD EVENING");
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-6 select-none">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <Badge variant="accent" dot>
            WORKSPACE ACTIVE
          </Badge>
          <span className="font-mono text-xs text-[var(--text-muted)] truncate max-w-[200px]">
            {workspaceName}
          </span>
        </div>

        <h1
          suppressHydrationWarning
          className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase"
        >
          {greeting}, {userName}
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Unified creative workspace status and connected studio pipelines
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link href="/app/projects">
          <Button variant="outline" size="sm" leftIcon={<FolderKanban className="h-4 w-4" />}>
            All Projects
          </Button>
        </Link>
        <Link href="/app/projects">
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
