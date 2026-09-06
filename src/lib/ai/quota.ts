/**
 * Slots Studio — Server-Side AI Free Quota & Usage Ledger Engine
 * 
 * Enforces strict server-side rate limits and free tier quotas for the Sialkot launch,
 * preventing unexpected compute bills while allowing free exploratory adoption.
 * All generation events are recorded to the authoritative PostgreSQL usage_ledger.
 */

import {
  findUsageLedgerByWorkspaceId,
  findSubscriptionByWorkspaceId,
} from "@/lib/supabase/repositories/billingRepository";
import { recordUsageEvent } from "@/lib/billing/service";
import { type UsageStudio, type UsageEventType } from "@/lib/billing/types";

export interface QuotaCheckResult {
  allowed: boolean;
  limit: number;
  used: number;
  remaining: number;
  reason?: string;
}

export type GenerationCategory = "TEXT" | "IMAGE";

export function getFreeTierLimits(): { textLimit: number; imageLimit: number; replicateImageLimit: number } {
  const textLimit = parseInt(process.env.FREE_TIER_TEXT_LIMIT || "20", 10);
  const imageLimit = parseInt(process.env.FREE_TIER_IMAGE_LIMIT || "5", 10);
  const replicateImageLimit = parseInt(process.env.REPLICATE_MAX_WORKSPACE_IMAGES || process.env.FREE_TIER_IMAGE_LIMIT || "5", 10);
  return {
    textLimit: isNaN(textLimit) ? 20 : textLimit,
    imageLimit: isNaN(imageLimit) ? 5 : imageLimit,
    replicateImageLimit: isNaN(replicateImageLimit) ? 5 : replicateImageLimit,
  };
}

/**
 * Checks if a workspace is eligible to generate text or image outputs.
 */
export async function checkGenerationQuota(
  workspaceId: string,
  category: GenerationCategory
): Promise<QuotaCheckResult> {
  const { textLimit, imageLimit, replicateImageLimit } = getFreeTierLimits();
  const isReplicate = process.env.AI_IMAGE_PROVIDER?.toLowerCase() === "replicate";
  const limit = category === "TEXT" ? textLimit : (isReplicate ? replicateImageLimit : imageLimit);

  try {
    // 1. Check if workspace has an active Pro or Enterprise subscription
    const sub = await findSubscriptionByWorkspaceId(workspaceId).catch(() => null);
    if (sub && (sub.planId === "PRO_STUDIO" || sub.planId === "ENTERPRISE_STUDIO")) {
      return {
        allowed: true,
        limit: 99999,
        used: 0,
        remaining: 99999,
      };
    }

    // 2. Query usage ledger entries from Supabase PostgreSQL
    const entries = await findUsageLedgerByWorkspaceId(workspaceId).catch(() => []);

    // Filter events matching the generation category
    const relevantEvents = entries.filter((e) => {
      if (category === "TEXT") {
        return (
          e.eventType === "CONCEPT_GENERATION" ||
          e.eventType === "CONTENT_SYNTHESIS" ||
          e.eventType === "CAMPAIGN_PACK" ||
          e.eventType === "PRODUCTION_TECHPACK"
        );
      } else {
        return e.eventType === "VISUAL_RENDER";
      }
    });

    const used = relevantEvents.length;
    const remaining = Math.max(0, limit - used);

    if (used >= limit) {
      return {
        allowed: false,
        limit,
        used,
        remaining: 0,
        reason: `Free tier ${category.toLowerCase()} generation quota reached (${used}/${limit}). Upgrade to Pro Studio for unlimited high-performance studio access.`,
      };
    }

    return {
      allowed: true,
      limit,
      used,
      remaining,
    };
  } catch (err) {
    console.warn("Quota check fallback warning:", err);
    // In case of transient database error, allow operation with standard remaining
    return {
      allowed: true,
      limit,
      used: 0,
      remaining: limit,
    };
  }
}

/**
 * Authoritatively records an AI generation event in the PostgreSQL usage ledger.
 */
export async function logGenerationUsage(input: {
  workspaceId: string;
  userId?: string;
  userName?: string;
  studio: UsageStudio;
  eventType: UsageEventType;
  provider: string;
  model: string;
  jobId?: string;
  creditsConsumed?: number;
  success?: boolean;
}): Promise<void> {
  const credits = input.creditsConsumed ?? (input.eventType === "VISUAL_RENDER" ? 20 : 5);

  try {
    // Idempotency guard: prevent duplicate usage deductions on retried or re-queued jobs
    if (input.jobId) {
      const existingEntries = await findUsageLedgerByWorkspaceId(input.workspaceId).catch(() => []);
      const alreadyBilled = existingEntries.some((e) => e.jobId === input.jobId);
      if (alreadyBilled) {
        return;
      }
    }

    await recordUsageEvent(
      input.workspaceId,
      input.userId || "usr_dev_primary",
      input.userName || "Development User",
      input.studio,
      input.eventType,
      credits,
      `AI Generation via ${input.provider} (${input.model})${input.success === false ? " [FAILED]" : ""}`,
      input.jobId
    );
  } catch (err) {
    console.warn("Notice: Failed to write generation usage to ledger:", err);
  }
}
