/**
 * Slots Studio — Billing, Usage Ledger & Team RBAC Service
 */

import {
  type BillingSettingsState,
  type SubscriptionPlan,
  type SubscriptionPlanId,
  type BillingInterval,
  type UsageLedgerEntry,
  type UsageStudio,
  type CreditSummary,
  type WorkspaceMemberDetailed,
  type WorkspaceInvitation,
  type WorkspaceRole,
} from "./types";
import {
  SUBSCRIPTION_PLANS,
  ensureWorkspaceBillingProvisioned,
  getSubscription,
  updateSubscription,
  getUsageLedger,
  addUsageLedgerEntry,
  getMembers,
  updateMember,
  removeMember,
  getInvitations,
  addInvitation,
  removeInvitation,
} from "./store";
import {
  findSubscriptionByWorkspaceId,
  upsertSubscriptionRecord,
  logUsageEventDb,
  findUsageLedgerByWorkspaceId,
} from "@/lib/supabase/repositories/billingRepository";
import { ensureDatabaseSeeded } from "@/lib/supabase/seed";
import { emailService } from "@/lib/email/service";
import { notificationService } from "@/lib/notifications/service";
import { findUserByEmail } from "@/lib/auth/store";
import { findUserByEmail as findDbUserByEmail } from "@/lib/supabase/repositories/authRepository";
import { findWorkspaceById } from "@/lib/supabase/repositories/workspaceRepository";

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Calculates current credit allocation, consumption breakdown, and remaining balance.
 */
export function calculateCreditSummary(
  plan: SubscriptionPlan,
  ledger: UsageLedgerEntry[],
  currentPeriodEnd: string
): CreditSummary {
  let usedCredits = 0;
  const byStudio: Record<UsageStudio, number> = {
    PRODUCT: 0,
    VISUAL: 0,
    CONTENT: 0,
    CAMPAIGN: 0,
    PRODUCTION: 0,
    SYSTEM: 0,
  };

  for (const entry of ledger) {
    if (entry.units < 0) {
      const consumed = Math.abs(entry.units);
      usedCredits += consumed;
      byStudio[entry.studio] = (byStudio[entry.studio] || 0) + consumed;
    }
  }

  const totalMonthlyCredits = plan.monthlyCredits;
  const remainingCredits = Math.max(0, totalMonthlyCredits - usedCredits);
  const usagePercentage = Math.min(100, Math.round((usedCredits / totalMonthlyCredits) * 100));

  return {
    totalMonthlyCredits,
    usedCredits,
    remainingCredits,
    usagePercentage,
    resetDate: currentPeriodEnd,
    byStudio,
  };
}

/**
 * Retrieves the complete Billing, Usage, and Team state for a workspace.
 */
export async function getWorkspaceBillingState(
  workspaceId: string,
  currentUserId: string,
  userName?: string,
  userEmail?: string,
  workspaceName?: string
): Promise<ServiceResult<BillingSettingsState>> {
  if (!workspaceId) {
    return { success: false, error: "Workspace ID is required." };
  }

  await ensureDatabaseSeeded();
  ensureWorkspaceBillingProvisioned(workspaceId, currentUserId, userName, userEmail);

  let subscription = getSubscription(workspaceId);
  try {
    const dbSub = await findSubscriptionByWorkspaceId(workspaceId);
    if (dbSub) {
      subscription = dbSub;
      updateSubscription(workspaceId, dbSub.planId, dbSub.billingInterval);
    }
  } catch (err) {
    console.warn("DB subscription lookup notice:", err);
  }

  if (!subscription) {
    return { success: false, error: "Subscription not found." };
  }

  const currentPlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === subscription.planId) || SUBSCRIPTION_PLANS[0];

  const storeLedger = getUsageLedger(workspaceId);
  let dbLedger: UsageLedgerEntry[] = [];
  try {
    dbLedger = await findUsageLedgerByWorkspaceId(workspaceId);
  } catch (err) {
    console.warn("DB usage ledger notice:", err);
  }

  const ledgerMap = new Map<string, UsageLedgerEntry>();
  for (const item of storeLedger) ledgerMap.set(item.id, item);
  for (const item of dbLedger) ledgerMap.set(item.id, item);
  const ledger = Array.from(ledgerMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const members = getMembers(workspaceId);
  const invitations = getInvitations(workspaceId);

  const currentMember = members.find((m) => m.userId === currentUserId);
  const currentUserRole: WorkspaceRole = currentMember?.role || "OWNER";

  const credits = calculateCreditSummary(currentPlan, ledger, subscription.currentPeriodEnd);

  return {
    success: true,
    data: {
      workspaceId,
      workspaceName: workspaceName || "Default Studio Workspace",
      subscription,
      currentPlan,
      availablePlans: SUBSCRIPTION_PLANS,
      credits,
      recentUsage: ledger.slice(0, 50),
      members,
      invitations,
      currentUserId,
      currentUserRole,
    },
  };
}

