/**
 * Slots Studio — Campaign Studio Domain Models & Types (STUDIO 04)
 */

import { type Job } from "@/lib/jobs/types";

export type CampaignChannel =
  | "INSTAGRAM"
  | "TIKTOK"
  | "PAID_SOCIAL"
  | "WEBSITE"
  | "EMAIL"
  | "PRINT";

export type CampaignAspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export type CampaignObjective =
  | "PRODUCT_LAUNCH"
  | "SEASONAL_DROP"
  | "PERFORMANCE_ACQUISITION"
  | "BRAND_AWARENESS"
  | "TECHNICAL_SHOWCASE";

export type CampaignOutputType =
  | "HERO_BANNER"
  | "SOCIAL_FEED"
  | "STORY_REEL"
  | "AD_CAROUSEL_FRAME"
  | "ECOMMERCE_FEATURE"
  | "EMAIL_HEADER";

export type CampaignOutputStatus = "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface CampaignMetadata {
  provider: string;
  modelLabel: string;
  isDevPreview: boolean;
  colorways: string[];
  silhouette: string;
}

export interface CampaignOutput {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName?: string;
  slotCode: string;
  campaignId: string;
  campaignName: string;
  jobId: string;
  outputType: CampaignOutputType;
  channel: CampaignChannel;
  aspectRatio: CampaignAspectRatio;
  headline: string;
  subheadline: string;
  ctaText: string;
  bodyCopy?: string;
  previewSvg: string; // High-fidelity responsive vector artwork
  previewUrl?: string;
  status: CampaignOutputStatus;
  savedAssetId?: string;
  metadata: CampaignMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  projectId: string;
  slotCode: string;
  name: string;
  objective: CampaignObjective;
  targetChannels: CampaignChannel[];
  supportedAspectRatios: CampaignAspectRatio[];
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  deliverableCount: number;
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

export interface CampaignStudioState {
  workspaceId: string;
  projectId: string;
  projectName: string;
  slotCode: string;
  approvedContext: ApprovedProductContext;
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  outputs: CampaignOutput[];
  activeJob?: Job | null;
}

export interface CreateCampaignInput {
  projectId: string;
  name: string;
  objective: CampaignObjective;
  targetChannels: CampaignChannel[];
  supportedAspectRatios?: CampaignAspectRatio[];
}

export interface GenerateCampaignRequest {
  projectId: string;
  campaignId: string;
  channels: CampaignChannel[];
  aspectRatios: CampaignAspectRatio[];
  outputTypes?: CampaignOutputType[];
  customDirective?: string;
  ctaVariant?: string;
}

export interface CampaignProvider {
  generateDeliverables(
    context: ApprovedProductContext,
    campaign: Campaign,
    channels: CampaignChannel[],
    aspectRatios: CampaignAspectRatio[],
    options?: {
      outputTypes?: CampaignOutputType[];
      customDirective?: string;
      ctaVariant?: string;
    }
  ): Promise<Omit<CampaignOutput, "id" | "workspaceId" | "projectId" | "slotCode" | "jobId" | "createdAt" | "updatedAt">[]>;
}
