"use client";

import React from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  workspaceName?: string;
  workspaceSlug?: string;
  className?: string;
}

export function AppShell({
  children,
  userName,
  userEmail,
  workspaceName,
  workspaceSlug,
  className,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* Accessibility Skip to Content Link */}
      <a
        href="#app-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-xs focus:font-bold focus:text-black focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Persistent Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AppSidebar />
      </div>

      {/* Main Area: Topbar + Dynamic Page Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppTopbar
          userName={userName}
          userEmail={userEmail}
          workspaceName={workspaceName}
          workspaceSlug={workspaceSlug}
        />

        <main
          id="app-main-content"
          tabIndex={-1}
          className={cn("flex-1 p-4 sm:p-6 lg:p-8 outline-none", className)}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
