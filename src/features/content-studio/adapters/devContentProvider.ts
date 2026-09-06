/**
 * Slots Studio — Deterministic Development Content Provider Adapter
 *
 * Implements ContentProvider for development and testing.
 * Synthesizes high-fidelity, structured copy inheriting approved product context
 * with clear DEV PREVIEW labeling and honest metadata without fake AI scores.
 */

import {
  type ContentProvider,
  type ContentGenerationRequest,
  type ContentRefineRequest,
  type ContentMetadata,
} from "@/lib/content/types";

export class DevContentProviderAdapter implements ContentProvider {
  async generate(request: ContentGenerationRequest): Promise<{
    title: string;
    content: string;
    summary: string;
    metadata: ContentMetadata;
  }> {
    const { approvedContext, contentType, tone, audience, customInstructions } = request;
    const { productName, category, description, silhouette, colorways, materials } = approvedContext;

    const primaryColor = colorways && colorways.length > 0 ? colorways[0] : "Monochrome";
    const colorList = colorways && colorways.length > 0 ? colorways.join(", ") : "Standard Core Palette";
    const materialList = materials && materials.length > 0 ? materials.join(" • ") : "Engineered Technical Fiber";

    let title = "";
    let summary = "";
    let content = "";

    switch (contentType) {
      case "PRODUCT_DESCRIPTION": {
        title = `${productName} — Official Product Overview`;
        summary = `Complete e-commerce overview with silhouette geometry, ergonomic fit, and material properties.`;
        content = `### ${productName.toUpperCase()}\n\n` +
          `**Category:** ${category} | **Silhouette:** ${silhouette} | **Colorway:** ${primaryColor}\n\n` +
          `#### The Design Statement\n` +
          `Engineered at the intersection of athletic performance and architectural streetwear, the **${productName}** delivers uncompromising utility for the modern creator. ` +
          `Rooted in an ergonomic ${silhouette.toLowerCase()} silhouette, every seam and contour is calibrated for dynamic range of motion and technical precision.\n\n` +
          `#### Material Engineering\n` +
          `Constructed utilizing **${materialList}**, the garment features a multi-density weave that balances moisture vapor regulation with structural drape. ` +
          `${description ? `\n\n> "${description}"` : ""}\n\n` +
          `#### Performance Attributes\n` +
          `- **Fit Profile:** Ergonomic ${silhouette} tailoring with articulated mobility zones\n` +
          `- **Textile Matrix:** ${materialList}\n` +
          `- **Calibrated Palette:** ${colorList}\n` +
          `- **Durability Index:** Reinforced stress points and laser-cut bonded hems\n\n` +
          `${customInstructions ? `*Special Directive:* ${customInstructions}\n\n` : ""}` +
          `*Slots Studio Dev Preview // Generated for ${audience.replace("_", " ")} under ${tone} tone profile.*`;
        break;
      }

      case "SHORT_DESCRIPTION": {
        title = `${productName} — Core Hook`;
        summary = `High-conversion 2-sentence product highlight.`;
        content = `The **${productName}** fuses technical **${materialList}** with an articulated **${silhouette}** silhouette—engineered for seamless transitions between high-performance movement and urban minimalism.\n\n` +
          `*Available in ${colorList}.*`;
        break;
      }

      case "FEATURE_BULLETS": {
        title = `${productName} — Technical Features & Specs`;
        summary = `5 structured engineering bullet points for product cards and technical spec sheets.`;
        content = `### Engineered Specifications\n\n` +
          `* **Articulated ${silhouette} Silhouette:** Precision-tailored pattern drafting enables unrestricted athletic flexion without excess volume.\n` +
          `* **Technical Textile System:** Crafted from **${materialList}** for rapid thermal dissipation and tactile abrasion resistance.\n` +
          `* **Color Calibration:** Finished in **${colorList}** with high-chroma fastness under intense studio and natural light.\n` +
          `* **Ergonomic Reinforcement:** Laser-bonded stress points engineered for prolonged daily usage.\n` +
          `* **Architectural Hardware:** Streamlined matte hardware designed for silent, low-profile tactical utility.`;
        break;
      }

      case "SOCIAL_CAPTION": {
        title = `${productName} — Multi-Channel Social Post`;
        summary = `Instagram/TikTok carousel copy with engagement hook and curated tags.`;
        content = `Create once. Carry the context everywhere. ⚡️\n\n` +
          `Introducing the **${productName}** [${category.toUpperCase()}].\n\n` +
          `Engineered in a sculptured ${silhouette.toLowerCase()} silhouette utilizing ${materialList}.\n` +
          `Finished in calibrated ${colorList}.\n\n` +
          `Built for the ${audience.replace("_", " ").toLowerCase()}. Available now on Slots Studio.\n\n` +
          `---\n` +
          `#SlotsStudio #SportswearDesign #TechnicalApparel #${productName.replace(/\s+/g, "")} #ErgonomicFit #${category.replace(/\s+/g, "")}`;
        break;
      }

      case "PRODUCT_STORY": {
        title = `${productName} — Origin & Brand Narrative`;
        summary = `Three-paragraph narrative exploring design philosophy and aesthetic tension.`;
        content = `### The Anatomy of Motion\n\n` +
          `The genesis of the **${productName}** began with a singular design inquiry: how can a ${category.toLowerCase()} provide maximum ergonomic utility without sacrificing architectural elegance? By deconstructing traditional sportswear patterns, the Slots design team established an articulated ${silhouette.toLowerCase()} geometry that honors natural biomechanics.\n\n` +
          `### Material Innovation\n\n` +
          `Rather than relying on generic synthetic blends, the garment incorporates **${materialList}**. Under high strain, the structural weave expands to release excess body heat, maintaining optimal microclimatic comfort across variable urban environments.\n\n` +
          `### Aesthetic Authority\n\n` +
          `Rendered in **${colorList}**, the ${productName} stands as a testament to disciplined form-follows-function minimalism. It is not merely apparel; it is high-precision equipment crafted for creators who refuse compromise.`;
        break;
      }

      case "CAMPAIGN_COPY": {
        title = `${productName} — Digital Ad Angles`;
        summary = `3 synchronized headline hooks and ad body copy.`;
        content = `### Angle 01: Performance Utility (High Energy)\n` +
          `**Headline:** RE-ENGINEER YOUR MOBILITY\n` +
          `**Sub-hook:** The ${productName} in ${silhouette} silhouette. Powered by ${materialList}.\n` +
          `**CTA:** Explore the Technical Spec\n\n` +
          `### Angle 02: Minimalist Aesthetic (Understated Luxury)\n` +
          `**Headline:** DISCIPLINED FORM. ZERO COMPROMISE.\n` +
          `**Sub-hook:** Clean architectural lines meet calibrated ${primaryColor} textile engineering.\n` +
          `**CTA:** Discover the Collection\n\n` +
          `### Angle 03: The Cultural Hook (Urban Lifestyle)\n` +
          `**Headline:** BORN FOR THE URBAN ARENA\n` +
          `**Sub-hook:** Built for the ${audience.replace("_", " ").toLowerCase()} with high-durability bonded seams.\n` +
          `**CTA:** Secure Your Slot`;
        break;
      }

      case "TECHNICAL_COPY": {
        title = `${productName} — Spec Sheet & Garment Care`;
        summary = `Engineering data sheet with material breakdown and wash protocols.`;
        content = `### Technical Data Sheet: ${productName.toUpperCase()}\n\n` +
          `| Parameter | Specification |\n` +
          `| :--- | :--- |\n` +
          `| **Product Name** | ${productName} |\n` +
          `| **Category** | ${category} |\n` +
          `| **Silhouette** | ${silhouette} |\n` +
          `| **Primary Material** | ${materialList} |\n` +
          `| **Core Colorway** | ${primaryColor} |\n` +
          `| **Target Demographic** | ${audience.replace("_", " ")} |\n` +
          `| **Tone Index** | ${tone} |\n\n` +
          `#### Garment Care Instructions\n` +
          `1. Machine wash cold (30°C) with like colors on gentle cycle.\n` +
          `2. Do not use fabric softeners or chlorine bleach.\n` +
          `3. Hang dry in shade to preserve technical bonded seams.\n` +
          `4. Do not iron directly on technical trims or reflective branding.`;
        break;
      }
    }

    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const readingTimeSeconds = Math.max(5, Math.ceil((wordCount / 200) * 60));

    return {
      title,
      content,
      summary,
      metadata: {
        wordCount,
        charCount,
        readingTimeSeconds,
        provider: "DevContentProviderAdapter",
        modelLabel: "SLOTS-SYNTHESIS-V1 (DEV PREVIEW)",
        isDevPreview: true,
      },
    };
  }

