/**
 * Slots Studio — Supabase Server & Admin Client Utilities
 *
 * Server-only modules. Never import or bundle into client components.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Server client honoring user session cookies for authenticated requests.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Trusted Admin Client using the Supabase Service Role Key.
 * MUST only be called from verified server-side service boundaries where
 * session authentication and RBAC authorization have already been checked.
 */
export function createAdminSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Ensure it is defined in .env.local for server operations."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
