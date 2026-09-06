export interface SiteConfig {
  name: string;
  brand: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter?: string;
    github?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Slots Studio",
  brand: "Slots Studio",
  tagline: "AI-Powered Creative Operating System",
  description:
    "Slots Studio is a futuristic AI-native SaaS workspace for turning product ideas into connected creative, content, campaign, and production outputs.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og/default-og.png",
  links: {},
};
