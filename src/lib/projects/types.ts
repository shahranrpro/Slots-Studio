/**
 * Slots Studio — Project Domain Types
 */

export type ProjectStatus =
  | "DRAFT"
  | "ACTIVE"
  | "IN_REVIEW"
  | "APPROVED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "ARCHIVED";

export type ProjectCategory =
  | "PRODUCT"
  | "COLLECTION"
  | "CAMPAIGN"
  | "BRAND_ASSET"
  | "OTHER";

export interface ProjectContext {
  targetAudience?: string;
  visualDirection?: string;
  notes?: string;
  tags?: string[];
  colorways?: string[];
}

export interface Project {
  id: string;
  workspaceId: string;
  slotCode: string; // e.g. "SS-02481"
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  context: ProjectContext;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  category: ProjectCategory;
  description?: string;
  targetAudience?: string;
  visualDirection?: string;
  notes?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  context?: Partial<ProjectContext>;
}

export interface ProjectFilterOptions {
  search?: string;
  status?: ProjectStatus | "ALL";
  category?: ProjectCategory | "ALL";
  includeArchived?: boolean;
}

export interface ProjectResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}
