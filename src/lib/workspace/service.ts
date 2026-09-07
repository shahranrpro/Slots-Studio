import {
  type Workspace,
  type WorkspaceResult,
  type OnboardingState,
  type OnboardingAnswers,
} from "./types";
import {
  createWorkspaceRecord,
  addWorkspaceMember,
  findWorkspacesByUserId,
  findWorkspaceBySlug,
  findOnboardingStateByUserId,
  saveOnboardingStateRecord,
} from "./store";
import {
  createWorkspaceRecord as createDbWorkspace,
  addWorkspaceMember as addDbWorkspaceMember,
  findWorkspacesByUserId as findDbWorkspacesByUserId,
  findWorkspaceBySlug as findDbWorkspaceBySlug,
  findOnboardingStateByUserId as findDbOnboardingStateByUserId,
  saveOnboardingStateRecord as saveDbOnboardingStateRecord,
} from "@/lib/supabase/repositories/workspaceRepository";
import { ensureDatabaseSeeded } from "@/lib/supabase/seed";
import { type Session, type User } from "@/lib/auth/types";
import { getUserFromSession } from "@/lib/auth/service";

import { generateWorkspaceSlug } from "./utils";

export { generateWorkspaceSlug };

/**
 * Creates a unique slug if the requested slug already exists.
 */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug || "workspace";
  let counter = 1;

  while ((await findWorkspaceBySlug(candidate)) || (await findDbWorkspaceBySlug(candidate))) {
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }

  return candidate;
}

/**
 * Creates a workspace, assigns the creator as OWNER, and links to onboarding.
 */
export async function createWorkspaceForUser(
  userId: string,
  rawName: string
): Promise<WorkspaceResult<{ workspace: Workspace; onboarding: OnboardingState }>> {
  const name = rawName?.trim();

  if (!userId) {
    return { success: false, error: "Unauthorized session. Please sign in." };
  }

  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Workspace name must be at least 2 characters.",
      fieldErrors: { name: "Workspace name is required." },
    };
  }

  if (name.length > 60) {
    return {
      success: false,
      error: "Workspace name cannot exceed 60 characters.",
      fieldErrors: { name: "Name too long (max 60 characters)." },
    };
  }

  const baseSlug = generateWorkspaceSlug(name);
  const slug = await ensureUniqueSlug(baseSlug);

  let workspace: Workspace;
  try {
    workspace = await createDbWorkspace({
      name,
      slug,
      ownerId: userId,
    });
    await addDbWorkspaceMember({
      workspaceId: workspace.id,
      userId,
      role: "OWNER",
    });
  } catch {
    workspace = await createWorkspaceRecord({
      name,
      slug,
      ownerId: userId,
    });
    await addWorkspaceMember({
      workspaceId: workspace.id,
      userId,
      role: "OWNER",
    });
  }

  // Update onboarding state
  const currentOnboarding = await getUserOnboardingState(userId);
  const updatedOnboarding = await saveOnboardingStateRecord({
    ...currentOnboarding,
    workspaceId: workspace.id,
    currentStep: Math.max(currentOnboarding.currentStep, 3), // Move forward to intent step
  });
  await saveDbOnboardingStateRecord(updatedOnboarding);

  return {
    success: true,
    data: {
      workspace,
      onboarding: updatedOnboarding,
    },
  };
}

/**
 * Retrieves all workspaces a user belongs to.
 */
export async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  if (!userId) return [];
  await ensureDatabaseSeeded();

  try {
    const dbWorkspaces = await findDbWorkspacesByUserId(userId);
    if (dbWorkspaces && dbWorkspaces.length > 0) {
      return dbWorkspaces;
    }
  } catch (err) {
    console.error("Supabase getUserWorkspaces fallback:", err);
  }

  return await findWorkspacesByUserId(userId);
}

/**
 * Retrieves or initializes the onboarding state for a user.
 */
export async function getUserOnboardingState(userId: string): Promise<OnboardingState> {
  try {
    const dbState = await findDbOnboardingStateByUserId(userId);
    if (dbState) return dbState;
  } catch {}

  const existing = await findOnboardingStateByUserId(userId);
  if (existing) return existing;

  const initial: OnboardingState = {
    userId,
    currentStep: 4,
    completed: true,
    answers: {
      creationIntent: "Products",
      teamStructure: "Studio",
    },
    updatedAt: new Date().toISOString(),
  };

  await saveDbOnboardingStateRecord(initial);
  return await saveOnboardingStateRecord(initial);
}

/**
 * Updates step answers and current step index in onboarding.
 */
export async function saveOnboardingProgress(
  userId: string,
  step: number,
  answers?: Partial<OnboardingAnswers>
): Promise<WorkspaceResult<OnboardingState>> {
  if (!userId) {
    return { success: false, error: "Unauthorized session." };
  }

  const current = await getUserOnboardingState(userId);

  const updated = await saveOnboardingStateRecord({
    ...current,
    currentStep: Math.max(current.currentStep, step),
    answers: {
      ...current.answers,
      ...answers,
    },
  });
  await saveDbOnboardingStateRecord(updated);

  return {
    success: true,
    data: updated,
  };
}

/**
 * Finalizes onboarding, marking it completed.
 */
export async function completeUserOnboarding(
  userId: string
): Promise<WorkspaceResult<OnboardingState>> {
  if (!userId) {
    return { success: false, error: "Unauthorized session." };
  }

  const current = await getUserOnboardingState(userId);

  const finalized = await saveOnboardingStateRecord({
    ...current,
    currentStep: 4,
    completed: true,
  });
  await saveDbOnboardingStateRecord(finalized);

  return {
    success: true,
    data: finalized,
  };
}

export interface AuthenticatedWorkspaceContext {
  user: User;
  workspace: Workspace;
  workspaces: Workspace[];
  onboarding: OnboardingState;
}

/**
 * Authoritative server-side workspace and session resolution.
 * Guarantees that any authenticated user resolves a valid user, active workspace,
 * and stable onboarding state consistently across all dashboard routes.
 *
 * If the user has no workspaces (e.g. first login after signup), a personal
 * workspace is automatically provisioned here as a safety net.
 */
export async function resolveAuthenticatedWorkspaceContext(
  session: Session | null
): Promise<AuthenticatedWorkspaceContext | null> {
  if (!session?.userId) return null;

  const user = await getUserFromSession(session);
  if (!user) return null;

  let workspaces = await getUserWorkspaces(session.userId);

  // Safety net: if the user somehow has no workspace (e.g. signup race condition
  // or in-memory store cleared), provision a personal workspace now.
  if (workspaces.length === 0) {
    try {
      const displayName = user.name || user.email.split("@")[0] || "My Workspace";
      const result = await createWorkspaceForUser(session.userId, `${displayName}'s Workspace`);
      if (result.success && result.data?.workspace) {
        workspaces = [result.data.workspace];
      }
    } catch (err) {
      console.error("[workspace] Failed to auto-provision workspace for user:", err);
      return null;
    }

    // Still no workspace after provisioning attempt
    if (workspaces.length === 0) return null;
  }

  const activeWorkspace = workspaces[0];
  const onboarding = await getUserOnboardingState(session.userId);

  return {
    user,
    workspace: activeWorkspace,
    workspaces,
    onboarding,
  };
}
