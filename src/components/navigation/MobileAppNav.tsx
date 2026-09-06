"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { navigationConfig, type NavItem } from "@/data/navigation";
import { APP_CONFIG } from "@/lib/constants";
import {
  Menu,
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
};

export interface MobileAppNavProps {
  userName?: string;
  userEmail?: string;
}

export function MobileAppNav({ userName, userEmail }: MobileAppNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isNavActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app";
    }
    return pathname.startsWith(href);
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="space-y-1.5">
      <h2 className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon ? ICON_MAP[item.icon] || Box : Box;
          const active = isNavActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2.5 text-xs font-medium transition-colors select-none",
                active
                  ? "bg-[var(--accent)] text-black font-bold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </div>
              {item.code && (
                <span
                  className={cn(
                    "font-mono text-[10px] rounded px-1.5 py-0.5",
                    active ? "bg-black text-white" : "bg-[var(--surface-3)] text-[var(--text-muted)]"
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--surface-3)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] cursor-pointer md:hidden"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        side="left"
        title="Application Navigation"
        className="w-[280px] p-0 flex flex-col justify-between"
      >
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Top Brand Info */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--border)]">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <BrandLogo size={20} alt="Slots Studio Logo" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
                {APP_CONFIG.name}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--accent)]">
                STUDIO OS
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-5">
            {renderSection("Overview", navigationConfig.appNav.overview)}
            {renderSection("Workspace", navigationConfig.appNav.workspace)}
            {renderSection("Studios", navigationConfig.appNav.studios)}
            {renderSection("System", navigationConfig.appNav.system)}
          </div>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono">
          <p className="font-bold text-[var(--text-primary)] truncate">{userName || "Creator"}</p>
          <p className="text-[11px] text-[var(--text-muted)] truncate">{userEmail || "user@slots.studio"}</p>
        </div>
      </Sheet>
    </>
  );
}
