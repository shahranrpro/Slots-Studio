import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getWorkspaceBillingState } from "@/lib/billing/service";
import { BillingSettingsView } from "@/features/billing";

export const metadata: Metadata = {
  title: "Settings & Billing — Slots Studio",
  description: "Manage account settings, subscription plans, AI credit quotas, and team permissions.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/settings");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/settings");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const billingResult = await getWorkspaceBillingState(
    context.workspace.id,
    session.userId,
    context.user.name,
    context.user.email,
    context.workspace.name
  );

  if (!billingResult.success || !billingResult.data) {
    return (
      <div className="p-8 text-center text-red-400">
        <p className="font-mono text-sm font-semibold">Failed to load workspace settings.</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{billingResult.error || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <BillingSettingsView
      initialState={billingResult.data}
      initialUserName={context.user.name}
      initialUserEmail={context.user.email}
      workspaceSlug={context.workspace.slug}
    />
  );
}
