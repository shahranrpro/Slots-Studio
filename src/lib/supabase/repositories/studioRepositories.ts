/**
 * Slots Studio — Supabase Studio Repositories
 *
 * Persists outputs for:
 * 1. Product Studio Concepts (generation_outputs)
 * 2. Visual Studio Renders (generation_outputs)
 * 3. Content Studio Copy Items (content_items)
 * 4. Campaign Studio Campaigns & Assets (campaigns, campaign_assets)
 * 5. Production Studio Tech Packs & BOM (production_specs)
 */

import { createAdminSupabaseClient } from "../server";
import { type ProductConcept } from "@/features/product-studio/types";
import { type VisualOutput } from "@/features/visual-studio/types";
import { type ContentOutput } from "@/lib/content/types";
import { type Campaign } from "@/lib/campaigns/types";
import { type TechPack } from "@/lib/production/types";
import { isUuid } from "../utils";

// ====================================================================
// 1. PRODUCT STUDIO & VISUAL STUDIO (generation_outputs)
// ====================================================================

export async function saveProductConceptDb(
  workspaceId: string,
  concept: ProductConcept
): Promise<ProductConcept> {
  const supabase = createAdminSupabaseClient();
  const isProjectUuid = isUuid(concept.projectId);

  const payload: Record<string, unknown> = {
    output_type: "PRODUCT_CONCEPT",
    data: {
      ...concept,
      workspaceId,
    },
  };

  if (isProjectUuid) {
    (payload.data as Record<string, unknown>).projectId = concept.projectId;
  }

  await supabase.from("generation_outputs").insert(payload);
  return concept;
}

export async function findProductConceptsByProjectId(
  workspaceId: string,
  projectId: string
): Promise<ProductConcept[]> {
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("generation_outputs")
    .select("*")
    .eq("output_type", "PRODUCT_CONCEPT");

  if (error || !rows) return [];

  return rows
    .map((r) => r.data as ProductConcept)
    .filter((c) => c && c.projectId === projectId);
}

export async function updateProductConceptStatusDb(
  workspaceId: string,
  conceptId: string,
  status: "APPROVED" | "REJECTED" | "REVIEW"
): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  const { data: rows } = await supabase
    .from("generation_outputs")
    .select("*")
    .eq("output_type", "PRODUCT_CONCEPT");

  const target = rows?.find((r) => r.data?.id === conceptId);
  if (!target) return false;

  const updatedData = {
    ...target.data,
    status,
    ...(status === "APPROVED" ? { approvedAt: new Date().toISOString() } : {}),
  };

  await supabase
    .from("generation_outputs")
    .update({ data: updatedData })
    .eq("id", target.id);

  return true;
}

export async function saveVisualOutputDb(
  workspaceId: string,
  output: VisualOutput
): Promise<VisualOutput> {
  const supabase = createAdminSupabaseClient();

  await supabase.from("generation_outputs").insert({
    output_type: "VISUAL_OUTPUT",
    data: {
      ...output,
      workspaceId,
    },
  });

  return output;
}

export async function findVisualOutputsByProjectId(
  workspaceId: string,
  projectId: string
): Promise<VisualOutput[]> {
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("generation_outputs")
    .select("*")
    .eq("output_type", "VISUAL_OUTPUT");

  if (error || !rows) return [];

  return rows
    .map((r) => r.data as VisualOutput)
    .filter((v) => v && v.projectId === projectId);
}

export async function updateVisualOutputStatusDb(
  workspaceId: string,
  outputId: string,
  status: "APPROVED" | "REJECTED" | "REVIEW"
): Promise<boolean> {
  const supabase = createAdminSupabaseClient();
  const { data: rows } = await supabase
    .from("generation_outputs")
    .select("*")
    .eq("output_type", "VISUAL_OUTPUT");

  const target = rows?.find((r) => r.data?.id === outputId);
  if (!target) return false;

  const updatedData = {
    ...target.data,
    status,
  };

  await supabase
    .from("generation_outputs")
    .update({ data: updatedData })
    .eq("id", target.id);

  return true;
}

