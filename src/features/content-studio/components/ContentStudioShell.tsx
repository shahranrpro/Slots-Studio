"use client";

import React from "react";
import Link from "next/link";
import { type Project } from "@/lib/projects/types";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { ArrowLeft } from "lucide-react";

export interface ContentStudioShellProps {
  currentProject?: Project;
  allProjects?: Project[];
  slotCode?: string;
  onProjectChange?: (projectId: string) => void;
  children: React.ReactNode;
}

export function ContentStudioShell({
  currentProject,
  allProjects = [],
  slotCode = "SS-00000",
  onProjectChange,
  children,
}: ContentStudioShellProps) {
  const projectOptions = allProjects.map((p) => ({
    value: p.id,
    label: `${p.slotCode || "SS-#####"} • ${p.name}`,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Studio Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="accent" dot>
              STUDIO 03
            </Badge>
            <span className="font-mono text-xs text-[var(--accent)] font-bold bg-[var(--surface-2)] px-2 py-0.5 rounded border border-[var(--border)]">
              {slotCode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              CONTENT STUDIO
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Synthesize context-locked commercial copy, product descriptions, and technical specifications
          </p>
        </div>

        {/* Project Switcher & Back Navigation */}
        <div className="flex items-center gap-3">
          {allProjects.length > 1 && (
            <div className="w-64">
              <Select
                options={projectOptions}
                value={currentProject?.id || ""}
                onChange={(val) => onProjectChange && onProjectChange(val)}
                placeholder="Switch Project..."
                aria-label="Active Project"
              />
            </div>
          )}

          {currentProject && (
            <Link
              href={`/app/projects/${currentProject.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Project Hub</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Studio Body */}
      <main>{children}</main>
    </div>
  );
}
