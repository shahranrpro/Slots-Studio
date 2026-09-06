import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserFromSession } from "@/lib/auth/service";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { OnboardingWizard } from "@/features/workspace";

export const metadata: Metadata = {
  title: "Onboarding — Slots Studio",
  description: "Set up your workspace and creative goals in Slots Studio.",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/onboarding");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/onboarding");
  }

  // If user has already completed onboarding, redirect directly to projects
  if (context.onboarding.completed) {
    redirect("/app/projects");
  }

  const user = await getUserFromSession(session);

  return (
    <OnboardingWizard
      initialState={context.onboarding}
      userName={user?.name || "Creator"}
    />
  );
}
