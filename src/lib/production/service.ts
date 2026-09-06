/**
 * Slots Studio — Production Studio Application Service (STUDIO 05)
 *
 * Implements authoritative business logic for manufacturing tech packs, context inheritance
 * from Product Studio, version lineage, shared Jobs tracking, and Assets Library integration.
 */

import {
  type TechPack,
  type ProductionStudioState,
  type ApprovedProductContext,
  type GenerateTechPackRequest,
  type UpdateTechPackInput,
  type ExportTechPackResult,
} from "./types";
import { productionStore } from "./store";
import {
  saveProductionSpecDb,
  findProductionSpecsByProjectId,
} from "@/lib/supabase/repositories/studioRepositories";
import { devProductionProvider } from "@/features/production/adapters/devProductionProvider";
import { getProject } from "@/lib/projects/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { type ProductConcept } from "@/features/product-studio/types";
import { createJob, updateJobStatus, getJobs } from "@/lib/jobs/service";
import { createAsset } from "@/lib/assets/service";
import { uploadFileToStorage } from "@/lib/storage";

/**
 * Loads complete Production Studio state for an active project slot.
 */
export async function getProductionStudioState(
  workspaceId: string,
  projectId: string,
  techPackId?: string
): Promise<{ success: boolean; data?: ProductionStudioState; error?: string }> {
  try {
    if (!workspaceId || !projectId) {
      return { success: false, error: "Missing required parameters." };
    }

    const projectResult = await getProject(workspaceId, projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    const project = projectResult.data;

    // Load Product Studio state to inherit approved context
    const productStudioResult = await getProductStudioState(workspaceId, projectId);
    const productState = productStudioResult.data;
    const approvedConcept = productState?.concepts.find(
      (c: ProductConcept) => c.status === "APPROVED"
    );

    const approvedContext: ApprovedProductContext = {
      productName: project.name,
      category: project.category || "Apparel",
      description:
        project.description ||
        productState?.brief?.description ||
        "High-performance technical sportswear engineered for kinetic movement.",
      silhouette:
        approvedConcept?.silhouetteDescription ||
        productState?.brief?.visualDirection ||
        "Articulated Kinetic Shell",
      colorways: approvedConcept?.colorPalette ||
        productState?.brief?.colors || ["#000000", "#B7FF00", "#FFFFFF"],
      materials: approvedConcept?.suggestedMaterials ||
        productState?.brief?.materials || [
          "3-Layer Micro-Ripstop Technical Poly",
          "Articulated Stretch Warp-Knit Mesh",
        ],
      approvedConceptId: approvedConcept?.id,
      isApproved: Boolean(approvedConcept),
    };

    const storeTechPacks = await productionStore.findTechPacksByProjectId(workspaceId, projectId);
    let dbTechPacks: TechPack[] = [];
    try {
      dbTechPacks = await findProductionSpecsByProjectId(workspaceId, projectId);
    } catch (err) {
      console.warn("DB tech packs notice:", err);
    }

    const techPackMap = new Map<string, TechPack>();
    for (const tp of storeTechPacks) techPackMap.set(tp.id, tp);
    for (const tp of dbTechPacks) techPackMap.set(tp.id, tp);
    const techPacks = Array.from(techPackMap.values());

    let activeTechPack: TechPack | null = null;
    if (techPackId) {
      activeTechPack = techPacks.find((tp) => tp.id === techPackId) || null;
    } else if (techPacks.length > 0) {
      activeTechPack = techPacks[0];
    }

    // Look for active production generation jobs
    const jobsResult = await getJobs(workspaceId, {
      projectId,
      studio: "PRODUCTION",
    });

    const activeJob =
      jobsResult.data?.find(
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
        techPacks,
        activeTechPack,
        activeJob,
      },
    };
  } catch (error) {
    console.error("Get Production Studio State Error:", error);
    return { success: false, error: "Failed to load Production Studio workstation." };
  }
}

/**
 * Synthesizes a structured manufacturing Tech Pack with version lineage and Jobs tracking.
 */
