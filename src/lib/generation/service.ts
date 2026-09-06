/**
 * Slots Studio — Generation Job Service
 *
 * Bridges generative pipeline jobs to the unified Jobs subsystem.
 */

import {
  type GenerationJob,
  type CreateJobInput,
  type JobStatus,
} from "./types";
import {
  createJobRecord,
  findJobById,
  findJobsByProjectId,
  updateJobRecord,
} from "./store";
import { createJob, updateJobStatus as updateUnifiedJobStatus } from "@/lib/jobs/service";

export async function createGenerationJob(input: CreateJobInput): Promise<GenerationJob> {
  const now = new Date().toISOString();
  const job: GenerationJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    studio: input.studio || "Product Studio",
    type: input.type || "PRODUCT_CONCEPT",
    status: "RUNNING",
    outputCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Save in generation store
  await createJobRecord(job);

  // 2. Mirror into shared jobs subsystem
  try {
    await createJob({
      workspaceId: input.workspaceId,
      projectId: input.projectId,
      studio: "PRODUCT",
      jobType: input.type === "CONCEPT_REFINEMENT" ? "PRODUCT_CONCEPT_REFINEMENT" : "PRODUCT_CONCEPT_GENERATION",
      inputSummary: `Product Concept Generation (${input.studio || "Product Studio"})`,
    });
  } catch {
    // Non-blocking mirror
  }

  return job;
}

export async function getGenerationJob(id: string): Promise<GenerationJob | null> {
  return findJobById(id);
}

export async function getProjectJobs(projectId: string): Promise<GenerationJob[]> {
  return findJobsByProjectId(projectId);
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
  outputCount?: number,
  error?: string
): Promise<GenerationJob | null> {
  const updated = await updateJobRecord(id, {
    status,
    ...(outputCount !== undefined ? { outputCount } : {}),
    ...(error !== undefined ? { error } : {}),
  });

  if (updated) {
    try {
      await updateUnifiedJobStatus(updated.workspaceId, id, status, {
        errorMessageSafe: error,
      });
    } catch {
      // Non-blocking mirror
    }
  }

  return updated;
}
