/**
 * Slots Studio — Visual Studio Service Layer
 *
 * Orchestrates product context reading, visual generation requests,
 * shared job lifecycle management, and asset library persistence.
 */

import {
  type VisualStudioState,
  type VisualGenerationRequest,
  type VisualOutput,
  type VisualOutputStatus,
  type VisualReference,
  type VisualSettingsConfig,
} from "../types";
import { getProject } from "@/lib/projects/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { createJob, updateJobStatus, getJobs } from "@/lib/jobs/service";
import { createAsset } from "@/lib/assets/service";
import { uploadFileToStorage } from "@/lib/storage";
import { getImageProvider } from "@/lib/ai/registry";
import { checkGenerationQuota, logGenerationUsage } from "@/lib/ai/quota";
import { DevVisualProviderAdapter } from "../adapters/devVisualProvider";
import {
  findOutputsByProjectId,
  findOutputById,
  saveOutput,
  updateOutputStatus as updateStoreStatus,
  markSavedToProject,
  findReferencesByProjectId,
  saveReference as saveStoreReference,
} from "../store";
import {
  saveVisualOutputDb,
  findVisualOutputsByProjectId,
  updateVisualOutputStatusDb,
} from "@/lib/supabase/repositories/studioRepositories";

const visualProvider = new DevVisualProviderAdapter();

const DEFAULT_SETTINGS: VisualSettingsConfig = {
  aspectRatio: "1:1",
  lighting: "key_softbox",
  background: "dark_cyc",
  environment: "studio_loft",
  composition: "center_hero",
  modelDirection: "pose_front",
};

/**
 * Retrieves the complete Visual Studio state for a given project.
 */
export async function getVisualStudioState(
  workspaceId: string,
  projectId: string
): Promise<{ success: boolean; data?: VisualStudioState; error?: string }> {
  try {
    const projectResult = await getProject(workspaceId, projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found." };
    }

    const project = projectResult.data;

    // Read approved product context from Product Studio
    const productStudioResult = await getProductStudioState(workspaceId, projectId);
    const approvedConcept = productStudioResult.data?.concepts.find(
      (c) => c.id === productStudioResult.data?.approvedConceptId || c.status === "APPROVED"
    ) || null;

    // Load project-level references
    const storedRefs = await findReferencesByProjectId(projectId);
    const productRefs: VisualReference[] = (productStudioResult.data?.references || []).map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      selected: true,
    }));

    const allReferences = [...productRefs, ...storedRefs];

    // Load existing visual outputs from store & database
    const storeOutputs = await findOutputsByProjectId(projectId);
    let dbOutputs: VisualOutput[] = [];
    try {
      dbOutputs = await findVisualOutputsByProjectId(workspaceId, projectId);
    } catch (err) {
      console.warn("DB visual outputs notice:", err);
    }

    const outputMap = new Map<string, VisualOutput>();
    for (const o of storeOutputs) outputMap.set(o.id, o);
    for (const o of dbOutputs) outputMap.set(o.id, o);
    const outputs = Array.from(outputMap.values());

    // Check for active visual jobs
    const jobsResult = await getJobs(workspaceId, {
      projectId,
      studio: "VISUAL",
    });

    const activeJob = jobsResult.data?.find(
      (j) => j.status === "RUNNING" || j.status === "QUEUED"
    ) || null;

    return {
      success: true,
      data: {
        project,
        approvedConcept,
        references: allReferences,
        outputs,
        activeMode: "studio",
        settings: DEFAULT_SETTINGS,
        selectedOutputId: outputs[0]?.id,
        activeJob,
      },
    };
  } catch {
    return { success: false, error: "Failed to load Visual Studio state." };
  }
}

/**
 * Core generation pass: executes AI image synthesis / fallback, uploads binaries to storage,
 * registers assets in DB, saves outputs to store and database, and logs usage.
 */
