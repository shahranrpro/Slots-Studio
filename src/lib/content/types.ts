/**
 * Slots Studio — Content Studio Domain Models & Types
 */

import { type Job } from "@/lib/jobs/types";

export type ContentType =
  | "PRODUCT_DESCRIPTION"
  | "SHORT_DESCRIPTION"
  | "FEATURE_BULLETS"
  | "SOCIAL_CAPTION"
  | "PRODUCT_STORY"
  | "CAMPAIGN_COPY"
  | "TECHNICAL_COPY";

export type ContentTone =
  | "PERFORMANCE"
  | "MINIMALIST"
  | "TECHNICAL"
  | "EDITORIAL"
  | "PUNCHY";

export type ContentAudience =
  | "ATHLETES"
  | "STREETWEAR"
  | "ACTIVE_URBAN"
  | "OUTDOOR_PRO";

export type ContentStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  defaultTone: ContentTone;
  defaultAudience: ContentAudience;
  structurePrompt: string;
}

export interface ContentMetadata {
  wordCount: number;
  charCount: number;
  readingTimeSeconds: number;
  provider: string;
  modelLabel: string;
  isDevPreview: boolean;
}

export interface ContentOutput {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName?: string;
  slotCode: string;
  jobId: string;
  contentType: ContentType;
  templateId?: string;
  templateName?: string;
  title: string;
  content: string; // Markdown text
  summary?: string;
  tone: ContentTone;
  audience: ContentAudience;
  status: ContentStatus;
  version: number;
  parentId?: string; // For lineage / refinement
  feedbackNotes?: string;
  savedAssetId?: string;
  metadata: ContentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovedProductContext {
  productName: string;
  category: string;
  description: string;
  silhouette: string;
  colorways: string[];
  materials: string[];
  approvedConceptId?: string;
  isApproved: boolean;
}

export interface ContentStudioState {
  workspaceId: string;
  projectId: string;
  projectName: string;
  slotCode: string;
  approvedContext: ApprovedProductContext;
  outputs: ContentOutput[];
  activeJob?: Job | null;
}

export interface ContentGenerationRequest {
  workspaceId: string;
  projectId: string;
  projectName: string;
  slotCode: string;
  approvedContext: ApprovedProductContext;
  contentType: ContentType;
  templateId?: string;
  tone: ContentTone;
  audience: ContentAudience;
  customInstructions?: string;
}

export interface ContentRefineRequest {
  workspaceId: string;
  projectId: string;
  parentOutput: ContentOutput;
  approvedContext: ApprovedProductContext;
  refinementNotes: string;
  customInstructions?: string;
}

export interface ContentRepository {
  findOutputsByProjectId(workspaceId: string, projectId: string): Promise<ContentOutput[]>;
  findOutputById(workspaceId: string, id: string): Promise<ContentOutput | null>;
  saveOutput(output: ContentOutput): Promise<ContentOutput>;
  updateOutput(workspaceId: string, id: string, updates: Partial<ContentOutput>): Promise<ContentOutput | null>;
  deleteOutput(workspaceId: string, id: string): Promise<boolean>;
}

export interface ContentProvider {
  generate(request: ContentGenerationRequest): Promise<{
    title: string;
    content: string;
    summary: string;
    metadata: ContentMetadata;
  }>;
  refine(request: ContentRefineRequest): Promise<{
    title: string;
    content: string;
    summary: string;
    metadata: ContentMetadata;
  }>;
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: "tpl_ecom_hero",
    name: "E-Commerce Hero Description",
    description: "Compelling primary product overview emphasizing silhouette ergonomics and material advantages.",
    contentType: "PRODUCT_DESCRIPTION",
    defaultTone: "PERFORMANCE",
    defaultAudience: "ACTIVE_URBAN",
    structurePrompt: "Write a high-converting e-commerce product overview detailing ergonomic design, aesthetic fit, and versatile daily application.",
  },
  {
    id: "tpl_feature_bullets",
    name: "Feature Highlights & Specs",
    description: "4-5 technical bullet points detailing engineered textile composition and functional hardware.",
    contentType: "FEATURE_BULLETS",
    defaultTone: "TECHNICAL",
    defaultAudience: "ATHLETES",
    structurePrompt: "Structure exactly 5 bullet points with bold technical headers explaining fabric engineering, thermal regulation, and durability.",
  },
  {
    id: "tpl_short_hook",
    name: "Punchy Catalog Hook",
    description: "High-impact 1-2 sentence tagline for product card previews and mobile banners.",
    contentType: "SHORT_DESCRIPTION",
    defaultTone: "PUNCHY",
    defaultAudience: "STREETWEAR",
    structurePrompt: "Generate a sharp, unforgettable 2-sentence hook highlighting the garment's distinctive attitude and utility.",
  },
  {
    id: "tpl_brand_story",
    name: "Editorial Brand Narrative",
    description: "Narrative 3-paragraph editorial story exploring design origins, aesthetic tension, and urban culture.",
    contentType: "PRODUCT_STORY",
    defaultTone: "EDITORIAL",
    defaultAudience: "STREETWEAR",
    structurePrompt: "Craft an immersive editorial story exploring the tension between functional sportswear and contemporary luxury aesthetics.",
  },
  {
    id: "tpl_social_kit",
    name: "Multi-Channel Social Post",
    description: "Engaging Instagram/TikTok post copy with call-to-action and targeted sportswear hashtags.",
    contentType: "SOCIAL_CAPTION",
    defaultTone: "PUNCHY",
    defaultAudience: "ACTIVE_URBAN",
    structurePrompt: "Compose an engaging social caption with a bold opening hook, product highlights, and 6 curated brand hashtags.",
  },
  {
    id: "tpl_campaign_angles",
    name: "Paid Campaign Headlines",
    description: "3 synchronized headline angles (Performance, Style, Innovation) for paid digital campaigns.",
    contentType: "CAMPAIGN_COPY",
    defaultTone: "PERFORMANCE",
    defaultAudience: "ATHLETES",
    structurePrompt: "Create 3 distinct ad hooks: Hook 1 (Performance Driver), Hook 2 (Aesthetic Statement), Hook 3 (Technical Advantage).",
  },
  {
    id: "tpl_tech_spec",
    name: "Technical Specification Sheet",
    description: "Precision data sheet with material specs, weight index, and garment care protocols.",
    contentType: "TECHNICAL_COPY",
    defaultTone: "TECHNICAL",
    defaultAudience: "OUTDOOR_PRO",
    structurePrompt: "Format an engineering-grade technical specification sheet with material breakdown, seam construction, and care guidelines.",
  },
];
