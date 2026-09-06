import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { processJob } from "@/lib/jobs/worker";
import { recoverStaleJobs } from "@/lib/supabase/repositories/jobRepository";

export const dynamic = "force-dynamic";

/**
 * Slots Studio — Serverless Worker Cron Endpoint
 *
 * Invoked by Vercel Cron or external schedulers (e.g., GitHub Actions, cron job)
 * to scavenge and drain pending QUEUED background jobs in serverless hosting environments.
 */
export async function GET(request: Request) {
  // 1. Security: Authenticate via CRON_SECRET or Vercel Cron header if configured in production
  const authHeader = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Scavenge and recover stale jobs (> 5 minutes in RUNNING state)
    const recovered = await recoverStaleJobs(5);

    // 3. Query pending QUEUED jobs (FIFO ordering)
    const supabase = createAdminSupabaseClient();
    const { data: candidates, error } = await supabase
      .from("generation_jobs")
      .select("id, workspace_id, status")
      .eq("status", "QUEUED")
      .order("created_at", { ascending: true })
      .limit(5);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const processedJobs: Array<{ id: string; success: boolean; status?: string; error?: string }> = [];

    if (candidates && candidates.length > 0) {
      for (const candidate of candidates) {
        try {
          const result = await processJob(candidate.id, candidate.workspace_id);
          processedJobs.push({
            id: candidate.id,
            success: result.success,
            status: result.status,
            error: result.error,
          });
        } catch (err) {
          processedJobs.push({
            id: candidate.id,
            success: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      recoveredStaleJobs: recovered,
      processedCount: processedJobs.length,
      jobs: processedJobs,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal worker cron execution failure",
      },
      { status: 500 }
    );
  }
}
