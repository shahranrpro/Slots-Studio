import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { ProductStudioView } from "@/features/product-studio";

export const metadata: Metadata = {
  title: "Product Studio — Slots Studio",
  description: "Product brief definition, concept generation, and review.",
  robots: { index: false, follow: false },
};

export default async function ProductStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect(`/login?callbackUrl=/app/studio/product${projectId ? `?projectId=${projectId}` : ""}`);
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/studio/product");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const projectsResult = await getProjects(context.workspace.id);
  const projects = projectsResult.data || [];

  const activeProject = projects.find((p) => p.id === projectId) || projects[0];

  let studioState = null;
  if (activeProject) {
    const stateResult = await getProductStudioState(context.workspace.id, activeProject.id);
    if (stateResult.success && stateResult.data) {
      studioState = stateResult.data;
    }
  }

  return (
    <ProductStudioView
      initialState={studioState}
      allProjects={projects}
    />
  );
}
