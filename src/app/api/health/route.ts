import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { emailService } from "@/lib/email/service";
import { getTextProvider, getImageProvider } from "@/lib/ai/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbConnected = false;
  let dbLatencyMs = 0;
  let storageConnected = false;
  let storageBucketIsPrivate = false;
  let queuedJobsCount = 0;
  let runningJobsCount = 0;
  let staleJobsCount = 0;

  // 1. Check PostgreSQL Database Connectivity & Queue Telemetry
  try {
    const admin = createAdminSupabaseClient();
    const dbPingStart = Date.now();
    const { error: dbErr } = await admin
      .from("workspaces")
      .select("id")
      .limit(1);

    dbLatencyMs = Date.now() - dbPingStart;
    dbConnected = !dbErr;

    // Check Worker Queue Telemetry
    if (dbConnected) {
      const { data: activeJobs } = await admin
        .from("generation_jobs")
        .select("id, status, created_at, started_at")
        .in("status", ["QUEUED", "RUNNING"]);

      if (activeJobs) {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        for (const job of activeJobs) {
          if (job.status === "QUEUED") {
            queuedJobsCount++;
          } else if (job.status === "RUNNING") {
            runningJobsCount++;
            if (job.started_at && new Date(job.started_at).getTime() < fiveMinutesAgo) {
              staleJobsCount++;
            }
          }
        }
      }
    }

    // 2. Check Supabase Storage Connectivity (private-assets)
    const { data: bucket, error: storageErr } = await admin.storage.getBucket("private-assets");
    if (!storageErr && bucket) {
      storageConnected = true;
      storageBucketIsPrivate = bucket.public === false;
    } else {
      // Fallback: list buckets
      const { data: buckets } = await admin.storage.listBuckets();
      const privateBucket = buckets?.find((b) => b.name === "private-assets" || b.id === "private-assets");
      if (privateBucket) {
        storageConnected = true;
        storageBucketIsPrivate = privateBucket.public === false;
      }
    }
  } catch {
    dbConnected = false;
    storageConnected = false;
  }

  // 3. Email Provider Status (Zero secrets exposed)
  const emailProviderName = emailService.getActiveProviderName();
  const isEmailProduction = emailService.isProductionEmailConfigured();
  const emailFrom = process.env.EMAIL_FROM || "Slots Studio <onboarding@resend.dev>";

  // 4. AI Provider Status (Zero secrets exposed)
  const activeTextProvider = getTextProvider();
  const activeImageProvider = getImageProvider();
  const hasRealAiConfigured = Boolean(
    process.env.REPLICATE_API_KEY ||
      process.env.REPLICATE_API_TOKEN ||
      process.env.GEMINI_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.OPENAI_API_KEY
  );

  const isHealthy = dbConnected && storageConnected;
  const status = isHealthy ? "healthy" : "degraded";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      version: "0.1.0",
      responseTimeMs: Date.now() - startTime,
      database: {
        connected: dbConnected,
        latencyMs: dbLatencyMs,
      },
      storage: {
        connected: storageConnected,
        bucket: "private-assets",
        isPrivate: storageBucketIsPrivate,
      },
      worker: {
        queuedJobs: queuedJobsCount,
        runningJobs: runningJobsCount,
        staleJobs: staleJobsCount,
      },
      email: {
        provider: emailProviderName,
        isProductionConfigured: isEmailProduction,
        fromAddress: emailFrom,
      },
      ai: {
        textProvider: activeTextProvider.id,
        imageProvider: activeImageProvider.id,
        imageModel: activeImageProvider.defaultModel,
        isRealAiConfigured: hasRealAiConfigured,
      },
    },
    { status: statusCode }
  );
}
