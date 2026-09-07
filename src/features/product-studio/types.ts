/**
 * Slots Studio — Product Studio Feature Domain Models
 */

import { type Project } from "@/lib/projects/types";
import { type Job } from "@/lib/jobs/types";

export type ReferenceType =
  | "PRODUCT"
  | "STYLE"
  | "COLOR"
  | "MATERIAL"
  | "LOGO"
  | "OTHER";

export interface ProductReference {
  id: string;
  projectId: string;
  name: string;
  type: ReferenceType;
  value: string; // Hex color code, material specification, or asset descriptor
  notes?: string;
  createdAt: string;
}

export type ConceptReviewStatus = "REVIEW" | "APPROVED" | "REJECTED";

export interface ProductConcept {
  id: string;
  workspaceId?: string;
  projectId: string;
  candidateCode: string; // e.g. "CANDIDATE-01"
  title: string;
  summary: string;
  silhouetteDescription: string;
  svgWireframe: string; // Deterministic vector silhouette preview
  imageUrl?: string; // Secure signed asset preview URL (/api/assets/[id]/preview)
  assetId?: string; // References assets table record
  provider?: string; // e.g. "Replicate (Flux)", "Pollinations (Flux)", or "DevConceptProvider"
  model?: string; // Model descriptor
  jobId?: string; // Generation job UUID
  colorPalette: string[];
  suggestedMaterials: string[];
  status: ConceptReviewStatus;
  isDevelopmentPreview: boolean;
  parentConceptId?: string;
  refinementNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface ProductBriefData {
  name: string;
  category: string;
  description: string;
  targetUser: string;
  visualDirection: string;
  colors: string[];
  materials: string[];
  notes: string;
}

export interface ProductStudioState {
  project: Project;
  brief: ProductBriefData;
  references: ProductReference[];
  concepts: ProductConcept[];
  approvedConceptId?: string;
  activeJob?: Job | null;
}

export interface ConceptRefinementInput {
  baseConceptId: string;
  instructions: string;
}
