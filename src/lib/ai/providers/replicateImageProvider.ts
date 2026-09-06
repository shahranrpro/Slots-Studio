/**
 * Slots Studio — Replicate (Flux) Image Generation Provider
 * 
 * Generates commercial apparel and sportswear visuals via Replicate's API.
 * Uses asynchronous prediction lifecycle with server-side polling, binary
 * validation, and private Supabase Storage persistence.
 * 
 * Security: Server-side only. API tokens are NEVER exposed to client bundles,
 * database records, or client-facing HTTP payloads.
 */

import {
  type ImageGenerationProvider,
  type ImageAiRequest,
  type ImageAiResult,
  AiAuthenticationError,
  AiRateLimitError,
  AiQuotaExhaustedError,
  AiProviderError,
} from "../types";

export class ReplicateImageProvider implements ImageGenerationProvider {
  public readonly id = "replicate";
  public readonly name = "Replicate (Flux)";
  public readonly defaultModel: string;

  private readonly baseUrl = "https://api.replicate.com/v1";

  constructor() {
    this.defaultModel = process.env.REPLICATE_IMAGE_MODEL || "black-forest-labs/flux-schnell";
  }

  /**
   * Resolves the server-side API token. Checks both REPLICATE_API_KEY and REPLICATE_API_TOKEN.
   */
  private getApiToken(): string | undefined {
    return process.env.REPLICATE_API_KEY || process.env.REPLICATE_API_TOKEN;
  }

  /**
   * Returns true if a valid non-empty Replicate token is configured on the server.
   */
  public isAvailable(): boolean {
    const token = this.getApiToken();
    return Boolean(token && token.trim().length > 0);
  }

  /**
   * Formats aspect ratio for Replicate Flux models (e.g., "1:1", "16:9", "4:5", "9:16").
   */
  private formatAspectRatio(aspectRatio?: string): string {
    switch (aspectRatio) {
      case "9:16":
        return "9:16";
      case "16:9":
        return "16:9";
      case "4:5":
        return "4:5";
      case "1:1":
      default:
        return "1:1";
    }
  }

