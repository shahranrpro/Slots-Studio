/**
 * Slots Studio — Google Gemini Text Generation Provider
 * 
 * Uses official Google Gemini REST API (gemini-1.5-flash) with free tier allowances.
 * Strict server-side execution: API key is never exposed to client bundles.
 */

import {
  type TextGenerationProvider,
  type TextAiRequest,
  type TextAiResult,
  AiAuthenticationError,
  AiRateLimitError,
  AiProviderError,
} from "../types";

export class GeminiTextProvider implements TextGenerationProvider {
  public readonly id = "gemini";
  public readonly name = "Google Gemini";
  public readonly defaultModel = "gemini-1.5-flash";

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  }

  public isAvailable(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0);
  }

  public async generateText(request: TextAiRequest): Promise<TextAiResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new AiAuthenticationError(
        "Gemini API key is not configured on the server.",
        this.name
      );
    }

    const model = this.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    let combinedPrompt = request.prompt;
    if (request.systemPrompt) {
      combinedPrompt = `[SYSTEM INSTRUCTIONS]\n${request.systemPrompt}\n\n[USER REQUEST]\n${request.prompt}`;
    }

    contents.push({
      role: "user",
      parts: [{ text: combinedPrompt }],
    });

    const body = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.7,
        maxOutputTokens: request.maxTokens ?? 1024,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData?.error?.message ||
          `Gemini API returned HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 401 || response.status === 403) {
          throw new AiAuthenticationError(message, this.name);
        }
        if (response.status === 429) {
          throw new AiRateLimitError(message, this.name);
        }
        throw new AiProviderError(message, this.name, response.status);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const text =
        candidate?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";

      const promptTokens = data.usageMetadata?.promptTokenCount;
      const completionTokens = data.usageMetadata?.candidatesTokenCount;
      const totalTokens = data.usageMetadata?.totalTokenCount;

      return {
        success: true,
        text: text.trim(),
        provider: this.name,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
        },
        isDevelopmentPreview: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : "Unknown Gemini API error";
      throw new AiProviderError(message, this.name, undefined, true);
    }
  }
}
