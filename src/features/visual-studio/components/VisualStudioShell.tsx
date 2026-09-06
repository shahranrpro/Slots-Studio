"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Eye, FolderKanban, ChevronDown } from "lucide-react";
import { type Project } from "@/lib/projects/types";

export interface VisualStudioShellProps {
  currentProject: Project;
  allProjects: Project[];
  onSelectProject: (projectId: string) => void;
  activeJobCount?: number;
}

export function VisualStudioShell({
  currentProject,
  allProjects,
  onSelectProject,
  activeJobCount = 0,
}: VisualStudioShellProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 select-none">
      {/* Top breadcrumb & project navigation */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <Link
          href={`/app/projects/${currentProject.id}`}
          className="flex items-center gap-1.5 font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>RETURN TO {currentProject.slotCode}</span>
        </Link>

        {/* Project Switcher Dropdown */}
        {allProjects.length > 1 && (
          <div className="relative inline-flex items-center">
            <label htmlFor="visual-project-switcher" className="sr-only">
              Switch Project
            </label>
            <div className="relative">
              <select
                id="visual-project-switcher"
                value={currentProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="appearance-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] pl-2.5 pr-8 py-1 font-mono text-xs text-[var(--text-primary)] hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
              >
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.slotCode} — {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Title & Studio Identifier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="accent" dot>
              STUDIO 02
            </Badge>

            <span className="font-mono text-xs font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {currentProject.slotCode}
            </span>

            <span className="font-semibold text-xs text-[var(--text-secondary)] truncate max-w-[200px] sm:max-w-none">
              {currentProject.name}
            </span>

            {activeJobCount > 0 && (
              <Badge variant="warning" dot>
                {activeJobCount} RUNNING
              </Badge>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
            VISUAL STUDIO
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            Controlled studio photography, on-model styling, mannequin draping, and campaign visuals using approved product context
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link href={`/app/projects/${currentProject.id}`}>
            <Button variant="outline" size="sm" leftIcon={<FolderKanban className="h-4 w-4" />}>
              Project Slot
            </Button>
          </Link>
          <Link href={`/app/studio/product?projectId=${currentProject.id}`}>
            <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
              Product Context
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
