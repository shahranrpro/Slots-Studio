"use client";

import React from "react";
import Link from "next/link";
import { type Project, type ProjectStatus } from "@/lib/projects/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Calendar } from "lucide-react";

export interface ProjectCardProps {
  project: Project;
}

export function getStatusBadgeVariant(status: ProjectStatus): "accent" | "default" | "success" | "warning" | "danger" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "accent";
    case "IN_REVIEW":
      return "warning";
    case "APPROVED":
    case "COMPLETED":
      return "success";
    case "IN_PRODUCTION":
      return "default";
    case "ARCHIVED":
      return "danger";
    case "DRAFT":
    default:
      return "outline";
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/app/projects/${project.id}`} className="group focus:outline-none block">
      <Card
        variant="interactive"
        className="p-5 h-full flex flex-col justify-between border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-all select-none"
      >
        <div className="space-y-3">
          {/* Card Top: SLOT ID & Status Badge */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--accent)] tracking-wider">
              {project.slotCode}
            </span>
            <Badge variant={getStatusBadgeVariant(project.status)}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>

          {/* Project Title & Category */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
              {project.name}
            </h3>
            <span className="inline-block rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[9px] font-mono font-semibold text-[var(--text-secondary)] border border-[var(--border)] uppercase">
              {project.category.replace("_", " ")}
            </span>
            {project.description && (
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed pt-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Card Footer: Metadata & Open Arrow */}
        <div className="pt-4 mt-4 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>

          <span className="flex items-center gap-1 font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            <span>Open Slot</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
