"use client";

import React from "react";
import Link from "next/link";
import { type ProjectItem } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FolderKanban, ArrowRight, Plus } from "lucide-react";

export interface RecentProjectsProps {
  projects: ProjectItem[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card variant="subtle" className="border-[var(--border-strong)] p-5 space-y-4 select-none">
      <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] border border-[var(--border)]">
            <FolderKanban className="h-3.5 w-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm">RECENT PROJECTS</CardTitle>
          </div>
        </div>

        {projects.length > 0 && (
          <Link
            href="/app/projects"
            className="flex items-center gap-1 text-xs font-mono text-[var(--accent)] hover:underline font-semibold"
          >
            <span>VIEW ALL ({projects.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {projects.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--accent)]">
              <FolderKanban className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-[var(--text-primary)] font-mono">NO PROJECTS YET</p>
            <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
              Create your first project to start building.
            </p>
            <Link href="/app/projects">
              <Button variant="primary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4 space-y-3 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
                      {project.slotId}
                    </span>
                    <Badge variant={project.status === "In Progress" ? "accent" : "outline"}>
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {project.category} • {project.activeStudio}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[var(--text-muted)]">
                    {project.assetCount} outputs
                  </span>
                  <Link
                    href={`/app/projects/${project.id}`}
                    className="flex items-center gap-1 font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