  /**
   * Initiates an asynchronous prediction on Replicate and polls until completion.
   */
  public async generateImage(request: ImageAiRequest): Promise<ImageAiResult> {
    const token = this.getApiToken();
    if (!token) {
      throw new AiAuthenticationError(
        "Replicate API token is not configured on the server (REPLICATE_API_KEY or REPLICATE_API_TOKEN required).",
        this.name
      );
    }

    const model = this.defaultModel;
    const formattedAspectRatio = this.formatAspectRatio(request.aspectRatio);

    // 1. Determine API endpoint based on model identifier
    // If model has format "owner/name", use /v1/models/{owner}/{name}/predictions
    // If model is a 64-char hash, use /v1/predictions with "version" field
    let endpoint = `${this.baseUrl}/predictions`;
    let requestBody: Record<string, unknown>;

    if (model.includes("/")) {
      endpoint = `${this.baseUrl}/models/${model}/predictions`;
      requestBody = {
        input: {
          prompt: request.prompt,
          aspect_ratio: formattedAspectRatio,
          output_format: "jpg",
          output_quality: 90,
          num_outputs: 1,
          ...(request.seed ? { seed: request.seed } : {}),
        },
      };
    } else {
      requestBody = {
        version: model,
        input: {
          prompt: request.prompt,
          aspect_ratio: formattedAspectRatio,
          output_format: "jpg",
          output_quality: 90,
        },
      };
    }

    // 2. Create Prediction (Asynchronous)
    const createController = new AbortController();
    const createTimeout = setTimeout(() => createController.abort(), 20000);

    let createRes: Response;
    try {
      createRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "wait=5", // Prefer waiting up to 5s if prediction finishes quickly
        },
        body: JSON.stringify(requestBody),
        signal: createController.signal,
      });
    } catch (err: unknown) {
      clearTimeout(createTimeout);
      const msg = err instanceof Error ? err.message : "Failed to connect to Replicate API";
      throw new AiProviderError(`Replicate API network error: ${msg}`, this.name, undefined, true);
    } finally {
      clearTimeout(createTimeout);
    }

    // Handle Creation Status Codes
    if (!createRes.ok) {
      const errorData = await createRes.json().catch(() => ({}));
      const detail = errorData?.detail || errorData?.title || createRes.statusText;

      if (createRes.status === 401 || createRes.status === 403) {
        throw new AiAuthenticationError(`Replicate authentication rejected: ${detail}`, this.name);
      }
      if (createRes.status === 402) {
        throw new AiQuotaExhaustedError(
          `Replicate account requires billing credit to run predictions (HTTP 402: ${detail}). Please add credits in your Replicate dashboard.`,
          this.name
        );
      }
      if (createRes.status === 429) {
        throw new AiRateLimitError(`Replicate rate limit exceeded: ${detail}`, this.name);
      }

      throw new AiProviderError(
        `Replicate API prediction creation failed with HTTP ${createRes.status}: ${detail}`,
        this.name,
        createRes.status,
        createRes.status >= 500
      );
    }

    const prediction = await createRes.json();
    const predictionId = prediction.id;

    if (!predictionId) {
      throw new AiProviderError("Replicate did not return a valid prediction ID", this.name);
    }

    // 3. Poll for Terminal State if not already succeeded
    let currentPrediction = prediction;
    const maxPollDurationMs = 60000; // 60-second polling ceiling
    const pollIntervalMs = 1500;
    const pollStart = Date.now();

    while (
      currentPrediction.status !== "succeeded" &&
      currentPrediction.status !== "failed" &&
      currentPrediction.status !== "canceled"
    ) {
      if (Date.now() - pollStart > maxPollDurationMs) {
        // Attempt to cancel timed-out prediction
        fetch(`${this.baseUrl}/predictions/${predictionId}/cancel`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});

        throw new AiProviderError(
          `Replicate prediction timed out after ${maxPollDurationMs / 1000}s (Prediction ID: ${predictionId})`,
          this.name,
          504,
          true
        );
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

      try {
        const pollRes = await fetch(`${this.baseUrl}/predictions/${predictionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!pollRes.ok) {
          if (pollRes.status === 404) {
            throw new AiProviderError(`Prediction ${predictionId} not found on Replicate`, this.name);
          }
          if (pollRes.status === 429) {
            continue; // Transient rate limit during polling, retry next loop
          }
        } else {
          currentPrediction = await pollRes.json();
        }
      } catch (pollErr: unknown) {
        if (pollErr instanceof AiProviderError) throw pollErr;
        // Non-fatal polling connection blip; continue loop
      }
    }

    // 4. Handle Terminal Failure
    if (currentPrediction.status === "failed") {
      const failureMsg = currentPrediction.error || "Replicate prediction failed during execution.";
      throw new AiProviderError(`Replicate prediction failed: ${failureMsg}`, this.name);
    }

    if (currentPrediction.status === "canceled") {
      throw new AiProviderError("Replicate prediction was canceled.", this.name);
    }

    // 5. Extract Output Image URL
    let outputUrl: string | undefined;
    if (Array.isArray(currentPrediction.output) && currentPrediction.output.length > 0) {
      outputUrl = currentPrediction.output[0];
    } else if (typeof currentPrediction.output === "string") {
      outputUrl = currentPrediction.output;
    }

    if (!outputUrl || !outputUrl.startsWith("http")) {
      throw new AiProviderError(
        `Replicate succeeded but did not return a valid output URL (Prediction: ${predictionId})`,
        this.name
      );
    }

    // 6. Download and Validate Binary Server-Side
    const downloadController = new AbortController();
    const downloadTimeout = setTimeout(() => downloadController.abort(), 20000);

    let imageRes: Response;
    try {
      imageRes = await fetch(outputUrl, { signal: downloadController.signal });
    } catch (err: unknown) {
      clearTimeout(downloadTimeout);
      const msg = err instanceof Error ? err.message : "Network error downloading image";
      throw new AiProviderError(`Failed to download image from Replicate CDN: ${msg}`, this.name, undefined, true);
    } finally {
      clearTimeout(downloadTimeout);
    }

    if (!imageRes.ok) {
      throw new AiProviderError(
        `Failed to download generated image from CDN (HTTP ${imageRes.status})`,
        this.name,
        imageRes.status
      );
    }

    const rawBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(rawBuffer);

    // Validate binary payload
    if (buffer.length < 512) {
      throw new AiProviderError("Downloaded image binary is corrupted or too small (< 512 bytes)", this.name);
    }

    // Validate content type
    let contentType = imageRes.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      contentType = "image/jpeg";
    }

    return {
      success: true,
      buffer,
      contentType,
      provider: this.name,
      model,
      isDevelopmentPreview: false,
    };
  }
}
