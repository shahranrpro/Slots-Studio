/**
 * Slots Studio — OpenAI DALL-E 3 Image Generation Provider
 * 
 * Generates apparel renders via OpenAI DALL-E 3.
 * Strict server-side execution: API key is never exposed to client bundles.
 */

import {
  type ImageGenerationProvider,
  type ImageAiRequest,
  type ImageAiResult,
  AiAuthenticationError,
  AiRateLimitError,
  AiProviderError,
} from "../types";

export class OpenAiImageProvider implements ImageGenerationProvider {
  public readonly id = "openai-image";
  public readonly name = "OpenAI (DALL-E 3)";
  public readonly defaultModel = "dall-e-3";

  private getApiKey(): string | undefined {
    return process.env.OPENAI_API_KEY;
  }

  public isAvailable(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0);
  }

  public async generateImage(request: ImageAiRequest): Promise<ImageAiResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new AiAuthenticationError(
        "OpenAI API key is not configured on the server.",
        this.name
      );
    }

    let size = "1024x1024";
    if (request.aspectRatio === "9:16" || request.aspectRatio === "4:5") {
      size = "1024x1792";
    } else if (request.aspectRatio === "16:9") {
      size = "1792x1024";
    }

    const url = "https://api.openai.com/v1/images/generations";
    const body = {
      model: this.defaultModel,
      prompt: request.prompt,
      n: 1,
      size,
      response_format: "b64_json",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.error?.message ||
          `OpenAI Image API returned HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 401 || response.status === 403) {
          throw new AiAuthenticationError(message, this.name);
        }
        if (response.status === 429) {
          throw new AiRateLimitError(message, this.name);
        }
        throw new AiProviderError(message, this.name, response.status);
      }

      const data = await response.json();
      const b64 = data.data?.[0]?.b64_json;
      if (!b64) {
        throw new AiProviderError("No image data returned from OpenAI", this.name);
      }

      const buffer = Buffer.from(b64, "base64");

      return {
        success: true,
        buffer,
        contentType: "image/png",
        provider: this.name,
        model: this.defaultModel,
        isDevelopmentPreview: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : "OpenAI image request failed";
      throw new AiProviderError(message, this.name, undefined, true);
    }
  }
}
