/**
 * Slots Studio — Product Studio Service Layer
 */

import {
  type ProductStudioState,
  type ProductBriefData,
  type ProductReference,
  type ProductConcept,
  type ConceptRefinementInput,
  type ReferenceType,
} from "../types";
import { getProject, updateProject } from "@/lib/projects/service";
import {
  getProjectReferences,
  addProjectReference,
  removeProjectReference,
  getProjectConcepts,
  addProjectConcepts,
  updateProjectConceptStatus,
} from "../store";
import {
  saveProductConceptDb,
  findProductConceptsByProjectId,
  updateProductConceptStatusDb,
} from "@/lib/supabase/repositories/studioRepositories";
import { checkGenerationQuota, logGenerationUsage } from "@/lib/ai/quota";
import { createJob, updateJobStatus, getJobs } from "@/lib/jobs/service";
import { uploadFileToStorage } from "@/lib/storage";
import { createAsset } from "@/lib/assets/service";
import { generateImageSafe, getImageProvider } from "@/lib/ai/registry";
import { getSilhouetteForCategory } from "@/lib/ai/adapters/devProvider";
import { type ProjectCategory } from "@/lib/projects/types";

/**
 * Loads complete Product Studio workspace state for a given project.
 */
export async function getProductStudioState(
  workspaceId: string,
  projectId: string
): Promise<{ success: boolean; data?: ProductStudioState; error?: string }> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    return { success: false, error: "Project not found or unauthorized." };
  }

  const project = projectResult.data;
  const [references, storeConcepts] = await Promise.all([
    getProjectReferences(projectId),
    getProjectConcepts(projectId),
  ]);

  let dbConcepts: ProductConcept[] = [];
  try {
    dbConcepts = await findProductConceptsByProjectId(workspaceId, projectId);
  } catch (err) {
    console.warn("DB concepts lookup notice:", err);
  }

  const conceptMap = new Map<string, ProductConcept>();
  for (const c of storeConcepts) conceptMap.set(c.id, c);
  for (const c of dbConcepts) conceptMap.set(c.id, c);
  const concepts = Array.from(conceptMap.values());

  const approvedConcept = concepts.find((c) => c.status === "APPROVED");

  const brief: ProductBriefData = {
    name: project.name,
    category: project.category,
    description: project.description,
    targetUser: project.context.targetAudience || "",
    visualDirection: project.context.visualDirection || "",
    colors: project.context.colorways?.length ? project.context.colorways : ["#000000", "#B7FF00"],
    materials: project.context.tags?.length ? project.context.tags : ["Technical Ripstop", "Bonded Shell"],
    notes: project.context.notes || "",
  };

  // Check for active product generation jobs
  let activeJob = null;
  try {
    const jobsResult = await getJobs(workspaceId, {
      projectId,
      studio: "PRODUCT",
    });
    activeJob =
      jobsResult.data?.find(
        (j) => j.status === "RUNNING" || j.status === "QUEUED"
      ) || null;
  } catch {
    // Non-blocking fallback
  }

  return {
    success: true,
    data: {
      project,
      brief,
      references,
      concepts,
      approvedConceptId: approvedConcept?.id,
      activeJob,
    },
  };
}

/**
 * Saves and locks product brief parameters directly to the project record.
 */
export async function saveProductBrief(
  workspaceId: string,
  projectId: string,
  brief: ProductBriefData
): Promise<{ success: boolean; error?: string }> {
  const updateResult = await updateProject(workspaceId, projectId, {
    name: brief.name,
    category: brief.category as ProjectCategory,
    description: brief.description,
    context: {
      targetAudience: brief.targetUser,
      visualDirection: brief.visualDirection,
      notes: brief.notes,
      colorways: brief.colors,
      tags: brief.materials,
    },
  });

  return { success: updateResult.success, error: updateResult.error };
}

/**
 * Adds a new product reference attachment.
 */
export async function addReference(
  workspaceId: string,
  projectId: string,
  input: { name: string; type: ReferenceType; value: string; notes?: string }
): Promise<{ success: boolean; data?: ProductReference; error?: string }> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    return { success: false, error: "Project not found." };
  }

  const reference: ProductReference = {
    id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    projectId,
    name: input.name.trim(),
    type: input.type,
    value: input.value.trim(),
    notes: input.notes?.trim(),
    createdAt: new Date().toISOString(),
  };

  const created = await addProjectReference(reference);
  return { success: true, data: created };
}

