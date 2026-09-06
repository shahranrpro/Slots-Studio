"use client";

import React from "react";
import { type ProjectCategory, type ProjectStatus } from "@/lib/projects/types";
import { LayoutGrid, List, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectFiltersProps {
  category: ProjectCategory | "ALL";
  setCategory: (category: ProjectCategory | "ALL") => void;
  status: ProjectStatus | "ALL";
  setStatus: (status: ProjectStatus | "ALL") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onReset: () => void;
  isFiltered: boolean;
  totalCount: number;
}

const CATEGORIES: { label: string; value: ProjectCategory | "ALL" }[] = [
  { label: "All Categories", value: "ALL" },
  { label: "Product", value: "PRODUCT" },
  { label: "Collection", value: "COLLECTION" },
  { label: "Campaign", value: "CAMPAIGN" },
  { label: "Brand Asset", value: "BRAND_ASSET" },
  { label: "Other", value: "OTHER" },
];

const STATUSES: { label: string; value: ProjectStatus | "ALL" }[] = [
  { label: "All Active", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "In Production", value: "IN_PRODUCTION" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

export function ProjectFilters({
  category,
  setCategory,
  status,
  setStatus,
  viewMode,
  setViewMode,
  onReset,
  isFiltered,
  totalCount,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none">
      {/* Left: Category & Status Dropdowns + Reset */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory | "ALL")}
            className="h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)] cursor-pointer"
            aria-label="Filter by project category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-[var(--surface-1)]">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus | "ALL")}
            className="h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1 text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] focus:outline-2 focus:outline-[var(--accent)] cursor-pointer"
            aria-label="Filter by project status"
          >
            {STATUSES.map((st) => (
              <option key={st.value} value={st.value} className="bg-[var(--surface-1)]">
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[var(--radius-md)] text-[11px] text-[var(--accent)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right: Project Count & View Mode Switcher */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-[var(--text-muted)]">
          {totalCount} {totalCount === 1 ? "project" : "projects"}
        </span>

        <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-[var(--surface-1)] text-[var(--accent)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-[var(--surface-1)] text-[var(--accent)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
            title="List view"
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
