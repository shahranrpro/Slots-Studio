-- ====================================================================
-- Slots Studio — Phase 3.4 Background Jobs & Worker Engine Migration
-- ====================================================================
-- Documents and formalizes the background job queue, worker state machine,
-- and atomic claim indexes for public.generation_jobs.
-- ====================================================================

-- 1. Ensure status check constraint covers all required lifecycle states
-- Allowed states: QUEUED, RUNNING, REVIEW, COMPLETED, FAILED, CANCELLED

-- 2. Helpful partial indexes for worker queue polling & stale job recovery
CREATE INDEX IF NOT EXISTS idx_generation_jobs_queued_asc 
  ON public.generation_jobs (created_at ASC) 
  WHERE status = 'QUEUED';

CREATE INDEX IF NOT EXISTS idx_generation_jobs_running 
  ON public.generation_jobs (created_at ASC) 
  WHERE status = 'RUNNING';

CREATE INDEX IF NOT EXISTS idx_generation_jobs_workspace 
  ON public.generation_jobs (workspace_id, status, created_at DESC);

-- 3. Comments describing worker payload contracts inside parameters JSONB:
-- parameters.claimedAt: ISO timestamp when a worker claimed the job
-- parameters.claimedBy: Worker node or instance identifier
-- parameters.startedAt: ISO timestamp when processing began
-- parameters.completedAt: ISO timestamp when terminal state reached
-- parameters.retryCount: Number of retries attempted (default 0)
-- parameters.maxRetries: Maximum retries allowed (default 3)
-- parameters.errorCode: Categorized machine-readable error code
-- parameters.studioPayload: Original studio generation request payload