export async function executeVisualGenerationPass(
  request: VisualGenerationRequest,
  jobId: string
): Promise<VisualOutput[]> {
  const projectResult = await getProject(request.workspaceId, request.projectId);
  if (!projectResult.success || !projectResult.data) {
    throw new Error("Project not found.");
  }
  const project = projectResult.data;

  // Read approved product concept
  const productStudioResult = await getProductStudioState(request.workspaceId, request.projectId);
  const approvedConcept =
    productStudioResult.data?.concepts.find(
      (c) => c.id === productStudioResult.data?.approvedConceptId || c.status === "APPROVED"
    ) || null;

  // Idempotency guard: If outputs already exist for this jobId, return them to prevent duplicate generation
  if (jobId) {
    const existingDb = await findVisualOutputsByProjectId(request.workspaceId, request.projectId).catch(() => []);
    const matching = existingDb.filter((o) => o.jobId === jobId);
    if (matching.length > 0) {
      return matching;
    }
  }

  const imgProvider = getImageProvider();
  let outputs: VisualOutput[] = [];
  const count = request.variantsCount || 2;

  if (imgProvider.id !== "dev") {
    try {
      const modeLabels: Record<string, string> = {
        studio: "Isolated Studio Pass",
        model: "On-Model Styling Frame",
        mannequin: "Form Structure Display",
        lifestyle: "Contextual Environment Shot",
        detail: "Material Construction Macro",
        editorial: "Campaign Narrative Visual",
      };

      for (let i = 0; i < count; i++) {
        const lightingStr = (request.settings?.lighting || "key_softbox").replace(/_/g, " ");
        const backgroundStr = (request.settings?.background || "dark_cyc").replace(/_/g, " ");
        const aspectRatioStr = request.settings?.aspectRatio || "1:1";

        const outputId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${i + 1}`;
        const candidateCode = `PASS-${String(i + 1).padStart(2, "0")}`;
        const title = `${project.name} • ${modeLabels[request.mode] || request.mode} ${candidateCode}`;
        const description = `${request.mode.toUpperCase()} view at ${aspectRatioStr} with ${lightingStr} lighting.`;

        const prompt = `Professional sportswear editorial photograph of ${project.name}, athletic sportswear, category: ${project.category}, silhouette: ${approvedConcept?.silhouetteDescription || "ergonomic technical sportswear"}, colorway: ${approvedConcept?.colorPalette?.join(" and ") || "monochrome neon"}, materials: ${approvedConcept?.suggestedMaterials?.join(", ") || "technical microfiber"}. Style: ${request.mode} setting, lighting: ${lightingStr}, background: ${backgroundStr}, ultra-high resolution commercial fashion studio render.`;

        const aiRes = await imgProvider.generateImage({
          prompt,
          aspectRatio: aspectRatioStr,
        });

        if (aiRes.success && aiRes.buffer && aiRes.buffer.length > 500) {
          const ext = aiRes.contentType === "image/png" ? "png" : "jpg";
          const filename = `${project.slotCode.toLowerCase()}_visual_${outputId}.${ext}`;

          // Upload real binary to private-assets Supabase Storage
          const uploadRes = await uploadFileToStorage({
            workspaceId: request.workspaceId,
            projectId: request.projectId,
            filename,
            contentType: aiRes.contentType || "image/jpeg",
            buffer: aiRes.buffer,
            metadata: {
              outputId,
              jobId,
              mode: request.mode,
              provider: aiRes.provider,
              model: aiRes.model,
            },
          });

          // Register asset in assets table
          const assetRes = await createAsset({
            workspaceId: request.workspaceId,
            projectId: request.projectId,
            projectName: project.name,
            slotCode: project.slotCode,
            name: title,
            assetType: "IMAGE",
            mimeType: aiRes.contentType || "image/jpeg",
            storageKey: uploadRes.path,
            storageBucket: "private-assets",
            sizeBytes: aiRes.buffer.byteLength,
            source: "AI_GENERATED",
            status: "REVIEW",
            metadata: {
              outputId,
              jobId,
              mode: request.mode,
              aspectRatio: request.settings.aspectRatio,
              provider: aiRes.provider,
              model: aiRes.model,
            },
          });

          const assetId = assetRes.data?.id;
          const previewUrl = assetId ? `/api/assets/${assetId}/preview` : undefined;

          outputs.push({
            id: outputId,
            workspaceId: request.workspaceId,
            projectId: request.projectId,
            jobId,
            mode: request.mode,
            title,
            description,
            aspectRatio: request.settings.aspectRatio,
            settings: request.settings,
            previewSvg: "",
            previewUrl,
            assetId,
            status: "REVIEW",
            isDevelopmentPreview: false,
            savedToProject: false,
            createdAt: new Date().toISOString(),
          });
        } else {
          throw new Error("Failed to generate real image binary");
        }
      }
    } catch (err) {
      console.warn(`Real image provider (${imgProvider.name}) failed. Falling back to DEV PREVIEW SVG:`, err);
      outputs = await visualProvider.generateVisuals({
        request,
        project,
        approvedConcept,
        jobId,
      });
    }
  } else {
    outputs = await visualProvider.generateVisuals({
      request,
      project,
      approvedConcept,
      jobId,
    });
  }

  // Persist outputs to store and database
  for (const output of outputs) {
    await saveOutput(output);
    await saveVisualOutputDb(request.workspaceId, output).catch((err) =>
      console.warn("DB visual output save notice:", err)
    );
  }

  // Log usage to PostgreSQL usage_ledger
  await logGenerationUsage({
    workspaceId: request.workspaceId,
    studio: "VISUAL",
    eventType: "VISUAL_RENDER",
    provider: outputs[0]?.isDevelopmentPreview ? "DevVisualProviderAdapter" : imgProvider.name,
    model: outputs[0]?.isDevelopmentPreview ? "slots-dev-preview" : imgProvider.defaultModel,
    jobId,
    creditsConsumed: 20,
    success: true,
  });

  return outputs;
}

/**
 * Executes a visual generation request through the shared Job pipeline.
 */
export async function generateVisualOutputs(
  request: VisualGenerationRequest,
  options?: { async?: boolean }
): Promise<{
  success: boolean;
  data?: VisualOutput[] | { jobId: string; status: string };
  jobId?: string;
  status?: string;
  error?: string;
}> {
  try {
    // 0. Server-side free quota check
    const quota = await checkGenerationQuota(request.workspaceId, "IMAGE");
    if (!quota.allowed) {
      return { success: false, error: quota.reason || "Free tier image generation quota reached." };
    }

    const projectResult = await getProject(request.workspaceId, request.projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found." };
    }
    const project = projectResult.data;

    const imgProvider = getImageProvider();

    // 1. Create shared workspace job
    const jobResult = await createJob({
      workspaceId: request.workspaceId,
      projectId: request.projectId,
      projectName: project.name,
      slotCode: project.slotCode,
      studio: "VISUAL",
      jobType: "VISUAL_GENERATION",
      provider: imgProvider.name,
      status: "QUEUED",
      payload: { request },
      inputSummary: `Mode: ${request.mode.toUpperCase()} | Ratio: ${request.settings.aspectRatio} | Light: ${request.settings.lighting.replace("_", " ")} (${imgProvider.name})`,
    });

    const jobId = jobResult.data?.id || `job_vis_${Date.now()}`;

    // If caller requested async background execution, return immediately
    if (options?.async) {
      return {
        success: true,
        jobId,
        status: "QUEUED",
        data: { jobId, status: "QUEUED" },
      };
    }

    // 2. Generate visuals via active provider (or DEV fallback)
    const outputs = await executeVisualGenerationPass(request, jobId);

    // 3. Update Job status to REVIEW
    await updateJobStatus(request.workspaceId, jobId, "REVIEW", {
      progressLabel: "AWAITING HUMAN REVIEW",
      outputIds: outputs.map((o) => o.id),
    });

    return {
      success: true,
      data: outputs,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Visual generation error";
    console.error("Visual generation failed:", msg);
    return {
      success: false,
      error: "We could not complete this visual generation. Your project is safe.",
    };
  }
}

/**
 * Updates review decision for a generated visual output.
 */
export async function updateVisualOutputStatus(
  workspaceId: string,
  projectId: string,
  outputId: string,
  status: VisualOutputStatus
): Promise<{ success: boolean; data?: VisualOutput; error?: string }> {
  try {
    const output = await findOutputById(outputId);
    if (!output || output.projectId !== projectId || output.workspaceId !== workspaceId) {
      return { success: false, error: "Visual output not found." };
    }

    const updated = await updateStoreStatus(outputId, status);
    await updateVisualOutputStatusDb(workspaceId, outputId, status).catch((err) =>
      console.warn("DB update visual output notice:", err)
    );

    if (!updated) {
      return { success: false, error: "Failed to update review status." };
    }

    return {
      success: true,
      data: updated,
    };
  } catch {
    return { success: false, error: "Failed to update output status." };
  }
}

/**
 * Saves a selected visual output as an official asset in the shared Assets library.
 */
export async function saveVisualOutputToProject(
  workspaceId: string,
  projectId: string,
  outputId: string
): Promise<{ success: boolean; data?: VisualOutput; error?: string }> {
  try {
    const output = await findOutputById(outputId);
    if (!output || output.projectId !== projectId || output.workspaceId !== workspaceId) {
      return { success: false, error: "Visual output not found." };
    }

    const projectResult = await getProject(workspaceId, projectId);
    const projectName = projectResult.data?.name || "Project";
    const slotCode = projectResult.data?.slotCode || "SS-00000";

    let assetId = output.assetId;

    if (!assetId) {
      const svgFilename = `${slotCode.toLowerCase()}_visual_${output.id}.svg`;
      const svgBuffer = Buffer.from(output.previewSvg || "<svg></svg>", "utf8");

      let storageKey = `assets/${workspaceId}/${projectId}/visuals/${output.id}.svg`;
      const uploadRes = await uploadFileToStorage({
        workspaceId,
        projectId,
        filename: svgFilename,
        contentType: "image/svg+xml",
        buffer: svgBuffer,
        metadata: {
          outputId: output.id,
          mode: output.mode,
        },
      });

      if (uploadRes.success) {
        storageKey = uploadRes.path;
      }

      // 1. Create asset in shared Assets Library
      const assetResult = await createAsset({
        workspaceId,
        projectId,
        projectName,
        slotCode,
        name: output.title,
        assetType: "IMAGE",
        mimeType: "image/svg+xml",
        storageKey,
        storageBucket: "private-assets",
        sizeBytes: svgBuffer.byteLength,
        previewSvg: output.previewSvg,
        source: "AI_GENERATED",
        status: "APPROVED",
        metadata: {
          studio: "VISUAL",
          mode: output.mode,
          aspectRatio: output.aspectRatio,
          settings: output.settings,
          jobId: output.jobId,
        },
      });

      assetId = assetResult.data?.id || `ast_${output.id}`;
    }

    // 2. Mark output as saved in Visual Studio
    const updated = await markSavedToProject(outputId, assetId);
    if (!updated) {
      return { success: false, error: "Failed to mark visual output as saved." };
    }

    // 3. Update status to APPROVED
    await updateStoreStatus(outputId, "APPROVED");

    return {
      success: true,
      data: updated,
    };
  } catch {
    return { success: false, error: "Failed to save visual asset to project." };
  }
}

/**
 * Adds an optional reference to the project visual workstation.
 */
export async function addVisualReference(
  workspaceId: string,
  projectId: string,
  name: string,
  type: string
): Promise<{ success: boolean; data?: VisualReference; error?: string }> {
  try {
    const newRef: VisualReference = {
      id: `vref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      type,
      selected: true,
    };

    const saved = await saveStoreReference(projectId, newRef);
    return { success: true, data: saved };
  } catch {
    return { success: false, error: "Failed to add reference." };
  }
}
