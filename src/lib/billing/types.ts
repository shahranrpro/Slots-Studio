/**
 * Slots Studio — Billing, Usage Ledger & Team RBAC Domain Types
 * (Section 7.3, 7.17, 7.18, and TASK 19 in Master Product Specification)
 */

export type SubscriptionPlanId = "FREE_STUDIO" | "PRO_STUDIO" | "ENTERPRISE_STUDIO";

export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "TRIALING" | "CANCELED";

export type BillingInterval = "MONTHLY" | "ANNUAL";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyCredits: number;
  slotLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UsageEventType =
  | "CONCEPT_GENERATION"
  | "VISUAL_RENDER"
  | "CONTENT_SYNTHESIS"
  | "CAMPAIGN_PACK"
  | "PRODUCTION_TECHPACK"
  | "CREDIT_REFILL"
  | "PLAN_UPGRADE";

export type UsageStudio =
  | "PRODUCT"
  | "VISUAL"
  | "CONTENT"
  | "CAMPAIGN"
  | "PRODUCTION"
  | "SYSTEM";

export interface UsageLedgerEntry {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  jobId?: string;
  studio: UsageStudio;
  eventType: UsageEventType;
  description: string;
  units: number; // Negative for consumption, positive for credit additions
  balanceAfter: number;
  createdAt: string;
}

export interface CreditSummary {
  totalMonthlyCredits: number;
  usedCredits: number;
  remainingCredits: number;
  usagePercentage: number;
  resetDate: string;
  byStudio: Record<UsageStudio, number>;
}

export type WorkspaceRole = "OWNER" | "ADMIN" | "EDITOR" | "REVIEWER" | "VIEWER";

export interface WorkspaceMemberDetailed {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  status: InvitationStatus;
  token: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: string;
  expiresAt: string;
}

export interface BillingSettingsState {
  workspaceId: string;
  workspaceName: string;
  subscription: Subscription;
  currentPlan: SubscriptionPlan;
  availablePlans: SubscriptionPlan[];
  credits: CreditSummary;
  recentUsage: UsageLedgerEntry[];
  members: WorkspaceMemberDetailed[];
  invitations: WorkspaceInvitation[];
  currentUserId: string;
  currentUserRole: WorkspaceRole;
}

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceRole;
}

export interface UpdateMemberRoleRequest {
  memberId: string;
  role: WorkspaceRole;
}

export interface ChangePlanRequest {
  planId: SubscriptionPlanId;
  billingInterval: BillingInterval;
}
