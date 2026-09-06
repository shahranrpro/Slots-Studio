/**
 * Slots Studio — Ollama Local Text Generation Provider
 * 
 * Connects to a locally running Ollama instance (default: http://localhost:11434)
 * for 100% private, zero-cloud-cost on-premise execution.
 */

import {
  type TextGenerationProvider,
  type TextAiRequest,
  type TextAiResult,
  AiProviderError,
} from "../types";

export class OllamaTextProvider implements TextGenerationProvider {
  public readonly id = "ollama";
  public readonly name = "Ollama (Local)";
  public readonly defaultModel = "llama3";

  private getBaseUrl(): string {
    return process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  }

  public isAvailable(): boolean {
    return Boolean(process.env.OLLAMA_ENABLED === "true" || process.env.OLLAMA_BASE_URL);
  }

  public async generateText(request: TextAiRequest): Promise<TextAiResult> {
    const baseUrl = this.getBaseUrl();
    const model = process.env.OLLAMA_MODEL || this.defaultModel;
    const url = `${baseUrl}/api/generate`;

    let prompt = request.prompt;
    if (request.systemPrompt) {
      prompt = `[SYSTEM INSTRUCTIONS]\n${request.systemPrompt}\n\n[USER REQUEST]\n${request.prompt}`;
    }

    const body = {
      model,
      prompt,
      stream: false,
      options: {
        temperature: request.temperature ?? 0.7,
        num_predict: request.maxTokens ?? 1024,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AiProviderError(
          `Ollama returned HTTP ${response.status}: ${response.statusText}`,
          this.name,
          response.status
        );
      }

      const data = await response.json();
      const text = data.response || "";

      return {
        success: true,
        text: text.trim(),
        provider: this.name,
        model,
        usage: {
          promptTokens: data.prompt_eval_count,
          completionTokens: data.eval_count,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        },
        isDevelopmentPreview: false,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof AiProviderError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : "Unable to reach local Ollama instance";
      throw new AiProviderError(message, this.name, undefined, true);
    }
  }
}
