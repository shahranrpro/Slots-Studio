/**
 * Slots Studio — Generation Job Subsystem Types
 */

export type JobStatus =
  | "QUEUED"
  | "RUNNING"
  | "REVIEW"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface GenerationJob {
  id: string;
  workspaceId: string;
  projectId: string;
  studio: string;
  type: string;
  status: JobStatus;
  outputCount: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface CreateJobInput {
  workspaceId: string;
  projectId: string;
  studio?: string;
  type?: string;
}
