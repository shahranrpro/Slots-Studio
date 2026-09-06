/**
 * Slots Studio — Deterministic AI Campaign Deliverables Provider Adapter
 *
 * Clearly labeled DEV PREVIEW adapter.
 * Produces structured creative candidates and responsive SVG artwork across channels and aspect ratios.
 */

import {
  type ApprovedProductContext,
  type Campaign,
  type CampaignChannel,
  type CampaignAspectRatio,
  type CampaignOutputType,
  type CampaignOutput,
  type CampaignProvider,
} from "@/lib/campaigns/types";

const CHANNEL_CONFIGS: Record<CampaignChannel, { label: string; defaultType: CampaignOutputType; badgeColor: string }> = {
  INSTAGRAM: { label: "Instagram", defaultType: "SOCIAL_FEED", badgeColor: "#E1306C" },
  TIKTOK: { label: "TikTok", defaultType: "STORY_REEL", badgeColor: "#00F2FE" },
  PAID_SOCIAL: { label: "Meta / Paid Social", defaultType: "AD_CAROUSEL_FRAME", badgeColor: "#1877F2" },
  WEBSITE: { label: "E-Commerce Web", defaultType: "ECOMMERCE_FEATURE", badgeColor: "#B7FF00" },
  EMAIL: { label: "Email Marketing", defaultType: "EMAIL_HEADER", badgeColor: "#FFA500" },
  PRINT: { label: "Print / Billboard", defaultType: "HERO_BANNER", badgeColor: "#FFFFFF" },
};

