/**
 * Slots Studio — Central AI Provider Registry
 * 
 * Resolves active text and image providers based on server-side environment variables.
 * Enforces zero client secret leakage, automatic fallback to DEV PREVIEW, and error normalization.
 */

import {
  type TextGenerationProvider,
  type ImageGenerationProvider,
  type TextAiRequest,
  type TextAiResult,
  type ImageAiRequest,
  type ImageAiResult,
} from "./types";
import { GeminiTextProvider } from "./providers/geminiTextProvider";
import { GroqTextProvider } from "./providers/groqTextProvider";
import { OpenAiTextProvider } from "./providers/openaiTextProvider";
import { OllamaTextProvider } from "./providers/ollamaTextProvider";
import { DevTextProvider } from "./providers/devTextProvider";
import { PollinationsImageProvider } from "./providers/pollinationsImageProvider";
import { OpenAiImageProvider } from "./providers/openaiImageProvider";
import { ReplicateImageProvider } from "./providers/replicateImageProvider";
import { DevImageProvider } from "./providers/devImageProvider";

// Singleton provider instances
const geminiText = new GeminiTextProvider();
const groqText = new GroqTextProvider();
const openAiText = new OpenAiTextProvider();
const ollamaText = new OllamaTextProvider();
const devText = new DevTextProvider();

const replicateImage = new ReplicateImageProvider();
const pollinationsImage = new PollinationsImageProvider();
const openAiImage = new OpenAiImageProvider();
const devImage = new DevImageProvider();

const textProviders: Record<string, TextGenerationProvider> = {
  gemini: geminiText,
  groq: groqText,
  openai: openAiText,
  ollama: ollamaText,
  dev: devText,
};

const imageProviders: Record<string, ImageGenerationProvider> = {
  replicate: replicateImage,
  pollinations: pollinationsImage,
  openai: openAiImage,
  dev: devImage,
};

/**
 * Resolves the primary active text generation provider.
 */
export function getTextProvider(preference?: string): TextGenerationProvider {
  if (preference && textProviders[preference]?.isAvailable()) {
    return textProviders[preference];
  }

  const explicit = process.env.AI_TEXT_PROVIDER?.toLowerCase();
  if (explicit && textProviders[explicit]?.isAvailable()) {
    return textProviders[explicit];
  }

  // Automatic precedence based on configured credentials
  if (geminiText.isAvailable()) return geminiText;
  if (groqText.isAvailable()) return groqText;
  if (openAiText.isAvailable()) return openAiText;
  if (ollamaText.isAvailable()) return ollamaText;

  // Safe deterministic fallback
  return devText;
}

/**
 * Resolves the primary active image generation provider.
 */
export function getImageProvider(preference?: string): ImageGenerationProvider {
  if (preference && imageProviders[preference]?.isAvailable()) {
    return imageProviders[preference];
  }

  const explicit = process.env.AI_IMAGE_PROVIDER?.toLowerCase();
  if (explicit && imageProviders[explicit]?.isAvailable()) {
    return imageProviders[explicit];
  }

  // Production priority: Replicate Flux -> OpenAI DALL-E 3 -> Pollinations Open Compute -> DEV
  if (replicateImage.isAvailable()) return replicateImage;
  if (openAiImage.isAvailable()) return openAiImage;
  if (pollinationsImage.isAvailable()) return pollinationsImage;

  return devImage;
}

/**
 * Executes text generation with graceful fallback to DEV PREVIEW on external failure.
 */
export async function generateTextSafe(
  request: TextAiRequest,
  preferredProviderId?: string
): Promise<TextAiResult> {
  const provider = getTextProvider(preferredProviderId);

  try {
    return await provider.generateText(request);
  } catch (err: unknown) {
    if (process.env.ALLOW_AI_FALLBACK === "false") {
      throw err;
    }
    // If the primary provider fails and wasn't already the DEV provider, fallback to DEV
    if (provider.id !== "dev") {
      console.warn(
        `Primary text AI provider (${provider.name}) failed. Falling back to DEV PREVIEW:`,
        err instanceof Error ? err.message : err
      );
      const fallbackResult = await devText.generateText(request);
      return {
        ...fallbackResult,
        error: `Notice: Primary provider (${provider.name}) failed. Used local deterministic fallback.`,
      };
    }
    throw err;
  }
}

/**
 * Executes image generation with graceful multi-stage fallback (Replicate -> Pollinations -> DEV PREVIEW).
 */
export async function generateImageSafe(
  request: ImageAiRequest,
  preferredProviderId?: string
): Promise<ImageAiResult> {
  const provider = getImageProvider(preferredProviderId);

  try {
    return await provider.generateImage(request);
  } catch (err: unknown) {
    if (process.env.ALLOW_AI_FALLBACK === "false") {
      throw err;
    }

    // Secondary stage: If primary provider was Replicate or OpenAI and failed (e.g. HTTP 402 Insufficient Credit),
    // attempt the operational open-compute Pollinations provider before falling back to local DEV PREVIEW
    if (provider.id !== "pollinations" && pollinationsImage.isAvailable()) {
      try {
        console.warn(
          `Primary image AI provider (${provider.name}) failed. Attempting secondary operational provider (${pollinationsImage.name}):`,
          err instanceof Error ? err.message : err
        );
        const secondaryResult = await pollinationsImage.generateImage(request);
        if (secondaryResult.success && secondaryResult.buffer && secondaryResult.buffer.length > 500) {
          return secondaryResult;
        }
      } catch (secondaryErr: unknown) {
        console.warn(
          `Secondary provider (${pollinationsImage.name}) also failed:`,
          secondaryErr instanceof Error ? secondaryErr.message : secondaryErr
        );
      }
    }

    if (provider.id !== "dev") {
      console.warn(
        `All external image AI providers failed. Falling back to DEV PREVIEW:`,
        err instanceof Error ? err.message : err
      );
      const fallbackResult = await devImage.generateImage(request);
      return {
        ...fallbackResult,
        error: `Notice: Primary image provider (${provider.name}) failed. Used local deterministic fallback.`,
      };
    }
    throw err;
  }
}

/**
 * Lists available providers and their live readiness (safe for diagnostics).
 */
export function listProvidersStatus(): {
  text: Array<{ id: string; name: string; available: boolean; isDefault: boolean }>;
  image: Array<{ id: string; name: string; available: boolean; isDefault: boolean }>;
} {
  const activeText = getTextProvider();
  const activeImage = getImageProvider();

  return {
    text: Object.values(textProviders).map((p) => ({
      id: p.id,
      name: p.name,
      available: p.isAvailable(),
      isDefault: p.id === activeText.id,
    })),
    image: Object.values(imageProviders).map((p) => ({
      id: p.id,
      name: p.name,
      available: p.isAvailable(),
      isDefault: p.id === activeImage.id,
    })),
  };
}
