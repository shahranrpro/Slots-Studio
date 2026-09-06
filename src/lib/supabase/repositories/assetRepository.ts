import { createAdminSupabaseClient } from "../server";
import {
  type Asset,
  type AssetFiltersInput,
  type CreateAssetInput,
  type AssetRepository,
} from "@/lib/assets/types";
import { normalizeWorkspaceId, isUuid } from "../utils";

export interface AssetDbRow {
  id: string;
  workspace_id: string;
  project_id?: string | null;
  name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  size_bytes?: number | null;
  metadata: {
    thumbnailKey?: string;
    previewUrl?: string;
    previewSvg?: string;
    width?: number;
    height?: number;
    source?: string;
    status?: string;
    projectName?: string;
    slotCode?: string;
    legacyId?: string;
    archivedAt?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

function toDomain(row: AssetDbRow): Asset {
  return {
    id: row.metadata?.legacyId || row.id,
    workspaceId: row.workspace_id,
    projectId: row.project_id || (row.metadata?.projectId as string | undefined),
    projectName: row.metadata?.projectName,
    slotCode: row.metadata?.slotCode,
    name: row.name,
    assetType: row.file_type as Asset["assetType"],
    mimeType: row.mime_type,
    storageKey: row.file_path,
    thumbnailKey: row.metadata?.thumbnailKey,
    previewUrl: row.metadata?.previewUrl,
    previewSvg: row.metadata?.previewSvg,
    width: row.metadata?.width,
    height: row.metadata?.height,
    sizeBytes: row.size_bytes || undefined,
    source: (row.metadata?.source as Asset["source"]) || "UPLOAD",
    status: (row.metadata?.status as Asset["status"]) || "REVIEW",
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.created_at,
    archivedAt: row.metadata?.archivedAt,
  };
}

export async function createAssetRecord(input: CreateAssetInput): Promise<Asset> {
  const supabase = createAdminSupabaseClient();

  const wsId = normalizeWorkspaceId(input.workspaceId);
  const isProjectUuid = input.projectId && isUuid(input.projectId);

  const metadata = {
    thumbnailKey: input.thumbnailKey,
    previewUrl: input.previewUrl,
    previewSvg: input.previewSvg,
    width: input.width,
    height: input.height,
    source: input.source || "UPLOAD",
    status: input.status || "REVIEW",
    projectName: input.projectName,
    slotCode: input.slotCode,
    projectId: input.projectId,
    legacyId: (input as unknown as Record<string, unknown>).id as string | undefined,
    ...(input.metadata || {}),
  };

  const payload: Record<string, unknown> = {
    workspace_id: wsId,
    name: input.name,
    file_path: input.storageKey,
    file_type: input.assetType,
    mime_type: input.mimeType || "application/octet-stream",
    size_bytes: input.sizeBytes || 0,
    metadata,
  };

  if (isProjectUuid) {
    payload.project_id = input.projectId;
  }

  const { data: created, error } = await supabase
    .from("assets")
    .insert(payload)
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to create asset: ${error?.message}`);
  }

  return toDomain(created as AssetDbRow);
}

export async function findAssetById(
  workspaceId: string,
  id: string
): Promise<Asset | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const idIsUuid = isUuid(id);

  let query = supabase.from("assets").select("*").eq("workspace_id", wsId);
  if (idIsUuid) {
    query = query.eq("id", id);
  } else {
    query = query.contains("metadata", { legacyId: id });
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    // Fallback search by id without workspace constraint
    if (idIsUuid) {
      const { data: fb } = await supabase.from("assets").select("*").eq("id", id).maybeSingle();
      if (fb) return toDomain(fb as AssetDbRow);
    }
    const { data: fbLegacy } = await supabase.from("assets").select("*").contains("metadata", { legacyId: id }).maybeSingle();
    if (fbLegacy) return toDomain(fbLegacy as AssetDbRow);

    return null;
  }

  return toDomain(data as AssetDbRow);
}

export async function findAssetsByWorkspaceId(
  workspaceId: string,
  filters?: AssetFiltersInput
): Promise<Asset[]> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  let query = supabase
    .from("assets")
    .select("*")
    .eq("workspace_id", wsId)
    .order("created_at", { ascending: false });

  if (filters?.assetType) {
    query = query.eq("file_type", filters.assetType);
  }

  const { data: rows, error } = await query;
  if (error || !rows) return [];

  let assets = rows.map((r) => toDomain(r as AssetDbRow));

  if (!filters?.includeArchived) {
    assets = assets.filter((a) => a.status !== "ARCHIVED");
  }

  if (filters?.status) {
    assets = assets.filter((a) => a.status === filters.status);
  }

  if (filters?.source) {
    assets = assets.filter((a) => a.source === filters.source);
  }

  if (filters?.projectId) {
    assets = assets.filter((a) => a.projectId === filters.projectId);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    assets = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.slotCode && a.slotCode.toLowerCase().includes(q)) ||
        (a.projectName && a.projectName.toLowerCase().includes(q))
    );
  }

  return assets;
}

export async function updateAssetRecord(
  workspaceId: string,
  id: string,
  updates: Partial<Asset>
): Promise<Asset | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const existing = await findAssetById(wsId, id);
  if (!existing) return null;

  const currentDbId = isUuid(existing.id) ? existing.id : undefined;

  const mergedMetadata = {
    ...existing.metadata,
    thumbnailKey: updates.thumbnailKey !== undefined ? updates.thumbnailKey : existing.thumbnailKey,
    previewUrl: updates.previewUrl !== undefined ? updates.previewUrl : existing.previewUrl,
    previewSvg: updates.previewSvg !== undefined ? updates.previewSvg : existing.previewSvg,
    status: updates.status !== undefined ? updates.status : existing.status,
    archivedAt: updates.archivedAt !== undefined ? updates.archivedAt : existing.archivedAt,
    legacyId: !currentDbId ? existing.id : undefined,
  };

  const payload: Record<string, unknown> = {
    name: updates.name !== undefined ? updates.name : existing.name,
    metadata: mergedMetadata,
  };

  let updateQuery = supabase.from("assets").update(payload);
  if (currentDbId) {
    updateQuery = updateQuery.eq("id", currentDbId);
  } else {
    updateQuery = updateQuery.eq("workspace_id", wsId).contains("metadata", { legacyId: existing.id });
  }

  const { data: updated, error } = await updateQuery.select().single();
  if (error || !updated) return null;

  return toDomain(updated as AssetDbRow);
}

export async function archiveAssetRecord(
  workspaceId: string,
  id: string
): Promise<Asset | null> {
  const now = new Date().toISOString();
  return updateAssetRecord(workspaceId, id, {
    status: "ARCHIVED",
    archivedAt: now,
  });
}

export const supabaseAssetRepository: AssetRepository = {
  async findMany(workspaceId, filters) {
    return findAssetsByWorkspaceId(workspaceId, filters);
  },
  async findById(workspaceId, id) {
    return findAssetById(workspaceId, id);
  },
  async create(asset) {
    return createAssetRecord(asset as unknown as CreateAssetInput);
  },
  async update(workspaceId, id, updates) {
    return updateAssetRecord(workspaceId, id, updates);
  },
  async delete(workspaceId, id) {
    const res = await archiveAssetRecord(workspaceId, id);
    return !!res;
  },
};

