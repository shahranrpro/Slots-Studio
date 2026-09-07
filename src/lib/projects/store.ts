/**
 * Slots Studio — Development-Only Project Store & Repository
 *
 * ARCHITECTURAL NOTICE:
 * This is an in-memory development repository used strictly for
 * TASK 11 testing and local workflow simulation. It is EXPLICITLY NON-PRODUCTION
 * and ephemeral (in-memory data does not survive process restarts).
 *
 * Service Boundary Rule:
 * All business operations, routing guards, and UI components interact exclusively
 * through `src/lib/projects/service.ts` or the `/api/projects/*` API endpoints.
 * UI components and page routes MUST NOT import or interact with this store directly.
 */

import {
  type Project,
  type ProjectFilterOptions,
} from "./types";

// In-memory collections (Development only — non-persistent across server restarts)
const projectsMap = new Map<string, Project>(); // key: id
const workspaceSlotCounters = new Map<string, number>(); // key: workspaceId, value: counter

let isProjectsSeeded = false;

export async function ensureSeededProjectsStore(): Promise<void> {
  if (isProjectsSeeded) return;

  const defaultProjectId = "proj_001";
  if (!projectsMap.has(defaultProjectId)) {
    const defaultProject: Project = {
      id: defaultProjectId,
      workspaceId: "ws_dev_seed",
      slotCode: "SS-00101",
      name: "Aero-Glide Running Anorak",
      description: "Ultra-lightweight weatherproof performance running anorak with articulated storm hood and laser-cut thermal vents.",
      category: "PRODUCT",
      status: "ACTIVE",
      context: {
        targetAudience: "Urban Marathon Runners",
        visualDirection: "Technical Minimalism / High-Chroma Accents",
        colorways: ["#000000", "#B7FF00", "#FFFFFF"],
        tags: ["Running", "Weatherproof", "Anorak"],
      },
      createdBy: "usr_dev_seed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projectsMap.set(defaultProjectId, defaultProject);
  }

  isProjectsSeeded = true;
}

export interface ProjectRepository {
  createProject(project: Project): Promise<Project>;
  findProjectById(id: string): Promise<Project | null>;
  findProjectsByWorkspaceId(
    workspaceId: string,
    options?: ProjectFilterOptions
  ): Promise<Project[]>;
  findProjectBySlotCode(workspaceId: string, slotCode: string): Promise<Project | null>;
  getNextSlotIndex(workspaceId: string): Promise<number>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | null>;
  archiveProject(id: string): Promise<Project | null>;
}

export async function createProjectRecord(project: Project): Promise<Project> {
  await ensureSeededProjectsStore();
  projectsMap.set(project.id, project);
  return project;
}

export async function findProjectById(id: string): Promise<Project | null> {
  await ensureSeededProjectsStore();
  return projectsMap.get(id) || null;
}

export async function findProjectBySlotCode(
  workspaceId: string,
  slotCode: string
): Promise<Project | null> {
  await ensureSeededProjectsStore();
  for (const proj of projectsMap.values()) {
    if (
      proj.workspaceId === workspaceId &&
      proj.slotCode.toUpperCase() === slotCode.toUpperCase()
    ) {
      return proj;
    }
  }
  return null;
}

export async function getNextSlotIndex(workspaceId: string): Promise<number> {
  await ensureSeededProjectsStore();
  const current = workspaceSlotCounters.get(workspaceId) || 100;
  const next = current + 1;
  workspaceSlotCounters.set(workspaceId, next);
  return next;
}

export async function findProjectsByWorkspaceId(
  workspaceId: string,
  options?: ProjectFilterOptions
): Promise<Project[]> {
  await ensureSeededProjectsStore();
  const allWorkspaceProjects: Project[] = [];

  for (const proj of projectsMap.values()) {
    if (proj.workspaceId === workspaceId) {
      allWorkspaceProjects.push(proj);
    }
  }


  // Filter pipeline
  let filtered = allWorkspaceProjects;

  // Archive filter
  if (!options?.includeArchived && options?.status !== "ARCHIVED") {
    filtered = filtered.filter((p) => p.status !== "ARCHIVED");
  }

  // Status filter
  if (options?.status && options.status !== "ALL") {
    filtered = filtered.filter((p) => p.status === options.status);
  }

  // Category filter
  if (options?.category && options.category !== "ALL") {
    filtered = filtered.filter((p) => p.category === options.category);
  }

  // Search filter (name, slotCode, description)
  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slotCode.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Sort by updatedAt descending
  return filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function updateProjectRecord(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const existing = projectsMap.get(id);
  if (!existing) return null;

  const updated: Project = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projectsMap.set(id, updated);
  return updated;
}

export async function archiveProjectRecord(id: string): Promise<Project | null> {
  const existing = projectsMap.get(id);
  if (!existing) return null;

  const updated: Project = {
    ...existing,
    status: "ARCHIVED",
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projectsMap.set(id, updated);
  return updated;
}
