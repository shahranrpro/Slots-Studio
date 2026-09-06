import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getProductionStudioState, generateTechPack } from "@/lib/production/service";
import { ProductionStudioView } from "@/features/production";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Production Studio (STUDIO 05) — Slots Studio",
  description: "Convert approved product concepts into manufacturing Tech Packs, Bills of Materials (BOM), and size grading matrices.",
  robots: { index: false, follow: false },
};

export default async function ProductionStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; techPackId?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/studio/production");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/studio/production");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const { projectId: queryProjectId, techPackId: queryTechPackId } = await searchParams;

  // Load all workspace projects
  const projectsResult = await getProjects(context.workspace.id);
  const projects = projectsResult.data || [];

  if (projects.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <Card variant="subtle" className="p-12 text-center border-[var(--border)]">
          <EmptyState
            title="NO PROJECT SLOTS IN WORKSPACE"
            description="Production Studio requires an active product project to synthesize manufacturing Tech Packs."
            icon={<Scissors className="h-10 w-10 text-[var(--accent)]" />}
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

  const stateResult = await getProductionStudioState(
    context.workspace.id,
    activeProject.id,
    queryTechPackId
  );

  if (!stateResult.success || !stateResult.data) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <Card variant="subtle" className="p-8 text-center text-red-400">
          <p className="font-mono text-sm font-semibold">Failed to load Production Studio workstation.</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{stateResult.error || "Unknown error"}</p>
        </Card>
      </div>
    );
  }

  const studioState = stateResult.data;

  // If no tech packs exist yet and product context is approved, auto-provision initial v1.0 Tech Pack
  if (studioState.techPacks.length === 0 && studioState.approvedContext.isApproved) {
    const starterResult = await generateTechPack(context.workspace.id, {
      projectId: activeProject.id,
      season: "FW26 / Main Drop 01",
      targetRegion: "Portugal / High-Performance Athletic Lab",
    });

    if (starterResult.success && starterResult.data) {
      studioState.techPacks = [starterResult.data];
      studioState.activeTechPack = starterResult.data;
    }
  }

  return <ProductionStudioView initialState={studioState} projects={projects} />;
}
