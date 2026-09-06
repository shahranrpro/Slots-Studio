/**
 * Slots Studio — Development-Only Workspace & Onboarding Store
 *
 * ARCHITECTURAL NOTICE:
 * This is an in-memory development repository used exclusively for
 * TASK 08 testing and local workflow simulation. It is EXPLICITLY NON-PRODUCTION
 * and ephemeral (in-memory data does not survive process restarts).
 *
 * It will be cleanly replaced by persistent database tables (PostgreSQL) in future phases (TASK 09+).
 *
 * Service Boundary Rule:
 * All business operations, routing guards, and UI components interact exclusively
 * through `src/lib/workspace/service.ts` or the `/api/workspace/*` API endpoints.
 * UI components and page routes MUST NOT import or interact with this store directly.
 */

import {
  type Workspace,
  type WorkspaceMember,
  type OnboardingState,
} from "./types";

// In-memory collections (Development only — non-persistent across server restarts)
const workspacesMap = new Map<string, Workspace>();
const membersMap = new Map<string, WorkspaceMember[]>(); // key: workspaceId
const onboardingStatesMap = new Map<string, OnboardingState>(); // key: userId

let isWorkspaceSeeded = false;

export async function ensureSeededWorkspaceStore(): Promise<void> {
  if (isWorkspaceSeeded) return;

  const devUserId = "usr_dev_seed";
  const defaultWsId = "ws_dev_seed";

  if (!workspacesMap.has(defaultWsId)) {
    const defaultWorkspace: Workspace = {
      id: defaultWsId,
      name: "Slots Studio Workspace",
      slug: "default",
      ownerId: devUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    workspacesMap.set(defaultWsId, defaultWorkspace);

    const devMember: WorkspaceMember = {
      id: "mem_dev_seed",
      workspaceId: defaultWsId,
      userId: devUserId,
      role: "OWNER",
      createdAt: new Date().toISOString(),
    };
    membersMap.set(defaultWsId, [devMember]);

    const devOnboarding: OnboardingState = {
      userId: devUserId,
      workspaceId: defaultWsId,
      currentStep: 4,
      completed: true,
      answers: {
        creationIntent: "Products",
        teamStructure: "Studio",
      },
      updatedAt: new Date().toISOString(),
    };
    onboardingStatesMap.set(devUserId, devOnboarding);
  }

  isWorkspaceSeeded = true;
}

export interface WorkspaceRepository {
  createWorkspace(data: Omit<Workspace, "id" | "createdAt" | "updatedAt">): Promise<Workspace>;
  findWorkspaceById(id: string): Promise<Workspace | null>;
  findWorkspaceBySlug(slug: string): Promise<Workspace | null>;
  findWorkspacesByUserId(userId: string): Promise<Workspace[]>;
  addMember(data: Omit<WorkspaceMember, "id" | "createdAt">): Promise<WorkspaceMember>;
  findMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>;
  findOnboardingStateByUserId(userId: string): Promise<OnboardingState | null>;
  saveOnboardingState(state: OnboardingState): Promise<OnboardingState>;
}

export async function createWorkspaceRecord(
  data: Omit<Workspace, "id" | "createdAt" | "updatedAt">
): Promise<Workspace> {
  await ensureSeededWorkspaceStore();
  const id = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  const workspace: Workspace = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  workspacesMap.set(id, workspace);
  return workspace;
}

export async function findWorkspaceById(id: string): Promise<Workspace | null> {
  await ensureSeededWorkspaceStore();
  return workspacesMap.get(id) || null;
}

export async function findWorkspaceBySlug(slug: string): Promise<Workspace | null> {
  await ensureSeededWorkspaceStore();
  for (const ws of workspacesMap.values()) {
    if (ws.slug === slug) return ws;
  }
  return null;
}

export async function addWorkspaceMember(
  data: Omit<WorkspaceMember, "id" | "createdAt">
): Promise<WorkspaceMember> {
  await ensureSeededWorkspaceStore();
  const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const member: WorkspaceMember = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  const existing = membersMap.get(data.workspaceId) || [];
  existing.push(member);
  membersMap.set(data.workspaceId, existing);

  return member;
}

export async function findMembersByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
  await ensureSeededWorkspaceStore();
  return membersMap.get(workspaceId) || [];
}

export async function findWorkspacesByUserId(userId: string): Promise<Workspace[]> {
  await ensureSeededWorkspaceStore();
  const matchingWorkspaceIds = new Set<string>();

  for (const [workspaceId, members] of membersMap.entries()) {
    if (members.some((m) => m.userId === userId)) {
      matchingWorkspaceIds.add(workspaceId);
    }
  }

  const result: Workspace[] = [];
  for (const id of matchingWorkspaceIds) {
    const ws = workspacesMap.get(id);
    if (ws) result.push(ws);
  }

  // If user is authenticated in development but has no explicit membership, associate with default workspace
  if (result.length === 0 && userId) {
    const defaultWs = workspacesMap.get("ws_dev_seed");
    if (defaultWs) {
      const defaultMembers = membersMap.get("ws_dev_seed") || [];
      if (!defaultMembers.some((m) => m.userId === userId)) {
        defaultMembers.push({
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          workspaceId: "ws_dev_seed",
          userId,
          role: "OWNER",
          createdAt: new Date().toISOString(),
        });
        membersMap.set("ws_dev_seed", defaultMembers);
      }
      result.push(defaultWs);
    }
  }

  return result;
}

export async function findOnboardingStateByUserId(userId: string): Promise<OnboardingState | null> {
  await ensureSeededWorkspaceStore();
  const existing = onboardingStatesMap.get(userId);
  if (existing) return existing;

  // In development, provision default completed onboarding for active authenticated user
  if (userId) {
    const autoOnboarding: OnboardingState = {
      userId,
      workspaceId: "ws_dev_seed",
      currentStep: 4,
      completed: true,
      answers: {
        creationIntent: "Products",
        teamStructure: "Studio",
      },
      updatedAt: new Date().toISOString(),
    };
    onboardingStatesMap.set(userId, autoOnboarding);
    return autoOnboarding;
  }

  return null;
}

export async function saveOnboardingStateRecord(state: OnboardingState): Promise<OnboardingState> {
  await ensureSeededWorkspaceStore();
  const updated: OnboardingState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
  onboardingStatesMap.set(state.userId, updated);
  return updated;
}
