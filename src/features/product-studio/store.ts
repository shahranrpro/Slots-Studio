/**
 * Slots Studio — Product Studio Ephemeral Store (Development Only)
 *
 * ARCHITECTURAL NOTICE:
 * This is an in-memory development repository for tracking product references
 * and generated concept candidates during TASK 12 workflow simulation.
 *
 * It is EXPLICITLY NON-PRODUCTION and ephemeral. All mutations and reads
 * flow strictly through `src/features/product-studio/services/productStudioService.ts`
 * or the `/api/studio/product/*` API endpoints.
 */

import {
  type ProductReference,
  type ProductConcept,
} from "./types";

const referencesMap = new Map<string, ProductReference[]>(); // key: projectId
const conceptsMap = new Map<string, ProductConcept[]>(); // key: projectId

export async function getProjectReferences(projectId: string): Promise<ProductReference[]> {
  return referencesMap.get(projectId) || [];
}

export async function addProjectReference(reference: ProductReference): Promise<ProductReference> {
  const list = referencesMap.get(reference.projectId) || [];
  list.push(reference);
  referencesMap.set(reference.projectId, list);
  return reference;
}

export async function removeProjectReference(projectId: string, referenceId: string): Promise<boolean> {
  const list = referencesMap.get(projectId) || [];
  const filtered = list.filter((r) => r.id !== referenceId);
  referencesMap.set(projectId, filtered);
  return filtered.length !== list.length;
}

export async function getProjectConcepts(projectId: string): Promise<ProductConcept[]> {
  return conceptsMap.get(projectId) || [];
}

export async function addProjectConcepts(projectId: string, newConcepts: ProductConcept[]): Promise<ProductConcept[]> {
  const list = conceptsMap.get(projectId) || [];
  const combined = [...newConcepts, ...list];
  conceptsMap.set(projectId, combined);
  return combined;
}

export async function updateProjectConceptStatus(
  projectId: string,
  conceptId: string,
  status: "REVIEW" | "APPROVED" | "REJECTED"
): Promise<ProductConcept | null> {
  const list = conceptsMap.get(projectId) || [];
  let updatedConcept: ProductConcept | null = null;

  const updatedList = list.map((c) => {
    if (c.id === conceptId) {
      updatedConcept = {
        ...c,
        status,
        approvedAt: status === "APPROVED" ? new Date().toISOString() : undefined,
      };
      return updatedConcept;
    }
    // If approving this one, mark other previously approved ones back to REVIEW
    if (status === "APPROVED" && c.status === "APPROVED") {
      return { ...c, status: "REVIEW" as const, approvedAt: undefined };
    }
    return c;
  });

  conceptsMap.set(projectId, updatedList);
  return updatedConcept;
}