/**
 * Changes/upgrades/downgrades the workspace subscription plan.
 */
export async function changeSubscriptionPlan(
  workspaceId: string,
  userId: string,
  userName: string,
  planId: SubscriptionPlanId,
  billingInterval: BillingInterval
): Promise<ServiceResult<{ plan: SubscriptionPlan; credits: CreditSummary }>> {
  if (!workspaceId) return { success: false, error: "Workspace ID is required." };

  const targetPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
  if (!targetPlan) {
    return { success: false, error: "Invalid subscription plan selected." };
  }

  const updatedSubscription = updateSubscription(workspaceId, planId, billingInterval);
  await upsertSubscriptionRecord(workspaceId, planId).catch((err) =>
    console.warn("DB upsert subscription notice:", err)
  );

  // Log usage upgrade event
  const entry = addUsageLedgerEntry({
    workspaceId,
    userId,
    userName: userName || "Operator",
    studio: "SYSTEM",
    eventType: "PLAN_UPGRADE",
    description: `Subscription changed to ${targetPlan.name} (${billingInterval.toLowerCase()})`,
    units: targetPlan.monthlyCredits,
  });

  await logUsageEventDb(entry).catch((err) =>
    console.warn("DB log usage upgrade notice:", err)
  );

  const ledger = getUsageLedger(workspaceId);
  const credits = calculateCreditSummary(targetPlan, ledger, updatedSubscription.currentPeriodEnd);

  return {
    success: true,
    data: {
      plan: targetPlan,
      credits,
    },
  };
}

/**
 * Records an AI credit consumption event in the usage ledger.
 */
export async function recordUsageEvent(
  workspaceId: string,
  userId: string,
  userName: string,
  studio: UsageStudio,
  eventType: UsageLedgerEntry["eventType"],
  units: number,
  description: string,
  jobId?: string
): Promise<ServiceResult<UsageLedgerEntry>> {
  if (!workspaceId) return { success: false, error: "Workspace ID is required." };

  const entry = addUsageLedgerEntry({
    workspaceId,
    userId,
    userName,
    studio,
    eventType,
    description,
    units: -Math.abs(units), // ensure negative for deduction
    jobId,
  });

  await logUsageEventDb(entry).catch((err) =>
    console.warn("DB log usage consumption notice:", err)
  );

  return { success: true, data: entry };
}

/**
 * Invites a new team member to the workspace.
 */
