/**
 * Slots Studio — Deterministic Production AI Provider Adapter (STUDIO 05)
 *
 * Synthesizes structured apparel Bill of Materials (BOM), size grading tables,
 * seam welding specifications, and factory QC protocols from approved product context.
 *
 * Clearly labeled as DEV PREVIEW.
 */

import {
  type ApprovedProductContext,
  type MaterialItem,
  type TrimItem,
  type ColorwayMapping,
  type MeasurementPoint,
  type ConstructionSpec,
  type ManufacturingQC,
  type ArtworkPlacement,
  type TechPack,
} from "@/lib/production/types";

export interface SynthesizeTechPackParams {
  season?: string;
  targetRegion?: string;
  customDirectives?: string;
  versionNumber: string;
  parentVersionId?: string;
}

export class DevProductionProviderAdapter {
  readonly providerName = "DevProductionProviderAdapter";
  readonly modelLabel = "SLOTS-PRODUCTION-V1 (DEV PREVIEW)";

  /**
   * Synthesizes a comprehensive manufacturing Tech Pack from approved product context.
   */
  async synthesizeTechPack(
    workspaceId: string,
    projectId: string,
    projectName: string,
    slotCode: string,
    context: ApprovedProductContext,
    params: SynthesizeTechPackParams
  ): Promise<Omit<TechPack, "id" | "createdAt" | "updatedAt">> {
    const season = params.season || "FW26 / Drop 01";
    const targetRegion = params.targetRegion || "Portugal / Tech Lab Facilities";
    const version = params.versionNumber;

    // 1. Synthesize Bill of Materials (BOM) based on inherited materials
    const materials: MaterialItem[] = [
      {
        id: `mat_01_${Date.now()}`,
        placement: "Main Outer Shell & Hood Visor",
        fabricName: context.materials[0] || "3-Layer Micro-Ripstop Technical Poly",
        composition: "88% Recycled Polyester, 12% Spandex Elastane",
        weightGsm: 145,
        finishTreatment: "C0 PFC-Free DWR (20,000mm Hydrostatic Head / 18,000g/m² Breathability)",
        supplierRef: "TX-POLY-3L-RE",
      },
      {
        id: `mat_02_${Date.now()}`,
        placement: "Underarm & Dynamic Articulation Vent Inserts",
        fabricName: context.materials[1] || "Articulated Stretch Warp-Knit Mesh",
        composition: "82% Polyamide, 18% Elastane",
        weightGsm: 120,
        finishTreatment: "Laser-Microperforated Airflow Hydrophilic Wicking",
        supplierRef: "TX-MESH-AIR-120",
      },
      {
        id: `mat_03_${Date.now()}`,
        placement: "Interior Seam Taping & Reinforcement Patches",
        fabricName: "Bemis 3-Layer Heat-Activated Thermoplastic Polyurethane Tape",
        composition: "100% TPU with Polyamide Backing",
        weightGsm: 65,
        finishTreatment: "8mm Ultrasonic Bonded Seam Sealant",
        supplierRef: "BEMIS-EXO-8MM",
      },
    ];

    // 2. Synthesize Trims & Hardware
    const trims: TrimItem[] = [
      {
        id: `trm_01_${Date.now()}`,
        type: "Center Front Zipper",
        description: "YKK AquaGuard® #5 Matte Waterproof Coil Zipper with Reverse Slider",
        placement: "Center front opening from neck to chest vent",
        colorRef: "Matte Pitch Black / Electric Lime Puller",
        supplierRef: "YKK-AQ5-MATTE-BLK",
        quantityPerUnit: "1 pc (68cm)",
      },
      {
        id: `trm_02_${Date.now()}`,
        type: "Pocket Closures",
        description: "YKK AquaGuard® #3 Concealed Storm Zippers",
        placement: "Left chest media pocket + dual side seam storage",
        colorRef: "Matte Black",
        supplierRef: "YKK-AQ3-CONCEAL",
        quantityPerUnit: "3 pcs (18cm)",
      },
      {
        id: `trm_03_${Date.now()}`,
        type: "Cord Adjustment System",
        description: "Cohaesive™ Integrated Embedded Drawcord Stopper & Bungee Cable",
        placement: "Hood rim (2x) & Hem circumference (2x)",
        colorRef: "Stealth Black Anodized Alloy",
        supplierRef: "COH-EMBED-10",
        quantityPerUnit: "4 units + 140cm cord",
      },
      {
        id: `trm_04_${Date.now()}`,
        type: "Storm Cuff Closures",
        description: "Bonded Hypalon Velcro Tab with Laser-Etched Slot Code",
        placement: "Left & right sleeve cuffs",
        colorRef: "Pitch Black with Lime deboss",
        supplierRef: "HYP-CUFF-TAB-01",
        quantityPerUnit: "2 pairs",
      },
    ];

    // 3. Synthesize Colorway Mappings from inherited palette
    const colorways: ColorwayMapping[] = [
      {
        id: `col_01_${Date.now()}`,
        colorwayName: "Colorway 01 — Stealth / Kinetic Lime (Primary)",
        hexPrimary: context.colorways[0] || "#000000",
        hexAccent: context.colorways[1] || "#B7FF00",
        pantonePrimary: "PANTONE 19-4008 TCX (Meteorite)",
        pantoneAccent: "PANTONE 13-0550 TCX (Lime Punch)",
        placementSummary: "Main body in Pitch Black, zipper pulls, hood drawcords & interior seam sealing in Electric Lime.",
      },
      {
        id: `col_02_${Date.now()}`,
        colorwayName: "Colorway 02 — Storm Shadow / Arctic White",
        hexPrimary: "#18181B",
        hexAccent: context.colorways[2] || "#FFFFFF",
        pantonePrimary: "PANTONE 19-3911 TCX (Deep Charcoal)",
        pantoneAccent: "PANTONE 11-0601 TCX (Bright White)",
        placementSummary: "Main body in Dark Storm Charcoal, all reflective callouts, trims & branding in Arctic White.",
      },
    ];

    // 4. Synthesize Size Grading Matrix (XS, S, M, L, XL, XXL) based on silhouette
    const measurements: MeasurementPoint[] = [
      {
        id: "pom_01",
        code: "POM-01",
        pointName: 'Chest Width (1" below armhole, straight across)',
        toleranceCm: 0.5,
        xs: 52.0,
        s: 55.0,
        m: 58.0,
        l: 61.0,
        xl: 64.5,
        xxl: 68.0,
      },
      {
        id: "pom_02",
        code: "POM-02",
        pointName: "Body Length (Center Back neck seam to bottom hem)",
        toleranceCm: 0.7,
        xs: 69.0,
        s: 71.0,
        m: 73.0,
        l: 75.0,
        xl: 77.5,
        xxl: 80.0,
      },
      {
        id: "pom_03",
        code: "POM-03",
        pointName: "Raglan Sleeve Length (From Center Back neck to cuff edge)",
        toleranceCm: 0.5,
        xs: 85.0,
        s: 87.5,
        m: 90.0,
        l: 92.5,
        xl: 95.0,
        xxl: 97.5,
      },
      {
        id: "pom_04",
        code: "POM-04",
        pointName: "Hem Circumference (Relaxed bottom sweep)",
        toleranceCm: 0.5,
        xs: 50.0,
        s: 53.0,
        m: 56.0,
        l: 59.0,
        xl: 62.5,
        xxl: 66.0,
      },
      {
        id: "pom_05",
        code: "POM-05",
        pointName: "Bicep Width (At widest point of arm sleeve)",
        toleranceCm: 0.4,
        xs: 20.0,
        s: 21.0,
        m: 22.0,
        l: 23.2,
        xl: 24.5,
        xxl: 26.0,
      },
      {
        id: "pom_06",
        code: "POM-06",
        pointName: "Neck Width (Seam to seam across collar opening)",
        toleranceCm: 0.3,
        xs: 19.5,
        s: 20.0,
        m: 20.5,
        l: 21.0,
        xl: 21.8,
        xxl: 22.5,
      },
    ];

    // 5. Synthesize Construction & Seam Protocols
    const construction: ConstructionSpec = {
      seamType: "Ultrasonic welded construction with 8mm Bemis 3-layer hot-air taped seam seals.",
      spi: "12-14 Stitches Per Inch on stress articulation darts and pocket anchors.",
      edgeFinishing: "Laser-cut ultrasonic clean-bonded hem with dropped-tail rear profile.",
      hoodConstruction: "3-panel ergonomic storm hood with laminated reinforced visor & dual Cohaesive cord locks.",
      cuffConstruction: "Bonded storm cuffs with laser-cut low-profile thumb loops & hypalon micro-adjust tabs.",
      ventilationSpec: "Precision laser-cut matrix vents under arms and across upper shoulder blades.",
    };

    // 6. Synthesize Quality Control & Care Protocols
    const qc: ManufacturingQC = {
      careInstructions: [
        "Machine wash cold at 30°C on delicate technical wash cycle",
        "Use mild technical detergent (do NOT use fabric softeners or chlorine bleach)",
        "Tumble dry on low heat for 20 minutes to reactivate outer DWR water-repellent coating",
        "Do NOT dry clean. Do NOT iron directly onto reflective artwork or seam tape",
      ],
      washCareSymbols: "30C_WASH | NO_BLEACH | LOW_TUMBLE | DO_NOT_IRON | DO_NOT_DRY_CLEAN",
      packagingSpec: "100% Biodegradable cornstarch polybag with silica desiccant packet. FSC-certified recycled cardstock hangtag with slot code QR passport.",
      inspectionAql: "Strict AQL 1.5 Major Defects / AQL 2.5 Minor Defects (ANSI/ASQC Z1.4 Inspection Standard).",
      factoryTolerances: "±0.5cm tolerance on all critical points of measurement. Zero adhesive bleed tolerance on heat-sealed taped seams.",
    };

    // 7. Synthesize Artwork / Reflective Graphics Placement
    const artwork: ArtworkPlacement[] = [
      {
        id: "art_01",
        item: "3M Scotchlite Reflective Chest Wordmark",
        placement: "Left chest, 12cm down from high shoulder point",
        technique: "High-density thermal heat transfer (160°C @ 4 bar, 12s dwell)",
        dimensions: "42mm x 14mm",
      },
      {
        id: "art_02",
        item: "Slot Code Technical Identifier Badge",
        placement: "Right bicep sleeve panel, 15cm down from shoulder seam",
        technique: "Micro-injected silicone badge on bonded backing",
        dimensions: "30mm x 10mm",
      },
      {
        id: "art_03",
        item: "Rear Center Neck Kinetic Signal Bar",
        placement: "Center back below hood collar seam",
        technique: "Reflective 550 candela high-visibility vinyl transfer",
        dimensions: "60mm x 4mm",
      },
    ];

    const factoryNotes = params.customDirectives ||
      `Engineered for high-output kinetic performance. Maintain strict tension control during ultrasonic tape bonding to prevent seam puckering. Ensure all YKK AquaGuard zips are tested for smooth 1-handed slider operation. Approved concept ID: ${context.approvedConceptId || "NONE"}.`;

    const changelog = params.parentVersionId
      ? `Revision ${version}: Refined size grading tolerances and updated trim callouts from parent ${params.parentVersionId}.`
      : `Initial manufacturing release ${version} synthesized from Product Studio approved context.`;

    // 8. Generate Raw Markdown Tech Pack Document
    const rawMarkdownSpec = generateMarkdownTechPack({
      projectName,
      slotCode,
      version,
      season,
      targetRegion,
      context,
      materials,
      trims,
      colorways,
      measurements,
      construction,
      qc,
      artwork,
      factoryNotes,
      modelLabel: this.modelLabel,
    });

    return {
      workspaceId,
      projectId,
      projectName,
      slotCode,
      version,
      parentVersionId: params.parentVersionId,
      season,
      status: "IN_REVIEW",
      targetRegion,
      materials,
      trims,
      colorways,
      measurements,
      construction,
      qc,
      artwork,
      factoryNotes,
      changelog,
      rawMarkdownSpec,
    };
  }
}

