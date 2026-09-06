/**
 * Slots Studio — Supabase Workspace Repository
 *
 * Backs Workspaces, Workspace Members, and Onboarding States with Supabase PostgreSQL.
 */

import { createAdminSupabaseClient } from "../server";
import {
  type Workspace,
  type WorkspaceMember,
  type WorkspaceRole,
  type OnboardingState,
} from "@/lib/workspace/types";
import { normalizeWorkspaceId, normalizeUserId } from "../utils";

// In-memory cache for onboarding states if table not yet migrated
const onboardingMemoryFallback = new Map<string, OnboardingState>();

export async function createWorkspaceRecord(data: {
  name: string;
  slug: string;
  ownerId: string;
}): Promise<Workspace> {
  const supabase = createAdminSupabaseClient();

  const { data: created, error } = await supabase
    .from("workspaces")
    .insert({
      name: data.name,
      slug: data.slug,
      owner_id: normalizeUserId(data.ownerId),
    })
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to create workspace in database: ${error?.message}`);
  }

  return {
    id: created.id,
    name: created.name,
    slug: created.slug,
    ownerId: created.owner_id,
    createdAt: created.created_at,
    updatedAt: created.created_at,
  };
}

export async function findWorkspaceById(id: string): Promise<Workspace | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(id);

  const { data: ws, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", wsId)
    .maybeSingle();

  if (error || !ws) {
    return null;
  }

  return {
    id: ws.id,
    name: ws.name,
    slug: ws.slug,
    ownerId: ws.owner_id,
    createdAt: ws.created_at,
    updatedAt: ws.created_at,
  };
}

export async function findWorkspaceBySlug(slug: string): Promise<Workspace | null> {
  const supabase = createAdminSupabaseClient();

  const { data: ws, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !ws) {
    return null;
  }

  return {
    id: ws.id,
    name: ws.name,
    slug: ws.slug,
    ownerId: ws.owner_id,
    createdAt: ws.created_at,
    updatedAt: ws.created_at,
  };
}

export async function findWorkspacesByUserId(userId: string): Promise<Workspace[]> {
  const supabase = createAdminSupabaseClient();
  const normalizedId = normalizeUserId(userId);

  // 1. Get workspace memberships
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", normalizedId);

  const workspaceIds = memberships?.map((m) => m.workspace_id) || [];

  // 2. Also check workspaces owned by user
  const { data: owned } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", normalizedId);

  if (owned) {
    owned.forEach((w) => {
      if (!workspaceIds.includes(w.id)) {
        workspaceIds.push(w.id);
      }
    });
  }

  if (workspaceIds.length === 0) {
    return [];
  }

  const { data: workspaces, error: wsError } = await supabase
    .from("workspaces")
    .select("*")
    .in("id", workspaceIds);

  if (wsError || !workspaces) {
    return [];
  }

  return workspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    slug: ws.slug,
    ownerId: ws.owner_id,
    createdAt: ws.created_at,
    updatedAt: ws.created_at,
  }));
}

export async function addWorkspaceMember(data: {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
}): Promise<WorkspaceMember> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(data.workspaceId);
  const userId = normalizeUserId(data.userId);

  const { data: created, error } = await supabase
    .from("workspace_members")
    .upsert(
      {
        workspace_id: wsId,
        user_id: userId,
        role: data.role,
      },
      { onConflict: "workspace_id,user_id" }
    )
    .select()
    .single();

  if (error || !created) {
    throw new Error(`Failed to add workspace member: ${error?.message}`);
  }

  return {
    id: created.id,
    workspaceId: created.workspace_id,
    userId: created.user_id,
    role: created.role as WorkspaceRole,
    createdAt: created.created_at,
  };
}

export async function findWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const { data: members, error } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", wsId);

  if (error || !members) {
    return [];
  }

  return members.map((m) => ({
    id: m.id,
    workspaceId: m.workspace_id,
    userId: m.user_id,
    role: m.role as WorkspaceRole,
    createdAt: m.created_at,
  }));
}

export async function findOnboardingStateByUserId(
  userId: string
): Promise<OnboardingState | null> {
  const supabase = createAdminSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("onboarding_states")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      return {
        userId: data.user_id,
        workspaceId: data.workspace_id,
        currentStep: data.current_step,
        completed: data.completed,
        answers: data.answers || {},
        updatedAt: data.updated_at,
      };
    }
  } catch {
    // Fallback to memory
  }

  return onboardingMemoryFallback.get(userId) || null;
}

export async function saveOnboardingStateRecord(
  state: OnboardingState
): Promise<OnboardingState> {
  const supabase = createAdminSupabaseClient();

  try {
    const { error } = await supabase.from("onboarding_states").upsert({
      user_id: state.userId,
      workspace_id: state.workspaceId,
      current_step: state.currentStep,
      completed: state.completed,
      answers: state.answers,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      return state;
    }
  } catch {
    // Fallback
  }

  onboardingMemoryFallback.set(state.userId, state);
  return state;
}
