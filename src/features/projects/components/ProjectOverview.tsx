"use client";

import React from "react";
import Link from "next/link";
import { type Project } from "@/lib/projects/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Box, Eye, FileText, Megaphone, Scissors, Layers, Sliders } from "lucide-react";

export interface ProjectOverviewProps {
  project: Project;
}

const STUDIOS = [
  { id: "01", name: "Product Studio", href: "/app/studio/product", icon: Box },
  { id: "02", name: "Visual Studio", href: "/app/studio/visual", icon: Eye },
  { id: "03", name: "Content Studio", href: "/app/studio/content", icon: FileText },
  { id: "04", name: "Campaign Studio", href: "/app/studio/campaign", icon: Megaphone },
  { id: "05", name: "Production Studio", href: "/app/studio/production", icon: Scissors },
];

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Overview Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Context Parameters */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
            <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[var(--accent)]" />
                <CardTitle className="text-sm">PROJECT BRIEF & CONTEXT</CardTitle>
              </div>
              <Badge variant="accent" dot>
                CONTEXT LOCKED
              </Badge>
            </CardHeader>

            <CardContent className="p-0 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  Concept Description
                </span>
                <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--surface-2)] p-3 rounded-[var(--radius-md)] border border-[var(--border)]">
                  {project.description || "No concept description provided yet. Click 'Edit Context' to add design briefs."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-muted)]">
                    Target Audience
                  </span>
                  <p className="text-[var(--text-primary)] font-mono bg-[var(--surface-2)] p-2.5 rounded-[var(--radius-md)] border border-[var(--border)]">
                    {project.context.targetAudience || "Not specified"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-muted)]">
                    Visual & Styling Direction
                  </span>
                  <p className="text-[var(--text-primary)] font-mono bg-[var(--surface-2)] p-2.5 rounded-[var(--radius-md)] border border-[var(--border)]">
                    {project.context.visualDirection || "Not specified"}
                  </p>
                </div>
              </div>

              {project.context.notes && (
                <div className="space-y-1 pt-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--text-muted)]">
                    Creative Notes
                  </span>
                  <p className="text-[var(--text-secondary)] font-mono bg-[var(--surface-2)] p-2.5 rounded-[var(--radius-md)] border border-[var(--border)]">
                    {project.context.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Metadata Summary */}
        <div className="space-y-6">
          <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
            <CardHeader className="p-0 border-b border-[var(--border)] pb-3">
              <CardTitle className="text-sm">SLOT ATTRIBUTES</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                <span className="text-[var(--text-muted)]">SLOT ID:</span>
                <span className="font-bold text-[var(--accent)]">{project.slotCode}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                <span className="text-[var(--text-muted)]">Category:</span>
                <span className="font-bold text-[var(--text-primary)]">{project.category}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]/60">
                <span className="text-[var(--text-muted)]">Status:</span>
                <span className="text-emerald-400 font-semibold">{project.status}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-muted)]">Created:</span>
                <span suppressHydrationWarning>{new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connected Studio Launchpad for this project */}
      <Card variant="subtle" className="p-6 border-[var(--border-strong)] space-y-4">
        <CardHeader className="p-0 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--accent)]" />
            <CardTitle className="text-sm">CONNECTED STUDIO WORKSPACES</CardTitle>
          </div>
          <span className="text-[10px] font-mono text-[var(--accent)]">
            CARRY CONTEXT INTO STUDIOS
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {STUDIOS.map((studio) => {
              const Icon = studio.icon;
              const studioHref = `${studio.href}?projectId=${project.id}`;
              return (
                <Link key={studio.id} href={studioHref} className="group focus:outline-none">
                  <div className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] transition-all space-y-2 select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-3)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {studio.id}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
                      {studio.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
