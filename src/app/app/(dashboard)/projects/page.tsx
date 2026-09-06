import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { ProjectsView } from "@/features/projects";

export const metadata: Metadata = {
  title: "Projects — Slots Studio",
  description: "Browse, filter, and create product-centric projects in Slots Studio.",
  robots: { index: false, follow: false },
};

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/projects");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/projects");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const projectsResult = await getProjects(context.workspace.id);

  return (
    <ProjectsView
      initialProjects={projectsResult.data || []}
      workspaceName={context.workspace.name}
    />
  );
}
