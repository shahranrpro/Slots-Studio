/**
 * Slots Studio — Development Concept Provider Adapter
 *
 * ARCHITECTURAL NOTICE:
 * This provider generates structured development concept candidates with
 * deterministic technical vector silhouettes. It is used for offline development,
 * component testing, and local simulation.
 *
 * It is clearly flagged with `isDevelopmentPreview: true` and does not claim
 * production AI telemetry or fabricated accuracy metrics.
 */

import {
  type ConceptProvider,
  type ConceptGenerationRequest,
  type ConceptGenerationResult,
  type ConceptVariant,
} from "../types";

// Vector silhouette presets for categories
const SILHOUETTE_SVGS: Record<string, string> = {
  outerwear: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
      <path d="M60 40 L85 30 L100 45 L115 30 L140 40 L165 75 L145 90 L135 70 L135 170 L65 170 L65 70 L55 90 L35 75 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.06"/>
      <path d="M100 45 L100 170" stroke-width="1.5" stroke-dasharray="4 4" stroke-opacity="0.6"/>
      <circle cx="85" cy="80" r="4" fill="currentColor" fill-opacity="0.4"/>
      <circle cx="115" cy="80" r="4" fill="currentColor" fill-opacity="0.4"/>
      <line x1="75" y1="120" x2="95" y2="120" stroke-width="1.5"/>
      <line x1="105" y1="120" x2="125" y2="120" stroke-width="1.5"/>
    </svg>
  `,
  footwear: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
      <path d="M30 140 C50 145 130 145 170 135 C175 125 170 100 145 85 C130 75 110 70 100 80 C90 90 85 100 65 105 C45 110 35 120 30 140 Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity="0.06"/>
      <path d="M25 145 L175 140 C175 148 165 155 140 155 L40 155 C30 155 25 150 25 145 Z" stroke-width="2" fill="currentColor" fill-opacity="0.12"/>
      <line x1="70" y1="105" x2="95" y2="85" stroke-width="1.5" stroke-dasharray="3 3"/>
      <line x1="85" y1="115" x2="110" y2="95" stroke-width="1.5" stroke-dasharray="3 3"/>
    </svg>
  `,
  accessories: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
      <rect x="50" y="50" width="100" height="120" rx="16" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <path d="M75 50 C75 35 125 35 125 50" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="90" x2="150" y2="90" stroke-width="1.5"/>
      <rect x="65" y="110" width="70" height="40" rx="6" stroke-width="1.5" stroke-dasharray="4 4"/>
    </svg>
  `,
  general: `
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-[var(--accent)] stroke-current">
      <rect x="40" y="40" width="120" height="120" rx="8" stroke-width="2" fill="currentColor" fill-opacity="0.06"/>
      <circle cx="100" cy="100" r="36" stroke-width="1.5" stroke-dasharray="6 4"/>
      <line x1="40" y1="100" x2="160" y2="100" stroke-width="1" stroke-opacity="0.4"/>
      <line x1="100" y1="40" x2="100" y2="160" stroke-width="1" stroke-opacity="0.4"/>
    </svg>
  `,
};

export function getSilhouetteForCategory(cat: string): string {
  const normalized = cat.toLowerCase();
  if (normalized.includes("jacket") || normalized.includes("outerwear") || normalized.includes("apparel")) {
    return SILHOUETTE_SVGS.outerwear;
  }
  if (normalized.includes("footwear") || normalized.includes("shoe") || normalized.includes("sneaker")) {
    return SILHOUETTE_SVGS.footwear;
  }
  if (normalized.includes("pack") || normalized.includes("bag") || normalized.includes("accessories")) {
    return SILHOUETTE_SVGS.accessories;
  }
  return SILHOUETTE_SVGS.general;
}

export class DevConceptProviderAdapter implements ConceptProvider {
  name = "SlotsStudio-DevConceptEngine";

  async generateConcepts(request: ConceptGenerationRequest): Promise<ConceptGenerationResult> {
    // Artificial small delay simulating generation pipeline
    await new Promise((resolve) => setTimeout(resolve, 800));

    const count = Math.min(Math.max(request.variantsCount || 3, 1), 4);
    const variants: ConceptVariant[] = [];

    const defaultColors = request.colors?.length ? request.colors : ["#000000", "#B7FF00", "#FFFFFF"];
    const defaultMaterials = request.materials?.length
      ? request.materials
      : ["Technical Ripstop Nylon", "Breathable Mesh", "Anodized Aluminum Accents"];

    for (let i = 1; i <= count; i++) {
      const id = `concept_${Date.now()}_${i}`;
      const code = `CANDIDATE-${i.toString().padStart(2, "0")}`;

      let styleFocus = "Balanced Ergonomic Silhouette";
      if (i === 1) styleFocus = "Technical High-Contrast Minimalist";
      if (i === 2) styleFocus = "Aerodynamic Streamlined Silhouette";
      if (i === 3) styleFocus = "Modular Layered Utility Architecture";
      if (i === 4) styleFocus = "Experimental Avant-Garde Profile";

      variants.push({
        id,
        candidateCode: code,
        title: `${request.productName} — Pass ${code}`,
        summary: `${styleFocus} crafted for ${request.targetUser || "performance creatives"}.`,
        silhouetteDescription: `Engineered ${request.category.toLowerCase()} geometry with ${request.visualDirection || "contemporary functional aesthetic"}.`,
        svgWireframe: getSilhouetteForCategory(request.category + " " + request.productName),
        colorPalette: defaultColors,
        suggestedMaterials: defaultMaterials,
        isDevelopmentPreview: true,
      });
    }

    return {
      success: true,
      variants,
      provider: this.name,
      model: "development-silhouette-engine",
    };
  }

  async refineConcept(
    baseVariant: ConceptVariant,
    instructions: string,
    _context: ConceptGenerationRequest
  ): Promise<ConceptVariant> {
    void _context;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const id = `concept_${Date.now()}_ref_${Math.random().toString(36).substring(2, 6)}`;
    const code = `${baseVariant.candidateCode}-R`;

    return {
      id,
      candidateCode: code,
      title: `${baseVariant.title} (Refined)`,
      summary: `Refined iteration based on operator guidance: "${instructions}".`,
      silhouetteDescription: `${baseVariant.silhouetteDescription} Adapted with specific focus on: ${instructions}.`,
      svgWireframe: baseVariant.svgWireframe,
      colorPalette: baseVariant.colorPalette,
      suggestedMaterials: baseVariant.suggestedMaterials,
      isDevelopmentPreview: true,
      parentConceptId: baseVariant.id,
      refinementNotes: instructions,
    };
  }
}
