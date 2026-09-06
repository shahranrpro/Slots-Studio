import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getVisualStudioState } from "@/features/visual-studio/services/visualStudioService";
import { VisualStudioView } from "@/features/visual-studio";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eye, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Visual Studio — Slots Studio",
  description: "Controlled studio photography, on-model styling, and campaign visuals using approved product context.",
  robots: { index: false, follow: false },
};

export default async function VisualStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect(`/login?callbackUrl=/app/studio/visual${projectId ? `?projectId=${projectId}` : ""}`);
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/studio/visual");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const projectsResult = await getProjects(context.workspace.id);
  const projects = projectsResult.data || [];

  if (projects.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto select-none">
        <div className="border-b border-[var(--border)] pb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            VISUAL STUDIO
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Generate clean e-commerce studio shots, on-model fashion styling, and lifestyle photography
          </p>
        </div>

        <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center">
          <EmptyState
            title="NO PROJECTS AVAILABLE"
            description="Create your first product-centric project and approve a product direction to start generating visual assets."
            icon={<Eye className="h-10 w-10 text-[var(--accent)]" />}
            action={
              <Link href="/app/projects">
                <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                  Create First Project
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const activeProject = projects.find((p) => p.id === projectId) || projects[0];

  let studioState = null;
  if (activeProject) {
    const stateResult = await getVisualStudioState(context.workspace.id, activeProject.id);
    if (stateResult.success && stateResult.data) {
      studioState = stateResult.data;
    }
  }

  return (
    <VisualStudioView
      initialState={studioState}
      allProjects={projects}
    />
  );
}
