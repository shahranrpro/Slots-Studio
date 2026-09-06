/**
 * Slots Studio — Billing, Usage Ledger & Team Repository Store
 * 
 * DEVELOPMENT ONLY (IN-MEMORY MVP)
 * --------------------------------
 * This file serves as a durable boundary for Billing and Teams in the MVP.
 * Do not connect real external payment gateways or send real emails using this data.
 * The state is held in global memory across Next.js HMR reloads but will reset 
 * on process termination. When moving to production, replace this file with
 * a real database adapter and keep the API in service.ts the same.
 */


import {
  type SubscriptionPlan,
  type Subscription,
  type UsageLedgerEntry,
  type WorkspaceMemberDetailed,
  type WorkspaceInvitation,
  type SubscriptionPlanId,
  type BillingInterval,
} from "./types";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "FREE_STUDIO",
    name: "Creator Free",
    tagline: "For solo designers and exploratory product concepts.",
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyCredits: 100,
    slotLimit: 1,
    features: [
      "1 Active Project Slot",
      "100 AI Studio Credits / month",
      "Standard Resolution Visual Renders",
      "Basic Content Generation",
      "Community Support",
    ],
  },
  {
    id: "PRO_STUDIO",
    name: "Pro Studio",
    tagline: "For professional sportswear brands, agencies & design teams.",
    monthlyPrice: 79,
    annualPrice: 790, // ~17% annual discount
    monthlyCredits: 1500,
    slotLimit: 10,
    isPopular: true,
    features: [
      "10 Active Project Slots",
      "1,500 AI Studio Credits / month",
      "4K Ultra-Res Multi-Angle Visuals",
      "Full Multi-Channel Campaign Studio",
      "Manufacturing Tech Pack & BOM Export (.csv, .md, .json)",
      "Multi-Seat Team RBAC (Up to 5 seats)",
      "Priority Job Queue & Asset Archival",
    ],
  },
  {
    id: "ENTERPRISE_STUDIO",
    name: "Enterprise Studio",
    tagline: "For global apparel houses and high-throughput production labs.",
    monthlyPrice: 299,
    annualPrice: 2990,
    monthlyCredits: 10000,
    slotLimit: 100,
    features: [
      "Unlimited Project Slots",
      "10,000 AI Studio Credits / month",
      "Dedicated High-Throughput Render Cloud",
      "Custom Brand Style & Vector Fine-Tuning",
      "Unlimited Team Seats with Custom RBAC",
      "Direct ERP & Factory API Connectors",
      "Dedicated 24/7 Solution Architect",
    ],
  },
];

interface BillingStoreData {
  subscriptions: Record<string, Subscription>; // keyed by workspaceId
  usageLedger: Record<string, UsageLedgerEntry[]>; // keyed by workspaceId
  members: Record<string, WorkspaceMemberDetailed[]>; // keyed by workspaceId
  invitations: Record<string, WorkspaceInvitation[]>; // keyed by workspaceId
}

declare global {
  var __SLOTS_BILLING_STORE__: BillingStoreData | undefined;
}

function getStore(): BillingStoreData {
  if (!globalThis.__SLOTS_BILLING_STORE__) {
    globalThis.__SLOTS_BILLING_STORE__ = {
      subscriptions: {},
      usageLedger: {},
      members: {},
      invitations: {},
    };
  }
  return globalThis.__SLOTS_BILLING_STORE__;
}

/**
 * Initializes or provisions default billing, usage ledger, and team data for a workspace.
 */