function generateAspectSvg(
  aspectRatio: CampaignAspectRatio,
  channel: CampaignChannel,
  productName: string,
  headline: string,
  subheadline: string,
  ctaText: string,
  colorways: string[],
  silhouette: string
): string {
  let viewBox = "0 0 1080 1080";
  let width = 1080;
  let height = 1080;

  if (aspectRatio === "4:5") {
    viewBox = "0 0 1080 1350";
    width = 1080;
    height = 1350;
  } else if (aspectRatio === "9:16") {
    viewBox = "0 0 1080 1920";
    width = 1080;
    height = 1920;
  } else if (aspectRatio === "16:9") {
    viewBox = "0 0 1920 1080";
    width = 1920;
    height = 1080;
  }

  const accentColor = colorways[1] || "#B7FF00";
  const lightColor = colorways[2] || "#FFFFFF";
  const channelInfo = CHANNEL_CONFIGS[channel];

  const centerY = height / 2;
  const centerX = width / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" style="background-color: #080808; font-family: 'Inter', system-ui, sans-serif;">
  <defs>
    <linearGradient id="bg-grad-${aspectRatio.replace(":", "-")}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F0F0F" />
      <stop offset="60%" stop-color="#050505" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.2" />
    </linearGradient>
    <filter id="blur-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="60" result="blur" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-grad-${aspectRatio.replace(":", "-")})" />

  <!-- Geometric Grid Accent -->
  <g opacity="0.12" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="4 8">
    <line x1="80" y1="0" x2="80" y2="${height}" />
    <line x1="${width - 80}" y1="0" x2="${width - 80}" y2="${height}" />
    <line x1="0" y1="120" x2="${width}" y2="120" />
    <line x1="0" y1="${height - 120}" x2="${width}" y2="${height - 120}" />
  </g>

  <!-- Ambient Backdrop Glow -->
  <circle cx="${centerX}" cy="${centerY - 80}" r="${Math.min(width, height) * 0.35}" fill="${accentColor}" opacity="0.12" filter="url(#blur-glow)" />

  <!-- Silhouette Geometric Graphic Matrix -->
  <g transform="translate(${centerX}, ${centerY - (height > 1200 ? 100 : 40)})">
    <!-- Outer Kinetic Hex/Ring -->
    <polygon points="0,-180 155,-90 155,90 0,180 -155,90 -155,-90" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.4" />
    <!-- Dynamic Silhouette Shield -->
    <path d="M -110,-120 L 110,-120 L 80,100 L 0,150 L -80,100 Z" fill="#121212" stroke="${lightColor}" stroke-width="3" />
    <!-- Inner Accent Flow Lines -->
    <path d="M -70,-80 L 70,-80 M -60,-20 L 60,-20 M -45,40 L 45,40" stroke="${accentColor}" stroke-width="4" stroke-linecap="round" />
    <!-- Center Branding Mark -->
    <circle cx="0" cy="0" r="14" fill="${accentColor}" />
  </g>

  <!-- Top Navigation / Channel Header -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="140" height="32" rx="16" fill="#171717" stroke="#333333" stroke-width="1" />
    <circle cx="16" cy="16" r="5" fill="${channelInfo.badgeColor}" />
    <text x="32" y="21" fill="#EEEEEE" font-size="12" font-weight="700" letter-spacing="1.5">${channelInfo.label.toUpperCase()}</text>

    <!-- Aspect Ratio Indicator -->
    <rect x="155" y="0" width="65" height="32" rx="16" fill="#111111" stroke="#262626" stroke-width="1" />
    <text x="187" y="21" fill="#888888" font-size="11" font-weight="700" text-anchor="middle">${aspectRatio}</text>

    <!-- Slots Studio Watermark -->
    <text x="${width - 160}" y="21" fill="#666666" font-size="12" font-weight="700" letter-spacing="2" text-anchor="end">SLOTS STUDIO</text>
  </g>

  <!-- Creative Typography & Campaign Copy -->
  <g transform="translate(${centerX}, ${height - (height > 1400 ? 440 : 280)})" text-anchor="middle">
    <!-- Category & Silhouette Micro-Tag -->
    <text y="0" fill="${accentColor}" font-size="14" font-weight="800" letter-spacing="3">${silhouette.toUpperCase()} // ${productName.toUpperCase()}</text>

    <!-- Primary Headline -->
    <text y="48" fill="#FFFFFF" font-size="${height > 1400 ? 46 : 36}" font-weight="800" font-family="'Sora', sans-serif" letter-spacing="-0.5">${headline}</text>

    <!-- Subheadline / Body -->
    <text y="90" fill="#AAAAAA" font-size="${height > 1400 ? 20 : 16}" font-weight="400" letter-spacing="0.2">${subheadline}</text>

    <!-- Call To Action Button -->
    <g transform="translate(0, 135)">
      <rect x="-130" y="0" width="260" height="52" rx="26" fill="${accentColor}" />
      <text x="0" y="32" fill="#000000" font-size="14" font-weight="800" font-family="'Sora', sans-serif" letter-spacing="1.5">${ctaText.toUpperCase()}</text>
    </g>
  </g>

  <!-- Footer Dev Badge -->
  <g transform="translate(${centerX}, ${height - 35})" text-anchor="middle">
    <text fill="#444444" font-size="10" font-weight="600" letter-spacing="2">SLOTS-CAMPAIGN-V1 (DEV PREVIEW) • AUTOMATED MULTI-ASPECT ENGINE</text>
  </g>
</svg>`;
}

export class DevCampaignProviderAdapter implements CampaignProvider {
  async generateDeliverables(
    context: ApprovedProductContext,
    campaign: Campaign,
    channels: CampaignChannel[],
    aspectRatios: CampaignAspectRatio[],
    options?: {
      outputTypes?: CampaignOutputType[];
      customDirective?: string;
      ctaVariant?: string;
    }
  ): Promise<Omit<CampaignOutput, "id" | "workspaceId" | "projectId" | "slotCode" | "jobId" | "createdAt" | "updatedAt">[]> {
    const deliverables: Omit<CampaignOutput, "id" | "workspaceId" | "projectId" | "slotCode" | "jobId" | "createdAt" | "updatedAt">[] = [];

    const defaultCta = options?.ctaVariant || "EXPLORE THE DROP";
    const customDirective = options?.customDirective?.trim();

    for (const channel of channels) {
      for (const ratio of aspectRatios) {
        let outputType: CampaignOutputType = CHANNEL_CONFIGS[channel].defaultType;
        if (ratio === "9:16") outputType = "STORY_REEL";
        else if (ratio === "16:9") outputType = "ECOMMERCE_FEATURE";
        else if (ratio === "4:5") outputType = "HERO_BANNER";

        let headline = `ENGINEERED FOR MOTION: ${context.productName.toUpperCase()}`;
        let subheadline = `${context.silhouette} construction with ${context.materials[0] || "articulated textiles"}.`;

        if (campaign.objective === "PRODUCT_LAUNCH") {
          headline = `THE ALL-NEW ${context.productName.toUpperCase()}`;
          subheadline = `Global Release. Precision tailored for high-output velocity.`;
        } else if (campaign.objective === "SEASONAL_DROP") {
          headline = `LIMITED DROP: ${context.productName.toUpperCase()}`;
          subheadline = `Strictly limited run in ${context.colorways.join(" / ")}.`;
        } else if (campaign.objective === "TECHNICAL_SHOWCASE") {
          headline = `MATERIAL LAB: ${context.productName.toUpperCase()}`;
          subheadline = `Dynamic thermal regulation and weather-shield barrier.`;
        }

        if (customDirective) {
          subheadline = `${subheadline} (${customDirective.slice(0, 45)})`;
        }

        const previewSvg = generateAspectSvg(
          ratio,
          channel,
          context.productName,
          headline,
          subheadline,
          defaultCta,
          context.colorways,
          context.silhouette
        );

        deliverables.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          outputType,
          channel,
          aspectRatio: ratio,
          headline,
          subheadline,
          ctaText: defaultCta,
          bodyCopy: `${context.description} Designed in ${context.silhouette} format for active performance.`,
          previewSvg,
          status: "IN_REVIEW",
          metadata: {
            provider: "DevCampaignProviderAdapter",
            modelLabel: "SLOTS-CAMPAIGN-V1 (DEV PREVIEW)",
            isDevPreview: true,
            colorways: context.colorways,
            silhouette: context.silhouette,
          },
        });
      }
    }

    return deliverables;
  }
}

export const devCampaignProvider = new DevCampaignProviderAdapter();
