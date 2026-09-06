"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type Project } from "@/lib/projects/types";
import { ProjectOverview } from "./ProjectOverview";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import {
  LayoutDashboard,
  Box,
  Eye,
  Bookmark,
  Sparkles,
  Images,
  FileText,
  Megaphone,
  Scissors,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectTabsProps {
  project: Project;
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "product", label: "Product", icon: Box, studioHref: "/app/studio/product" },
  { id: "visual", label: "Visual", icon: Eye, studioHref: "/app/studio/visual" },
  { id: "references", label: "References", icon: Bookmark },
  { id: "concepts", label: "Concepts", icon: Sparkles },
  { id: "assets", label: "Assets", icon: Images, studioHref: "/app/assets" },
  { id: "content", label: "Content", icon: FileText, studioHref: "/app/studio/content" },
  { id: "campaigns", label: "Campaigns", icon: Megaphone, studioHref: "/app/studio/campaign" },
  { id: "production", label: "Production", icon: Scissors, studioHref: "/app/studio/production" },
  { id: "activity", label: "Activity", icon: Clock },
];

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="space-y-6 select-none">
      {/* Scrollable Tab Navigation Bar */}
      <div className="border-b border-[var(--border)] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max pb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono font-medium transition-colors border-b-2 cursor-pointer",
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent)] font-bold bg-[var(--surface-2)]/50"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]/30"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div>
        {activeTab === "overview" && <ProjectOverview project={project} />}

        {activeTab !== "overview" && (
          <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center">
            <EmptyState
              title="NOTHING HERE YET"
              description="This workspace will populate as you create project outputs in downstream studios."
              action={
                currentTab?.studioHref && (
                  <div className="pt-4">
                    <Link href={`${currentTab.studioHref}?projectId=${project.id}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                        Open {currentTab.label} Studio
                      </Button>
                    </Link>
                  </div>
                )
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
}
