/**
 * Slots Studio — Jobs Service Layer
 *
 * Exposes authoritative business logic for the shared workspace jobs subsystem.
 */

import {
  type Job,
  type JobStatus,
  type JobFiltersInput,
  type CreateJobInput,
  type UpdateJobInput,
  type JobRepository,
} from "./types";
import { jobStore } from "./store";
import { supabaseJobRepository } from "@/lib/supabase/repositories/jobRepository";
import { ensureDatabaseSeeded } from "@/lib/supabase/seed";

let repository: JobRepository = supabaseJobRepository;

export function setJobRepository(repo: JobRepository): void {
  repository = repo;
}

export async function getJobs(
  workspaceId: string,
  filters?: JobFiltersInput
): Promise<{ success: boolean; data?: Job[]; error?: string }> {
  try {
    await ensureDatabaseSeeded();
    const jobs = await repository.findMany(workspaceId, filters);
    if (jobs && jobs.length > 0) {
      for (const j of jobs) {
        await jobStore.create(j).catch(() => {});
      }
      return { success: true, data: jobs };
    }
    const fallback = await jobStore.findMany(workspaceId, filters);
    return { success: true, data: fallback };
  } catch {
    try {
      const fallback = await jobStore.findMany(workspaceId, filters);
      return { success: true, data: fallback };
    } catch {
      return { success: false, error: "Failed to retrieve jobs." };
    }
  }
}

export async function getJobById(
  workspaceId: string,
  id: string
): Promise<{ success: boolean; data?: Job; error?: string }> {
  try {
    await ensureDatabaseSeeded();
    let job = await repository.findById(workspaceId, id);
    if (!job) {
      job = await jobStore.findById(workspaceId, id);
    }
    if (!job) {
      return { success: false, error: "Job not found." };
    }
    return { success: true, data: job };
  } catch {
    const fallback = await jobStore.findById(workspaceId, id).catch(() => null);
    if (fallback) return { success: true, data: fallback };
    return { success: false, error: "Failed to retrieve job." };
  }
}

import { triggerWorker } from "./worker";

export async function createJob(
  input: CreateJobInput
): Promise<{ success: boolean; data?: Job; error?: string }> {
  try {
    await ensureDatabaseSeeded();
    const now = new Date().toISOString();
    const initialStatus = input.status || "QUEUED";

    const job: Job = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      projectName: input.projectName,
      slotCode: input.slotCode,
      createdBy: input.createdBy,
      studio: input.studio,
      jobType: input.jobType,
      provider: input.provider || "SlotsStudio-DevEngine",
      status: initialStatus,
      progress: initialStatus === "QUEUED" ? 0 : 25,
      progressLabel:
        input.progressLabel ||
        (initialStatus === "QUEUED"
          ? "QUEUED IN WORKSPACE PIPELINE"
          : "SYNTHESIZING CANDIDATES"),
      inputSummary: input.inputSummary,
      outputIds: input.outputIds || [],
      retryCount: 0,
      maxRetries: input.maxRetries ?? 3,
      payload: input.payload,
      startedAt: initialStatus === "RUNNING" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    let created: Job;
    try {
      created = await repository.create(job);
    } catch (err) {
      console.warn("DB job create notice:", err);
      created = job;
    }

    await jobStore.create(created).catch(() => {});

    // Automatically trigger background worker processing if queued
    if (created.status === "QUEUED") {
      triggerWorker(created.id, created.workspaceId);
    }

    return { success: true, data: created };
  } catch {
    return { success: false, error: "Failed to create job record." };
  }
}

