import { createAdminSupabaseClient } from "../server";
import {
  type Subscription,
  type SubscriptionPlanId,
  type UsageLedgerEntry,
} from "@/lib/billing/types";
import { normalizeWorkspaceId, normalizeUserId } from "../utils";

export async function findSubscriptionByWorkspaceId(
  workspaceId: string
): Promise<Subscription | null> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("workspace_id", wsId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    workspaceId: data.workspace_id,
    planId: (data.plan_tier as SubscriptionPlanId) || "PRO_STUDIO",
    status: (data.status as Subscription["status"]) || "ACTIVE",
    billingInterval: "MONTHLY",
    currentPeriodStart: data.created_at,
    currentPeriodEnd: data.current_period_end || new Date(Date.now() + 30 * 86400000).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  };
}

export async function upsertSubscriptionRecord(
  workspaceId: string,
  planId: SubscriptionPlanId
): Promise<Subscription> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);
  const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString();

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("workspace_id", wsId)
    .maybeSingle();

  let data, error;
  if (existing) {
    const res = await supabase
      .from("subscriptions")
      .update({
        plan_tier: planId,
        status: "ACTIVE",
        current_period_end: nextMonth,
      })
      .eq("id", existing.id)
      .select()
      .single();
    data = res.data;
    error = res.error;
  } else {
    const res = await supabase
      .from("subscriptions")
      .insert({
        workspace_id: wsId,
        plan_tier: planId,
        status: "ACTIVE",
        current_period_end: nextMonth,
      })
      .select()
      .single();
    data = res.data;
    error = res.error;
  }

  if (error || !data) {
    throw new Error(`Failed to update subscription in database: ${error?.message}`);
  }

  return {
    id: data.id,
    workspaceId: data.workspace_id,
    planId: (data.plan_tier as SubscriptionPlanId) || planId,
    status: "ACTIVE",
    billingInterval: "MONTHLY",
    currentPeriodStart: data.created_at,
    currentPeriodEnd: data.current_period_end,
    cancelAtPeriodEnd: false,
    createdAt: data.created_at,
    updatedAt: data.created_at,
  };
}

export async function logUsageEventDb(
  entry: Omit<UsageLedgerEntry, "id" | "createdAt">
): Promise<UsageLedgerEntry> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(entry.workspaceId);
  const userId = normalizeUserId(entry.userId);

  const payload = {
    workspace_id: wsId,
    event_type: entry.eventType,
    credits_consumed: Math.abs(entry.units),
    details: {
      userId,
      userName: entry.userName,
      jobId: entry.jobId,
      studio: entry.studio,
      description: entry.description,
      units: entry.units,
      balanceAfter: entry.balanceAfter,
    },
  };

  const { data } = await supabase
    .from("usage_ledger")
    .insert(payload)
    .select()
    .single();

  const now = new Date().toISOString();
  return {
    id: data?.id || `use_${Date.now()}`,
    workspaceId: entry.workspaceId,
    userId: entry.userId,
    userName: entry.userName,
    jobId: entry.jobId,
    studio: entry.studio,
    eventType: entry.eventType,
    description: entry.description,
    units: entry.units,
    balanceAfter: entry.balanceAfter,
    createdAt: data?.created_at || now,
  };
}

export async function findUsageLedgerByWorkspaceId(
  workspaceId: string
): Promise<UsageLedgerEntry[]> {
  const supabase = createAdminSupabaseClient();
  const wsId = normalizeWorkspaceId(workspaceId);

  const { data: rows, error } = await supabase
    .from("usage_ledger")
    .select("*")
    .eq("workspace_id", wsId)
    .order("created_at", { ascending: false });

  if (error || !rows) return [];

  return rows.map((r) => ({
    id: r.id,
    workspaceId: r.workspace_id,
    userId: (r.details as Record<string, unknown>)?.userId as string || "system",
    userName: (r.details as Record<string, unknown>)?.userName as string || "Development User",
    jobId: (r.details as Record<string, unknown>)?.jobId as string | undefined,
    studio: ((r.details as Record<string, unknown>)?.studio as UsageLedgerEntry["studio"]) || "PRODUCT",
    eventType: r.event_type as UsageLedgerEntry["eventType"],
    description: ((r.details as Record<string, unknown>)?.description as string) || r.event_type,
    units: (r.details as Record<string, unknown>)?.units !== undefined
      ? ((r.details as Record<string, unknown>).units as number)
      : -r.credits_consumed,
    balanceAfter: ((r.details as Record<string, unknown>)?.balanceAfter as number) || 1270,
    createdAt: r.created_at,
  }));
}
