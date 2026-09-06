/**
 * Slots Studio — Development Visual AI Provider Adapter
 *
 * Provides deterministic vector-based visual render candidates tailored
 * to product context, visual mode, aspect ratio, lighting, and environment.
 *
 * ARCHITECTURAL RULE:
 * This development adapter generates explicit "DEV PREVIEW" outputs for local
 * testing and workflow evaluation without fabricating fake AI scores, accuracy
 * metrics, or non-existent external model IDs.
 */

import {
  type VisualMode,
  type VisualAspectRatio,
  type VisualSettingsConfig,
  type VisualOutput,
  type VisualGenerationRequest,
} from "../types";
import { type ProductConcept } from "@/features/product-studio/types";
import { type Project } from "@/lib/projects/types";

export interface GenerateVisualsInput {
  request: VisualGenerationRequest;
  project: Project;
  approvedConcept: ProductConcept | null;
  jobId: string;
}

export interface VisualProvider {
  name: string;
  generateVisuals(input: GenerateVisualsInput): Promise<VisualOutput[]>;
}

export class DevVisualProviderAdapter implements VisualProvider {
  public readonly name = "SlotsStudio-DevVisualEngine";

  public async generateVisuals(input: GenerateVisualsInput): Promise<VisualOutput[]> {
    const { request, project, approvedConcept, jobId } = input;
    const count = request.variantsCount || 2;
    const outputs: VisualOutput[] = [];

    const modeLabels: Record<VisualMode, string> = {
      studio: "Isolated Studio Pass",
      model: "On-Model Styling Frame",
      mannequin: "Form Structure Display",
      lifestyle: "Contextual Environment Shot",
      detail: "Material Construction Macro",
      editorial: "Campaign Narrative Visual",
    };

    const modeDescriptions: Record<VisualMode, string> = {
      studio: "Clean high-key commercial lighting with calibrated neutral backdrop and shadow isolation.",
      model: "Dynamic athletic fashion silhouette styled on fitting model with balanced key and rim illumination.",
      mannequin: "Technical 3D draped form displaying silhouette drape, tension lines, and structural seams.",
      lifestyle: "Ambient contextual scene emphasizing product ergonomics in architectural environment.",
      detail: "Ultra-fine macro inspection highlighting fabric weave, precision bonding, and technical hardware.",
      editorial: "High-contrast cinematic framing with directional keylight and bold compositional focus.",
    };

    const primaryColor = approvedConcept?.colorPalette?.[0] || "#B7FF00";
    const secondaryColor = approvedConcept?.colorPalette?.[1] || "#1F2937";

    for (let i = 0; i < count; i++) {
      const outputId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${i + 1}`;
      const candidateCode = `PASS-${String(i + 1).padStart(2, "0")}`;

      const title = `${project.name} • ${modeLabels[request.mode]} ${candidateCode}`;
      const description = `${modeDescriptions[request.mode]} Formatted at ${request.settings.aspectRatio}.`;

      const previewSvg = this.generateModeSvg(
        request.mode,
        request.settings.aspectRatio,
        request.settings,
        project.name,
        project.slotCode,
        primaryColor,
        secondaryColor,
        i
      );

      outputs.push({
        id: outputId,
        workspaceId: request.workspaceId,
        projectId: request.projectId,
        jobId,
        mode: request.mode,
        title,
        description,
        aspectRatio: request.settings.aspectRatio,
        settings: request.settings,
        previewSvg,
        status: "REVIEW",
        isDevelopmentPreview: true,
        savedToProject: false,
        createdAt: new Date().toISOString(),
      });
    }

    return outputs;
  }

  private generateModeSvg(
    mode: VisualMode,
    aspectRatio: VisualAspectRatio,
    settings: VisualSettingsConfig,
    projectName: string,
    slotCode: string,
    primaryColor: string,
    secondaryColor: string,
    variantIndex: number
  ): string {
    const dimensions: Record<VisualAspectRatio, { w: number; h: number }> = {
      "1:1": { w: 600, h: 600 },
      "4:5": { w: 480, h: 600 },
      "9:16": { w: 338, h: 600 },
      "16:9": { w: 600, h: 338 },
    };

    const { w, h } = dimensions[aspectRatio] || { w: 600, h: 600 };
    const cx = w / 2;
    const cy = h / 2;

    const bgMap: Record<string, { fill: string; stroke: string; gridColor: string }> = {
      clean_white: { fill: "#F8FAFC", stroke: "#E2E8F0", gridColor: "rgba(0,0,0,0.04)" },
      dark_cyc: { fill: "#0B0F17", stroke: "#1E293B", gridColor: "rgba(255,255,255,0.03)" },
      concrete_gray: { fill: "#18181B", stroke: "#27272A", gridColor: "rgba(255,255,255,0.04)" },
      gradient_studio: { fill: "#09090B", stroke: "#18181B", gridColor: "rgba(183,255,0,0.03)" },
      custom: { fill: "#050505", stroke: "#1A1A1A", gridColor: "rgba(255,255,255,0.03)" },
    };

    const bg = bgMap[settings.background] || bgMap.dark_cyc;

    // Visual geometry based on mode
    let modeContent = "";
    const scale = Math.min(w, h) / 600;

    if (mode === "studio") {
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Studio Softbox Spotlight Shadow -->
          <ellipse cx="0" cy="180" rx="140" ry="24" fill="rgba(0,0,0,0.4)" filter="blur(8px)" />
          <!-- Studio Centerpiece Outer Glow -->
          <circle cx="0" cy="0" r="160" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.3" />
          <!-- Hero Product Silhouette Representation -->
          <path d="M-90 -120 L90 -120 L110 -60 L130 60 L100 140 L-100 140 L-130 60 L-110 -60 Z" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2" />
          <path d="M0 -120 L0 140" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6" />
          <path d="M-60 -40 L60 -40 L70 40 L-70 40 Z" fill="${primaryColor}" fill-opacity="0.15" stroke="${primaryColor}" stroke-width="1.5" />
          <!-- Technical Alignment Marks -->
          <line x1="-160" y1="0" x2="-140" y2="0" stroke="${primaryColor}" stroke-width="2" />
          <line x1="140" y1="0" x2="160" y2="0" stroke="${primaryColor}" stroke-width="2" />
          <line x1="0" y1="-160" x2="0" y2="-140" stroke="${primaryColor}" stroke-width="2" />
          <line x1="0" y1="140" x2="0" y2="160" stroke="${primaryColor}" stroke-width="2" />
        </g>
      `;
    } else if (mode === "model") {
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Floor Light Gradient -->
          <ellipse cx="0" cy="210" rx="120" ry="20" fill="rgba(0,0,0,0.5)" filter="blur(6px)" />
          <!-- Stylized Human Form & Garment Rig -->
          <!-- Head / Neck -->
          <ellipse cx="0" cy="-170" rx="28" ry="36" fill="none" stroke="${primaryColor}" stroke-width="2" />
          <path d="M-14 -134 L-14 -115 L14 -115 L14 -134" fill="none" stroke="${primaryColor}" stroke-width="2" />
          <!-- Torso & Dynamic Fit Layer -->
          <path d="M-85 -110 L85 -110 L115 -30 L125 70 L65 75 L55 170 L-55 170 L-65 75 L-125 70 L-115 -30 Z" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2.5" />
          <!-- Fashion Seam Accents -->
          <path d="M-40 -110 L-25 75 L-20 170" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="3 3" />
          <path d="M40 -110 L25 75 L20 170" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="3 3" />
          <polygon points="0,-70 35,-20 0,30 -35,-20" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="1.5" />
          <!-- Model Gesture Dynamic Lines -->
          <circle cx="-130" cy="75" r="14" fill="none" stroke="${primaryColor}" stroke-width="1.5" opacity="0.6" />
          <circle cx="130" cy="75" r="14" fill="none" stroke="${primaryColor}" stroke-width="1.5" opacity="0.6" />
        </g>
      `;
    } else if (mode === "mannequin") {
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Mannequin Stand Base -->
          <ellipse cx="0" cy="220" rx="100" ry="16" fill="none" stroke="${primaryColor}" stroke-width="2" />
          <line x1="0" y1="160" x2="0" y2="220" stroke="${primaryColor}" stroke-width="3" />
          <!-- Tailor Form Torso -->
          <path d="M-75 -130 L75 -130 L95 -50 L90 50 L55 150 L-55 150 L-90 50 L-95 -50 Z" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2" />
          <!-- Structural Seam Measurement Grid -->
          <line x1="-90" y1="-50" x2="90" y2="-50" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="4 4" opacity="0.7" />
          <line x1="-80" y1="20" x2="80" y2="20" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="4 4" opacity="0.7" />
          <line x1="-55" y1="90" x2="55" y2="90" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="4 4" opacity="0.7" />
          <!-- Neck Cap -->
          <path d="M-30 -130 L30 -130 L20 -155 L-20 -155 Z" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2" />
        </g>
      `;
    } else if (mode === "lifestyle") {
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Architectural Perspective Lines -->
          <line x1="-240" y1="-180" x2="0" y2="0" stroke="${primaryColor}" stroke-width="1" opacity="0.2" />
          <line x1="240" y1="-180" x2="0" y2="0" stroke="${primaryColor}" stroke-width="1" opacity="0.2" />
          <line x1="-240" y1="180" x2="0" y2="0" stroke="${primaryColor}" stroke-width="1" opacity="0.2" />
          <line x1="240" y1="180" x2="0" y2="0" stroke="${primaryColor}" stroke-width="1" opacity="0.2" />
          <!-- Scene Backdrop Rectangles -->
          <rect x="-180" y="-120" width="120" height="240" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="6 6" opacity="0.3" />
          <rect x="60" y="-120" width="120" height="240" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-dasharray="6 6" opacity="0.3" />
          <!-- Lifestyle Subject & Product in Environment -->
          <circle cx="0" cy="-30" r="110" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2" />
          <path d="M-60 -80 L60 -80 L80 10 L-80 10 Z" fill="${primaryColor}" fill-opacity="0.25" stroke="${primaryColor}" stroke-width="2" />
          <circle cx="0" cy="-30" r="45" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="4 4" />
        </g>
      `;
    } else if (mode === "detail") {
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Macro Circular Viewport Focus -->
          <circle cx="0" cy="0" r="180" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2.5" />
          <!-- Precision Technical Weave Grid -->
          <g stroke="${primaryColor}" stroke-width="1" opacity="0.4">
            <line x1="-150" y1="-100" x2="150" y2="-100" />
            <line x1="-165" y1="-50" x2="165" y2="-50" />
            <line x1="-180" y1="0" x2="180" y2="0" stroke-width="1.5" />
            <line x1="-165" y1="50" x2="165" y2="50" />
            <line x1="-150" y1="100" x2="150" y2="100" />
            
            <line x1="-100" y1="-150" x2="-100" y2="150" />
            <line x1="-50" y1="-165" x2="-50" y2="165" />
            <line x1="0" y1="-180" x2="0" y2="180" stroke-width="1.5" />
            <line x1="50" y1="-165" x2="50" y2="165" />
            <line x1="100" y1="-150" x2="100" y2="150" />
          </g>
          <!-- Material Hardware / Seam Detail -->
          <rect x="-60" y="-60" width="120" height="120" rx="16" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="2" />
          <circle cx="0" cy="0" r="28" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="4 4" />
          <circle cx="0" cy="0" r="8" fill="${primaryColor}" />
          <!-- Dimension Callout Lines -->
          <path d="M70 -70 L110 -110 L150 -110" fill="none" stroke="${primaryColor}" stroke-width="1.5" />
          <text x="155" y="-106" fill="${primaryColor}" font-family="monospace" font-size="11" font-weight="bold">MICRO-SPEC 0.4mm</text>
        </g>
      `;
    } else {
      // Editorial mode
      modeContent = `
        <g transform="translate(${cx}, ${cy}) scale(${scale})">
          <!-- Cinematic 2.35:1 & Framing Bars -->
          <line x1="-220" y1="-170" x2="220" y2="-170" stroke="${primaryColor}" stroke-width="1.5" opacity="0.4" />
          <line x1="-220" y1="170" x2="220" y2="170" stroke="${primaryColor}" stroke-width="1.5" opacity="0.4" />
          <!-- Diagonal Dramatic Light Ray -->
          <polygon points="-220,-170 120,-170 220,170 -120,170" fill="${primaryColor}" fill-opacity="0.06" />
          <!-- Editorial Hero Composition -->
          <path d="M-100 -120 L80 -100 L110 50 L-60 120 Z" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="2.5" />
          <circle cx="-10" cy="-20" r="90" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.5" />
          <path d="M-40 -80 L60 -65 L40 60 L-70 40 Z" fill="${primaryColor}" fill-opacity="0.2" stroke="${primaryColor}" stroke-width="1.5" />
          <!-- High-Fashion Typography Accent -->
          <text x="-210" y="160" fill="${primaryColor}" font-family="monospace" font-size="10" letter-spacing="3" opacity="0.8">STUDIO EDITORIAL // VOL.02</text>
        </g>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%" className="w-full h-full block select-none">
        <defs>
          <pattern id="grid-${variantIndex}-${w}-${h}" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${bg.gridColor}" stroke-width="1" />
          </pattern>
          <linearGradient id="lighting-grad-${variantIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        <!-- Canvas Background -->
        <rect width="${w}" height="${h}" fill="${bg.fill}" stroke="${bg.stroke}" stroke-width="1" />
        <rect width="${w}" height="${h}" fill="url(#grid-${variantIndex}-${w}-${h})" />
        <rect width="${w}" height="${h}" fill="url(#lighting-grad-${variantIndex})" opacity="0.6" />

        <!-- Framing Corner Brackets -->
        <path d="M 16 32 L 16 16 L 32 16" fill="none" stroke="${primaryColor}" stroke-width="2" />
        <path d="M ${w - 32} 16 L ${w - 16} 16 L ${w - 16} 32" fill="none" stroke="${primaryColor}" stroke-width="2" />
        <path d="M 16 ${h - 32} L 16 ${h - 16} L 32 ${h - 16}" fill="none" stroke="${primaryColor}" stroke-width="2" />
        <path d="M ${w - 32} ${h - 16} L ${w - 16} ${h - 16} L ${w - 16} ${h - 32}" fill="none" stroke="${primaryColor}" stroke-width="2" />

        <!-- Top Status Bar -->
        <g transform="translate(24, 30)">
          <rect x="0" y="0" width="100" height="20" rx="3" fill="#000000" fill-opacity="0.8" stroke="${primaryColor}" stroke-width="1" />
          <circle cx="10" cy="10" r="3.5" fill="${primaryColor}" />
          <text x="20" y="14" fill="#FFFFFF" font-family="monospace" font-size="9" font-weight="bold" letter-spacing="1">DEV PREVIEW</text>

          <text x="${w - 48}" y="14" text-anchor="end" fill="${primaryColor}" font-family="monospace" font-size="10" font-weight="bold">
            ${slotCode} // ${aspectRatio}
          </text>
        </g>

        <!-- Mode Specific Generated Visualization -->
        ${modeContent}

        <!-- Bottom Technical Parameter Slate -->
        <g transform="translate(24, ${h - 26})">
          <rect x="0" y="-16" width="${w - 48}" height="26" rx="4" fill="#000000" fill-opacity="0.75" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
          <text x="12" y="1" fill="#FFFFFF" font-family="monospace" font-size="9" font-weight="600">
            MODE: ${mode.toUpperCase()} | LIGHT: ${settings.lighting.replace("_", " ").toUpperCase()}
          </text>
          <text x="${w - 60}" y="1" text-anchor="end" fill="#94A3B8" font-family="monospace" font-size="9">
            ${projectName.toUpperCase()}
          </text>
        </g>
      </svg>
    `;
  }
}