export async function updateJobStatus(
  workspaceId: string,
  id: string,
  status: JobStatus,
  updates?: Partial<UpdateJobInput>
): Promise<{ success: boolean; data?: Job; error?: string }> {
  try {
    const existing = await repository.findById(workspaceId, id);
    if (!existing) {
      return { success: false, error: "Job not found." };
    }

    const now = new Date().toISOString();
    const isTerminal = status === "COMPLETED" || status === "FAILED" || status === "CANCELLED";

    const updated = await repository.update(workspaceId, id, {
      status,
      ...(updates?.progress !== undefined ? { progress: updates.progress } : {}),
      ...(updates?.progressLabel ? { progressLabel: updates.progressLabel } : {}),
      ...(updates?.outputIds ? { outputIds: updates.outputIds } : {}),
      ...(updates?.errorCode ? { errorCode: updates.errorCode } : {}),
      ...(updates?.errorMessageSafe ? { errorMessageSafe: updates.errorMessageSafe } : {}),
      ...(isTerminal ? { completedAt: now } : {}),
    });

    const storeUpdated = await jobStore.update(workspaceId, id, {
      status,
      ...(updates?.progress !== undefined ? { progress: updates.progress } : {}),
      ...(updates?.progressLabel ? { progressLabel: updates.progressLabel } : {}),
      ...(updates?.outputIds ? { outputIds: updates.outputIds } : {}),
      ...(updates?.errorCode ? { errorCode: updates.errorCode } : {}),
      ...(updates?.errorMessageSafe ? { errorMessageSafe: updates.errorMessageSafe } : {}),
      ...(isTerminal ? { completedAt: now } : {}),
    }).catch(() => null);

    const finalUpdated = updated || storeUpdated;
    if (!finalUpdated) {
      return { success: false, error: "Failed to update job status." };
    }

    return { success: true, data: finalUpdated };
  } catch {
    return { success: false, error: "Failed to update job." };
  }
}

export async function retryJob(
  workspaceId: string,
  id: string
): Promise<{ success: boolean; data?: Job; error?: string }> {
  try {
    const existing = await repository.findById(workspaceId, id);
    if (!existing) {
      return { success: false, error: "Source job not found." };
    }

    if (existing.status !== "FAILED" && existing.status !== "CANCELLED") {
      return { success: false, error: "Only failed or cancelled jobs can be retried." };
    }

    const now = new Date().toISOString();
    const retryJobRecord: Job = {
      id: `job_${Date.now()}_retry_${Math.random().toString(36).substring(2, 6)}`,
      workspaceId: existing.workspaceId,
      projectId: existing.projectId,
      projectName: existing.projectName,
      slotCode: existing.slotCode,
      createdBy: existing.createdBy,
      studio: existing.studio,
      jobType: existing.jobType,
      provider: existing.provider,
      status: "QUEUED",
      progress: 0,
      progressLabel: "QUEUED FOR RETRY",
      inputSummary: existing.inputSummary,
      outputIds: [],
      payload: existing.payload,
      sourceJobId: existing.id,
      retryCount: (existing.retryCount || 0) + 1,
      maxRetries: existing.maxRetries ?? 3,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    let created: Job;
    try {
      created = await repository.create(retryJobRecord);
    } catch (err) {
      console.warn("DB job retry create notice:", err);
      created = retryJobRecord;
    }
    await jobStore.create(created).catch(() => {});

    // Trigger worker
    triggerWorker(created.id, created.workspaceId);

    return { success: true, data: created };
  } catch {
    return { success: false, error: "Failed to retry job." };
  }
}

export async function cancelJob(
  workspaceId: string,
  id: string
): Promise<{ success: boolean; data?: Job; error?: string }> {
  try {
    const existing = await repository.findById(workspaceId, id);
    if (!existing) {
      return { success: false, error: "Job not found." };
    }

    if (existing.status !== "QUEUED" && existing.status !== "RUNNING") {
      return { success: false, error: "Only queued or running jobs can be cancelled." };
    }

    const now = new Date().toISOString();
    const updated = await repository.update(workspaceId, id, {
      status: "CANCELLED",
      progressLabel: "CANCELLED BY USER",
      completedAt: now,
    });

    const storeUpdated = await jobStore.update(workspaceId, id, {
      status: "CANCELLED",
      progressLabel: "CANCELLED BY USER",
      completedAt: now,
    }).catch(() => null);

    const finalJob = updated || storeUpdated;
    if (!finalJob) {
      return { success: false, error: "Failed to cancel job." };
    }

    return { success: true, data: finalJob };
  } catch {
    return { success: false, error: "Failed to cancel job." };
  }
}
