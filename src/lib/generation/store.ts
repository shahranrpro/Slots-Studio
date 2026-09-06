/**
 * Slots Studio — Generation Job Store (Development Only)
 *
 * Ephemeral in-memory repository for tracking background generation jobs.
 */

import { type GenerationJob } from "./types";

const jobsMap = new Map<string, GenerationJob>();

export async function createJobRecord(job: GenerationJob): Promise<GenerationJob> {
  jobsMap.set(job.id, job);
  return job;
}

export async function findJobById(id: string): Promise<GenerationJob | null> {
  return jobsMap.get(id) || null;
}

export async function findJobsByProjectId(projectId: string): Promise<GenerationJob[]> {
  const result: GenerationJob[] = [];
  for (const job of jobsMap.values()) {
    if (job.projectId === projectId) {
      result.push(job);
    }
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateJobRecord(
  id: string,
  updates: Partial<GenerationJob>
): Promise<GenerationJob | null> {
  const existing = jobsMap.get(id);
  if (!existing) return null;

  const updated: GenerationJob = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  jobsMap.set(id, updated);
  return updated;
}
