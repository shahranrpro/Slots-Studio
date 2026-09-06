import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getContentStudioState } from "@/lib/content/service";
import { ContentStudioView } from "@/features/content-studio";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Studio — Slots Studio",
  description: "Commercial copy, SEO descriptions, and technical specifications.",
  robots: { index: false, follow: false },
};

export default async function ContentStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect(`/login?callbackUrl=/app/studio/content${projectId ? `?projectId=${projectId}` : ""}`);
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/studio/content");
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
            CONTENT STUDIO
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Generate high-converting product descriptions, technical bullet points, and ad headlines
          </p>
        </div>

        <Card variant="subtle" className="p-8 sm:p-12 border-[var(--border-strong)] text-center">
          <EmptyState
            title="NO PROJECTS AVAILABLE"
            description="Create your first product-centric project and approve a product direction to start generating commercial copy."
            icon={<FileText className="h-10 w-10 text-[var(--accent)]" />}
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
    const stateResult = await getContentStudioState(context.workspace.id, activeProject.id);
    if (stateResult.success && stateResult.data) {
      studioState = stateResult.data;
    }
  }

  return (
    <ContentStudioView
      initialState={studioState}
      allProjects={projects}
    />
  );
}
