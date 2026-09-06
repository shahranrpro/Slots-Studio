import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getCampaignStudioState, createCampaign } from "@/lib/campaigns/service";
import { CampaignStudioView } from "@/features/campaigns";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Campaign Studio (STUDIO 04) — Slots Studio",
  description: "Synthesize multi-channel advertising campaigns, social deliverables, and marketing kits from approved product context.",
  robots: { index: false, follow: false },
};

export default async function CampaignStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; campaignId?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/studio/campaign");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/studio/campaign");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const { projectId: queryProjectId, campaignId: queryCampaignId } = await searchParams;

  // Load all workspace projects
  const projectsResult = await getProjects(context.workspace.id);
  const projects = projectsResult.data || [];

  if (projects.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <Card variant="subtle" className="p-12 text-center border-[var(--border)]">
          <EmptyState
            title="NO PROJECT SLOTS IN WORKSPACE"
            description="Campaign Studio requires an active product project to synthesize marketing campaigns and social kits."
            icon={<Megaphone className="h-10 w-10 text-[var(--accent)]" />}
            action={
              <Link href="/app/projects">
                <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                  Create Project Slot
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const activeProject =
    (queryProjectId && projects.find((p) => p.id === queryProjectId)) || projects[0];

  const stateResult = await getCampaignStudioState(
    context.workspace.id,
    activeProject.id,
    queryCampaignId
  );

  if (!stateResult.success || !stateResult.data) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <Card variant="subtle" className="p-8 text-center text-red-400">
          <p className="font-mono text-sm font-semibold">Failed to load Campaign Studio workstation.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{stateResult.error || "Unknown error"}</p>
        </Card>
      </div>
    );
  }

  const studioState = stateResult.data;

  // If no campaigns exist for this project yet, auto-provision a starter campaign
  if (studioState.campaigns.length === 0) {
    const starterResult = await createCampaign(context.workspace.id, {
      projectId: activeProject.id,
      name: `Global Debut — ${activeProject.name}`,
      objective: "PRODUCT_LAUNCH",
      targetChannels: ["INSTAGRAM", "PAID_SOCIAL", "WEBSITE"],
      supportedAspectRatios: ["1:1", "4:5", "9:16", "16:9"],
    });

    if (starterResult.success && starterResult.data) {
      studioState.campaigns = [starterResult.data];
      studioState.activeCampaign = starterResult.data;
    }
  }

  return <CampaignStudioView initialState={studioState} projects={projects} />;
}
