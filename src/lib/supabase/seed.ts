/**
 * Slots Studio — Supabase Idempotent Seeder
 *
 * Ensures development seed entities exist in the remote Supabase database:
 * - Development User (dev@slots.studio)
 * - Default Workspace (Slots Studio Workspace)
 * - Owner Membership
 * - Seed Project (proj_001 / SS-02481 Technical Training Jacket)
 * - Default Subscription (PRO_STUDIO)
 */

import { createAdminSupabaseClient } from "./server";

export const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";
export const DEV_WORKSPACE_ID = "00000000-0000-0000-0000-000000000002";
export const DEV_MEMBER_ID = "00000000-0000-0000-0000-000000000003";
export const DEV_PROJECT_ID = "00000000-0000-0000-0000-000000000010";

let isSeeded = false;
let seedingPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(): Promise<void> {
  // CRITICAL: Never run dev seed in production — dev IDs must never exist in live DB
  if (process.env.NODE_ENV === "production") return;

  if (isSeeded) return;
  if (seedingPromise) return seedingPromise;


  seedingPromise = (async () => {
    try {
      const supabase = createAdminSupabaseClient();

      // 1. Seed Dev User (public.users)
      await supabase.from("users").upsert(
        {
          id: DEV_USER_ID,
          email: "dev@slots.studio",
          full_name: "Development User",
        },
        { onConflict: "id" }
      );

      // 1b. Provision Dev User in Supabase GoTrue Auth (auth.users)
      try {
        await supabase.auth.admin.createUser({
          id: DEV_USER_ID,
          email: "dev@slots.studio",
          password: "Password123!",
          email_confirm: true,
          user_metadata: { full_name: "Development User" },
        });
      } catch {
        // Non-blocking if already exists
      }

    // 2. Seed Default Workspace
    await supabase.from("workspaces").upsert(
      {
        id: DEV_WORKSPACE_ID,
        name: "Slots Studio Workspace",
        slug: "slots-studio-workspace",
        owner_id: DEV_USER_ID,
      },
      { onConflict: "id" }
    );

    // 3. Seed Workspace Member (OWNER)
    await supabase.from("workspace_members").upsert(
      {
        id: DEV_MEMBER_ID,
        workspace_id: DEV_WORKSPACE_ID,
        user_id: DEV_USER_ID,
        role: "OWNER",
      },
      { onConflict: "id" }
    );

    // 4. Seed Canonical Project (proj_001 / SS-02481)
    await supabase.from("projects").upsert(
      {
        id: DEV_PROJECT_ID,
        workspace_id: DEV_WORKSPACE_ID,
        slot_id: "SS-02481",
        title: "Technical Training Jacket",
        status: "ACTIVE",
        metadata: {
          legacyId: "proj_001",
          description: "High-performance technical sportswear engineered for kinetic movement.",
          category: "PRODUCT",
          context: {
            targetAudience: "Active Urban Athletes",
            visualDirection: "Technical Clean Minimalist",
            notes: "Canonical production prototype slot.",
            tags: ["Apparel", "Sportswear", "Outerwear"],
            colorways: ["#000000", "#B7FF00", "#FFFFFF"],
          },
          createdBy: DEV_USER_ID,
        },
      },
      { onConflict: "id" }
    );

    // 5. Seed Subscription
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("workspace_id", DEV_WORKSPACE_ID)
      .maybeSingle();

    if (existingSub) {
      await supabase
        .from("subscriptions")
        .update({
          plan_tier: "PRO_STUDIO",
          status: "ACTIVE",
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        })
        .eq("id", existingSub.id);
    } else {
      await supabase
        .from("subscriptions")
        .insert({
          workspace_id: DEV_WORKSPACE_ID,
          plan_tier: "PRO_STUDIO",
          status: "ACTIVE",
          current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        });
    }

      isSeeded = true;
    } catch (error) {
      console.error("Database seed notice:", error);
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
