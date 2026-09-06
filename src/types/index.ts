/**
 * Slots Studio — Shared Type Definitions
 */

export type EntityId = string;

export type ProjectStatus =
  | "DRAFT"
  | "ACTIVE"
  | "IN_REVIEW"
  | "APPROVED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "ARCHIVED";

export type JobStatus = "QUEUED" | "RUNNING" | "REVIEW" | "APPROVED" | "FAILED" | "CANCELLED";

export type AssetSource = "UPLOAD" | "AI_GENERATED" | "IMPORTED" | "SYSTEM";

export type AssetStatus = "DRAFT" | "GENERATING" | "REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED";

export type WorkspaceRole = "OWNER" | "ADMIN" | "EDITOR" | "REVIEWER" | "VIEWER";

export interface User {
  id: EntityId;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: EntityId;
  name: string;
  slug: string;
  ownerId: EntityId;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: EntityId;
  workspaceId: EntityId;
  slotCode: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  category?: string;
  createdBy: EntityId;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface Asset {
  id: EntityId;
  workspaceId: EntityId;
  projectId?: EntityId;
  uploadedBy?: EntityId;
  name: string;
  assetType: string;
  mimeType: string;
  storageKey: string;
  thumbnailKey?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  source: AssetSource;
  status: AssetStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: EntityId;
  workspaceId: EntityId;
  projectId?: EntityId;
  jobType: string;
  status: JobStatus;
  progressPercent: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
