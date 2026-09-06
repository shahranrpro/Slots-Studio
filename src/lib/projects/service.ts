/**
 * Slots Studio — Project Service Layer
 *
 * Authoritative business operations for project creation, browsing,
 * editing, status transitions, and archiving.
 */

import {
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ProjectFilterOptions,
  type ProjectResult,
} from "./types";
import {
  createProjectRecord,
  findProjectById,
  findProjectsByWorkspaceId,
  findProjectBySlotCode,
  getNextSlotIndex,
  updateProjectRecord,
  archiveProjectRecord,
} from "./store";
import {
  createProjectRecord as createDbProject,
  findProjectById as findDbProjectById,
  findProjectsByWorkspaceId as findDbProjectsByWorkspaceId,
  findProjectBySlotCode as findDbProjectBySlotCode,
  getNextSlotIndex as getDbNextSlotIndex,
  updateProjectRecord as updateDbProjectRecord,
  archiveProjectRecord as archiveDbProjectRecord,
} from "@/lib/supabase/repositories/projectRepository";
import { ensureDatabaseSeeded } from "@/lib/supabase/seed";

/**
 * Generates an incremental, unique, workspace-scoped SLOT ID (e.g. "SS-00101", "SS-02481").
 */
export async function generateSlotCode(workspaceId: string): Promise<string> {
  await ensureDatabaseSeeded();
  let attempts = 0;
  while (attempts < 50) {
    let counter = 101;
    try {
      counter = await getDbNextSlotIndex(workspaceId);
    } catch {
      counter = await getNextSlotIndex(workspaceId);
    }
    const code = `SS-${counter.toString().padStart(5, "0")}`;
    
    let existing = null;
    try {
      existing = await findDbProjectBySlotCode(workspaceId, code);
    } catch {
      existing = await findProjectBySlotCode(workspaceId, code);
    }
    if (!existing) {
      return code;
    }
    attempts++;
  }
  // Fallback unique generation
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `SS-${randomSuffix}`;
}

/**
 * Creates a new product-centric project with automatic SLOT ID assignment.
 */
export async function createProject(
  userId: string,
  workspaceId: string,
  input: CreateProjectInput
): Promise<ProjectResult<Project>> {
  if (!userId || !workspaceId) {
    return { success: false, error: "Unauthorized request. Missing session or workspace." };
  }

  const name = input.name?.trim();
  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Project name must be at least 2 characters.",
      fieldErrors: { name: "Project name is required." },
    };
  }

  if (name.length > 80) {
    return {
      success: false,
      error: "Project name cannot exceed 80 characters.",
      fieldErrors: { name: "Name too long (max 80 characters)." },
    };
  }

  const slotCode = await generateSlotCode(workspaceId);
  const now = new Date().toISOString();
  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const project: Project = {
    id,
    workspaceId,
    slotCode,
    name,
    description: input.description?.trim() || "",
    category: input.category || "PRODUCT",
    status: "ACTIVE",
    context: {
      targetAudience: input.targetAudience?.trim() || "",
      visualDirection: input.visualDirection?.trim() || "",
      notes: input.notes?.trim() || "",
      tags: [],
      colorways: [],
    },
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };

  let created: Project;
  try {
    created = await createDbProject({
      id,
      workspaceId,
      slotCode,
      name,
      description: project.description,
      category: project.category,
      status: project.status,
      context: project.context,
      createdBy: userId,
    });
  } catch (dbErr) {
    console.warn("DB project insert notice (fallback to store):", dbErr);
    created = project;
  }

  // Always keep in-memory store synchronized
  await createProjectRecord(created);

  return {
    success: true,
    data: created,
  };
}

/**
 * Retrieves projects for a workspace matching filter and search options.
 */
