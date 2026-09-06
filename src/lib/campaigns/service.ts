/**
 * Slots Studio — Campaign Studio Application Service (STUDIO 04)
 *
 * Implements authoritative business operations, context inheritance from Product Studio,
 * shared Jobs orchestration, and Assets Library integration.
 */

import {
  type Campaign,
  type CampaignOutput,
  type CampaignStudioState,
  type ApprovedProductContext,
  type CreateCampaignInput,
  type GenerateCampaignRequest,
} from "./types";
import { campaignStore } from "./store";
import {
  saveCampaignDb,
  findCampaignsByProjectId,
} from "@/lib/supabase/repositories/studioRepositories";
import { devCampaignProvider } from "@/features/campaigns/adapters/devCampaignProvider";
import { getProject } from "@/lib/projects/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { createJob, updateJobStatus, getJobs } from "@/lib/jobs/service";
import { createAsset } from "@/lib/assets/service";

import { type ProductConcept } from "@/features/product-studio/types";

/**
 * Retrieves the complete Campaign Studio state for an active project,
 * inheriting approved product parameters from Product Studio.
 */
export async function getCampaignStudioState(
  workspaceId: string,
  projectId: string,
  campaignId?: string
): Promise<{ success: boolean; data?: CampaignStudioState; error?: string }> {
  try {
    if (!workspaceId || !projectId) {
      return { success: false, error: "Missing required parameters." };
    }

    const projectResult = await getProject(workspaceId, projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    const project = projectResult.data;

    // Load Product Studio state to inherit approved product context
    const productStudioResult = await getProductStudioState(workspaceId, projectId);
    const productState = productStudioResult.data;
    const approvedConcept = productState?.concepts.find((c: ProductConcept) => c.status === "APPROVED");

    const approvedContext: ApprovedProductContext = {
      productName: project.name,
      category: project.category || "Apparel",
      description: project.description || productState?.brief?.description || "High-performance technical sportswear engineered for movement.",
      silhouette: approvedConcept?.silhouetteDescription || productState?.brief?.visualDirection || "Articulated Athletic",
      colorways: approvedConcept?.colorPalette || productState?.brief?.colors || ["#000000", "#B7FF00", "#FFFFFF"],
      materials: approvedConcept?.suggestedMaterials || productState?.brief?.materials || ["Engineered Tech Poly", "Articulated Stretch Elastane"],
      approvedConceptId: approvedConcept?.id,
      isApproved: Boolean(approvedConcept),
    };

    const storeCampaigns = await campaignStore.findCampaignsByProjectId(workspaceId, projectId);
    let dbCampaigns: Campaign[] = [];
    try {
      dbCampaigns = await findCampaignsByProjectId(workspaceId, projectId);
    } catch (err) {
      console.warn("DB campaigns notice:", err);
    }

    const campaignMap = new Map<string, Campaign>();
    for (const c of storeCampaigns) campaignMap.set(c.id, c);
    for (const c of dbCampaigns) campaignMap.set(c.id, c);
    const campaigns = Array.from(campaignMap.values());

    let activeCampaign: Campaign | null = null;
    if (campaignId) {
      activeCampaign = campaigns.find((c) => c.id === campaignId) || null;
    } else if (campaigns.length > 0) {
      activeCampaign = campaigns[0];
    }

    let outputs: CampaignOutput[] = [];
    if (activeCampaign) {
      outputs = await campaignStore.findOutputsByCampaignId(workspaceId, activeCampaign.id);
    } else {
      outputs = await campaignStore.findOutputsByProjectId(workspaceId, projectId);
    }

    // Look for active campaign generation jobs
    const jobsResult = await getJobs(workspaceId, {
      projectId,
      studio: "CAMPAIGN",
    });

    const activeJob = jobsResult.data?.find(
      (j) => j.status === "RUNNING" || j.status === "QUEUED" || j.status === "REVIEW"
    ) || null;

    return {
      success: true,
      data: {
        workspaceId,
        projectId: project.id,
        projectName: project.name,
        slotCode: project.slotCode || "SS-00000",
        approvedContext,
        campaigns,
        activeCampaign,
        outputs,
        activeJob,
      },
    };
  } catch (error) {
    console.error("Get Campaign Studio State Error:", error);
    return { success: false, error: "Failed to load Campaign Studio state." };
  }
}

/**
 * Creates a new marketing campaign under the project slot.
 */
export async function createCampaign(
  workspaceId: string,
  input: CreateCampaignInput
): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  try {
    if (!workspaceId || !input.projectId || !input.name.trim()) {
      return { success: false, error: "Campaign name and project are required." };
    }

    const projectResult = await getProject(workspaceId, input.projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    const project = projectResult.data;
    const now = new Date().toISOString();
    const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newCampaign: Campaign = {
      id: campaignId,
      workspaceId,
      projectId: project.id,
      slotCode: project.slotCode || "SS-00000",
      name: input.name.trim(),
      objective: input.objective,
      targetChannels: input.targetChannels,
      supportedAspectRatios: input.supportedAspectRatios || ["1:1", "4:5", "9:16", "16:9"],
      status: "ACTIVE",
      deliverableCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const created = await campaignStore.createCampaign(newCampaign);
    await saveCampaignDb(newCampaign).catch((err) =>
      console.warn("DB save campaign notice:", err)
    );
    return { success: true, data: created };
  } catch (error) {
    console.error("Create Campaign Error:", error);
    return { success: false, error: "Failed to create campaign." };
  }
}

/**
 * Generates creative deliverables across chosen channels and aspect ratios,
 * tracked by the shared Jobs subsystem.
 */
export async function generateCampaignOutputs(
  workspaceId: string,
  request: GenerateCampaignRequest
): Promise<{ success: boolean; data?: CampaignOutput[]; jobId?: string; error?: string }> {
  try {
    if (!workspaceId || !request.projectId || !request.campaignId) {
      return { success: false, error: "Missing required parameters." };
    }

    const projectResult = await getProject(workspaceId, request.projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    const campaign = await campaignStore.findCampaignById(workspaceId, request.campaignId);
    if (!campaign) {
      return { success: false, error: "Campaign not found." };
    }

    const productStudioResult = await getProductStudioState(workspaceId, request.projectId);
    const productState = productStudioResult.data;
    const approvedConcept = productState?.concepts.find((c: ProductConcept) => c.status === "APPROVED");

    const approvedContext: ApprovedProductContext = {
      productName: projectResult.data.name,
      category: projectResult.data.category || "Apparel",
      description: projectResult.data.description || productState?.brief?.description || "High-performance technical sportswear engineered for movement.",
      silhouette: approvedConcept?.silhouetteDescription || productState?.brief?.visualDirection || "Articulated Athletic",
      colorways: approvedConcept?.colorPalette || productState?.brief?.colors || ["#000000", "#B7FF00", "#FFFFFF"],
      materials: approvedConcept?.suggestedMaterials || productState?.brief?.materials || ["Engineered Tech Poly", "Articulated Stretch Elastane"],
      approvedConceptId: approvedConcept?.id,
      isApproved: Boolean(approvedConcept),
    };

    const channels = request.channels.length > 0 ? request.channels : campaign.targetChannels;
    const aspectRatios = request.aspectRatios.length > 0 ? request.aspectRatios : campaign.supportedAspectRatios;

    // 1. Create shared Job in Jobs subsystem
    const jobResult = await createJob({
      workspaceId,
      projectId: request.projectId,
      projectName: projectResult.data.name,
      slotCode: projectResult.data.slotCode,
      studio: "CAMPAIGN",
      jobType: "CAMPAIGN_GENERATION",
      provider: "DevCampaignProviderAdapter",
      inputSummary: `Synthesizing ${channels.length * aspectRatios.length} multi-aspect deliverables for campaign "${campaign.name}" across [${channels.join(", ")}].`,
    });

    const now = new Date().toISOString();
    const jobId = jobResult.data?.id || `job_${Date.now()}`;

    // 2. Synthesize deliverables via provider
    const rawDeliverables = await devCampaignProvider.generateDeliverables(
      approvedContext,
      campaign,
      channels,
      aspectRatios,
      {
        outputTypes: request.outputTypes,
        customDirective: request.customDirective,
        ctaVariant: request.ctaVariant,
      }
    );

    const savedOutputs: CampaignOutput[] = [];
    for (const raw of rawDeliverables) {
      const outputId = `cmp_out_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newOutput: CampaignOutput = {
        ...raw,
        id: outputId,
        workspaceId,
        projectId: request.projectId,
        projectName: projectResult.data.name,
        slotCode: projectResult.data.slotCode || "SS-00000",
        jobId,
        createdAt: now,
        updatedAt: now,
      };
      await campaignStore.saveOutput(newOutput);
      savedOutputs.push(newOutput);
    }

    // Update campaign deliverable count
    await campaignStore.updateCampaign(workspaceId, campaign.id, {
      deliverableCount: campaign.deliverableCount + savedOutputs.length,
    });

    // 3. Update Job status to REVIEW
    if (jobResult.data) {
      await updateJobStatus(workspaceId, jobResult.data.id, "REVIEW", {
        outputIds: savedOutputs.map((o) => o.id),
        progress: 100,
        progressLabel: "CAMPAIGN KIT READY FOR REVIEW",
      });
    }

    return { success: true, data: savedOutputs, jobId };
  } catch (error) {
    console.error("Generate Campaign Outputs Error:", error);
    return { success: false, error: "Failed to generate campaign deliverables." };
  }
}

/**
 * Sets human review decision (APPROVE / REJECT) on a campaign candidate.
 */
export async function reviewCampaignOutput(
  workspaceId: string,
  outputId: string,
  decision: "APPROVED" | "REJECTED"
): Promise<{ success: boolean; data?: CampaignOutput; error?: string }> {
  try {
    const updated = await campaignStore.updateOutput(workspaceId, outputId, {
      status: decision,
    });

    if (!updated) {
      return { success: false, error: "Campaign output not found." };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Review Campaign Output Error:", error);
    return { success: false, error: "Failed to submit review decision." };
  }
}

/**
 * Registers an approved campaign output into the shared Assets Library as a DESIGN asset.
 */
export async function saveCampaignOutputToAssets(
  workspaceId: string,
  outputId: string
): Promise<{ success: boolean; data?: CampaignOutput; error?: string }> {
  try {
    const output = await campaignStore.findOutputById(workspaceId, outputId);
    if (!output) {
      return { success: false, error: "Campaign output not found." };
    }

    // Auto-approve if not already approved
    if (output.status !== "APPROVED") {
      await campaignStore.updateOutput(workspaceId, outputId, { status: "APPROVED" });
    }

    // Create DESIGN asset in shared Assets Library
    const assetResult = await createAsset({
      workspaceId,
      projectId: output.projectId,
      projectName: output.projectName,
      slotCode: output.slotCode,
      name: `${output.campaignName} — ${output.channel} (${output.aspectRatio})`,
      assetType: "DESIGN",
      mimeType: "image/svg+xml",
      previewSvg: output.previewSvg,
      storageKey: `projects/${output.projectId}/campaigns/${output.campaignId}/${output.id}.svg`,
      sizeBytes: Buffer.byteLength(output.previewSvg, "utf8"),
      source: "AI_GENERATED",
      status: "APPROVED",
      metadata: {
        campaignId: output.campaignId,
        campaignName: output.campaignName,
        channel: output.channel,
        aspectRatio: output.aspectRatio,
        outputType: output.outputType,
        headline: output.headline,
        ctaText: output.ctaText,
        tags: ["Campaign Studio", output.channel, output.aspectRatio, output.outputType],
      },
    });

    if (!assetResult.success || !assetResult.data) {
      return { success: false, error: assetResult.error || "Failed to create asset in library." };
    }

    const updatedOutput = await campaignStore.updateOutput(workspaceId, outputId, {
      savedAssetId: assetResult.data.id,
      status: "APPROVED",
    });

    return { success: true, data: updatedOutput || output };
  } catch (error) {
    console.error("Save Campaign Output to Assets Error:", error);
    return { success: false, error: "Failed to save campaign output to Assets Library." };
  }
}
