/**
 * Slots Studio — Job Repository Implementation (Development Only)
 *
 * ARCHITECTURAL NOTICE:
 * This repository manages jobs in memory during development.
 * It is EXPLICITLY NON-PRODUCTION and will be replaced with PostgreSQL
 * and background worker infrastructure in upcoming tasks.
 */

import {
  type Job,
  type JobFiltersInput,
  type JobRepository,
} from "./types";

const globalForJobs = globalThis as unknown as {
  jobsMap?: Map<string, Job>;
};

const jobsMap = globalForJobs.jobsMap || new Map<string, Job>();
if (process.env.NODE_ENV !== "production") globalForJobs.jobsMap = jobsMap;

class InMemoryJobRepository implements JobRepository {
  private jobs: Map<string, Job> = jobsMap;

  async findMany(workspaceId: string, filters?: JobFiltersInput): Promise<Job[]> {
    let list = Array.from(this.jobs.values()).filter(
      (j) => j.workspaceId === workspaceId || j.workspaceId === "ws_dev_seed"
    );

    if (filters?.projectId) {
      list = list.filter((j) => j.projectId === filters.projectId);
    }

    if (filters?.studio) {
      list = list.filter((j) => j.studio === filters.studio);
    }

    if (filters?.jobType) {
      list = list.filter((j) => j.jobType === filters.jobType);
    }

    if (filters?.status) {
      list = list.filter((j) => j.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((j) =>
        (j.projectName && j.projectName.toLowerCase().includes(q)) ||
        (j.slotCode && j.slotCode.toLowerCase().includes(q)) ||
        j.jobType.toLowerCase().includes(q) ||
        j.studio.toLowerCase().includes(q) ||
        (j.inputSummary && j.inputSummary.toLowerCase().includes(q))
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(workspaceId: string, id: string): Promise<Job | null> {
    const job = this.jobs.get(id);
    if (!job || (job.workspaceId !== workspaceId && job.workspaceId !== "ws_dev_seed")) {
      return null;
    }
    return job;
  }

  async create(job: Job): Promise<Job> {
    this.jobs.set(job.id, job);
    return job;
  }

  async update(
    workspaceId: string,
    id: string,
    updates: Partial<Job>
  ): Promise<Job | null> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) return null;

    const updated: Job = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(id, updated);
    return updated;
  }

  async delete(workspaceId: string, id: string): Promise<boolean> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) return false;
    return this.jobs.delete(id);
  }
}

export const jobStore = new InMemoryJobRepository();
