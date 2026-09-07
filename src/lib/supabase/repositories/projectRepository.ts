/**
 * Slots Studio — Supabase Projects Repository
 *
 * Backs Project entities, SLOT ID generation, search/filters, and soft archival.
 */

import { createAdminSupabaseClient } from "../server";
import {
  type Project,
  type ProjectContext,
  type ProjectFilterOptions,
} from "@/lib/projects/types";
import { normalizeWorkspaceId, normalizeUserId, isUuid } from "../utils";

export interface ProjectDbRow {
  id: string;
  workspace_id: string;
  slot_id: string;
  title: string;
  status: string;
  metadata: {
    description?: string;
    category?: string;
    context?: Record<string, unknown>;
    createdBy?: string;
    archivedAt?: string;
    legacyId?: string;
  };
  created_at: string;
}

function toDomain(row: ProjectDbRow): Project {
  return {
    id: row.metadata?.legacyId || row.id,
    workspaceId: row.workspace_id,
    slotCode: row.slot_id,
    name: row.title,
    description: row.metadata?.description || "",
    category: (row.metadata?.category as Project["category"]) || "PRODUCT",
    status: (row.status as Project["status"]) || "ACTIVE",
    context: (row.metadata?.context as unknown as Project["context"]) || {},
    createdBy: row.metadata?.createdBy || "system",
    createdAt: row.created_at,
    updatedAt: row.created_at,
    archivedAt: row.metadata?.archivedAt,
  };
}

export async function createProjectRecord(data: {
  workspaceId: string;
  slotCode: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  context?: ProjectContext | Record<string, unknown>;
  createdBy?: string;
  id?: string;
}): Promise<Project> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(data.workspaceId);
  const userId = normalizeUserId(data.createdBy);

  const metadata = {
    description: data.description || "",
    category: data.category || "PRODUCT",
    context: data.context || {},
    createdBy: userId,
    legacyId: data.id,
  };

  const payload: Record<string, unknown> = {
    workspace_id: wsId,
    slot_id: data.slotCode,
    title: data.name,
    status: data.status || "ACTIVE",
    metadata,
  };

  // If ID is valid UUID, provide it directly
  if (data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.id)) {
    payload.id = data.id;
  }

  const { data: created, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to create project: ${error?.message}`);
  }

  return toDomain(created as ProjectDbRow);
}

export async function findProjectById(
  workspaceId: string,
  id: string
): Promise<Project | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  // Try querying by ID directly
  const idIsUuid = isUuid(id);

  let query = supabase.from("projects").select("*").eq("workspace_id", wsId);

  if (idIsUuid) {
    query = query.eq("id", id);
  } else {
    // Check legacyId in metadata or slot_id
    query = query.contains("metadata", { legacyId: id });
  }

  const { data: proj, error } = await query.maybeSingle();

  if (error || !proj) {
    // If not found with legacyId, try slot_id within workspace
    const { data: bySlot } = await supabase
      .from("projects")
      .select("*")
      .eq("workspace_id", wsId)
      .eq("slot_id", id)
      .maybeSingle();

    if (bySlot) return toDomain(bySlot as ProjectDbRow);

    // Strictly enforce workspace isolation — never search across the entire database
    return null;
  }

  return toDomain(proj as ProjectDbRow);
}

export async function findProjectBySlotCode(
  workspaceId: string,
  slotCode: string
): Promise<Project | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const { data: proj, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", wsId)
    .eq("slot_id", slotCode)
    .maybeSingle();

  if (error || !proj) {
    return null;
  }

  return toDomain(proj as ProjectDbRow);
}

export async function findProjectsByWorkspaceId(
  workspaceId: string,
  filters?: ProjectFilterOptions
): Promise<Project[]> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  let query = supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", wsId)
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  } else if (!filters?.includeArchived) {
    query = query.neq("status", "ARCHIVED");
  }

  const { data: rows, error } = await query;

  if (error || !rows) {
    return [];
  }

  let projects = rows.map((r) => toDomain(r as ProjectDbRow));

  if (filters?.category && filters.category !== "ALL") {
    projects = projects.filter((p) => p.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slotCode.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return projects;
}

export async function getNextSlotIndex(workspaceId: string): Promise<number> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const { count } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", wsId);

  return (count || 0) + 101;
}

export async function updateProjectRecord(
  workspaceId: string,
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const existing = await findProjectById(wsId, id);
  if (!existing) return null;

  const currentDbId = isUuid(existing.id) ? existing.id : undefined;

  const mergedMetadata = {
    description: updates.description !== undefined ? updates.description : existing.description,
    category: updates.category !== undefined ? updates.category : existing.category,
    context: updates.context !== undefined ? { ...existing.context, ...updates.context } : existing.context,
    createdBy: existing.createdBy,
    archivedAt: updates.archivedAt !== undefined ? updates.archivedAt : existing.archivedAt,
    legacyId: !currentDbId ? existing.id : undefined,
  };

  const patchPayload: Record<string, unknown> = {
    title: updates.name !== undefined ? updates.name : existing.name,
    status: updates.status !== undefined ? updates.status : existing.status,
    metadata: mergedMetadata,
  };

  let updateQuery = supabase.from("projects").update(patchPayload);

  if (currentDbId) {
    updateQuery = updateQuery.eq("id", currentDbId);
  } else {
    updateQuery = updateQuery.eq("workspace_id", wsId).contains("metadata", { legacyId: existing.id });
  }

  const { data: updated, error } = await updateQuery.select().single();

  if (error || !updated) {
    return null;
  }

  return toDomain(updated as ProjectDbRow);
}

export async function archiveProjectRecord(
  workspaceId: string,
  id: string
): Promise<Project | null> {
  const now = new Date().toISOString();
  return updateProjectRecord(workspaceId, id, {
    status: "ARCHIVED",
    archivedAt: now,
  });
}