export function ensureWorkspaceBillingProvisioned(workspaceId: string, ownerUserId: string, ownerName?: string, ownerEmail?: string) {
  const store = getStore();

  // 1. Subscription
  if (!store.subscriptions[workspaceId]) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    store.subscriptions[workspaceId] = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      workspaceId,
      planId: "PRO_STUDIO",
      status: "ACTIVE",
      billingInterval: "MONTHLY",
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  // 2. Members
  if (!store.members[workspaceId] || store.members[workspaceId].length === 0) {
    store.members[workspaceId] = [
      {
        id: `mem_owner_${workspaceId}`,
        workspaceId,
        userId: ownerUserId || "usr_dev_primary",
        name: ownerName || "Dev Lead",
        email: ownerEmail || "dev@slots.studio",
        role: "OWNER",
        joinedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: `mem_1_${workspaceId}`,
        workspaceId,
        userId: "usr_sarah_chen",
        name: "Sarah Chen",
        email: "sarah.chen@slots.studio",
        role: "EDITOR",
        joinedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: `mem_2_${workspaceId}`,
        workspaceId,
        userId: "usr_marcus_vance",
        name: "Marcus Vance",
        email: "marcus.vance@slots.studio",
        role: "REVIEWER",
        joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ];
  }

  // 3. Invitations
  if (!store.invitations[workspaceId] || store.invitations[workspaceId].length === 0) {
    store.invitations[workspaceId] = [
      {
        id: `inv_1_${workspaceId}`,
        workspaceId,
        email: "elena.rostova@slots.studio",
        role: "REVIEWER",
        status: "PENDING",
        token: "tok_inv_elena_98a7sd",
        invitedBy: ownerUserId || "usr_dev_primary",
        invitedByName: ownerName || "Dev Lead",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
      },
    ];
  }

  // 4. Usage Ledger
  if (!store.usageLedger[workspaceId] || store.usageLedger[workspaceId].length === 0) {
    let balance = 1500; // Starting monthly allowance
    const initialEvents: Omit<UsageLedgerEntry, "id" | "workspaceId" | "balanceAfter">[] = [
      {
        userId: ownerUserId || "usr_dev_primary",
        userName: ownerName || "Dev Lead",
        studio: "SYSTEM",
        eventType: "CREDIT_REFILL",
        description: "Monthly Pro Studio Credit Allocation (+1,500 Credits)",
        units: 1500,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        userId: ownerUserId || "usr_dev_primary",
        userName: ownerName || "Dev Lead",
        studio: "PRODUCT",
        eventType: "CONCEPT_GENERATION",
        description: "Synthesized 3 Technical Concept Briefs for Aero-Glide Running Anorak",
        units: -30,
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        userId: "usr_sarah_chen",
        userName: "Sarah Chen",
        studio: "VISUAL",
        eventType: "VISUAL_RENDER",
        description: "Rendered 4K Multi-Angle Visuals (Studio & Model Angles)",
        units: -60,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        userId: ownerUserId || "usr_dev_primary",
        userName: ownerName || "Dev Lead",
        studio: "CONTENT",
        eventType: "CONTENT_SYNTHESIS",
        description: "Generated Commercial Catalog Copy, E-Commerce Bullets & SEO Metadata",
        units: -20,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        userId: "usr_sarah_chen",
        userName: "Sarah Chen",
        studio: "CAMPAIGN",
        eventType: "CAMPAIGN_PACK",
        description: "Synthesized Multi-Channel Campaign Creative Matrix (6 Channels, 4 Ratios)",
        units: -80,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        userId: "usr_marcus_vance",
        userName: "Marcus Vance",
        studio: "PRODUCTION",
        eventType: "PRODUCTION_TECHPACK",
        description: "Generated Factory Bill of Materials (BOM), Seam Welds & XS-XXL Size Matrix",
        units: -40,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];

    const entries: UsageLedgerEntry[] = [];
    balance = 0; // build running balance
    for (const evt of initialEvents) {
      balance += evt.units;
      entries.push({
        ...evt,
        id: `usg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        workspaceId,
        balanceAfter: balance,
      });
    }

    store.usageLedger[workspaceId] = entries.reverse(); // Most recent first
  }
}

export function getSubscription(workspaceId: string): Subscription | null {
  return getStore().subscriptions[workspaceId] || null;
}

export function updateSubscription(workspaceId: string, planId: SubscriptionPlanId, billingInterval: BillingInterval): Subscription {
  const store = getStore();
  const existing = store.subscriptions[workspaceId];
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + (billingInterval === "ANNUAL" ? 365 : 30));

  const updated: Subscription = {
    id: existing?.id || `sub_${Date.now()}`,
    workspaceId,
    planId,
    status: "ACTIVE",
    billingInterval,
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: existing?.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };

  store.subscriptions[workspaceId] = updated;
  return updated;
}

export function getUsageLedger(workspaceId: string): UsageLedgerEntry[] {
  return getStore().usageLedger[workspaceId] || [];
}

export function addUsageLedgerEntry(entry: Omit<UsageLedgerEntry, "id" | "createdAt" | "balanceAfter">): UsageLedgerEntry {
  const store = getStore();
  if (!store.usageLedger[entry.workspaceId]) {
    store.usageLedger[entry.workspaceId] = [];
  }

  const list = store.usageLedger[entry.workspaceId];
  const previousBalance = list.length > 0 ? list[0].balanceAfter : 1500;
  const newBalance = Math.max(0, previousBalance + entry.units);

  const fullEntry: UsageLedgerEntry = {
    ...entry,
    id: `usg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    balanceAfter: newBalance,
    createdAt: new Date().toISOString(),
  };

  list.unshift(fullEntry); // Prepend so most recent is first
  return fullEntry;
}

export function getMembers(workspaceId: string): WorkspaceMemberDetailed[] {
  return getStore().members[workspaceId] || [];
}

export function addMember(member: WorkspaceMemberDetailed): void {
  const store = getStore();
  if (!store.members[member.workspaceId]) {
    store.members[member.workspaceId] = [];
  }
  store.members[member.workspaceId].push(member);
}

export function updateMember(workspaceId: string, memberId: string, updates: Partial<WorkspaceMemberDetailed>): WorkspaceMemberDetailed | null {
  const store = getStore();
  const list = store.members[workspaceId] || [];
  const idx = list.findIndex((m) => m.id === memberId);
  if (idx === -1) return null;

  list[idx] = { ...list[idx], ...updates };
  return list[idx];
}

export function removeMember(workspaceId: string, memberId: string): boolean {
  const store = getStore();
  const list = store.members[workspaceId] || [];
  const initialLen = list.length;
  store.members[workspaceId] = list.filter((m) => m.id !== memberId);
  return store.members[workspaceId].length < initialLen;
}

export function getInvitations(workspaceId: string): WorkspaceInvitation[] {
  return getStore().invitations[workspaceId] || [];
}

export function addInvitation(invitation: WorkspaceInvitation): void {
  const store = getStore();
  if (!store.invitations[invitation.workspaceId]) {
    store.invitations[invitation.workspaceId] = [];
  }
  store.invitations[invitation.workspaceId].unshift(invitation);
}

export function removeInvitation(workspaceId: string, invitationId: string): boolean {
  const store = getStore();
  const list = store.invitations[workspaceId] || [];
  const initialLen = list.length;
  store.invitations[workspaceId] = list.filter((i) => i.id !== invitationId);
  return store.invitations[workspaceId].length < initialLen;
}
