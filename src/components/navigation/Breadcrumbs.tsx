"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  app: "Dashboard",
  projects: "Projects",
  assets: "Assets",
  jobs: "Jobs",
  studio: "Studio",
  product: "Product Studio",
  visual: "Visual Studio",
  content: "Content Studio",
  campaign: "Campaign Studio",
  production: "Production Studio",
  settings: "Settings",
  help: "Help",
  onboarding: "Onboarding",
};

export interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // If on /app, just show "Dashboard"
  if (segments.length <= 1 && segments[0] === "app") {
    return (
      <nav aria-label="Breadcrumbs" className={cn("flex items-center text-xs font-mono", className)}>
        <span className="font-semibold text-[var(--text-primary)]">Dashboard</span>
      </nav>
    );
  }

  // Build trail
  const crumbs: { label: string; href: string; isLast: boolean }[] = [];
  let pathAcc = "";

  segments.forEach((seg, idx) => {
    pathAcc += `/${seg}`;
    const label = SEGMENT_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({
      label,
      href: pathAcc,
      isLast: idx === segments.length - 1,
    });
  });

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]", className)}
    >
      <Link
        href="/app"
        className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors select-none"
        title="Go to Dashboard"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.slice(1).map((crumb) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="h-3 w-3 shrink-0 text-[var(--border-strong)]" aria-hidden="true" />
          {crumb.isLast ? (
            <span
              aria-current="page"
              className="font-semibold text-[var(--text-primary)] truncate max-w-[180px] sm:max-w-none"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-[var(--text-primary)] transition-colors truncate max-w-[120px] sm:max-w-none select-none"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
