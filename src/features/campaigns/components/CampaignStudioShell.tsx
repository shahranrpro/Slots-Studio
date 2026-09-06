"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { type Campaign } from "@/lib/campaigns/types";
import { type Project } from "@/lib/projects/types";
import { ArrowLeft, Plus, Layers } from "lucide-react";

export interface CampaignStudioShellProps {
  slotCode: string;
  projectName: string;
  projects: Project[];
  activeProjectId: string;
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  onCampaignChange: (campaignId: string) => void;
  onOpenCreateCampaign: () => void;
}

export function CampaignStudioShell({
  slotCode,
  projectName,
  projects,
  activeProjectId,
  campaigns,
  activeCampaign,
  onCampaignChange,
  onOpenCreateCampaign,
}: CampaignStudioShellProps) {
  const router = useRouter();

  const handleProjectSwitch = (newId: string) => {
    if (newId && newId !== activeProjectId) {
      router.push(`/app/studio/campaign?projectId=${newId}`);
    }
  };

  return (
    <div className="space-y-4 border-b border-[var(--border)] pb-5">
      {/* Top Breadcrumb & Switcher Row */}
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
          <span className="font-mono text-[var(--text-muted)]">STUDIO 04</span>
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
              STUDIO 04
            </Badge>
            <span className="font-mono text-xs font-bold text-[var(--accent)] px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {slotCode}
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
              {projectName}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            CAMPAIGN STUDIO
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Synthesize multi-channel advertising kits, social deliverables, and promotional assets from approved product context.
          </p>
        </div>

        {/* Campaign Switcher & New Campaign CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {campaigns.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-md)] px-2 py-1">
              <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
              <select
                value={activeCampaign?.id || ""}
                onChange={(e) => onCampaignChange(e.target.value)}
                className="bg-transparent text-xs font-mono font-semibold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                aria-label="Select active campaign"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[var(--surface-1)] text-[var(--text-primary)]">
                    {c.name} ({c.deliverableCount} items)
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCreateCampaign}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
