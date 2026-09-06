"use client";

import React, { useState, useMemo } from "react";
import { type Job } from "@/lib/jobs/types";
import { type Project } from "@/lib/projects/types";
import { type JobFilterState, type JobViewMode } from "../types";
import { JobSearch } from "./JobSearch";
import { JobFilters } from "./JobFilters";
import { JobList } from "./JobList";
import { JobCard } from "./JobCard";
import { JobDetail } from "./JobDetail";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, List } from "lucide-react";

export interface JobsViewProps {
  initialJobs: Job[];
  projects?: Project[];
}

export function JobsView({ initialJobs, projects = [] }: JobsViewProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [viewMode, setViewMode] = useState<JobViewMode>("list");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<JobFilterState>({
    search: "",
    status: "ALL",
    studio: "ALL",
    jobType: "ALL",
    projectId: "ALL",
  });

  const handleFilterChange = (updates: Partial<JobFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      studio: "ALL",
      jobType: "ALL",
      projectId: "ALL",
    });
  };

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (filters.status !== "ALL" && job.status !== filters.status) {
        return false;
      }

      // Studio filter
      if (filters.studio !== "ALL" && job.studio !== filters.studio) {
        return false;
      }

      // Job type filter
      if (filters.jobType !== "ALL" && job.jobType !== filters.jobType) {
        return false;
      }

      // Project filter
      if (filters.projectId !== "ALL" && job.projectId !== filters.projectId) {
        return false;
      }

      // Search query
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const matchesProject = job.projectName?.toLowerCase().includes(q);
        const matchesSlot = job.slotCode?.toLowerCase().includes(q);
        const matchesType = job.jobType.toLowerCase().includes(q);
        const matchesStudio = job.studio.toLowerCase().includes(q);
        const matchesSummary = job.inputSummary?.toLowerCase().includes(q);
        if (!matchesProject && !matchesSlot && !matchesType && !matchesStudio && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  const activeJobsCount = useMemo(() => {
    return jobs.filter((j) => j.status === "RUNNING" || j.status === "QUEUED").length;
  }, [jobs]);

  // Live poll while active jobs are running or queued
  React.useEffect(() => {
    if (activeJobsCount === 0) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setJobs(data.data);
          if (selectedJob) {
            const updatedSelected = data.data.find((j: Job) => j.id === selectedJob.id);
            if (updatedSelected) setSelectedJob(updatedSelected);
          }
        }
      } catch {
        // graceful polling
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeJobsCount, selectedJob]);

  const isFiltered =
    filters.status !== "ALL" ||
    filters.studio !== "ALL" ||
    filters.jobType !== "ALL" ||
    filters.projectId !== "ALL" ||
    Boolean(filters.search);

  // Retry Action
  const handleRetry = async (job: Job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}/retry`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.data) {
        setJobs((prev) => [data.data, ...prev]);
        setSelectedJob(data.data);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  // Cancel Action
  const handleCancel = async (job: Job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.data) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? data.data : j)));
        if (selectedJob?.id === job.id) {
          setSelectedJob(data.data);
        }
      }
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="accent" dot>
              JOB PIPELINE
            </Badge>
            {activeJobsCount > 0 && (
              <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                {activeJobsCount} ACTIVE
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            MY JOBS
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Monitor, inspect, retry, and track generative pipeline jobs across all studios.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-[var(--surface-2)] p-1 rounded-[var(--radius-md)] border border-[var(--border)]">
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            leftIcon={<List className="h-3.5 w-3.5" />}
            className="h-7 text-xs px-2.5"
            aria-label="List view mode"
          >
            List
          </Button>
          <Button
            variant={viewMode === "compact" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("compact")}
            leftIcon={<LayoutGrid className="h-3.5 w-3.5" />}
            className="h-7 text-xs px-2.5"
            aria-label="Compact view mode"
          >
            Compact
          </Button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <JobSearch
            value={filters.search}
            onChange={(search) => handleFilterChange({ search })}
          />

          <JobFilters
            filters={filters}
            projects={projects}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
          <span>
            SHOWING {filteredJobs.length} OF {jobs.length} JOBS
          </span>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "list" ? (
        <JobList
          jobs={filteredJobs}
          isFiltered={isFiltered}
          onOpen={(job) => setSelectedJob(job)}
          onRetry={handleRetry}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpen={(job) => setSelectedJob(job)}
              onRetry={handleRetry}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <JobDetail
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
    </div>
  );
}
