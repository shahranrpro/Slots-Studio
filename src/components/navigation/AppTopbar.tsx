"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { CommandMenu } from "./CommandMenu";
import { MobileAppNav } from "./MobileAppNav";
import { AppearanceSelector } from "@/components/ui/AppearanceSelector";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppTopbarProps {
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
  workspaceSlug?: string;
  className?: string;
}

export function AppTopbar({
  userName,
  userEmail,
  workspaceName,
  workspaceSlug,
  className,
}: AppTopbarProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--surface-1)]/90 px-4 sm:px-6 backdrop-blur-md select-none",
          className
        )}
      >
        {/* Left: Mobile Nav & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <MobileAppNav userName={userName} userEmail={userEmail} />
          <Breadcrumbs className="hidden sm:flex" />
        </div>

        {/* Right: Quick Search, Workspace Switcher, Appearance & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Command Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer"
            title="Open Command Menu (Cmd + K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[11px] font-mono">Quick Search...</span>
            <kbd className="hidden sm:inline-flex items-center rounded border border-[var(--border)] bg-[var(--surface-3)] px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-muted)]">
              ⌘K
            </kbd>
          </button>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher
            currentWorkspaceName={workspaceName}
            currentWorkspaceSlug={workspaceSlug}
            className="hidden sm:flex"
          />

          <div className="hidden sm:block h-4 w-px bg-[var(--border)]" />

          {/* Notifications Bell */}
          <NotificationBell />

          {/* Appearance Toggle */}
          <div className="hidden sm:block">
            <AppearanceSelector size="sm" />
          </div>

          {/* User Menu */}
          <UserMenu userName={userName} userEmail={userEmail} />
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}
