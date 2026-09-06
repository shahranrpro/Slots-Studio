/**
 * Slots Studio — Groq Text Generation Provider
 * 
 * Uses official Groq OpenAI-compatible chat completion API with free developer tier.
 * Models: llama-3.3-70b-versatile, llama-3.1-8b-instant.
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

export class GroqTextProvider implements TextGenerationProvider {
  public readonly id = "groq";
  public readonly name = "Groq (Llama 3.3)";
  public readonly defaultModel = "llama-3.3-70b-versatile";

  private getApiKey(): string | undefined {
    return process.env.GROQ_API_KEY;
  }

  public isAvailable(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0);
  }

  public async generateText(request: TextAiRequest): Promise<TextAiResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new AiAuthenticationError(
        "Groq API key is not configured on the server.",
        this.name
      );
    }

    const model = process.env.GROQ_MODEL || this.defaultModel;
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const messages: Array<{ role: string; content: string }> = [];
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    messages.push({ role: "user", content: request.prompt });

    const body = {
      model,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 1024,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

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
          `Groq API returned HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 401 || response.status === 403) {
          throw new AiAuthenticationError(message, this.name);
        }
        if (response.status === 429) {
          throw new AiRateLimitError(message, this.name);
        }
        throw new AiProviderError(message, this.name, response.status);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const text = choice?.message?.content || "";

      return {
        success: true,
        text: text.trim(),
        provider: this.name,
        model,
        usage: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens,
        },
        isDevelopmentPreview: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : "Unknown Groq API error";
      throw new AiProviderError(message, this.name, undefined, true);
    }
  }
}
