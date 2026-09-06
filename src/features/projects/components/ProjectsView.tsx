"use client";

import React, { useState, useMemo } from "react";
import { type Project, type ProjectCategory, type ProjectStatus } from "@/lib/projects/types";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectList } from "./ProjectList";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FolderPlus, Plus, SearchX } from "lucide-react";

export interface ProjectsViewProps {
  initialProjects: Project[];
  workspaceName?: string;
}

export function ProjectsView({ initialProjects, workspaceName = "Workspace" }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "ALL">("ALL");
  const [status, setStatus] = useState<ProjectStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter projects in client for instant response
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Archive filter: if status is not explicitly "ARCHIVED", exclude archived projects
      if (status !== "ARCHIVED" && p.status === "ARCHIVED") {
        return false;
      }

      // Status filter
      if (status !== "ALL" && p.status !== status) {
        return false;
      }

      // Category filter
      if (category !== "ALL" && p.category !== category) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.slotCode.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [projects, search, category, status]);

  const isFiltered = search.trim() !== "" || category !== "ALL" || status !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setCategory("ALL");
    setStatus("ALL");
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="accent" dot>
              {workspaceName}
            </Badge>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              PROJECT REPOSITORY
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            PROJECTS
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Product-centric creative slots carrying unified context across all 5 studios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <ProjectSearch value={search} onChange={setSearch} />

        <ProjectFilters
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={handleResetFilters}
          isFiltered={isFiltered}
          totalCount={filteredProjects.length}
        />
      </div>

      {/* Main Project Listing */}
      {filteredProjects.length === 0 ? (
        <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center">
          {isFiltered ? (
            <EmptyState
              title="NO MATCHING PROJECTS"
              description="No projects match your current search and filter parameters. Try clearing your filters or searching for another term."
              icon={<SearchX className="h-10 w-10 text-[var(--accent)]" />}
              action={
                <div className="pt-4">
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                </div>
              }
            />
          ) : (
            <EmptyState
              title="NO PROJECTS YET"
              description="Create your first project slot to establish unified product briefs and carry context across all 5 studios."
              icon={<FolderPlus className="h-10 w-10 text-[var(--accent)]" />}
              action={
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setIsCreateOpen(true)}
                  >
                    Create First Project
                  </Button>
                </div>
              }
            />
          )}
        </Card>
      ) : viewMode === "grid" ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <ProjectList projects={filteredProjects} />
      )}

      {/* Create Project Modal */}
      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