  async refine(request: ContentRefineRequest): Promise<{
    title: string;
    content: string;
    summary: string;
    metadata: ContentMetadata;
  }> {
    const { parentOutput, refinementNotes, customInstructions } = request;

    const updatedContent = `${parentOutput.content}\n\n` +
      `---\n\n` +
      `### Refinement v${parentOutput.version + 1}\n` +
      `*Operator Directive:* "${refinementNotes}"\n\n` +
      `> **Refined Copy Adjustment:**\n` +
      `> Further elevated for enhanced technical clarity, sharp rhythm, and precise focus on ergonomic advantage. ` +
      `${customInstructions ? `Incorporated custom directive: ${customInstructions}.` : ""}`;

    const wordCount = updatedContent.trim().split(/\s+/).length;
    const charCount = updatedContent.length;
    const readingTimeSeconds = Math.max(5, Math.ceil((wordCount / 200) * 60));

    return {
      title: `${parentOutput.title} (v${parentOutput.version + 1})`,
      content: updatedContent,
      summary: `Refined iteration based on operator directive: ${refinementNotes}`,
      metadata: {
        wordCount,
        charCount,
        readingTimeSeconds,
        provider: "DevContentProviderAdapter",
        modelLabel: "SLOTS-SYNTHESIS-V1 (DEV PREVIEW)",
        isDevPreview: true,
      },
    };
  }
}

export const devContentProvider = new DevContentProviderAdapter();
