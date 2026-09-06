/**
 * Slots Studio — Email Delivery Log Store
 *
 * Provides persistent & resilient tracking of all outgoing transactional emails:
 * - Writes to Supabase public.email_logs when table is available
 * - Maintains an in-memory queue/fallback for resilient local operations
 * - Idempotency lookup by key
 */

import { type EmailLogEntry } from "./types";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

// Fallback in-memory ledger
const memoryEmailLogs = new Map<string, EmailLogEntry>();
const idempotencyIndex = new Map<string, string>(); // idempotencyKey -> logId

export async function logEmailDelivery(entry: EmailLogEntry): Promise<void> {
  // 1. Store in memory cache
  memoryEmailLogs.set(entry.id, entry);
  if (entry.idempotencyKey) {
    idempotencyIndex.set(entry.idempotencyKey, entry.id);
  }

  // 2. Persist to Supabase if email_logs table is available
  try {
    const supabase = createAdminSupabaseClient();
    await supabase.from("email_logs").insert({
      id: entry.id,
      workspace_id: entry.workspaceId || null,
      user_id: entry.userId || null,
      recipient_email: entry.recipientEmail,
      template: entry.template,
      subject: entry.subject,
      provider: entry.provider,
      status: entry.status,
      provider_message_id: entry.providerMessageId || null,
      idempotency_key: entry.idempotencyKey || null,
      retry_count: entry.retryCount,
      max_retries: entry.maxRetries,
      error_message: entry.errorMessage || null,
      metadata: entry.metadata || {},
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    });
  } catch {
    // Non-blocking if table is not yet migrated
  }
}

export async function findEmailLogByIdempotencyKey(
  key: string
): Promise<EmailLogEntry | null> {
  // Check memory
  const logId = idempotencyIndex.get(key);
  if (logId && memoryEmailLogs.has(logId)) {
    return memoryEmailLogs.get(logId)!;
  }

  // Check Supabase
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .eq("idempotency_key", key)
      .maybeSingle();

    if (!error && data) {
      const entry: EmailLogEntry = {
        id: data.id,
        workspaceId: data.workspace_id,
        userId: data.user_id,
        recipientEmail: data.recipient_email,
        template: data.template,
        subject: data.subject,
        provider: data.provider,
        status: data.status,
        providerMessageId: data.provider_message_id,
        idempotencyKey: data.idempotency_key,
        retryCount: data.retry_count ?? 0,
        maxRetries: data.max_retries ?? 3,
        errorMessage: data.error_message,
        metadata: data.metadata || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      memoryEmailLogs.set(entry.id, entry);
      idempotencyIndex.set(key, entry.id);
      return entry;
    }
  } catch {
    // Database schema fallback
  }

  return null;
}

export async function getRecentEmailLogs(limit = 50): Promise<EmailLogEntry[]> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data.map((d) => ({
        id: d.id,
        workspaceId: d.workspace_id,
        userId: d.user_id,
        recipientEmail: d.recipient_email,
        template: d.template,
        subject: d.subject,
        provider: d.provider,
        status: d.status,
        providerMessageId: d.provider_message_id,
        idempotencyKey: d.idempotency_key,
        retryCount: d.retry_count,
        maxRetries: d.max_retries,
        errorMessage: d.error_message,
        metadata: d.metadata,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  } catch {
    // Return memory fallback
  }

  return Array.from(memoryEmailLogs.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