function generateMarkdownTechPack(data: {
  projectName: string;
  slotCode: string;
  version: string;
  season: string;
  targetRegion: string;
  context: ApprovedProductContext;
  materials: MaterialItem[];
  trims: TrimItem[];
  colorways: ColorwayMapping[];
  measurements: MeasurementPoint[];
  construction: ConstructionSpec;
  qc: ManufacturingQC;
  artwork: ArtworkPlacement[];
  factoryNotes: string;
  modelLabel: string;
}): string {
  return `# MANUFACTURING TECH PACK SPECIFICATION
**Product Slot:** ${data.slotCode} — ${data.projectName}
**Specification Version:** ${data.version} | **Season:** ${data.season}
**Target Facility:** ${data.targetRegion}
**Engine:** ${data.modelLabel}
**Date Generated:** ${new Date().toISOString()}

---

## 1. PRODUCT IDENTITY & SILHOUETTE
- **Product Name:** ${data.projectName}
- **Category:** ${data.context.category}
- **Silhouette Fit:** ${data.context.silhouette}
- **Canonical Design Statement:** ${data.context.description}

---

## 2. BILL OF MATERIALS (BOM)
| Ref | Placement | Fabric Description | Composition | Weight | Finish & Treatment |
| :--- | :--- | :--- | :--- | :--- | :--- |
${data.materials.map((m, i) => `| M-${i + 1} | ${m.placement} | ${m.fabricName} | ${m.composition} | ${m.weightGsm} GSM | ${m.finishTreatment} |`).join("\n")}

---

## 3. TRIMS & HARDWARE SPECIFICATION
| Ref | Type | Item Description | Placement | Colorway Callout | Quantity |
| :--- | :--- | :--- | :--- | :--- | :--- |
${data.trims.map((t, i) => `| T-${i + 1} | ${t.type} | ${t.description} | ${t.placement} | ${t.colorRef} | ${t.quantityPerUnit} |`).join("\n")}

---

## 4. COLORWAY MAPPINGS
${data.colorways.map((c) => `### ${c.colorwayName}
- **Primary:** ${c.hexPrimary} (${c.pantonePrimary})
- **Accent:** ${c.hexAccent} (${c.pantoneAccent})
- **Placement Details:** ${c.placementSummary}
`).join("\n")}

---

## 5. MEASUREMENT SPECIFICATION & SIZE GRADING MATRIX (CM)
| Code | Point of Measurement (POM) | Tol (±) | XS | S | M | L | XL | XXL |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${data.measurements.map((p) => `| ${p.code} | ${p.pointName} | ${p.toleranceCm} | ${p.xs} | ${p.s} | ${p.m} | ${p.l} | ${p.xl} | ${p.xxl} |`).join("\n")}

---

## 6. CONSTRUCTION & SEAM SPECIFICATIONS
- **Seam Assembly:** ${data.construction.seamType}
- **Stitch Density (SPI):** ${data.construction.spi}
- **Edge & Hem Finishing:** ${data.construction.edgeFinishing}
- **Hood Construction:** ${data.construction.hoodConstruction || "N/A"}
- **Cuff Construction:** ${data.construction.cuffConstruction || "N/A"}
- **Breathability Matrix:** ${data.construction.ventilationSpec || "N/A"}

---

## 7. ARTWORK & GRAPHICS PLACEMENT
${data.artwork.map((a, i) => `### A-${i + 1}: ${a.item}
- **Location:** ${a.placement}
- **Application Method:** ${a.technique}
- **Dimensions:** ${a.dimensions}
`).join("\n")}

---

## 8. QUALITY CONTROL, CARE & PACKAGING
- **Inspection Standard:** ${data.qc.inspectionAql}
- **Critical Tolerances:** ${data.qc.factoryTolerances}
- **Care Instructions:**
${data.qc.careInstructions.map((c) => `  - ${c}`).join("\n")}
- **Packaging Protocol:** ${data.qc.packagingSpec}

---

## 9. FACTORY DIRECTIVES & SPECIAL NOTES
${data.factoryNotes}
`;
}

export const devProductionProvider = new DevProductionProviderAdapter();
