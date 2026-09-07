import { createAdminSupabaseClient } from "../server";
import {
  type Job,
  type JobFiltersInput,
  type JobStatus,
  type JobRepository,
} from "@/lib/jobs/types";
import { normalizeWorkspaceId, isUuid } from "../utils";

export interface JobDbRow {
  id: string;
  workspace_id: string;
  project_id?: string | null;
  studio_type: string;
  status: string;
  prompt?: string | null;
  parameters: {
    jobType?: string;
    provider?: string;
    progress?: number;
    progressLabel?: string;
    outputIds?: string[];
    errorCode?: string;
    retryCount?: number;
    maxRetries?: number;
    claimedAt?: string;
    claimedBy?: string;
    payload?: Record<string, unknown>;
    sourceJobId?: string;
    parentJobId?: string;
    projectName?: string;
    slotCode?: string;
    createdBy?: string;
    startedAt?: string;
    completedAt?: string;
    legacyId?: string;
    [key: string]: unknown;
  };
  error_message?: string | null;
  created_at: string;
}

function toDomain(row: JobDbRow): Job {
  return {
    id: row.parameters?.legacyId || row.id,
    workspaceId: row.workspace_id,
    projectId: row.project_id || (row.parameters?.projectId as string | undefined),
    projectName: row.parameters?.projectName,
    slotCode: row.parameters?.slotCode,
    createdBy: row.parameters?.createdBy,
    studio: row.studio_type as Job["studio"],
    jobType: (row.parameters?.jobType as Job["jobType"]) || "OTHER",
    provider: row.parameters?.provider,
    status: row.status as JobStatus,
    progress: row.parameters?.progress,
    progressLabel: row.parameters?.progressLabel,
    inputSummary: row.prompt || undefined,
    outputIds: row.parameters?.outputIds || [],
    errorCode: row.parameters?.errorCode,
    errorMessageSafe: row.error_message || undefined,
    retryCount: row.parameters?.retryCount ?? 0,
    maxRetries: row.parameters?.maxRetries ?? 3,
    claimedAt: row.parameters?.claimedAt,
    claimedBy: row.parameters?.claimedBy,
    payload: row.parameters?.payload,
    sourceJobId: row.parameters?.sourceJobId,
    parentJobId: row.parameters?.parentJobId,
    startedAt: row.parameters?.startedAt,
    completedAt: row.parameters?.completedAt,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
}

export async function createJobRecord(job: Job): Promise<Job> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(job.workspaceId);
  const isProjectUuid = job.projectId && isUuid(job.projectId);

  const parameters = {
    jobType: job.jobType,
    provider: job.provider,
    progress: job.progress,
    progressLabel: job.progressLabel,
    outputIds: job.outputIds,
    errorCode: job.errorCode,
    retryCount: job.retryCount ?? 0,
    maxRetries: job.maxRetries ?? 3,
    claimedAt: job.claimedAt,
    claimedBy: job.claimedBy,
    payload: job.payload,
    sourceJobId: job.sourceJobId,
    parentJobId: job.parentJobId,
    projectName: job.projectName,
    slotCode: job.slotCode,
    createdBy: job.createdBy,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    projectId: job.projectId,
    legacyId: job.id,
  };

  const payload: Record<string, unknown> = {
    workspace_id: wsId,
    studio_type: job.studio,
    status: job.status,
    prompt: job.inputSummary || null,
    error_message: job.errorMessageSafe || null,
    parameters,
  };

  if (isProjectUuid) {
    payload.project_id = job.projectId;
  }

  const { data: created, error } = await supabase
    .from("generation_jobs")
    .insert(payload)
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to create generation job: ${error?.message}`);
  }

  return toDomain(created as JobDbRow);
}

export async function findJobById(
  workspaceId: string,
  id: string
): Promise<Job | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const idIsUuid = isUuid(id);

  let query = supabase.from("generation_jobs").select("*").eq("workspace_id", wsId);
  if (idIsUuid) {
    query = query.eq("id", id);
  } else {
    query = query.contains("parameters", { legacyId: id });
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    // Strictly enforce workspace isolation — never search across the entire database
    return null;
  }

  return toDomain(data as JobDbRow);
}

export async function findJobsByWorkspaceId(
  workspaceId: string,
  filters?: JobFiltersInput
): Promise<Job[]> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  let query = supabase
    .from("generation_jobs")
    .select("*")
    .eq("workspace_id", wsId)
    .order("created_at", { ascending: false });

  if (filters?.studio) {
    query = query.eq("studio_type", filters.studio);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data: rows, error } = await query;
  if (error || !rows) return [];

  let jobs = rows.map((r) => toDomain(r as JobDbRow));

  if (filters?.projectId) {
    jobs = jobs.filter((j) => j.projectId === filters.projectId);
  }

  if (filters?.jobType) {
    jobs = jobs.filter((j) => j.jobType === filters.jobType);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    jobs = jobs.filter(
      (j) =>
        (j.projectName && j.projectName.toLowerCase().includes(q)) ||
        (j.slotCode && j.slotCode.toLowerCase().includes(q)) ||
        (j.inputSummary && j.inputSummary.toLowerCase().includes(q)) ||
        j.id.toLowerCase().includes(q)
    );
  }

  return jobs;
}

export async function updateJobRecord(
  workspaceId: string,
  id: string,
  updates: Partial<Job>
): Promise<Job | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const existing = await findJobById(wsId, id);
  if (!existing) return null;

  const currentDbId = isUuid(existing.id) ? existing.id : undefined;

  const mergedParameters = {
    jobType: updates.jobType !== undefined ? updates.jobType : existing.jobType,
    provider: updates.provider !== undefined ? updates.provider : existing.provider,
    progress: updates.progress !== undefined ? updates.progress : existing.progress,
    progressLabel: updates.progressLabel !== undefined ? updates.progressLabel : existing.progressLabel,
    outputIds: updates.outputIds !== undefined ? updates.outputIds : existing.outputIds,
    errorCode: updates.errorCode !== undefined ? updates.errorCode : existing.errorCode,
    retryCount: updates.retryCount !== undefined ? updates.retryCount : existing.retryCount,
    maxRetries: updates.maxRetries !== undefined ? updates.maxRetries : existing.maxRetries,
    claimedAt: updates.claimedAt !== undefined ? updates.claimedAt : existing.claimedAt,
    claimedBy: updates.claimedBy !== undefined ? updates.claimedBy : existing.claimedBy,
    payload: updates.payload !== undefined ? updates.payload : existing.payload,
    startedAt: updates.startedAt !== undefined ? updates.startedAt : existing.startedAt,
    completedAt: updates.completedAt !== undefined ? updates.completedAt : existing.completedAt,
    legacyId: !currentDbId ? existing.id : undefined,
  };

  const payload: Record<string, unknown> = {
    status: updates.status !== undefined ? updates.status : existing.status,
    error_message: updates.errorMessageSafe !== undefined ? updates.errorMessageSafe : existing.errorMessageSafe,
    parameters: mergedParameters,
  };

  let updateQuery = supabase.from("generation_jobs").update(payload);
  if (currentDbId) {
    updateQuery = updateQuery.eq("id", currentDbId);
  } else {
    updateQuery = updateQuery.eq("workspace_id", wsId).contains("parameters", { legacyId: existing.id });
  }

  const { data: updated, error } = await updateQuery.select().single();
  if (error || !updated) return null;

  return toDomain(updated as JobDbRow);
}

/**
 * Atomically claim a specific job by ID if its status is 'QUEUED'.
 * Prevents race conditions between concurrent worker threads.
 */
export async function claimJobById(
  workspaceId: string,
  id: string,
  workerId: string
): Promise<Job | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const existing = await findJobById(wsId, id);
  if (!existing || existing.status !== "QUEUED") return null;

  const currentDbId = isUuid(existing.id) ? existing.id : undefined;
  const now = new Date().toISOString();

  const mergedParameters = {
    jobType: existing.jobType,
    provider: existing.provider,
    progress: 15,
    progressLabel: "PROCESSING IN BACKGROUND WORKER",
    outputIds: existing.outputIds,
    errorCode: existing.errorCode,
    retryCount: existing.retryCount ?? 0,
    maxRetries: existing.maxRetries ?? 3,
    claimedAt: now,
    claimedBy: workerId,
    startedAt: existing.startedAt || now,
    payload: existing.payload,
    legacyId: !currentDbId ? existing.id : undefined,
  };

  let updateQuery = supabase
    .from("generation_jobs")
    .update({
      status: "RUNNING",
      parameters: mergedParameters,
    })
    .eq("status", "QUEUED");

  if (currentDbId) {
    updateQuery = updateQuery.eq("id", currentDbId);
  } else {
    updateQuery = updateQuery.eq("workspace_id", wsId).contains("parameters", { legacyId: existing.id });
  }

  const { data: updated, error } = await updateQuery.select().maybeSingle();
  if (error || !updated) return null;

  return toDomain(updated as JobDbRow);
}

/**
 * Atomically claim the oldest QUEUED job across the workspace.
 */
export async function claimNextQueuedJob(
  workerId: string,
  workspaceId?: string
): Promise<Job | null> {
  const supabase = createAdminSupabaseClient();
  let query = supabase
    .from("generation_jobs")
    .select("*")
    .eq("status", "QUEUED")
    .order("created_at", { ascending: true })
    .limit(10);

  if (workspaceId) {
    query = query.eq("workspace_id", normalizeWorkspaceId(workspaceId));
  }

  const { data: candidates, error } = await query;
  if (error || !candidates || candidates.length === 0) return null;

  const now = new Date().toISOString();
  for (const candidate of candidates) {
    const params = candidate.parameters || {};
    const updatedParams = {
      ...params,
      claimedAt: now,
      claimedBy: workerId,
      startedAt: params.startedAt || now,
      progressLabel: "PROCESSING IN BACKGROUND WORKER",
    };

    const { data: claimed, error: claimErr } = await supabase
      .from("generation_jobs")
      .update({
        status: "RUNNING",
        parameters: updatedParams,
      })
      .eq("id", candidate.id)
      .eq("status", "QUEUED")
      .select()
      .maybeSingle();

    if (!claimErr && claimed) {
      return toDomain(claimed as JobDbRow);
    }
  }

  return null;
}

/**
 * Recovers jobs that have been RUNNING for longer than staleMinutes.
 * Re-queues them if within retry limits, or marks them FAILED.
 */
export async function recoverStaleJobs(staleMinutes = 5): Promise<number> {
  const supabase = createAdminSupabaseClient();
  const cutoff = new Date(Date.now() - staleMinutes * 60 * 1000).toISOString();

  const { data: runningJobs, error } = await supabase
    .from("generation_jobs")
    .select("*")
    .eq("status", "RUNNING");

  if (error || !runningJobs || runningJobs.length === 0) return 0;

  let recoveredCount = 0;
  const now = new Date().toISOString();

  for (const job of runningJobs) {
    const params = job.parameters || {};
    const claimedOrStarted = params.claimedAt || params.startedAt || job.created_at;

    if (new Date(claimedOrStarted) < new Date(cutoff)) {
      const retryCount = (params.retryCount ?? 0) + 1;
      const maxRetries = params.maxRetries ?? 3;

      if (retryCount <= maxRetries) {
        // Re-queue
        await supabase
          .from("generation_jobs")
          .update({
            status: "QUEUED",
            parameters: {
              ...params,
              retryCount,
              progressLabel: `RE-QUEUED STALE JOB (Attempt ${retryCount}/${maxRetries})`,
              claimedAt: null,
              claimedBy: null,
            },
          })
          .eq("id", job.id);
      } else {
        // Mark FAILED
        await supabase
          .from("generation_jobs")
          .update({
            status: "FAILED",
            error_message: `Execution timed out and exceeded max retries (${maxRetries}).`,
            parameters: {
              ...params,
              errorCode: "ERR_EXECUTION_TIMEOUT",
              completedAt: now,
              progressLabel: "FAILED (TIMEOUT)",
            },
          })
          .eq("id", job.id);
      }
      recoveredCount++;
    }
  }

  return recoveredCount;
}

export async function deleteJobRecord(
  workspaceId: string,
  id: string
): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const existing = await findJobById(wsId, id);
  if (!existing) return false;

  const currentDbId = isUuid(existing.id) ? existing.id : undefined;

  let query = supabase.from("generation_jobs").delete();
  if (currentDbId) {
    query = query.eq("id", currentDbId);
  } else {
    query = query.eq("workspace_id", wsId).contains("parameters", { legacyId: existing.id });
  }

  const { error } = await query;
  return !error;
}

export const supabaseJobRepository: JobRepository = {
  findMany: findJobsByWorkspaceId,
  findById: findJobById,
  create: createJobRecord,
  update: updateJobRecord,
  delete: deleteJobRecord,
};


