/**
 * Slots Studio — Production Studio Domain Models (STUDIO 05)
 *
 * Defines technical data models for apparel manufacturing, Bill of Materials (BOM),
 * size grading tables, seam specifications, quality control, and versioned tech packs.
 */

import { type Job } from "@/lib/jobs/types";

export type TechPackStatus = "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface MaterialItem {
  id: string;
  placement: string; // e.g. "Main Outer Shell", "Side Vent Panels", "Pocket Lining"
  fabricName: string; // e.g. "3-Layer Micro-Ripstop Tech Poly"
  composition: string; // e.g. "88% Recycled Polyester, 12% Spandex"
  weightGsm: number; // e.g. 140
  finishTreatment: string; // e.g. "C0 PFC-Free DWR + 20,000mm Hydrophilic Membrane"
  supplierRef?: string; // e.g. "TORAY-KINETIC-88"
}

export interface TrimItem {
  id: string;
  type: string; // e.g. "Main Zipper", "Pocket Pulls", "Cord Locks", "Eyelets"
  description: string; // e.g. "YKK AquaGuard® #5 Matte Waterproof Coil Zipper"
  placement: string; // e.g. "Center Front"
  colorRef: string; // e.g. "Matte Pitch Black / Electric Lime Pull"
  supplierRef?: string; // e.g. "YKK-AQ5-MATTE"
  quantityPerUnit: string; // e.g. "1 pc (75cm)"
}

export interface ColorwayMapping {
  id: string;
  colorwayName: string; // e.g. "Colorway 01 — Stealth Black"
  hexPrimary: string; // e.g. "#000000"
  hexAccent: string; // e.g. "#B7FF00"
  pantonePrimary: string; // e.g. "PANTONE 19-4008 TCX (Meteorite)"
  pantoneAccent: string; // e.g. "PANTONE 13-0550 TCX (Lime Punch)"
  placementSummary: string; // e.g. "Body in Pitch Black, zipper pulls & interior seam tape in Lime"
}

export interface MeasurementPoint {
  id: string;
  code: string; // e.g. "POM-01"
  pointName: string; // e.g. "Chest Width (1\" below armhole)"
  toleranceCm: number; // e.g. 0.5
  xs: number; // in cm
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
}

export interface ConstructionSpec {
  seamType: string; // e.g. "Ultrasonic Welded + 8mm Bemis 3-Layer Heat-Sealed Seam Tape"
  spi: string; // e.g. "12-14 Stitches Per Inch on stress zones"
  edgeFinishing: string; // e.g. "Laser-cut clean-bonded edge with laminated hem"
  hoodConstruction?: string; // e.g. "3-panel ergonomic storm hood with laminated visor & dual Cohaesive cord locks"
  cuffConstruction?: string; // e.g. "Articulated storm cuffs with laser-cut low-profile thumb loops"
  ventilationSpec?: string; // e.g. "Laser-perforated dynamic underarm breathability matrix"
}

export interface ManufacturingQC {
  careInstructions: string[]; // e.g. ["Machine wash cold 30°C delicate", "Tumble dry low to reactivate DWR"]
  washCareSymbols: string; // e.g. "30C_WASH | NO_BLEACH | LOW_TUMBLE | DO_NOT_IRON"
  packagingSpec: string; // e.g. "Biodegradable FSC Polybag, folded with silica desiccant & slot-code QR tag"
  inspectionAql: string; // e.g. "AQL 1.5 Major / AQL 2.5 Minor (ANSI/ASQC Z1.4 Standard)"
  factoryTolerances: string; // e.g. "±0.5cm critical dimensions, zero adhesive bleed on welded tape"
}

export interface ArtworkPlacement {
  id: string;
  item: string; // e.g. "3M Scotchlite Reflective Chest Logo"
  placement: string; // e.g. "Left chest, 12cm down from high shoulder point"
  technique: string; // e.g. "High-density thermal heat transfer (160°C @ 4 bar, 12s)"
  dimensions: string; // e.g. "35mm x 18mm"
}

export interface TechPack {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  slotCode: string;
  version: string; // e.g. "v1.0", "v1.1", "v2.0"
  parentVersionId?: string;
  season: string; // e.g. "FW26 / Spring Drop 01"
  status: TechPackStatus;
  targetRegion: string; // e.g. "Portugal / High-Performance Athletic Lab"
  materials: MaterialItem[];
  trims: TrimItem[];
  colorways: ColorwayMapping[];
  measurements: MeasurementPoint[];
  construction: ConstructionSpec;
  qc: ManufacturingQC;
  artwork: ArtworkPlacement[];
  factoryNotes: string;
  changelog: string;
  savedAssetId?: string;
  jobId?: string;
  rawMarkdownSpec: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovedProductContext {
  productName: string;
  category: string;
  description: string;
  silhouette: string;
  colorways: string[];
  materials: string[];
  approvedConceptId?: string;
  isApproved: boolean;
}

export interface ProductionStudioState {
  workspaceId: string;
  projectId: string;
  projectName: string;
  slotCode: string;
  approvedContext: ApprovedProductContext;
  techPacks: TechPack[];
  activeTechPack: TechPack | null;
  activeJob: Job | null;
}

export interface GenerateTechPackRequest {
  projectId: string;
  season?: string;
  targetRegion?: string;
  customDirectives?: string;
  parentVersionId?: string;
}

export interface UpdateTechPackInput {
  techPackId: string;
  season?: string;
  targetRegion?: string;
  factoryNotes?: string;
  changelog?: string;
  materials?: MaterialItem[];
  trims?: TrimItem[];
  colorways?: ColorwayMapping[];
  measurements?: MeasurementPoint[];
  construction?: Partial<ConstructionSpec>;
  qc?: Partial<ManufacturingQC>;
}

export interface ExportTechPackRequest {
  techPackId: string;
  format: "MARKDOWN" | "JSON" | "CSV_BOM";
}

export interface ExportTechPackResult {
  filename: string;
  mimeType: string;
  content: string;
}
