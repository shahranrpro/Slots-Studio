"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { navigationConfig, type NavItem } from "@/data/navigation";
import { APP_CONFIG } from "@/lib/constants";
import {
  LayoutDashboard,
  FolderKanban,
  Images,
  Activity,
  Box,
  Eye,
  FileText,
  Megaphone,
  Scissors,
  Settings,
  HelpCircle,
  Bell,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FolderKanban,
  Images,
  Activity,
  Box,
  Eye,
  FileText,
  Megaphone,
  Scissors,
  Settings,
  HelpCircle,
  Bell,
};

export interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  const isNavActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app";
    }
    return pathname.startsWith(href);
  };

  const renderNavSection = (title: string, items: NavItem[]) => {
    return (
      <div className="space-y-1">
        <h2 className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] select-none">
          {title}
        </h2>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon ? ICON_MAP[item.icon] || Box : Box;
            const active = isNavActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-xs font-medium transition-all duration-150 select-none",
                  active
                    ? "bg-[var(--surface-3)] text-[var(--text-primary)] font-semibold border border-[var(--border-strong)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-transparent"
                )}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[var(--accent)]" />
                )}

                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {item.code && (
                  <span
                    className={cn(
                      "font-mono text-[10px] rounded px-1.5 py-0.5",
                      active
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                    )}
                  >
                    {item.code}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] select-none",
        className
      )}
    >
      {/* Top Brand & Quick Action */}
      <div className="p-4 space-y-4">
        {/* Brand Link */}
        <Link
          href="/app"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] shadow-2xs">
            <BrandLogo size={20} alt="Slots Studio Logo" priority />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)] leading-none">
              {APP_CONFIG.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent)] mt-0.5">
              STUDIO OS
            </span>
          </div>
        </Link>

        {/* Quick Project CTA */}
        <Link
          href="/app/projects"
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--accent)] py-2 px-3 text-xs font-bold text-black transition-all hover:bg-[var(--accent)]/90 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[var(--accent)] shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
        {renderNavSection("Overview", navigationConfig.appNav.overview)}
        {renderNavSection("Workspace", navigationConfig.appNav.workspace)}
        {renderNavSection("Studios", navigationConfig.appNav.studios)}
        {renderNavSection("System", navigationConfig.appNav.system)}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-1)]">
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] px-2">
          <span>v1.0.0-beta</span>
          <span className="text-[var(--accent)] font-semibold">ALL STUDIOS ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
