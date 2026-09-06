/**
 * Privacy-preserving analytics event logger foundation.
 */

export type AnalyticsEvent =
  | "signup"
  | "onboarding_complete"
  | "project_create"
  | "project_open"
  | "generation_start"
  | "generation_complete"
  | "generation_failed"
  | "asset_approve"
  | "asset_reject"
  | "asset_download"
  | "studio_open"
  | "campaign_create"
  | "production_export"
  | "appearance_change";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    // Development event debugging without logging sensitive information
    console.debug(`[Analytics] ${event}`, properties);
  }
}
