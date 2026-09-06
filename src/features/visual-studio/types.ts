/**
 * Slots Studio — Visual Studio Domain Types
 */

import { type Project } from "@/lib/projects/types";
import { type ProductConcept } from "@/features/product-studio/types";
import { type Job } from "@/lib/jobs/types";

export type VisualMode =
  | "studio"
  | "model"
  | "mannequin"
  | "lifestyle"
  | "detail"
  | "editorial";

export type VisualAspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export type VisualLighting =
  | "key_softbox"
  | "high_contrast_rim"
  | "golden_hour"
  | "direct_flash"
  | "diffused_ambient";

export type VisualBackground =
  | "clean_white"
  | "dark_cyc"
  | "concrete_gray"
  | "gradient_studio"
  | "custom";

export type VisualEnvironment =
  | "minimal_interior"
  | "urban_architectural"
  | "natural_outdoor"
  | "studio_loft";

export type VisualComposition =
  | "center_hero"
  | "dynamic_angle"
  | "flat_lay"
  | "macro_detail"
  | "wide_scene";

export type VisualModelDirection =
  | "pose_front"
  | "in_motion"
  | "editorial_gaze"
  | "casual_stance"
  | "form_fitting";

export interface VisualSettingsConfig {
  aspectRatio: VisualAspectRatio;
  lighting: VisualLighting;
  background: VisualBackground;
  environment?: VisualEnvironment;
  composition: VisualComposition;
  modelDirection?: VisualModelDirection;
  additionalPrompt?: string;
}

export type VisualSettingsData = VisualSettingsConfig;

export type VisualOutputStatus = "REVIEW" | "APPROVED" | "REJECTED";

export interface VisualOutput {
  id: string;
  workspaceId: string;
  projectId: string;
  jobId: string;
  mode: VisualMode;
  title: string;
  description: string;
  aspectRatio: VisualAspectRatio;
  settings: VisualSettingsConfig;
  previewSvg: string; // High-fidelity vector preview
  previewUrl?: string;
  assetId?: string; // Linked asset ID in shared Assets library
  status: VisualOutputStatus;
  isDevelopmentPreview: boolean;
  savedToProject: boolean;
  createdAt: string;
  approvedAt?: string;
}

export interface VisualReference {
  id: string;
  name: string;
  type: string;
  url?: string;
  previewSvg?: string;
  selected: boolean;
}

export interface VisualStudioState {
  project: Project;
  approvedConcept: ProductConcept | null;
  references: VisualReference[];
  outputs: VisualOutput[];
  activeMode: VisualMode;
  settings: VisualSettingsConfig;
  selectedOutputId?: string;
  activeJob?: Job | null;
}

export interface VisualGenerationRequest {
  workspaceId: string;
  projectId: string;
  mode: VisualMode;
  settings: VisualSettingsConfig;
  selectedReferenceIds?: string[];
  variantsCount?: number;
}