/**
 * Removes a product reference.
 */
export async function deleteReference(
  workspaceId: string,
  projectId: string,
  referenceId: string
): Promise<{ success: boolean; error?: string }> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    return { success: false, error: "Project not found." };
  }

  const removed = await removeProjectReference(projectId, referenceId);
  return { success: removed };
}

/**
 * Builds canonical product prompt respecting brief parameters and styling direction.
 */
export function buildConceptPrompt(params: {
  productName: string;
  category: string;
  description: string;
  targetUser?: string;
  visualDirection?: string;
  colors?: string[];
  materials?: string[];
  references?: Array<{ name: string; type: string; value?: string }>;
  candidateIndex: number;
}): string {
  const {
    productName,
    category,
    description,
    targetUser,
    visualDirection,
    colors,
    materials,
    references,
    candidateIndex,
  } = params;

  const colorway = colors?.length ? colors.join(", ") : "monochrome black with electric lime accents";
  const materialList = materials?.length ? materials.join(", ") : "technical performance fabrics";
  const target = targetUser ? `targeted for ${targetUser}` : "high-performance technical apparel";
  const styling = visualDirection ? `Visual styling: ${visualDirection}.` : "Futuristic technical minimalism.";

  const angles = [
    "clean front product view centered",
    "dynamic three-quarter angle product presentation",
    "front-facing hero product view with emphasized articulation",
    "isometric technical product presentation",
  ];
  const angle = angles[(candidateIndex - 1) % angles.length];

  let refStr = "";
  if (references?.length) {
    const refNames = references.map((r) => `${r.name} (${r.type})`).join("; ");
    refStr = `Design cues: ${refNames}.`;
  }

  return (
    `Professional commercial studio product photograph of ${productName}, a premium ${category}. ` +
    `${description}. ` +
    `Product presentation: ${angle}, centered on a clean neutral studio cyclorama background. ` +
    `Colorway: ${colorway}. ` +
    `Fabrication & materials: ${materialList}. ` +
    `${target}. ${styling} ${refStr} ` +
    `Photorealistic apparel render, authentic textures, sharp stitching detail, commercial lookbook quality, no text, no logos, no watermarks, professional studio lighting.`
  );
}

/**
 * Core generation pass: executes AI image synthesis / fallback, uploads binaries to storage,
 * registers assets in DB, saves concepts to store and database, and logs usage.
 */
