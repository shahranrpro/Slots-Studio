/**
 * Slots Studio — Content Studio Application Service
 *
 * Orchestrates approved product context inheritance, content generation passes,
 * shared Jobs tracking, human review decisions, and Assets Library integration.
 */

import {
  type ContentOutput,
  type ContentStudioState,
  type ContentGenerationRequest,
  type ContentRefineRequest,
  type ContentType,
  type ContentTone,
  type ContentAudience,
  type ApprovedProductContext,
  CONTENT_TEMPLATES,
} from "./types";
import { contentStore } from "./store";
import {
  saveContentOutputDb,
  findContentOutputsByProjectId,
} from "@/lib/supabase/repositories/studioRepositories";
import { devContentProvider } from "@/features/content-studio/adapters/devContentProvider";
import { getProject } from "@/lib/projects/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { createJob, updateJobStatus, getJobs } from "@/lib/jobs/service";
import { createAsset } from "@/lib/assets/service";
import { getTextProvider } from "@/lib/ai/registry";
import { checkGenerationQuota, logGenerationUsage } from "@/lib/ai/quota";


/**
 * Retrieves the full Content Studio state for a given project, inheriting approved product context.
 */
export async function getContentStudioState(
  workspaceId: string,
  projectId: string
): Promise<{ success: boolean; data?: ContentStudioState; error?: string }> {
  try {
    const projectResult = await getProject(workspaceId, projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found." };
    }

    const project = projectResult.data;

    // Load Product Studio state to inherit approved product context
    const productStudioResult = await getProductStudioState(workspaceId, projectId);
    const productState = productStudioResult.data;
    const approvedConcept = productState?.concepts.find((c) => c.status === "APPROVED");

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

    const storeOutputs = await contentStore.findOutputsByProjectId(workspaceId, projectId);
    let dbOutputs: ContentOutput[] = [];
    try {
      dbOutputs = await findContentOutputsByProjectId(workspaceId, projectId);
    } catch (err) {
      console.warn("DB content outputs notice:", err);
    }

    const outputMap = new Map<string, ContentOutput>();
    for (const o of storeOutputs) outputMap.set(o.id, o);
    for (const o of dbOutputs) outputMap.set(o.id, o);
    const outputs = Array.from(outputMap.values());

    // Look for active content generation jobs
    const jobsResult = await getJobs(workspaceId, {
      projectId,
      studio: "CONTENT",
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
        outputs,
        activeJob,
      },
    };
  } catch (error) {
    console.error("Content Studio State Error:", error);
    return { success: false, error: "Failed to load Content Studio state." };
  }
}

/**
 * Generates new content using approved product context and registers a shared workspace Job.
 */
