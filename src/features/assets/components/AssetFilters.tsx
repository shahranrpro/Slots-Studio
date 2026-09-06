"use client";

import React from "react";
import { type AssetFilterState } from "../types";
import { type AssetType, type AssetSource, type AssetStatus } from "@/lib/assets/types";
import { type Project } from "@/lib/projects/types";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

export interface AssetFiltersProps {
  filters: AssetFilterState;
  projects?: Project[];
  onChange: (filters: Partial<AssetFilterState>) => void;
  onReset: () => void;
}

const ASSET_TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Design", value: "DESIGN" },
  { label: "Image", value: "IMAGE" },
  { label: "Reference", value: "REFERENCE" },
  { label: "Logo", value: "LOGO" },
  { label: "Document", value: "DOCUMENT" },
  { label: "Other", value: "OTHER" },
];

const ASSET_SOURCES = [
  { label: "All Sources", value: "ALL" },
  { label: "AI Generated", value: "AI_GENERATED" },
  { label: "Upload", value: "UPLOAD" },
  { label: "Imported", value: "IMPORTED" },
  { label: "System", value: "SYSTEM" },
];

const ASSET_STATUSES = [
  { label: "Active (All)", value: "ALL" },
  { label: "Approved", value: "APPROVED" },
  { label: "In Review", value: "REVIEW" },
  { label: "Draft", value: "DRAFT" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Archived", value: "ARCHIVED" },
];

export function AssetFilters({
  filters,
  projects = [],
  onChange,
  onReset,
}: AssetFiltersProps) {
  const isFiltered =
    filters.assetType !== "ALL" ||
    filters.source !== "ALL" ||
    filters.status !== "ALL" ||
    filters.projectId !== "ALL" ||
    Boolean(filters.search);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {/* Project Selector */}
      {projects.length > 0 && (
        <select
          value={filters.projectId}
          onChange={(e) => onChange({ projectId: e.target.value })}
          className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
          aria-label="Filter by project"
        >
          <option value="ALL">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.slotCode} — {p.name}
            </option>
          ))}
        </select>
      )}

      {/* Asset Type */}
      <select
        value={filters.assetType}
        onChange={(e) => onChange({ assetType: e.target.value as AssetType | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by asset type"
      >
        {ASSET_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Source */}
      <select
        value={filters.source}
        onChange={(e) => onChange({ source: e.target.value as AssetSource | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by source"
      >
        {ASSET_SOURCES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as AssetStatus | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by status"
      >
        {ASSET_STATUSES.map((st) => (
          <option key={st.value} value={st.value}>
            {st.label}
          </option>
        ))}
      </select>

      {/* Reset */}
      {isFiltered && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="h-3 w-3" />}
          className="h-9 text-xs"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}
