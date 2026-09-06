/**
 * Slots Studio — Pollinations Image Generation Provider (Flux)
 * 
 * Generates photorealistic sportswear and apparel imagery using Pollinations Flux.
 * Free, open compute endpoint requiring no API key for initial developer/free-tier adoption.
 * Returns binary image buffer (JPEG) for server-side persistence in private Supabase Storage.
 */

import {
  type ImageGenerationProvider,
  type ImageAiRequest,
  type ImageAiResult,
  AiProviderError,
} from "../types";

export class PollinationsImageProvider implements ImageGenerationProvider {
  public readonly id = "pollinations";
  public readonly name = "Pollinations (Flux)";
  public readonly defaultModel = "flux";

  public isAvailable(): boolean {
    // Open compute provider available unless explicitly disabled
    return process.env.POLLINATIONS_DISABLED !== "true";
  }

  public async generateImage(request: ImageAiRequest): Promise<ImageAiResult> {
    const prompt = request.prompt;
    if (!prompt || prompt.trim().length === 0) {
      throw new AiProviderError("Prompt is required for image generation", this.name);
    }

    // Determine dimensions from aspect ratio (optimized for fast open compute turnaround)
    let width = request.width || 768;
    let height = request.height || 768;

    if (request.aspectRatio) {
      switch (request.aspectRatio) {
        case "1:1":
          width = 768;
          height = 768;
          break;
        case "4:5":
          width = 640;
          height = 800;
          break;
        case "9:16":
          width = 576;
          height = 1024;
          break;
        case "16:9":
          width = 1024;
          height = 576;
          break;
      }
    }

    const seed = request.seed || Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 1000));
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${this.defaultModel}&nologo=true&seed=${seed}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "image/jpeg,image/png,image/*",
          "User-Agent": "SlotsStudio/1.0 (Sportswear Apparel Studio)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AiProviderError(
          `Pollinations image service returned HTTP ${response.status}: ${response.statusText}`,
          this.name,
          response.status,
          true
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 500) {
        throw new AiProviderError(
          "Image generation returned invalid or empty binary payload",
          this.name,
          502,
          true
        );
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";

      return {
        success: true,
        buffer,
        contentType: contentType.includes("image") ? contentType : "image/jpeg",
        provider: this.name,
        model: this.defaultModel,
        isDevelopmentPreview: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : "Image generation request failed";
      throw new AiProviderError(message, this.name, undefined, true);
    }
  }
}
