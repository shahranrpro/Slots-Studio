/**
 * Slots Studio — Development-Only Visual Studio Store
 *
 * ARCHITECTURAL NOTICE:
 * This in-memory repository manages Visual Studio outputs and reference links.
 * It is EXPLICITLY NON-PRODUCTION and will be cleanly replaced by persistent
 * database tables (PostgreSQL) in future platform phases.
 */

import {
  type VisualOutput,
  type VisualReference,
  type VisualOutputStatus,
} from "./types";

// In-memory collections (Development only — non-persistent across server restarts)
const visualOutputsMap = new Map<string, VisualOutput>(); // key: outputId
const visualReferencesMap = new Map<string, VisualReference[]>(); // key: projectId

export interface VisualStudioRepository {
  findOutputsByProjectId(projectId: string): Promise<VisualOutput[]>;
  findOutputById(outputId: string): Promise<VisualOutput | null>;
  saveOutput(output: VisualOutput): Promise<VisualOutput>;
  updateOutputStatus(outputId: string, status: VisualOutputStatus): Promise<VisualOutput | null>;
  markSavedToProject(outputId: string, assetId: string): Promise<VisualOutput | null>;
  findReferencesByProjectId(projectId: string): Promise<VisualReference[]>;
  saveReference(projectId: string, reference: VisualReference): Promise<VisualReference>;
}

export async function findOutputsByProjectId(projectId: string): Promise<VisualOutput[]> {
  const list: VisualOutput[] = [];
  for (const output of visualOutputsMap.values()) {
    if (output.projectId === projectId) {
      list.push(output);
    }
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function findOutputById(outputId: string): Promise<VisualOutput | null> {
  return visualOutputsMap.get(outputId) || null;
}

export async function saveOutput(output: VisualOutput): Promise<VisualOutput> {
  visualOutputsMap.set(output.id, output);
  return output;
}

export async function updateOutputStatus(
  outputId: string,
  status: VisualOutputStatus
): Promise<VisualOutput | null> {
  const existing = visualOutputsMap.get(outputId);
  if (!existing) return null;

  const updated: VisualOutput = {
    ...existing,
    status,
    approvedAt: status === "APPROVED" ? new Date().toISOString() : undefined,
  };

  visualOutputsMap.set(outputId, updated);
  return updated;
}

export async function markSavedToProject(
  outputId: string,
  assetId: string
): Promise<VisualOutput | null> {
  const existing = visualOutputsMap.get(outputId);
  if (!existing) return null;

  const updated: VisualOutput = {
    ...existing,
    savedToProject: true,
    assetId,
  };

  visualOutputsMap.set(outputId, updated);
  return updated;
}

export async function findReferencesByProjectId(projectId: string): Promise<VisualReference[]> {
  return visualReferencesMap.get(projectId) || [];
}

export async function saveReference(
  projectId: string,
  reference: VisualReference
): Promise<VisualReference> {
  const current = visualReferencesMap.get(projectId) || [];
  current.push(reference);
  visualReferencesMap.set(projectId, current);
  return reference;
}
