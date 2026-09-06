import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import {
  getDashboardData,
  DashboardHeader,
  CreateAction,
  ReviewQueue,
  ActiveJobs,
  RecentProjects,
  RecentAssets,
  UsageSummary,
  ActivityFeed,
} from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Slots Studio",
  description: "Slots Studio creative workspace command center.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app");
  }

  // If user has not completed onboarding, route them to onboarding wizard
  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const dashboardData = await getDashboardData(context.user.id, context.workspace.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header & Context Greeting */}
      <DashboardHeader
        userName={context.user.name || "Creator"}
        workspaceName={context.workspace.name}
      />

      {/* 2. Primary Create Hub & Studio Launchers */}
      <CreateAction />

      {/* 3. Multi-Column Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left / Primary Column: Review Queue, Projects, Assets */}
        <div className="lg:col-span-2 space-y-6">
          <ReviewQueue initialItems={dashboardData.reviews} />
          <RecentProjects projects={dashboardData.projects} />
          <RecentAssets assets={dashboardData.assets} />
        </div>

        {/* Right / Secondary Column: Active Jobs, Usage Capacity, Activity */}
        <div className="space-y-6">
          <ActiveJobs jobs={dashboardData.jobs} />
          <UsageSummary usage={dashboardData.usage} />
          <ActivityFeed activity={dashboardData.activity} />
        </div>
      </div>
    </div>
  );
}