export async function generateTechPack(
  workspaceId: string,
  request: GenerateTechPackRequest
): Promise<{ success: boolean; data?: TechPack; jobId?: string; error?: string }> {
  try {
    if (!workspaceId || !request.projectId) {
      return { success: false, error: "Missing required parameters." };
    }

    const projectResult = await getProject(workspaceId, request.projectId);
    if (!projectResult.success || !projectResult.data) {
      return { success: false, error: "Project not found or unauthorized." };
    }

    const project = projectResult.data;

    const productStudioResult = await getProductStudioState(workspaceId, request.projectId);
    const productState = productStudioResult.data;
    const approvedConcept = productState?.concepts.find(
      (c: ProductConcept) => c.status === "APPROVED"
    );

    const approvedContext: ApprovedProductContext = {
      productName: project.name,
      category: project.category || "Apparel",
      description:
        project.description ||
        productState?.brief?.description ||
        "High-performance technical sportswear engineered for kinetic movement.",
      silhouette:
        approvedConcept?.silhouetteDescription ||
        productState?.brief?.visualDirection ||
        "Articulated Kinetic Shell",
      colorways: approvedConcept?.colorPalette ||
        productState?.brief?.colors || ["#000000", "#B7FF00", "#FFFFFF"],
      materials: approvedConcept?.suggestedMaterials ||
        productState?.brief?.materials || [
          "3-Layer Micro-Ripstop Technical Poly",
          "Articulated Stretch Warp-Knit Mesh",
        ],
      approvedConceptId: approvedConcept?.id,
      isApproved: Boolean(approvedConcept),
    };

    // Calculate version number based on existing tech packs for this project
    const existing = await productionStore.findTechPacksByProjectId(workspaceId, request.projectId);
    let versionNumber = "v1.0";
    if (request.parentVersionId) {
      const parent = existing.find((tp) => tp.id === request.parentVersionId);
      if (parent) {
        const major = parseInt(parent.version.replace("v", "").split(".")[0], 10) || 1;
        const minor = parseInt(parent.version.replace("v", "").split(".")[1], 10) || 0;
        versionNumber = `v${major}.${minor + 1}`;
      }
    } else if (existing.length > 0) {
      versionNumber = `v${existing.length + 1}.0`;
    }

    // 1. Create Job in shared Jobs subsystem
    const jobResult = await createJob({
      workspaceId,
      projectId: request.projectId,
      projectName: project.name,
      slotCode: project.slotCode,
      studio: "PRODUCTION",
      jobType: "PRODUCTION_TECHPACK_GENERATION",
      provider: devProductionProvider.providerName,
      inputSummary: `Synthesizing ${versionNumber} Manufacturing Tech Pack (BOM, size grading, seam specs, QC) for ${project.name} (${project.slotCode}).`,
    });

    const now = new Date().toISOString();
    const jobId = jobResult.data?.id || `job_${Date.now()}`;

    // 2. Synthesize Tech Pack through provider
    const synthesized = await devProductionProvider.synthesizeTechPack(
      workspaceId,
      request.projectId,
      project.name,
      project.slotCode || "SS-00000",
      approvedContext,
      {
        season: request.season,
        targetRegion: request.targetRegion,
        customDirectives: request.customDirectives,
        versionNumber,
        parentVersionId: request.parentVersionId,
      }
    );

    const techPackId = `tp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTechPack: TechPack = {
      ...synthesized,
      id: techPackId,
      jobId,
      createdAt: now,
      updatedAt: now,
    };

    await productionStore.createTechPack(newTechPack);
    await saveProductionSpecDb(workspaceId, newTechPack).catch((err) =>
      console.warn("DB tech pack save notice:", err)
    );

    // 3. Update Job status to REVIEW
    if (jobResult.data) {
      await updateJobStatus(workspaceId, jobResult.data.id, "REVIEW", {
        outputIds: [newTechPack.id],
        progress: 100,
        progressLabel: "TECH PACK READY FOR OPERATOR REVIEW",
      });
    }

    return { success: true, data: newTechPack, jobId };
  } catch (error) {
    console.error("Generate Tech Pack Error:", error);
    return { success: false, error: "Failed to synthesize manufacturing Tech Pack." };
  }
}

/**
 * Sets human review decision (APPROVE / REJECT) on a Tech Pack version.
 */
export async function reviewTechPack(
  workspaceId: string,
  techPackId: string,
  decision: "APPROVED" | "REJECTED"
): Promise<{ success: boolean; data?: TechPack; error?: string }> {
  try {
    const updated = await productionStore.updateTechPack(workspaceId, techPackId, {
      status: decision,
    });

    if (!updated) {
      return { success: false, error: "Tech Pack not found." };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Review Tech Pack Error:", error);
    return { success: false, error: "Failed to submit review decision." };
  }
}

/**
 * Updates specific technical specifications on an active Tech Pack.
 */
export async function updateTechPackData(
  workspaceId: string,
  input: UpdateTechPackInput
): Promise<{ success: boolean; data?: TechPack; error?: string }> {
  try {
    const techPack = await productionStore.findTechPackById(workspaceId, input.techPackId);
    if (!techPack) {
      return { success: false, error: "Tech Pack not found." };
    }

    const updates: Partial<TechPack> = {
      ...(input.season && { season: input.season }),
      ...(input.targetRegion && { targetRegion: input.targetRegion }),
      ...(input.factoryNotes && { factoryNotes: input.factoryNotes }),
      ...(input.changelog && { changelog: input.changelog }),
      ...(input.materials && { materials: input.materials }),
      ...(input.trims && { trims: input.trims }),
      ...(input.colorways && { colorways: input.colorways }),
      ...(input.measurements && { measurements: input.measurements }),
      ...(input.construction && {
        construction: { ...techPack.construction, ...input.construction },
      }),
      ...(input.qc && { qc: { ...techPack.qc, ...input.qc } }),
    };

    const updated = await productionStore.updateTechPack(workspaceId, input.techPackId, updates);
    return { success: true, data: updated || techPack };
  } catch (error) {
    console.error("Update Tech Pack Error:", error);
    return { success: false, error: "Failed to update Tech Pack data." };
  }
}

/**
 * Registers an approved Tech Pack document in the shared Assets Library.
 */
export async function saveTechPackToAssets(
  workspaceId: string,
  techPackId: string
): Promise<{ success: boolean; data?: TechPack; error?: string }> {
  try {
    const techPack = await productionStore.findTechPackById(workspaceId, techPackId);
    if (!techPack) {
      return { success: false, error: "Tech Pack not found." };
    }

    // Auto-approve if not already approved
    if (techPack.status !== "APPROVED") {
      await productionStore.updateTechPack(workspaceId, techPackId, { status: "APPROVED" });
    }

    const filename = `${techPack.slotCode.toLowerCase()}_techpack_${techPack.version.toLowerCase().replace(/\s+/g, "_")}.md`;
    const mdBuffer = Buffer.from(techPack.rawMarkdownSpec || "", "utf8");

    let storageKey = `projects/${techPack.projectId}/production/${techPack.id}_${techPack.version}.md`;
    const uploadRes = await uploadFileToStorage({
      workspaceId,
      projectId: techPack.projectId,
      filename,
      contentType: "text/markdown",
      buffer: mdBuffer,
      metadata: {
        techPackId: techPack.id,
        version: techPack.version,
      },
    });

    if (uploadRes.success) {
      storageKey = uploadRes.path;
    }

    // Create DOCUMENT asset in shared Assets Library
    const assetResult = await createAsset({
      workspaceId,
      projectId: techPack.projectId,
      projectName: techPack.projectName,
      slotCode: techPack.slotCode,
      name: `${techPack.projectName} — Manufacturing Tech Pack (${techPack.version})`,
      assetType: "DOCUMENT",
      mimeType: "text/markdown",
      storageKey,
      storageBucket: "private-assets",
      sizeBytes: mdBuffer.byteLength,
      source: "AI_GENERATED",
      status: "APPROVED",
      metadata: {
        techPackId: techPack.id,
        version: techPack.version,
        season: techPack.season,
        targetRegion: techPack.targetRegion,
        bomsCount: techPack.materials.length,
        trimsCount: techPack.trims.length,
        pomCount: techPack.measurements.length,
        tags: ["Production Studio", "Tech Pack", techPack.version, techPack.season],
      },
    });

    if (!assetResult.success || !assetResult.data) {
      return { success: false, error: assetResult.error || "Failed to create asset in library." };
    }

    const updated = await productionStore.updateTechPack(workspaceId, techPackId, {
      savedAssetId: assetResult.data.id,
      status: "APPROVED",
    });

    return { success: true, data: updated || techPack };
  } catch (error) {
    console.error("Save Tech Pack to Assets Error:", error);
    return { success: false, error: "Failed to save Tech Pack to Assets Library." };
  }
}

/**
 * Formats and exports a Tech Pack in Markdown, JSON, or CSV BOM format.
 */
export async function exportTechPack(
  workspaceId: string,
  techPackId: string,
  format: "MARKDOWN" | "JSON" | "CSV_BOM"
): Promise<{ success: boolean; data?: ExportTechPackResult; error?: string }> {
  try {
    const techPack = await productionStore.findTechPackById(workspaceId, techPackId);
    if (!techPack) {
      return { success: false, error: "Tech Pack not found." };
    }

    const cleanProjectName = techPack.projectName.toLowerCase().replace(/\s+/g, "_");
    const filenamePrefix = `${techPack.slotCode.toLowerCase()}_${cleanProjectName}_${techPack.version}`;

    if (format === "JSON") {
      return {
        success: true,
        data: {
          filename: `${filenamePrefix}_techpack.json`,
          mimeType: "application/json",
          content: JSON.stringify(techPack, null, 2),
        },
      };
    }

    if (format === "CSV_BOM") {
      const csvHeader = "Ref,Placement,Fabric Description,Composition,Weight (GSM),Finish & Treatment,Supplier Ref\n";
      const csvRows = techPack.materials
        .map(
          (m, idx) =>
            `"M-${idx + 1}","${m.placement}","${m.fabricName}","${m.composition}","${m.weightGsm}","${m.finishTreatment}","${m.supplierRef || "N/A"}"`
        )
        .join("\n");

      return {
        success: true,
        data: {
          filename: `${filenamePrefix}_bom.csv`,
          mimeType: "text/csv",
          content: csvHeader + csvRows,
        },
      };
    }

    // Default: MARKDOWN
    return {
      success: true,
      data: {
        filename: `${filenamePrefix}_techpack.md`,
        mimeType: "text/markdown",
        content: techPack.rawMarkdownSpec,
      },
    };
  } catch (error) {
    console.error("Export Tech Pack Error:", error);
    return { success: false, error: "Failed to export Tech Pack." };
  }
}