// ====================================================================
// 2. CONTENT STUDIO (content_items)
// ====================================================================

export async function saveContentOutputDb(
  output: ContentOutput
): Promise<ContentOutput> {
  const supabase = createAdminSupabaseClient();
  const isProjectUuid = isUuid(output.projectId);

  const payload: Record<string, unknown> = {
    workspace_id: output.workspaceId,
    title: output.title,
    body: output.content,
    content_type: output.contentType,
    status: output.status,
  };

  if (isProjectUuid) {
    payload.project_id = output.projectId;
  }

  await supabase.from("content_items").insert(payload);
  return output;
}

export async function findContentOutputsByProjectId(
  workspaceId: string,
  projectId: string
): Promise<ContentOutput[]> {
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("workspace_id", workspaceId);

  if (error || !rows) return [];

  return rows
    .map((r) => ({
      id: r.id,
      workspaceId: r.workspace_id,
      projectId: r.project_id || projectId,
      slotCode: "SS-02481",
      jobId: "",
      contentType: r.content_type as ContentOutput["contentType"],
      title: r.title,
      content: r.body,
      tone: "TECHNICAL" as ContentOutput["tone"],
      audience: "ACTIVE_URBAN" as ContentOutput["audience"],
      status: r.status as ContentOutput["status"],
      version: 1,
      metadata: {
        wordCount: r.body ? r.body.split(/\s+/).length : 0,
        charCount: r.body ? r.body.length : 0,
        readingTimeSeconds: 30,
        provider: "DevEngine",
        modelLabel: "SLOTS-CONTENT-V1",
        isDevPreview: true,
      },
      createdAt: r.created_at,
      updatedAt: r.created_at,
    }));
}

// ====================================================================
// 3. CAMPAIGN STUDIO (campaigns, campaign_assets)
// ====================================================================

export async function saveCampaignDb(campaign: Campaign): Promise<Campaign> {
  const supabase = createAdminSupabaseClient();

  const payload: Record<string, unknown> = {
    workspace_id: campaign.workspaceId,
    name: campaign.name,
    objective: campaign.objective,
    channels: campaign.targetChannels,
  };

  await supabase.from("campaigns").insert(payload);
  return campaign;
}

export async function findCampaignsByProjectId(
  workspaceId: string,
  projectId: string
): Promise<Campaign[]> {
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("workspace_id", workspaceId);

  if (error || !rows) return [];

  return rows.map((r) => ({
    id: r.id,
    workspaceId: r.workspace_id,
    projectId: r.project_id || projectId,
    slotCode: "SS-02481",
    name: r.name,
    objective: r.objective as Campaign["objective"],
    targetChannels: r.channels as Campaign["targetChannels"],
    supportedAspectRatios: ["1:1", "4:5", "9:16", "16:9"],
    status: "ACTIVE",
    deliverableCount: 4,
    createdAt: r.created_at,
    updatedAt: r.created_at,
  }));
}

// ====================================================================
// 4. PRODUCTION STUDIO (production_specs)
// ====================================================================

export async function saveProductionSpecDb(
  workspaceId: string,
  techPack: TechPack
): Promise<TechPack> {
  const supabase = createAdminSupabaseClient();
  const isProjectUuid = isUuid(techPack.projectId);

  const payload: Record<string, unknown> = {
    tech_pack: techPack as unknown as Record<string, unknown>,
    bom: { materials: techPack.materials, trims: techPack.trims },
    measurements: techPack.measurements as unknown as Record<string, unknown>,
  };

  if (isProjectUuid) {
    payload.project_id = techPack.projectId;
  }

  await supabase.from("production_specs").insert(payload);
  return techPack;
}

export async function findProductionSpecsByProjectId(
  workspaceId: string,
  projectId: string
): Promise<TechPack[]> {
  const supabase = createAdminSupabaseClient();

  const { data: rows, error } = await supabase
    .from("production_specs")
    .select("*");

  if (error || !rows) return [];

  return rows
    .map((r) => r.tech_pack as TechPack)
    .filter((tp) => tp && (tp.projectId === projectId || !isUuid(projectId)));
}
