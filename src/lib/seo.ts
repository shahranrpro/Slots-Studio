import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/constants";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = APP_CONFIG.description,
  image = "/og/default-og.png",
  noIndex = false,
}: SeoProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${APP_CONFIG.name}`
    : `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(APP_CONFIG.url),
    openGraph: {
      title: fullTitle,
      description,
      url: APP_CONFIG.url,
      siteName: APP_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    icons: {
      icon: "/brand/logo/logo.png",
      apple: "/brand/logo/logo.png",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}
