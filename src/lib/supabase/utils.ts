/**
 * Slots Studio — Supabase Utilities
 *
 * Helpers for UUID validation and safe ID normalization.
 *
 * SECURITY NOTE:
 * Production builds MUST NOT silently remap unknown workspace/user IDs to shared
 * dev seed constants. Any code path that reaches a repository function without a
 * valid workspace UUID is a bug and should fail fast, NOT silently read/write
 * another user's data.
 */

import { DEV_WORKSPACE_ID, DEV_USER_ID, DEV_PROJECT_ID } from "./seed";

export function isUuid(str: unknown): boolean {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Normalizes a workspace ID for database queries.
 *
 * - In development: maps known dev sentinel strings to DEV_WORKSPACE_ID.
 * - In all environments: if the ID is a valid UUID, returns it as-is.
 * - NEVER falls back to DEV_WORKSPACE_ID for an unknown/missing ID in production,
 *   as that would silently expose shared dev data to production users.
 *
 * @throws Error in production if id is falsy or not a UUID (caller bug).
 */
export function normalizeWorkspaceId(id?: string): string {
  // Known dev sentinel strings — only remap in development
  if (id === "ws_dev_seed" || id === "workspace-dev") {
    if (process.env.NODE_ENV !== "production") {
      return DEV_WORKSPACE_ID;
    }
    throw new Error(
      `[SECURITY] normalizeWorkspaceId received dev sentinel ID "${id}" in production. ` +
        "This indicates a missing workspace context — check auth/workspace resolution."
    );
  }

  if (isUuid(id)) {
    return id as string;
  }

  // Missing or non-UUID ID
  if (process.env.NODE_ENV !== "production") {
    // In development, fall back gracefully so dev tooling still works
    return DEV_WORKSPACE_ID;
  }
  throw new Error(
    `[SECURITY] normalizeWorkspaceId received invalid ID "${id ?? "(empty)"}" in production. ` +
      "Workspace ID must be a valid UUID derived from the authenticated session."
  );
}

/**
 * Normalizes a user ID for database queries.
 *
 * Same security rules as normalizeWorkspaceId.
 */
export function normalizeUserId(id?: string): string {
  if (id === "usr_dev_seed" || id === "user-dev") {
    if (process.env.NODE_ENV !== "production") {
      return DEV_USER_ID;
    }
    throw new Error(
      `[SECURITY] normalizeUserId received dev sentinel ID "${id}" in production. ` +
        "This indicates missing user context — check auth/session resolution."
    );
  }

  if (isUuid(id)) {
    return id as string;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_USER_ID;
  }
  throw new Error(
    `[SECURITY] normalizeUserId received invalid ID "${id ?? "(empty)"}" in production. ` +
      "User ID must be the authenticated Supabase auth.uid()."
  );
}

/**
 * Normalizes a project ID for database queries.
 * Returns undefined if the ID is not a valid UUID (optional FK — never throws).
 */
export function normalizeProjectId(id?: string): string | undefined {
  if (!id) return undefined;
  // Legacy dev sentinel — only in development
  if (id === "proj_001" && process.env.NODE_ENV !== "production") {
    return DEV_PROJECT_ID;
  }
  if (isUuid(id)) {
    return id;
  }
  return undefined;
}
