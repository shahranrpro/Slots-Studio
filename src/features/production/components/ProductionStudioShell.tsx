"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type TechPack } from "@/lib/production/types";
import { type Project } from "@/lib/projects/types";
import { ArrowLeft, History, Plus, FileText } from "lucide-react";

export interface ProductionStudioShellProps {
  slotCode: string;
  projectName: string;
  projects: Project[];
  activeProjectId: string;
  techPacks: TechPack[];
  activeTechPack: TechPack | null;
  onTechPackChange: (techPackId: string) => void;
  onOpenHistory: () => void;
  onOpenGenerateRevision: () => void;
}

export function ProductionStudioShell({
  slotCode,
  projectName,
  projects,
  activeProjectId,
  techPacks,
  activeTechPack,
  onTechPackChange,
  onOpenHistory,
  onOpenGenerateRevision,
}: ProductionStudioShellProps) {
  const router = useRouter();

  const handleProjectSwitch = (newId: string) => {
    if (newId && newId !== activeProjectId) {
      router.push(`/app/studio/production?projectId=${newId}`);
    }
  };

  return (
    <div className="space-y-4 border-b border-[var(--border)] pb-5">
      {/* Top Breadcrumb & Project Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/app/projects/${activeProjectId}`}
            className="flex items-center gap-1.5 font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>BACK TO PROJECT</span>
          </Link>
          <span className="text-[var(--border-strong)]">/</span>
          <span className="font-mono text-[var(--text-muted)]">STUDIO 05</span>
        </div>

        {/* Project Switcher */}
        {projects.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">PROJECT:</span>
            <select
              value={activeProjectId}
              onChange={(e) => handleProjectSwitch(e.target.value)}
              className="h-7 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 text-xs font-mono font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] focus:outline-none cursor-pointer"
              aria-label="Switch active project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.slotCode} — {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Studio Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="accent" dot>
              STUDIO 05
            </Badge>
            <span className="font-mono text-xs font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {slotCode}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
              {projectName}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            PRODUCTION STUDIO
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Convert approved product concepts into structured manufacturing Tech Packs, Bills of Materials (BOM), and size grading matrices.
          </p>
        </div>

        {/* Tech Pack Revision Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {techPacks.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-md)] px-2.5 py-1">
                <FileText className="h-3.5 w-3.5 text-[var(--accent)]" />
                <select
                  value={activeTechPack?.id || ""}
                  onChange={(e) => onTechPackChange(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                  aria-label="Select active tech pack revision"
                >
                  {techPacks.map((tp) => (
                    <option
                      key={tp.id}
                      value={tp.id}
                      className="bg-[var(--surface-1)] text-[var(--text-primary)]"
                    >
                      {tp.version} ({tp.status}) — {tp.season}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenHistory}
                leftIcon={<History className="h-3.5 w-3.5" />}
                title="View revision history"
              >
                Revisions ({techPacks.length})
              </Button>
            </>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenGenerateRevision}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Revision
          </Button>
        </div>
      </div>
    </div>
  );
}
