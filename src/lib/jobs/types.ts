/**
 * Slots Studio — Shared Workspace Jobs Domain Models
 */

export type JobStatus =
  | "QUEUED"
  | "RUNNING"
  | "REVIEW"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type JobType =
  | "PRODUCT_CONCEPT_GENERATION"
  | "PRODUCT_CONCEPT_REFINEMENT"
  | "VISUAL_GENERATION"
  | "CONTENT_GENERATION"
  | "CONTENT_REFINEMENT"
  | "CAMPAIGN_GENERATION"
  | "CAMPAIGN_ASSET_PACK_GENERATION"
  | "PRODUCTION_TECHPACK_GENERATION"
  | "PRODUCTION_DOCUMENT_GENERATION"
  | "ASSET_PROCESSING"
  | "OTHER";

export type StudioContext =
  | "PRODUCT"
  | "VISUAL"
  | "CONTENT"
  | "CAMPAIGN"
  | "PRODUCTION";

export interface Job {
  id: string;
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  slotCode?: string; // e.g. "SS-02481"
  createdBy?: string;
  studio: StudioContext;
  jobType: JobType;
  provider?: string;
  status: JobStatus;
  progress?: number;
  progressLabel?: string; // e.g. "SYNTHESIZING CANDIDATES", "PREPARING OUTPUT"
  inputSummary?: string; // High-level safe summary
  outputIds?: string[]; // Linked asset / concept IDs
  errorCode?: string;
  errorMessageSafe?: string;
  retryCount?: number;
  maxRetries?: number;
  claimedAt?: string;
  claimedBy?: string;
  payload?: Record<string, unknown>; // Custom studio payload parameters
  sourceJobId?: string;
  parentJobId?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFiltersInput {
  search?: string;
  projectId?: string;
  studio?: StudioContext;
  jobType?: JobType;
  status?: JobStatus;
}

export interface CreateJobInput {
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  slotCode?: string;
  createdBy?: string;
  studio: StudioContext;
  jobType: JobType;
  provider?: string;
  status?: JobStatus;
  progressLabel?: string;
  inputSummary?: string;
  outputIds?: string[];
  maxRetries?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateJobInput {
  status?: JobStatus;
  progress?: number;
  progressLabel?: string;
  outputIds?: string[];
  errorCode?: string;
  errorMessageSafe?: string;
  retryCount?: number;
  maxRetries?: number;
  claimedAt?: string;
  claimedBy?: string;
  startedAt?: string;
  completedAt?: string;
  payload?: Record<string, unknown>;
}

export interface JobRepository {
  findMany(workspaceId: string, filters?: JobFiltersInput): Promise<Job[]>;
  findById(workspaceId: string, id: string): Promise<Job | null>;
  create(job: Job): Promise<Job>;
  update(workspaceId: string, id: string, updates: Partial<Job>): Promise<Job | null>;
  delete(workspaceId: string, id: string): Promise<boolean>;
}
