"use client";

import React from "react";
import Link from "next/link";
import { type Project } from "@/lib/projects/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export interface ProductStudioShellProps {
  project: Project;
  allProjects?: Project[];
  onSelectProject?: (projectId: string) => void;
}

export function ProductStudioShell({
  project,
  allProjects = [],
  onSelectProject,
}: ProductStudioShellProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)] pb-5 select-none">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge variant="accent" dot>
            01 PRODUCT STUDIO
          </Badge>
          <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
            {project.slotCode}
          </span>
          <Badge variant="outline">
            {project.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {allProjects.length > 1 && onSelectProject ? (
            <select
              value={project.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
              aria-label="Switch active project"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[var(--surface-1)] text-sm">
                  {p.slotCode} — {p.name}
                </option>
              ))}
            </select>
          ) : (
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] truncate">
              {project.name}
            </h1>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          Define canonical product context, attach references, generate candidates, and approve direction.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/app/projects/${project.id}`}>
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Project Detail
          </Button>
        </Link>
      </div>
    </div>
  );
}
