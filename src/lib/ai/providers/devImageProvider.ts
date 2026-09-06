/**
 * Slots Studio — Deterministic DEV PREVIEW Image Generation Provider
 * 
 * Provides vector SVG preview renders when external image APIs are offline or unconfigured.
 * Strictly labeled as DEV PREVIEW.
 */

import {
  type ImageGenerationProvider,
  type ImageAiRequest,
  type ImageAiResult,
} from "../types";

export class DevImageProvider implements ImageGenerationProvider {
  public readonly id = "dev-image";
  public readonly name = "DEV PREVIEW Visual Engine";
  public readonly defaultModel = "slots-visual-preview-v1";

  public isAvailable(): boolean {
    return true; // Always available as fallback
  }

  public async generateImage(request: ImageAiRequest): Promise<ImageAiResult> {
    const ratio = request.aspectRatio || "1:1";
    let width = 800;
    let height = 800;
    if (ratio === "4:5") {
      width = 800;
      height = 1000;
    } else if (ratio === "9:16") {
      width = 720;
      height = 1280;
    } else if (ratio === "16:9") {
      width = 1280;
      height = 720;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f18"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#B7FF00"/>
      <stop offset="100%" stop-color="#00F2FE"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#222f3e" stroke-width="1.5" stroke-dasharray="8 8"/>
  <g transform="translate(${width / 2}, ${height / 2 - 40})">
    <!-- Technical Wireframe Silhouette -->
    <path d="M-80,-60 L80,-60 L100,60 L-100,60 Z" fill="none" stroke="url(#neonGlow)" stroke-width="2.5"/>
    <circle cx="0" cy="-20" r="30" fill="none" stroke="#B7FF00" stroke-width="1.5" opacity="0.6"/>
    <line x1="-120" y1="0" x2="120" y2="0" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
    <line x1="0" y1="-100" x2="0" y2="80" stroke="#334155" stroke-width="1" stroke-dasharray="4 4"/>
  </g>
  <text x="${width / 2}" y="${height / 2 + 70}" font-family="monospace" font-size="14" font-weight="bold" fill="#B7FF00" text-anchor="middle" letter-spacing="2">DEV PREVIEW VISUAL</text>
  <text x="${width / 2}" y="${height / 2 + 95}" font-family="monospace" font-size="11" fill="#94A3B8" text-anchor="middle">Ratio: ${ratio} | Sportswear Vector Frame</text>
</svg>`;

    return {
      success: true,
      svgContent,
      contentType: "image/svg+xml",
      buffer: Buffer.from(svgContent, "utf8"),
      provider: this.name,
      model: this.defaultModel,
      isDevelopmentPreview: true,
    };
  }
}
