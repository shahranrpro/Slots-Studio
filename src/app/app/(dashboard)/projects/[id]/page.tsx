import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProject } from "@/lib/projects/service";
import { ProjectDetailView } from "@/features/projects";

export const metadata: Metadata = {
  title: "Project Slot Detail — Slots Studio",
  description: "Product brief, context parameters, and connected studio workstations.",
  robots: { index: false, follow: false },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect(`/login?callbackUrl=/app/projects/${id}`);
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect(`/login?callbackUrl=/app/projects/${id}`);
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const projectResult = await getProject(context.workspace.id, id);

  if (!projectResult.success || !projectResult.data) {
    notFound();
  }

  return <ProjectDetailView initialProject={projectResult.data} />;
}
