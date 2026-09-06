/**
 * Slots Studio — Deterministic DEV PREVIEW Text Generation Provider
 * 
 * Provides high-fidelity, sports-tailored mock copy when no external AI
 * providers are configured, or as a seamless offline fallback.
 */

import {
  type TextGenerationProvider,
  type TextAiRequest,
  type TextAiResult,
} from "../types";

export class DevTextProvider implements TextGenerationProvider {
  public readonly id = "dev";
  public readonly name = "DEV PREVIEW Text Engine";
  public readonly defaultModel = "slots-text-preview-v1";

  public isAvailable(): boolean {
    return true; // Always available as fallback
  }

  public async generateText(request: TextAiRequest): Promise<TextAiResult> {
    // Generate sports-apparel copy matching prompt context
    const lines: string[] = [];

    const context = request.context || {};
    const productName = (context.productName as string) || "Technical Apparel System";
    const category = (context.category as string) || "Sportswear";
    const silhouette = (context.silhouette as string) || "Articulated Performance";

    lines.push(`### ${productName.toUpperCase()}`);
    lines.push(`**Category:** ${category} | **Silhouette:** ${silhouette}`);
    lines.push("");
    lines.push("#### Technical Product Overview");
    lines.push(
      `Engineered for the demands of high-velocity movement and modern technical aesthetics, the ${productName} blends ergonomic tailoring with micro-engineered textiles.`
    );
    lines.push("");
    lines.push("#### Key Performance Specifications");
    lines.push("- **Kinetic Architecture:** Ergonomically articulated seams eliminate friction during dynamic extension.");
    lines.push("- **Hydrophobic Vapor Management:** Laser-perforated ventilation zones regulate core thermal equilibrium.");
    lines.push("- **Reinforced Construction:** Bonded seam tape and bar-tack reinforcements at high-stress shear vectors.");
    lines.push("");
    lines.push(`*Slots Studio DEV PREVIEW // Deterministic synthesis based on product parameters.*`);

    return {
      success: true,
      text: lines.join("\n"),
      provider: this.name,
      model: this.defaultModel,
      usage: {
        promptTokens: 50,
        completionTokens: 120,
        totalTokens: 170,
      },
      isDevelopmentPreview: true,
    };
  }
}