export async function executeProductGenerationPass(
  workspaceId: string,
  projectId: string,
  variantsCount: number = 3,
  jobId: string
): Promise<ProductConcept[]> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    throw new Error("Project not found.");
  }
  const project = projectResult.data;
  const references = await getProjectReferences(projectId);

  // Idempotency check: if concepts already exist for this jobId, return them to avoid duplicate generation/charging
  if (jobId) {
    const existingDb = await findProductConceptsByProjectId(workspaceId, projectId).catch(() => []);
    const matching = existingDb.filter((c) => c.jobId === jobId);
    if (matching.length > 0) {
      return matching;
    }
  }

  const count = Math.min(Math.max(variantsCount || 3, 1), 4);
  const newConcepts: ProductConcept[] = [];

  const defaultColors = project.context.colorways?.length
    ? project.context.colorways
    : ["#000000", "#B7FF00"];
  const defaultMaterials = project.context.tags?.length
    ? project.context.tags
    : ["Technical Ripstop Nylon", "Bonded Shell"];

  for (let i = 1; i <= count; i++) {
    const conceptId = `concept_${Date.now()}_${Math.random().toString(36).substring(2, 6)}_${i}`;
    const code = `CANDIDATE-${i.toString().padStart(2, "0")}`;

    const prompt = buildConceptPrompt({
      productName: project.name,
      category: project.category,
      description: project.description,
      targetUser: project.context.targetAudience,
      visualDirection: project.context.visualDirection,
      colors: defaultColors,
      materials: defaultMaterials,
      references: references.map((r) => ({ name: r.name, type: r.type, value: r.value })),
      candidateIndex: i,
    });

    let imageUrl: string | undefined = undefined;
    let assetId: string | undefined = undefined;
    let providerName = "DevConceptProvider";
    let modelName = "slots-dev-preview";
    let isDevPreview = true;

    try {
      // Multi-stage image generation: Replicate -> Pollinations -> DEV PREVIEW
      const aiRes = await generateImageSafe({
        prompt,
        aspectRatio: "1:1",
      });

      if (aiRes.success && aiRes.buffer && aiRes.buffer.length > 500 && !aiRes.isDevelopmentPreview) {
        const ext = aiRes.contentType === "image/png" ? "png" : "jpg";
        const filename = `${project.slotCode.toLowerCase()}_concept_${conceptId}.${ext}`;

        // Upload real image binary to Supabase Storage private-assets bucket
        const uploadRes = await uploadFileToStorage({
          workspaceId,
          projectId,
          filename,
          contentType: aiRes.contentType || "image/jpeg",
          buffer: aiRes.buffer,
          metadata: {
            conceptId,
            jobId,
            provider: aiRes.provider,
            model: aiRes.model,
          },
        });

        // Register asset in assets table
        const assetRes = await createAsset({
          workspaceId,
          projectId,
          projectName: project.name,
          slotCode: project.slotCode,
          name: `${project.name} • Concept ${code}`,
          assetType: "IMAGE",
          mimeType: aiRes.contentType || "image/jpeg",
          storageKey: uploadRes.path,
          storageBucket: "private-assets",
          sizeBytes: aiRes.buffer.byteLength,
          source: "AI_GENERATED",
          status: "REVIEW",
          metadata: {
            conceptId,
            jobId,
            provider: aiRes.provider,
            model: aiRes.model,
          },
        });

        assetId = assetRes.data?.id;
        if (assetId) {
          imageUrl = `/api/assets/${assetId}/preview`;
        }
        providerName = aiRes.provider || "Pollinations (Flux)";
        modelName = aiRes.model || "flux";
        isDevPreview = false;
      }
    } catch (imgErr: unknown) {
      console.warn(`Concept image generation fallback for ${code}:`, imgErr instanceof Error ? imgErr.message : imgErr);
    }

    const silhouetteDescription = `${project.category} technical silhouette with articulated seams`;
    const title = `${project.name} — Pass ${code}`;
    const summary = `${project.category} concept synthesized with ${defaultMaterials.slice(0, 2).join(", ")}. Colorway locked to ${defaultColors.join(", ")}.`;

    newConcepts.push({
      id: conceptId,
      projectId,
      candidateCode: code,
      title,
      summary,
      silhouetteDescription,
      svgWireframe: getSilhouetteForCategory(project.category),
      imageUrl,
      assetId,
      provider: providerName,
      model: modelName,
      jobId,
      colorPalette: defaultColors,
      suggestedMaterials: defaultMaterials,
      status: "REVIEW",
      isDevelopmentPreview: isDevPreview,
      createdAt: new Date().toISOString(),
    });
  }

  // Save concepts to memory store and persistent database
  const saved = await addProjectConcepts(projectId, newConcepts);
  for (const c of newConcepts) {
    await saveProductConceptDb(workspaceId, c).catch((err) =>
      console.warn("DB concept save notice:", err)
    );
  }

  // Idempotent usage ledger logging
  await logGenerationUsage({
    workspaceId,
    studio: "PRODUCT",
    eventType: "CONCEPT_GENERATION",
    provider: newConcepts[0]?.provider || "DevConceptProvider",
    model: newConcepts[0]?.model || "slots-dev-preview",
    jobId,
    creditsConsumed: 10,
    success: true,
  }).catch((err) => console.warn("Usage ledger logging notice:", err));

  return saved;
}

/**
 * Creates a generation job and executes concept variant generation through the AI layer.
 */
