import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { uploadFileToStorage } from "@/lib/storage";
import { createAsset } from "@/lib/assets/service";
import { logGenerationUsage } from "@/lib/ai/quota";
import { notificationService } from "@/lib/notifications/service";

export const dynamic = "force-dynamic";

/**
 * Slots Studio — Replicate Webhook Endpoint
 * 
 * Receives asynchronous prediction completion events from Replicate.
 * - Authenticates using HMAC-SHA256 signature verification (REPLICATE_WEBHOOK_SECRET).
 * - Idempotent: Skips processing if job already reached a terminal state.
 * - Downloads binary server-side and stores in private-assets Supabase Storage.
 * - Prevents double charging and duplicate asset records.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.REPLICATE_WEBHOOK_SECRET;

  // 1. Signature Verification (if secret configured)
  const rawBody = await request.text();
  const signature = request.headers.get("webhook-signature");
  const timestamp = request.headers.get("webhook-timestamp");
  const webhookId = request.headers.get("webhook-id");

  if (webhookSecret) {
    if (!signature || !timestamp || !webhookId) {
      return NextResponse.json({ error: "Missing required webhook verification headers" }, { status: 401 });
    }

    // Replicate signatures format: v1,<base64-hmac>
    const signedPayload = `${webhookId}.${timestamp}.${rawBody}`;
    const expectedSig = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("base64");

    const sigParts = signature.split(",").map((s) => s.trim());
    const validSig = sigParts.some((part) => {
      const candidate = part.startsWith("v1,") ? part.slice(3) : part;
      return candidate === expectedSig;
    });

    if (!validSig) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }

  const predictionId = payload.id as string;
  const status = payload.status as string; // "succeeded", "failed", "canceled"
  const output = payload.output as string | string[] | undefined;

  if (!predictionId) {
    return NextResponse.json({ error: "Missing prediction ID" }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabaseClient();

    // 2. Query job associated with this Replicate prediction ID
    const { data: jobs, error: jobErr } = await supabase
      .from("generation_jobs")
      .select("*")
      .contains("parameters", { replicatePredictionId: predictionId })
      .limit(1);

    if (jobErr || !jobs || jobs.length === 0) {
      // Fallback: search by jobId if passed in query params
      const url = new URL(request.url);
      const queryJobId = url.searchParams.get("jobId");
      if (!queryJobId) {
        return NextResponse.json({ received: true, note: "No matching job found for prediction" }, { status: 200 });
      }
    }

    const job = jobs?.[0];
    if (!job) {
      return NextResponse.json({ received: true, note: "Job not located" }, { status: 200 });
    }

    // 3. Idempotency Check: if job is already terminal, return 200 immediately
    if (job.status === "COMPLETED" || job.status === "REVIEW" || job.status === "FAILED") {
      return NextResponse.json({ received: true, status: "ALREADY_TERMINAL", jobId: job.id }, { status: 200 });
    }

    // 4. Handle Failure Status
    if (status === "failed" || status === "canceled") {
      const errorMsg = (payload.error as string) || "Replicate prediction failed via webhook notice";
      await supabase
        .from("generation_jobs")
        .update({
          status: "FAILED",
          error_message: errorMsg,
          parameters: {
            ...(job.parameters || {}),
            replicateStatus: status,
            completedAt: new Date().toISOString(),
          },
        })
        .eq("id", job.id);

      return NextResponse.json({ received: true, status: "FAILED", jobId: job.id }, { status: 200 });
    }

    // 5. Handle Succeeded Status
    if (status === "succeeded" && output) {
      const outputUrl = Array.isArray(output) ? output[0] : output;
      if (outputUrl && typeof outputUrl === "string" && outputUrl.startsWith("http")) {
        // Download binary server-side
        const imgRes = await fetch(outputUrl);
        if (imgRes.ok) {
          const rawBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(rawBuffer);
          const contentType = imgRes.headers.get("content-type") || "image/jpeg";
          const ext = contentType.includes("png") ? "png" : "jpg";
          const filename = `webhook_replicate_${job.id.slice(0, 8)}.${ext}`;

          // Upload to private Supabase Storage
          const uploadRes = await uploadFileToStorage({
            workspaceId: job.workspace_id,
            projectId: job.project_id || "",
            filename,
            contentType,
            buffer,
            metadata: {
              jobId: job.id,
              replicatePredictionId: predictionId,
              provider: "Replicate (Flux)",
              model: (payload.model as string) || "black-forest-labs/flux-schnell",
            },
          });

          // Create Asset
          const assetRes = await createAsset({
            workspaceId: job.workspace_id,
            projectId: job.project_id || "",
            projectName: "Visual Asset",
            slotCode: "SS-VIS",
            name: "Visual Studio Replicate Output",
            assetType: "IMAGE",
            mimeType: contentType,
            storageKey: uploadRes.path,
            storageBucket: "private-assets",
            sizeBytes: buffer.byteLength,
            source: "AI_GENERATED",
            status: "REVIEW",
            metadata: {
              jobId: job.id,
              replicatePredictionId: predictionId,
              provider: "Replicate (Flux)",
              model: (payload.model as string) || "black-forest-labs/flux-schnell",
            },
          });

          // Idempotent usage ledger logging
          await logGenerationUsage({
            workspaceId: job.workspace_id,
            studio: "VISUAL",
            eventType: "VISUAL_RENDER",
            provider: "Replicate (Flux)",
            model: (payload.model as string) || "black-forest-labs/flux-schnell",
            jobId: job.id,
            creditsConsumed: 20,
            success: true,
          });

          // Update job to REVIEW status
          await supabase
            .from("generation_jobs")
            .update({
              status: "REVIEW",
              progress: 100,
              parameters: {
                ...(job.parameters || {}),
                progress: 100,
                progressLabel: "AWAITING HUMAN REVIEW",
                assetId: assetRes.data?.id,
                completedAt: new Date().toISOString(),
              },
            })
            .eq("id", job.id);

          // Dispatch notification
          notificationService
            .dispatchNotification({
              userId: job.created_by || "00000000-0000-0000-0000-000000000001",
              workspaceId: job.workspace_id,
              type: "JOB_COMPLETED",
              title: "Visual Studio Generation Complete",
              message: "Pipeline finished successfully via Replicate.",
              link: `/app/jobs?jobId=${job.id}`,
              jobId: job.id,
              projectId: job.project_id || undefined,
              idempotencyKey: `job_completed_notif_${job.id}`,
            })
            .catch(() => {});

          return NextResponse.json({ received: true, status: "PROCESSED", jobId: job.id }, { status: 200 });
        }
      }
    }

    return NextResponse.json({ received: true, status: "ACKNOWLEDGED" }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook execution failure";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
