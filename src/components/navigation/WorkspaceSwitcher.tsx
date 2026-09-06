"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, type DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { Building2, ChevronsUpDown, Check, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkspaceSwitcherProps {
  currentWorkspaceName?: string;
  currentWorkspaceSlug?: string;
  className?: string;
}

export function WorkspaceSwitcher({
  currentWorkspaceName = "Slots Studio Workspace",
  currentWorkspaceSlug = "default",
  className,
}: WorkspaceSwitcherProps) {
  const router = useRouter();

  const items: (DropdownMenuItem | "separator")[] = [
    {
      id: "active-ws",
      label: (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col text-left">
            <span className="font-bold text-[var(--text-primary)]">{currentWorkspaceName}</span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">slug: {currentWorkspaceSlug}</span>
          </div>
          <Check className="h-3.5 w-3.5 text-[var(--accent)] ml-2" />
        </div>
      ),
      icon: <Building2 className="h-4 w-4 text-[var(--accent)]" />,
      onClick: () => router.push("/app"),
    },
    "separator",
    {
      id: "settings",
      label: "Workspace Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push("/app/settings"),
    },
  ];

  const trigger = (
    <button
      type="button"
      className={cn(
        "group flex items-center justify-between gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs transition-all duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer select-none",
        className
      )}
      aria-label={`Current workspace: ${currentWorkspaceName}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-1)] text-[var(--accent)] border border-[var(--border)]">
          <Building2 className="h-3 w-3" />
        </div>
        <span className="font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
          {currentWorkspaceName}
        </span>
      </div>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" />
    </button>
  );

  return <DropdownMenu trigger={trigger} items={items} align="left" className="min-w-[220px]" />;
}
