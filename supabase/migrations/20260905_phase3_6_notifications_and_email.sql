-- ====================================================================
-- Slots Studio — Phase 3.6 Real Email & Notifications Migration
-- ====================================================================
-- Extends public.notifications with workspace/job relation and idempotency.
-- Adds public.email_logs table for durable delivery tracking.
-- ====================================================================

-- 1. NOTIFICATIONS TABLE EXTENSIONS
-- Ensure base table exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add extended columns if they don't already exist
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'SYSTEM',
  ADD COLUMN IF NOT EXISTS link TEXT,
  ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES public.generation_jobs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Unique partial index for idempotency (worker retry deduplication)
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_idempotency 
  ON public.notifications (idempotency_key) 
  WHERE idempotency_key IS NOT NULL;

-- High-frequency indexes for user inbox and workspace queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON public.notifications (user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_workspace 
  ON public.notifications (workspace_id, created_at DESC);

-- 2. EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  template TEXT NOT NULL,
  subject TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ACCEPTED', 'DELIVERED', 'DEV_PREVIEW_MOCK', 'FAILED', 'RETRY_QUEUED')),
  provider_message_id TEXT,
  idempotency_key TEXT UNIQUE,
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient 
  ON public.email_logs (recipient_email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_workspace 
  ON public.email_logs (workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_status 
  ON public.email_logs (status);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Notifications RLS: Users can only see and update their own notifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their notifications') THEN
    CREATE POLICY "Users can view their notifications" ON public.notifications
      FOR SELECT USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their notifications') THEN
    CREATE POLICY "Users can update their notifications" ON public.notifications
      FOR UPDATE USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can insert notifications') THEN
    CREATE POLICY "Service role can insert notifications" ON public.notifications
      FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can delete notifications') THEN
    CREATE POLICY "Service role can delete notifications" ON public.notifications
      FOR DELETE USING (true);
  END IF;
END $$;

-- Email Logs RLS: Workspace members can view their workspace's email delivery logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view workspace email logs') THEN
    CREATE POLICY "Members can view workspace email logs" ON public.email_logs
      FOR SELECT USING (
        (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id))
        OR user_id = auth.uid()
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage email logs') THEN
    CREATE POLICY "Service role can manage email logs" ON public.email_logs
      FOR ALL USING (true);
  END IF;
END $$;
