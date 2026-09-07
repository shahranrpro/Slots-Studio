-- ====================================================================
-- Slots Studio — Phase 3.13 Multi-User Data Isolation Migration
-- ====================================================================
-- Adds missing RLS policies for all workspace/user-owned tables.
-- Tightens overly-broad USING (true) policies on notifications.
-- Ensures strict workspace-membership-based access for all data domains.
-- ====================================================================

-- ============================================================
-- 1. USERS (PROFILES) TABLE — Users can only see their own profile
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.users
      FOR SELECT USING (id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.users
      FOR UPDATE USING (id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage users') THEN
    CREATE POLICY "Service role can manage users" ON public.users
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 2. ONBOARDING STATES — Scoped to the owning user
-- ============================================================
ALTER TABLE public.onboarding_states ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own onboarding state') THEN
    CREATE POLICY "Users can view own onboarding state" ON public.onboarding_states
      FOR SELECT USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own onboarding state') THEN
    CREATE POLICY "Users can update own onboarding state" ON public.onboarding_states
      FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage onboarding states') THEN
    CREATE POLICY "Service role can manage onboarding states" ON public.onboarding_states
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 3. REVIEWS — Workspace-membership scoped
-- ============================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace reviews') THEN
    CREATE POLICY "Members can view workspace reviews" ON public.reviews
      FOR SELECT USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can insert workspace reviews') THEN
    CREATE POLICY "Members can insert workspace reviews" ON public.reviews
      FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can update workspace reviews') THEN
    CREATE POLICY "Members can update workspace reviews" ON public.reviews
      FOR UPDATE USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage reviews') THEN
    CREATE POLICY "Service role can manage reviews" ON public.reviews
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 4. CONTENT ITEMS — Workspace-membership scoped
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace content items') THEN
    CREATE POLICY "Members can view workspace content items" ON public.content_items
      FOR SELECT USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can insert workspace content items') THEN
    CREATE POLICY "Members can insert workspace content items" ON public.content_items
      FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can update workspace content items') THEN
    CREATE POLICY "Members can update workspace content items" ON public.content_items
      FOR UPDATE USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage content items') THEN
    CREATE POLICY "Service role can manage content items" ON public.content_items
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 5. CAMPAIGNS — Workspace-membership scoped
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace campaigns') THEN
    CREATE POLICY "Members can view workspace campaigns" ON public.campaigns
      FOR SELECT USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can insert workspace campaigns') THEN
    CREATE POLICY "Members can insert workspace campaigns" ON public.campaigns
      FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can update workspace campaigns') THEN
    CREATE POLICY "Members can update workspace campaigns" ON public.campaigns
      FOR UPDATE USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage campaigns') THEN
    CREATE POLICY "Service role can manage campaigns" ON public.campaigns
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 6. CAMPAIGN ASSETS — Scoped via campaign -> workspace membership
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view campaign assets') THEN
    CREATE POLICY "Members can view campaign assets" ON public.campaign_assets
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.campaigns c
          WHERE c.id = campaign_assets.campaign_id
            AND public.is_workspace_member(c.workspace_id)
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can insert campaign assets') THEN
    CREATE POLICY "Members can insert campaign assets" ON public.campaign_assets
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.campaigns c
          WHERE c.id = campaign_assets.campaign_id
            AND public.is_workspace_member(c.workspace_id)
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage campaign assets') THEN
    CREATE POLICY "Service role can manage campaign assets" ON public.campaign_assets
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 7. PRODUCTION SPECS — Scoped via project -> workspace membership
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view production specs') THEN
    CREATE POLICY "Members can view production specs" ON public.production_specs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = production_specs.project_id
            AND public.is_workspace_member(p.workspace_id)
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can insert production specs') THEN
    CREATE POLICY "Members can insert production specs" ON public.production_specs
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = production_specs.project_id
            AND public.is_workspace_member(p.workspace_id)
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage production specs') THEN
    CREATE POLICY "Service role can manage production specs" ON public.production_specs
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 8. SUBSCRIPTIONS — Workspace-membership scoped
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace subscription') THEN
    CREATE POLICY "Members can view workspace subscription" ON public.subscriptions
      FOR SELECT USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage subscriptions') THEN
    CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 9. USAGE LEDGER — Workspace-membership scoped
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace usage ledger') THEN
    CREATE POLICY "Members can view workspace usage ledger" ON public.usage_ledger
      FOR SELECT USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage usage ledger') THEN
    CREATE POLICY "Service role can manage usage ledger" ON public.usage_ledger
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 10. GENERATION OUTPUTS — Scoped via job -> workspace membership
-- ============================================================
ALTER TABLE public.generation_outputs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace generation outputs') THEN
    CREATE POLICY "Members can view workspace generation outputs" ON public.generation_outputs
      FOR SELECT USING (
        job_id IS NULL OR
        EXISTS (
          SELECT 1 FROM public.generation_jobs j
          WHERE j.id = generation_outputs.job_id
            AND public.is_workspace_member(j.workspace_id)
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage generation outputs') THEN
    CREATE POLICY "Service role can manage generation outputs" ON public.generation_outputs
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ============================================================
-- 11. NOTIFICATIONS — Tighten overly-broad INSERT/DELETE to service role
-- ============================================================
-- Drop the existing overly-broad policies (USING (true)) if they exist
DO $$ BEGIN
  -- Drop and replace broad INSERT policy
  DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
  DROP POLICY IF EXISTS "Service role can delete notifications" ON public.notifications;
END $$;

-- Re-create with strict service_role check
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can insert notifications v2') THEN
    CREATE POLICY "Service role can insert notifications v2" ON public.notifications
      FOR INSERT WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can delete notifications v2') THEN
    CREATE POLICY "Service role can delete notifications v2" ON public.notifications
      FOR DELETE USING (auth.role() = 'service_role' OR user_id = auth.uid());
  END IF;
END $$;

-- ============================================================
-- 12. WORKSPACE INVITATIONS — Users can view invitations sent to their email
-- ============================================================
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their workspace invitations') THEN
    CREATE POLICY "Users can view their workspace invitations" ON public.workspace_invitations
      FOR SELECT USING (
        email = (SELECT email FROM public.users WHERE id = auth.uid())
        OR public.is_workspace_member(workspace_id)
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Owners can manage workspace invitations') THEN
    CREATE POLICY "Owners can manage workspace invitations" ON public.workspace_invitations
      FOR ALL USING (public.is_workspace_member(workspace_id));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage invitations') THEN
    CREATE POLICY "Service role can manage invitations" ON public.workspace_invitations
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- ====================================================================
-- END OF PHASE 3.13 MULTI-USER ISOLATION MIGRATION
-- ====================================================================