export async function generateContentOutput(
  workspaceId: string,
  input: {
    projectId: string;
    contentType: ContentType;
    templateId?: string;
    tone: ContentTone;
    audience: ContentAudience;
    customInstructions?: string;
    userId?: string;
  }
): Promise<{ success: boolean; data?: ContentOutput; error?: string }> {
  try {
    // 0. Enforce server-side free tier quota
    const quota = await checkGenerationQuota(workspaceId, "TEXT");
    if (!quota.allowed) {
      return { success: false, error: quota.reason || "Free tier generation quota reached." };
    }

    const studioStateResult = await getContentStudioState(workspaceId, input.projectId);
    if (!studioStateResult.success || !studioStateResult.data) {
      return { success: false, error: "Failed to load project context." };
    }

    const { projectName, slotCode, approvedContext } = studioStateResult.data;
    const textProvider = getTextProvider();

    // 1. Create a shared workspace Job
    const jobResult = await createJob({
      workspaceId,
      projectId: input.projectId,
      projectName,
      slotCode,
      createdBy: input.userId,
      studio: "CONTENT",
      jobType: "CONTENT_GENERATION",
      provider: textProvider.name,
      inputSummary: `${input.contentType.replace("_", " ")} under ${input.tone} tone (${textProvider.name})`,
    });

    const jobId = jobResult.data?.id || `job_${Date.now()}`;

    // 2. Synthesize copy via active provider (or DEV fallback)
    const request: ContentGenerationRequest = {
      workspaceId,
      projectId: input.projectId,
      projectName,
      slotCode,
      approvedContext,
      contentType: input.contentType,
      templateId: input.templateId,
      tone: input.tone,
      audience: input.audience,
      customInstructions: input.customInstructions,
    };

    const template = CONTENT_TEMPLATES.find((t) => t.id === input.templateId);
    let title = "";
    let content = "";
    let summary = "";
    let isDev = true;
    let providerName = "DevContentProviderAdapter";
    let modelName = "dev-preview";

    if (textProvider.id !== "dev") {
      try {
        const systemPrompt = `You are the lead sportswear technical copywriter for Slots Studio, specializing in premium technical apparel, ergonomic fit, and athletic performance engineering. Respond with polished, structured copy for ${input.contentType.replace("_", " ")} targeting ${input.audience} with a ${input.tone} tone.`;
        const userPrompt = `Product: ${approvedContext.productName}\nCategory: ${approvedContext.category}\nSilhouette: ${approvedContext.silhouette}\nColorways: ${approvedContext.colorways.join(", ")}\nMaterials: ${approvedContext.materials.join(", ")}\nDescription: ${approvedContext.description}\nSpecial Instructions: ${input.customInstructions || "None"}\n\nGenerate structured technical copy including a bold title, succinct 2-sentence summary hook, and full copy body.`;

        const aiRes = await textProvider.generateText({
          systemPrompt,
          prompt: userPrompt,
          temperature: 0.7,
        });

        if (aiRes.success && aiRes.text.length > 50) {
          title = `${approvedContext.productName} — ${input.contentType.replace("_", " ")}`;
          content = aiRes.text;
          summary = aiRes.text.split("\n\n")[0]?.replace(/^#+\s*/, "").slice(0, 160) || "Synthesized technical apparel copy.";
          isDev = false;
          providerName = aiRes.provider;
          modelName = aiRes.model;
        } else {
          throw new Error("Empty provider response");
        }
      } catch (err) {
        console.warn(`External text AI provider (${textProvider.name}) notice, using fallback:`, err);
        const generated = await devContentProvider.generate(request);
        title = generated.title;
        content = generated.content;
        summary = generated.summary;
        providerName = "DevContentProviderAdapter (Fallback)";
        modelName = "slots-dev-preview";
        isDev = true;
      }
    } else {
      const generated = await devContentProvider.generate(request);
      title = generated.title;
      content = generated.content;
      summary = generated.summary;
      providerName = "DevContentProviderAdapter";
      modelName = "slots-dev-preview";
      isDev = true;
    }

    const now = new Date().toISOString();
    const output: ContentOutput = {
      id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      workspaceId,
      projectId: input.projectId,
      projectName,
      slotCode,
      jobId,
      contentType: input.contentType,
      templateId: input.templateId,
      templateName: template?.name,
      title,
      content,
      summary,
      tone: input.tone,
      audience: input.audience,
      status: "IN_REVIEW",
      version: 1,
      metadata: {
        provider: providerName,
        modelLabel: modelName,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        charCount: content.length,
        readingTimeSeconds: Math.ceil(content.split(/\s+/).filter(Boolean).length / 3.5),
        isDevPreview: isDev,
      },
      createdAt: now,
      updatedAt: now,
    };

    await contentStore.saveOutput(output);
    await saveContentOutputDb(output).catch((err) =>
      console.warn("DB content output save notice:", err)
    );

    // 3. Log usage to PostgreSQL usage_ledger
    await logGenerationUsage({
      workspaceId,
      userId: input.userId,
      studio: "CONTENT",
      eventType: "CONTENT_SYNTHESIS",
      provider: providerName,
      model: modelName,
      jobId,
      creditsConsumed: 5,
      success: true,
    });

    // 4. Update Job status to REVIEW
    if (jobResult.data) {
      await updateJobStatus(workspaceId, jobResult.data.id, "REVIEW", {
        outputIds: [output.id],
        progress: 100,
        progressLabel: "SYNTHESIS READY FOR REVIEW",
      });
    }

    return { success: true, data: output };
  } catch (error) {
    console.error("Content Generation Error:", error);
    return { success: false, error: "Failed to generate content." };
  }
}

/**
 * Refines an existing content output with specific operator directives, preserving version lineage.
 */
export async function refineContentOutput(
  workspaceId: string,
  input: {
    outputId: string;
    refinementNotes: string;
    customInstructions?: string;
    userId?: string;
  }
): Promise<{ success: boolean; data?: ContentOutput; error?: string }> {
  try {
    const parentOutput = await contentStore.findOutputById(workspaceId, input.outputId);
    if (!parentOutput) {
      return { success: false, error: "Source content output not found." };
    }

    const studioStateResult = await getContentStudioState(workspaceId, parentOutput.projectId);
    if (!studioStateResult.success || !studioStateResult.data) {
      return { success: false, error: "Failed to load project context." };
    }

    const { approvedContext } = studioStateResult.data;

    // 1. Create refinement Job
    const jobResult = await createJob({
      workspaceId,
      projectId: parentOutput.projectId,
      projectName: parentOutput.projectName,
      slotCode: parentOutput.slotCode,
      createdBy: input.userId,
      studio: "CONTENT",
      jobType: "CONTENT_REFINEMENT",
      provider: "DevContentProviderAdapter",
      inputSummary: `Refining ${parentOutput.title} (v${parentOutput.version + 1})`,
    });

    const jobId = jobResult.data?.id || `job_${Date.now()}`;

    // 2. Synthesize refinement
    const request: ContentRefineRequest = {
      workspaceId,
      projectId: parentOutput.projectId,
      parentOutput,
      approvedContext,
      refinementNotes: input.refinementNotes,
      customInstructions: input.customInstructions,
    };

    const refined = await devContentProvider.refine(request);

    const now = new Date().toISOString();
    const refinedOutput: ContentOutput = {
      ...parentOutput,
      id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      jobId,
      title: refined.title,
      content: refined.content,
      summary: refined.summary,
      status: "IN_REVIEW",
      version: parentOutput.version + 1,
      parentId: parentOutput.id,
      feedbackNotes: input.refinementNotes,
      savedAssetId: undefined,
      metadata: refined.metadata,
      createdAt: now,
      updatedAt: now,
    };

    await contentStore.saveOutput(refinedOutput);
    await saveContentOutputDb(refinedOutput).catch((err) =>
      console.warn("DB refined content output save notice:", err)
    );

    if (jobResult.data) {
      await updateJobStatus(workspaceId, jobResult.data.id, "REVIEW", {
        outputIds: [refinedOutput.id],
        progress: 100,
        progressLabel: "REFINEMENT READY FOR REVIEW",
      });
    }

    return { success: true, data: refinedOutput };
  } catch (error) {
    console.error("Content Refine Error:", error);
    return { success: false, error: "Failed to refine content." };
  }
}

/**
 * Updates the raw text content of an output directly from the inline editor.
 */
export async function updateContentText(
  workspaceId: string,
  outputId: string,
  newContent: string
): Promise<{ success: boolean; data?: ContentOutput; error?: string }> {
  try {
    const existing = await contentStore.findOutputById(workspaceId, outputId);
    if (!existing) {
      return { success: false, error: "Content output not found." };
    }

    const wordCount = newContent.trim().split(/\s+/).length;
    const charCount = newContent.length;
    const readingTimeSeconds = Math.max(5, Math.ceil((wordCount / 200) * 60));

    const updated = await contentStore.updateOutput(workspaceId, outputId, {
      content: newContent,
      metadata: {
        ...existing.metadata,
        wordCount,
        charCount,
        readingTimeSeconds,
      },
    });

    if (!updated) {
      return { success: false, error: "Failed to update content." };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Content Text Error:", error);
    return { success: false, error: "Failed to update content text." };
  }
}

/**
 * Sets human review decision (APPROVE / REJECT) on a content candidate.
 */
export async function reviewContentOutput(
  workspaceId: string,
  outputId: string,
  decision: "APPROVED" | "REJECTED"
): Promise<{ success: boolean; data?: ContentOutput; error?: string }> {
  try {
    const updated = await contentStore.updateOutput(workspaceId, outputId, {
      status: decision,
    });

    if (!updated) {
      return { success: false, error: "Content output not found." };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Content Review Error:", error);
    return { success: false, error: "Failed to submit review decision." };
  }
}

/**
 * Registers an approved content output into the shared Assets Library as a DOCUMENT asset.
 */
export async function saveContentToAssets(
  workspaceId: string,
  outputId: string
): Promise<{ success: boolean; data?: ContentOutput; error?: string }> {
  try {
    const output = await contentStore.findOutputById(workspaceId, outputId);
    if (!output) {
      return { success: false, error: "Content output not found." };
    }

    // Auto-approve if not already approved
    if (output.status !== "APPROVED") {
      await contentStore.updateOutput(workspaceId, outputId, { status: "APPROVED" });
    }

    // Create DOCUMENT asset in shared Assets Library
    const assetResult = await createAsset({
      workspaceId,
      projectId: output.projectId,
      projectName: output.projectName,
      slotCode: output.slotCode,
      name: `${output.title} (${output.contentType})`,
      assetType: "DOCUMENT",
      mimeType: "text/markdown",
      storageKey: `projects/${output.projectId}/content/${output.id}.md`,
      sizeBytes: Buffer.byteLength(output.content, "utf8"),
      source: "AI_GENERATED",
      status: "APPROVED",
      metadata: {
        description: output.summary || output.title,
        tags: ["Content Studio", output.contentType, output.tone, output.audience],
        textContent: output.content,
      },
    });

    if (!assetResult.success || !assetResult.data) {
      return { success: false, error: assetResult.error || "Failed to create asset in library." };
    }

    const updatedOutput = await contentStore.updateOutput(workspaceId, outputId, {
      savedAssetId: assetResult.data.id,
      status: "APPROVED",
    });

    return { success: true, data: updatedOutput || output };
  } catch (error) {
    console.error("Save Content to Assets Error:", error);
    return { success: false, error: "Failed to save content to Assets Library." };
  }
}