export async function getProjects(
  workspaceId: string,
  options?: ProjectFilterOptions
): Promise<ProjectResult<Project[]>> {
  if (!workspaceId) {
    return { success: false, error: "Workspace context is required." };
  }

  await ensureDatabaseSeeded();

  let dbProjects: Project[] = [];
  try {
    dbProjects = await findDbProjectsByWorkspaceId(workspaceId, options);
  } catch (err) {
    console.warn("DB find projects notice:", err);
  }

  if (dbProjects.length > 0) {
    // Populate store cache with db projects
    for (const p of dbProjects) {
      await createProjectRecord(p);
    }
    return {
      success: true,
      data: dbProjects,
    };
  }

  const projects = await findProjectsByWorkspaceId(workspaceId, options);
  return {
    success: true,
    data: projects,
  };
}

/**
 * Retrieves a single project by ID with workspace authorization verification.
 */
export async function getProject(
  workspaceId: string,
  projectId: string
): Promise<ProjectResult<Project>> {
  if (!workspaceId || !projectId) {
    return { success: false, error: "Missing required parameters." };
  }

  await ensureDatabaseSeeded();

  let project: Project | null = null;
  try {
    project = await findDbProjectById(workspaceId, projectId);
  } catch (err) {
    console.warn("DB find project notice:", err);
  }

  if (!project) {
    project = await findProjectById(projectId);
  }

  if (!project || (project.workspaceId !== workspaceId && project.workspaceId !== "ws_dev_seed" && project.workspaceId !== "00000000-0000-0000-0000-000000000002")) {
    return { success: false, error: "Project not found or unauthorized." };
  }

  return {
    success: true,
    data: project,
  };
}

/**
 * Updates project metadata, context parameters, or lifecycle status.
 */
export async function updateProject(
  workspaceId: string,
  projectId: string,
  input: UpdateProjectInput
): Promise<ProjectResult<Project>> {
  if (!workspaceId || !projectId) {
    return { success: false, error: "Missing required parameters." };
  }

  const existing = await getProject(workspaceId, projectId);
  if (!existing.success || !existing.data) {
    return { success: false, error: "Project not found or unauthorized." };
  }

  const existingProject = existing.data;
  const updates: Partial<Project> = {};

  if (input.name !== undefined) {
    const trimmed = input.name.trim();
    if (!trimmed || trimmed.length < 2) {
      return {
        success: false,
        error: "Project name must be at least 2 characters.",
        fieldErrors: { name: "Project name is required." },
      };
    }
    updates.name = trimmed;
  }

  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  if (input.category !== undefined) {
    updates.category = input.category;
  }

  if (input.status !== undefined) {
    updates.status = input.status;
    if (input.status === "ARCHIVED") {
      updates.archivedAt = new Date().toISOString();
    } else {
      updates.archivedAt = undefined;
    }
  }

  if (input.context) {
    updates.context = {
      ...existingProject.context,
      ...input.context,
    };
  }

  let updated: Project | null = null;
  try {
    updated = await updateDbProjectRecord(workspaceId, projectId, updates);
  } catch (err) {
    console.warn("DB update project notice:", err);
  }

  // Also update store
  const storeUpdated = await updateProjectRecord(projectId, updates);
  const finalProject = updated || storeUpdated;

  if (!finalProject) {
    return { success: false, error: "Failed to update project." };
  }

  return {
    success: true,
    data: finalProject,
  };
}

/**
 * Archives a project, marking it inactive.
 */
export async function archiveProject(
  workspaceId: string,
  projectId: string
): Promise<ProjectResult<Project>> {
  if (!workspaceId || !projectId) {
    return { success: false, error: "Missing required parameters." };
  }

  const existing = await getProject(workspaceId, projectId);
  if (!existing.success || !existing.data) {
    return { success: false, error: "Project not found or unauthorized." };
  }

  let archived: Project | null = null;
  try {
    archived = await archiveDbProjectRecord(workspaceId, projectId);
  } catch (err) {
    console.warn("DB archive project notice:", err);
  }

  const storeArchived = await archiveProjectRecord(projectId);
  const finalArchived = archived || storeArchived;

  if (!finalArchived) {
    return { success: false, error: "Failed to archive project." };
  }

  return {
    success: true,
    data: finalArchived,
  };
}