export async function inviteTeamMember(
  workspaceId: string,
  invitedByUserId: string,
  invitedByName: string,
  email: string,
  role: WorkspaceRole
): Promise<ServiceResult<WorkspaceInvitation>> {
  if (!workspaceId) return { success: false, error: "Workspace ID is required." };
  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email address is required." };
  }

  const existingMembers = getMembers(workspaceId);
  if (existingMembers.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "User is already an active member of this workspace." };
  }

  const existingInvites = getInvitations(workspaceId);
  if (existingInvites.some((i) => i.email.toLowerCase() === email.toLowerCase() && i.status === "PENDING")) {
    return { success: false, error: "An active invitation has already been sent to this email." };
  }

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitation: WorkspaceInvitation = {
    id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    workspaceId,
    email: email.trim().toLowerCase(),
    role,
    status: "PENDING",
    token: `tok_${Math.random().toString(36).slice(2, 12)}`,
    invitedBy: invitedByUserId,
    invitedByName: invitedByName || "Workspace Member",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  addInvitation(invitation);

  // Dispatch workspace invitation email & in-app notification (asynchronous)
  setTimeout(async () => {
    try {
      const ws = await findWorkspaceById(workspaceId);
      const wsName = ws?.name || "Slots Studio Workspace";
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/signup?inviteToken=${invitation.token}&email=${encodeURIComponent(invitation.email)}`;

      // 1. Send transactional invite email
      await emailService.sendWorkspaceInvite(
        {
          to: invitation.email,
          inviteUrl,
          workspaceName: wsName,
          inviterName: invitedByName || "Workspace Administrator",
          role,
        },
        {
          workspaceId,
          idempotencyKey: `ws_invite_email_${invitation.id}`,
        }
      );

      // 2. If the invited user already exists, create in-app notification
      const existingUser = (await findUserByEmail(invitation.email)) || (await findDbUserByEmail(invitation.email));
      if (existingUser) {
        await notificationService.notifyWorkspaceInvite({
          invitedUserId: existingUser.id,
          workspaceId,
          workspaceName: wsName,
          inviterName: invitedByName || "Workspace Administrator",
          role,
        });
      }
    } catch (err) {
      console.warn("Notice: Workspace invitation notification dispatch notice:", err);
    }
  }, 0);

  return { success: true, data: invitation };
}

/**
 * Updates an existing member's role.
 */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: WorkspaceRole
): Promise<ServiceResult<WorkspaceMemberDetailed>> {
  if (!workspaceId || !memberId) return { success: false, error: "Workspace and member ID required." };

  const members = getMembers(workspaceId);
  const target = members.find((m) => m.id === memberId);
  if (!target) return { success: false, error: "Member not found." };

  if (target.role === "OWNER" && newRole !== "OWNER") {
    // Check if there are other owners
    const ownerCount = members.filter((m) => m.role === "OWNER").length;
    if (ownerCount <= 1) {
      return { success: false, error: "Cannot demote the primary workspace owner." };
    }
  }

  const updated = updateMember(workspaceId, memberId, { role: newRole });
  if (!updated) return { success: false, error: "Failed to update member role." };

  return { success: true, data: updated };
}

/**
 * Removes a member from the workspace.
 */
export async function removeTeamMember(
  workspaceId: string,
  memberId: string
): Promise<ServiceResult<{ memberId: string }>> {
  if (!workspaceId || !memberId) return { success: false, error: "Workspace and member ID required." };

  const members = getMembers(workspaceId);
  const target = members.find((m) => m.id === memberId);
  if (!target) return { success: false, error: "Member not found." };

  if (target.role === "OWNER") {
    return { success: false, error: "Cannot remove the workspace owner." };
  }

  const removed = removeMember(workspaceId, memberId);
  if (!removed) return { success: false, error: "Failed to remove member." };

  return { success: true, data: { memberId } };
}

/**
 * Revokes a pending workspace invitation.
 */
export async function revokeInvitation(
  workspaceId: string,
  invitationId: string
): Promise<ServiceResult<{ invitationId: string }>> {
  if (!workspaceId || !invitationId) return { success: false, error: "Workspace and invitation ID required." };

  const removed = removeInvitation(workspaceId, invitationId);
  if (!removed) return { success: false, error: "Invitation not found or already revoked." };

  return { success: true, data: { invitationId } };
}
