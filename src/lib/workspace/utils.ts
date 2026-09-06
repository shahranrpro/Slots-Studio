/**
 * Slots Studio — Workspace Client-Safe Utilities
 *
 * Pure utility functions safe for execution in both browser (Client Components)
 * and server environments without pulling in Node-only crypto/database modules.
 */

/**
 * Normalizes a workspace name into a URL-safe slug.
 */
export function generateWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
