/**
 * Slots Studio — Supabase Browser Client
 *
 * Official browser client using @supabase/ssr.
 * Safe for use in Client Components. Uses only the public publishable anon key.
 */

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
