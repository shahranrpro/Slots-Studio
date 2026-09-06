export interface WorkflowStage {
  id: string;
  number: string;
  title: string;
  description: string;
  inputContext: string;
  outputArtifact: string;
  signalTag: string;
}

export interface StudioDetail {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  capabilities: string[];
  outputType: string;
  status: "available" | "coming_soon";
  href: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "product",
    number: "01",
    title: "Product",
    description: "Define the product idea, references, direction, and core context.",
    inputContext: "Inspiration brief & technical requirements",
    outputArtifact: "Locked Product Slot (Silhouette, Materials, Colorway)",
    signalTag: "CONTEXT ANCHOR",
  },
  {
    id: "visual",
    number: "02",
    title: "Visual",
    description: "Turn the approved product direction into visual assets and creative variations.",
    inputContext: "Locked Product Slot specs",
    outputArtifact: "4K Studio Photography & On-Model Lookbooks",
    signalTag: "GENERATIVE SYNTHESIS",
  },
  {
    id: "content",
    number: "03",
    title: "Content",
    description: "Create product descriptions, features, specifications, and commercial copy.",
    inputContext: "Materials, Fit & Feature attributes",
    outputArtifact: "Multi-Channel Technical & Editorial Copy",
    signalTag: "STRUCTURED COPY",
  },
  {
    id: "campaign",
    number: "04",
    title: "Campaign",
    description: "Build coordinated creative outputs for campaigns and channels.",
    inputContext: "Visuals + Content packages",
    outputArtifact: "Omnichannel Launch Kit & Aspect-Ratio Bundles",
    signalTag: "PACKAGING ENGINE",
  },
  {
    id: "production",
    number: "05",
    title: "Production",
    description: "Prepare structured production information and technical handoff.",
    inputContext: "Complete commercial & technical slot data",
    outputArtifact: "Vector Tech-Packs & Manufacturing Specs",
    signalTag: "TECHNICAL HANDOFF",
  },
];

export const STUDIOS_DATA: StudioDetail[] = [
  {
    id: "product",
    number: "01",
    name: "Product Studio",
    tagline: "Concept & Technical Briefs",
    description: "Shape and refine product concepts.",
    capabilities: [
      "Generative silhouette exploration",
      "Material and fabric spec definition",
      "Dynamic colorway matrix generation",
      "Functional feature mapping",
    ],
    outputType: "Interactive 3D Schematics & Briefs",
    status: "available",
    href: "/studios#product",
  },
  {
    id: "visual",
    number: "02",
    name: "Visual Studio",
    tagline: "Photography & Lookbooks",
    description: "Create product photography and visual variations.",
    capabilities: [
      "Studio lighting rig simulation",
      "Diverse on-model lookbook synthesis",
      "Macro fabric texture captures",
      "Ghost mannequin e-commerce renders",
    ],
    outputType: "4K Photorealistic Asset Packs",
    status: "available",
    href: "/studios#visual",
  },
  {
    id: "content",
    number: "03",
    name: "Content Studio",
    tagline: "Copywriting & Storytelling",
    description: "Generate structured commercial content.",
    capabilities: [
      "SEO-optimized technical product descriptions",
      "Multi-angle bullet point feature lists",
      "Brand voice narrative alignment",
      "Packaging and hang-tag copy",
    ],
    outputType: "Structured Commercial Copy Bundles",
    status: "available",
    href: "/studios#content",
  },
  {
    id: "campaign",
    number: "04",
    name: "Campaign Studio",
    tagline: "Omnichannel Launch Kits",
    description: "Turn approved products into campaign-ready creative.",
    capabilities: [
      "Multi-aspect ratio adaptive banners",
      "Social media story & feed packaging",
      "Retail display asset generation",
      "Channel-specific visual variations",
    ],
    outputType: "Omnichannel Marketing Kits",
    status: "available",
    href: "/studios#campaign",
  },
  {
    id: "production",
    number: "05",
    name: "Production Studio",
    tagline: "Manufacturing & Tech Packs",
    description: "Prepare technical production information.",
    capabilities: [
      "Vector flat sketch generation",
      "Measurement table & tolerance specs",
      "Trims, stitching, & hardware callouts",
      "Direct factory handoff PDF export",
    ],
    outputType: "Production-Ready Tech Packs",
    status: "available",
    href: "/studios#production",
  },
];