export async function generateStudioConcepts(
  workspaceId: string,
  projectId: string,
  variantsCount: number = 3,
  options?: { async?: boolean }
): Promise<{
  success: boolean;
  data?: ProductConcept[] | { jobId: string; status: string };
  jobId?: string;
  status?: string;
  error?: string;
}> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    return { success: false, error: "Project not found." };
  }
  const project = projectResult.data;

  // 0. Free tier quota check (IMAGE quota)
  const quota = await checkGenerationQuota(workspaceId, "IMAGE");
  if (!quota.allowed) {
    return { success: false, error: quota.reason || "Free tier image generation quota reached." };
  }

  // 1. Create generation job
  const jobResult = await createJob({
    workspaceId,
    projectId,
    projectName: project.name,
    slotCode: project.slotCode,
    studio: "PRODUCT",
    jobType: "PRODUCT_CONCEPT_GENERATION",
    provider: getImageProvider().name,
    status: options?.async ? "QUEUED" : "RUNNING",
    payload: { variantsCount, projectId },
    inputSummary: `Product Concept Generation: ${variantsCount} passes for ${project.name} (${project.slotCode})`,
  });

  const jobId = jobResult.data?.id || `job_prod_${Date.now()}`;

  // If async requested, return immediately
  if (options?.async) {
    return {
      success: true,
      jobId,
      status: "QUEUED",
      data: { jobId, status: "QUEUED" },
    };
  }

  // Synchronous pass (default for direct callers & backward compatibility)
  try {
    const concepts = await executeProductGenerationPass(workspaceId, projectId, variantsCount, jobId);

    await updateJobStatus(workspaceId, jobId, "COMPLETED", {
      progress: 100,
      outputIds: concepts.map((c) => c.id),
      progressLabel: "GENERATION COMPLETE",
    });

    return { success: true, jobId, status: "COMPLETED", data: concepts };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Generation error.";
    await updateJobStatus(workspaceId, jobId, "FAILED", {
      errorMessageSafe: errorMsg,
      progressLabel: "FAILED",
    });
    return { success: false, jobId, status: "FAILED", error: "We could not complete this generation. Please try again." };
  }
}

/**
 * Refines a concept creating a traceable child version.
 */
