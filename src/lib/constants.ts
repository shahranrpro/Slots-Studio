/**
 * Slots Studio — Application Constants
 */

export const APP_CONFIG = {
  name: "Slots Studio",
  shortName: "Slots",
  tagline: "AI-Powered Creative Operating System",
  description:
    "Slots Studio is a futuristic AI-native SaaS workspace for turning product ideas into connected creative, content, campaign, and production outputs.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: "0.1.0",
} as const;

export const ROUTES = {
  marketing: {
    home: "/",
    features: "/features",
    studios: "/studios",
    workflow: "/workflow",
    pricing: "/pricing",
    about: "/about",
    resources: "/resources",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms",
  },
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verify: "/auth/verify",
  },
  app: {
    dashboard: "/app/dashboard",
    projects: "/app/projects",
    project: (id: string) => `/app/projects/${id}`,
    studios: {
      product: "/app/studio/product",
      visual: "/app/studio/visual",
      content: "/app/studio/content",
      campaign: "/app/studio/campaign",
      production: "/app/studio/production",
    },
    assets: "/app/assets",
    jobs: "/app/jobs",
    settings: {
      profile: "/app/settings/profile",
      appearance: "/app/settings/appearance",
      workspace: "/app/settings/workspace",
      notifications: "/app/settings/notifications",
      security: "/app/settings/security",
      billing: "/app/settings/billing",
    },
    help: "/app/help",
  },
} as const;
