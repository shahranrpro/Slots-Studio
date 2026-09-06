"use client";

import React from "react";
import { type AssetFilterState, type AssetViewMode } from "../types";
import { type Project } from "@/lib/projects/types";
import { AssetSearch } from "./AssetSearch";
import { AssetFilters } from "./AssetFilters";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssetToolbarProps {
  filters: AssetFilterState;
  projects?: Project[];
  totalCount: number;
  viewMode: AssetViewMode;
  onFilterChange: (filters: Partial<AssetFilterState>) => void;
  onFilterReset: () => void;
  onViewModeChange: (mode: AssetViewMode) => void;
}

export function AssetToolbar({
  filters,
  projects = [],
  totalCount,
  viewMode,
  onFilterChange,
  onFilterReset,
  onViewModeChange,
}: AssetToolbarProps) {
  return (
    <div className="space-y-3 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <AssetSearch
          value={filters.search}
          onChange={(val) => onFilterChange({ search: val })}
          onClear={() => onFilterChange({ search: "" })}
        />

        {/* View Switcher & Result Count */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {totalCount} {totalCount === 1 ? "Asset" : "Assets"}
          </span>

          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-[var(--surface-3)] text-[var(--accent)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-1.5 rounded-[var(--radius-sm)] transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-[var(--surface-3)] text-[var(--accent)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
              title="List view"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-dimension Filter Pills */}
      <AssetFilters
        filters={filters}
        projects={projects}
        onChange={onFilterChange}
        onReset={onFilterReset}
      />
    </div>
  );
}
