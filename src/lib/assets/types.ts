/**
 * Slots Studio — Shared Workspace Asset Domain Models
 */

export type AssetType =
  | "IMAGE"
  | "VIDEO"
  | "DOCUMENT"
  | "DESIGN"
  | "LOGO"
  | "REFERENCE"
  | "OTHER";

export type AssetSource =
  | "UPLOAD"
  | "AI_GENERATED"
  | "IMPORTED"
  | "SYSTEM";

export type AssetStatus =
  | "DRAFT"
  | "GENERATING"
  | "REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export interface Asset {
  id: string;
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  slotCode?: string; // e.g. "SS-02481"
  name: string;
  assetType: AssetType;
  mimeType: string;
  storageKey: string;
  storageBucket?: string;
  thumbnailKey?: string;
  previewUrl?: string; // Optional direct preview URL for standard images/media
  previewSvg?: string; // Vector preview for development rendering
  width?: number;
  height?: number;
  sizeBytes?: number;
  source: AssetSource;
  status: AssetStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface AssetFiltersInput {
  search?: string;
  projectId?: string;
  assetType?: AssetType;
  source?: AssetSource;
  status?: AssetStatus;
  includeArchived?: boolean;
}

export interface CreateAssetInput {
  workspaceId: string;
  projectId?: string;
  projectName?: string;
  slotCode?: string;
  name: string;
  assetType: AssetType;
  mimeType: string;
  storageKey: string;
  storageBucket?: string;
  thumbnailKey?: string;
  previewUrl?: string;
  previewSvg?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  source: AssetSource;
  status?: AssetStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateAssetInput {
  name?: string;
  status?: AssetStatus;
  metadata?: Record<string, unknown>;
}

export interface AssetRepository {
  findMany(workspaceId: string, filters?: AssetFiltersInput): Promise<Asset[]>;
  findById(workspaceId: string, id: string): Promise<Asset | null>;
  create(asset: Asset): Promise<Asset>;
  update(workspaceId: string, id: string, updates: Partial<Asset>): Promise<Asset | null>;
  delete(workspaceId: string, id: string): Promise<boolean>;
}