export async function refineStudioConcept(
  workspaceId: string,
  projectId: string,
  input: ConceptRefinementInput
): Promise<{ success: boolean; data?: ProductConcept; error?: string }> {
  const projectResult = await getProject(workspaceId, projectId);
  if (!projectResult.success || !projectResult.data) {
    return { success: false, error: "Project not found." };
  }

  const project = projectResult.data;
  const concepts = await getProjectConcepts(projectId);
  const baseConcept = concepts.find((c) => c.id === input.baseConceptId);

  if (!baseConcept) {
    return { success: false, error: "Base concept not found." };
  }

  const jobResult = await createJob({
    workspaceId,
    projectId,
    projectName: project.name,
    slotCode: project.slotCode,
    studio: "PRODUCT",
    jobType: "PRODUCT_CONCEPT_REFINEMENT",
    provider: getImageProvider().name,
    status: "RUNNING",
    inputSummary: `Concept Refinement for ${baseConcept.candidateCode}: ${input.instructions.slice(0, 60)}...`,
  });

  const jobId = jobResult.data?.id || `job_refine_${Date.now()}`;

  try {
    const childConceptId = `concept_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const prompt = buildConceptPrompt({
      productName: project.name,
      category: project.category,
      description: `${project.description}. Refinement focus: ${input.instructions}`,
      targetUser: project.context.targetAudience,
      visualDirection: project.context.visualDirection,
      colors: baseConcept.colorPalette,
      materials: baseConcept.suggestedMaterials,
      candidateIndex: 1,
    });

    let imageUrl: string | undefined = undefined;
    let assetId: string | undefined = undefined;
    let providerName = baseConcept.provider || "DevConceptProvider";
    let modelName = baseConcept.model || "slots-dev-preview";
    let isDevPreview = true;

    try {
      const aiRes = await generateImageSafe({ prompt, aspectRatio: "1:1" });
      if (aiRes.success && aiRes.buffer && aiRes.buffer.length > 500 && !aiRes.isDevelopmentPreview) {
        const ext = aiRes.contentType === "image/png" ? "png" : "jpg";
        const filename = `${project.slotCode.toLowerCase()}_concept_${childConceptId}.${ext}`;

        const uploadRes = await uploadFileToStorage({
          workspaceId,
          projectId,
          filename,
          contentType: aiRes.contentType || "image/jpeg",
          buffer: aiRes.buffer,
          metadata: {
            conceptId: childConceptId,
            jobId,
            provider: aiRes.provider,
            model: aiRes.model,
          },
        });

        const assetRes = await createAsset({
          workspaceId,
          projectId,
          projectName: project.name,
          slotCode: project.slotCode,
          name: `${project.name} • Refinement of ${baseConcept.candidateCode}`,
          assetType: "IMAGE",
          mimeType: aiRes.contentType || "image/jpeg",
          storageKey: uploadRes.path,
          storageBucket: "private-assets",
          sizeBytes: aiRes.buffer.byteLength,
          source: "AI_GENERATED",
          status: "REVIEW",
          metadata: {
            conceptId: childConceptId,
            jobId,
            provider: aiRes.provider,
            model: aiRes.model,
          },
        });

        assetId = assetRes.data?.id;
        if (assetId) {
          imageUrl = `/api/assets/${assetId}/preview`;
        }
        providerName = aiRes.provider || "Pollinations (Flux)";
        modelName = aiRes.model || "flux";
        isDevPreview = false;
      }
    } catch {
      // Fallback preview
    }

    const newChildConcept: ProductConcept = {
      id: childConceptId,
      projectId,
      candidateCode: `${baseConcept.candidateCode}-R`,
      title: `${baseConcept.title} (Refined)`,
      summary: `Refined iteration incorporating guidance: "${input.instructions.slice(0, 100)}"`,
      silhouetteDescription: baseConcept.silhouetteDescription,
      svgWireframe: baseConcept.svgWireframe,
      imageUrl,
      assetId,
      provider: providerName,
      model: modelName,
      jobId,
      colorPalette: baseConcept.colorPalette,
      suggestedMaterials: baseConcept.suggestedMaterials,
      status: "REVIEW",
      isDevelopmentPreview: isDevPreview,
      parentConceptId: baseConcept.id,
      refinementNotes: input.instructions,
      createdAt: new Date().toISOString(),
    };

    await addProjectConcepts(projectId, [newChildConcept]);
    await saveProductConceptDb(workspaceId, newChildConcept).catch((err) =>
      console.warn("DB refine concept save notice:", err)
    );

    await updateJobStatus(workspaceId, jobId, "COMPLETED", {
      progress: 100,
      outputIds: [newChildConcept.id],
    });

    return { success: true, data: newChildConcept };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Refinement error.";
    await updateJobStatus(workspaceId, jobId, "FAILED", {
      errorMessageSafe: errorMsg,
    });
    return { success: false, error: "Failed to refine concept. Please try again." };
  }
}

/**
 * Approves a concept and locks its parameters to the canonical project context.
 */
export async function approveStudioConcept(
  workspaceId: string,
  projectId: string,
  conceptId: string
): Promise<{ success: boolean; data?: ProductConcept; error?: string }> {
  const updatedConcept = await updateProjectConceptStatus(projectId, conceptId, "APPROVED");
  if (!updatedConcept) {
    return { success: false, error: "Concept not found." };
  }

  await updateProductConceptStatusDb(workspaceId, conceptId, "APPROVED").catch((err) =>
    console.warn("DB approve concept notice:", err)
  );

  // Update project lifecycle status and locked attributes
  await updateProject(workspaceId, projectId, {
    status: "APPROVED",
    context: {
      visualDirection: updatedConcept.silhouetteDescription,
      colorways: updatedConcept.colorPalette,
      tags: updatedConcept.suggestedMaterials,
    },
  });

  return { success: true, data: updatedConcept };
}

/**
 * Marks a concept as rejected.
 */
export async function rejectStudioConcept(
  workspaceId: string,
  projectId: string,
  conceptId: string
): Promise<{ success: boolean; data?: ProductConcept; error?: string }> {
  const updatedConcept = await updateProjectConceptStatus(projectId, conceptId, "REJECTED");
  if (!updatedConcept) {
    return { success: false, error: "Concept not found." };
  }

  await updateProductConceptStatusDb(workspaceId, conceptId, "REJECTED").catch((err) =>
    console.warn("DB reject concept notice:", err)
  );

  return { success: true, data: updatedConcept };
}
