/**
 * Slots Studio — Supabase Utilities
 *
 * Helpers for UUID validation and legacy mock ID normalization.
 */

import { DEV_WORKSPACE_ID, DEV_USER_ID, DEV_PROJECT_ID } from "./seed";

export function isUuid(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function normalizeWorkspaceId(id?: string): string {
  if (!id || id === "ws_dev_seed" || id === "workspace-dev") {
    return DEV_WORKSPACE_ID;
  }
  if (isUuid(id)) {
    return id;
  }
  return DEV_WORKSPACE_ID;
}

export function normalizeUserId(id?: string): string {
  if (!id || id === "usr_dev_seed" || id === "user-dev") {
    return DEV_USER_ID;
  }
  if (isUuid(id)) {
    return id;
  }
  return DEV_USER_ID;
}

export function normalizeProjectId(id?: string): string | undefined {
  if (!id) return undefined;
  if (id === "proj_001") {
    return DEV_PROJECT_ID;
  }
  if (isUuid(id)) {
    return id;
  }
  return undefined;
}
