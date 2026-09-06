/**
 * Slots Studio — Jobs UI Types
 */

import {
  type JobStatus,
  type StudioContext,
  type JobType,
} from "@/lib/jobs/types";

export type JobViewMode = "list" | "compact";

export interface JobFilterState {
  search: string;
  status: JobStatus | "ALL";
  studio: StudioContext | "ALL";
  jobType: JobType | "ALL";
  projectId: string | "ALL";
}
