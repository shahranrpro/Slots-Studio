"use client";

import React from "react";
import Link from "next/link";
import { type Project } from "@/lib/projects/types";
import { Badge } from "@/components/ui/Badge";
import { getStatusBadgeVariant } from "./ProjectCard";
import { ArrowRight, Calendar, Box } from "lucide-react";

export interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] divide-y divide-[var(--border)] overflow-hidden select-none">
      {projects.map((project) => {
        const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <Link
            key={project.id}
            href={`/app/projects/${project.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[var(--surface-2)] transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
                <Box className="h-4 w-4" />
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent)]">
                    {project.slotCode}
                  </span>
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {project.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono text-[var(--text-muted)] shrink-0 pl-12 sm:pl-0">
              <span className="rounded bg-[var(--surface-3)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)] border border-[var(--border)] uppercase">
                {project.category.replace("_", " ")}
              </span>

              <span suppressHydrationWarning className="text-[11px] flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>

              <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
