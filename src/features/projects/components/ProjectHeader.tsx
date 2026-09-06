"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Project, type ProjectStatus } from "@/lib/projects/types";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Edit3, Archive } from "lucide-react";

export interface ProjectHeaderProps {
  project: Project;
  onEditClick: () => void;
  onStatusChange: (status: ProjectStatus) => Promise<void>;
  onArchive: () => Promise<void>;
}

const ALL_STATUSES: ProjectStatus[] = [
  "DRAFT",
  "ACTIVE",
  "IN_REVIEW",
  "APPROVED",
  "IN_PRODUCTION",
  "COMPLETED",
  "ARCHIVED",
];

export function ProjectHeader({
  project,
  onEditClick,
  onStatusChange,
  onArchive,
}: ProjectHeaderProps) {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const handleStatusSelect = async (newStatus: ProjectStatus) => {
    if (newStatus === project.status) return;
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleArchiveConfirm = async () => {
    setIsArchiving(true);
    try {
      await onArchive();
      router.push("/app/projects");
      router.refresh();
    } finally {
      setIsArchiving(false);
      setShowArchiveConfirm(false);
    }
  };

  return (
    <div className="space-y-4 border-b border-[var(--border)] pb-6 select-none">
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/app/projects"
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>ALL PROJECTS</span>
        </Link>

        <span suppressHydrationWarning className="font-mono text-[11px] text-[var(--text-muted)]">
          Updated: {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-sm font-bold text-[var(--accent)] tracking-wider px-2 py-0.5 rounded bg-[var(--surface-3)] border border-[var(--border)]">
              {project.slotCode}
            </span>

            <span className="rounded bg-[var(--surface-3)] px-2 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-secondary)] border border-[var(--border)] uppercase">
              {project.category.replace("_", " ")}
            </span>

            {/* Status Selector Dropdown */}
            <div className="relative inline-block">
              <select
                value={project.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusSelect(e.target.value as ProjectStatus)}
                className="h-6 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] px-2 text-[10px] font-mono font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)] cursor-pointer"
                aria-label="Change project status"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] truncate">
            {project.name}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            leftIcon={<Edit3 className="h-3.5 w-3.5" />}
          >
            Edit Context
          </Button>

          {project.status !== "ARCHIVED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchiveConfirm(true)}
              leftIcon={<Archive className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
              className="hover:border-red-500/50 hover:text-red-400"
            >
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Archive Confirmation Banner */}
      {showArchiveConfirm && (
        <div className="rounded-[var(--radius-md)] border border-red-500/30 bg-red-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-red-300">
            Archive this project slot? It will be hidden from the active list but preserved under the Archived filter.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchiveConfirm(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isArchiving}
              onClick={handleArchiveConfirm}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Confirm Archive
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
