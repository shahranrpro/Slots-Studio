"use client";

import React from "react";
import { type JobFilterState } from "../types";
import { type JobStatus, type StudioContext, type JobType } from "@/lib/jobs/types";
import { type Project } from "@/lib/projects/types";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

export interface JobFiltersProps {
  filters: JobFilterState;
  projects?: Project[];
  onChange: (filters: Partial<JobFilterState>) => void;
  onReset: () => void;
}

const JOB_STATUSES = [
  { label: "All Statuses", value: "ALL" },
  { label: "Running", value: "RUNNING" },
  { label: "In Review", value: "REVIEW" },
  { label: "Queued", value: "QUEUED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const JOB_STUDIOS = [
  { label: "All Studios", value: "ALL" },
  { label: "Product Studio", value: "PRODUCT" },
  { label: "Visual Studio", value: "VISUAL" },
  { label: "Content Studio", value: "CONTENT" },
  { label: "Campaign Studio", value: "CAMPAIGN" },
  { label: "Production Studio", value: "PRODUCTION" },
];

const JOB_TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Concept Generation", value: "PRODUCT_CONCEPT_GENERATION" },
  { label: "Concept Refinement", value: "PRODUCT_CONCEPT_REFINEMENT" },
  { label: "Asset Processing", value: "ASSET_PROCESSING" },
  { label: "Other", value: "OTHER" },
];

export function JobFilters({
  filters,
  projects = [],
  onChange,
  onReset,
}: JobFiltersProps) {
  const isFiltered =
    filters.status !== "ALL" ||
    filters.studio !== "ALL" ||
    filters.jobType !== "ALL" ||
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

      {/* Status Selector */}
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value as JobStatus | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by job status"
      >
        {JOB_STATUSES.map((st) => (
          <option key={st.value} value={st.value}>
            {st.label}
          </option>
        ))}
      </select>

      {/* Studio Selector */}
      <select
        value={filters.studio}
        onChange={(e) => onChange({ studio: e.target.value as StudioContext | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by studio"
      >
        {JOB_STUDIOS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Job Type Selector */}
      <select
        value={filters.jobType}
        onChange={(e) => onChange({ jobType: e.target.value as JobType | "ALL" })}
        className="h-9 px-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-primary)] transition-colors focus:border-[var(--border-strong)] focus:outline-none cursor-pointer"
        aria-label="Filter by job type"
      >
        {JOB_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
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
