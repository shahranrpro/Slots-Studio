import React from "react";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getJobs } from "@/lib/jobs/service";
import { getProjects } from "@/lib/projects/service";
import { JobsView } from "@/features/jobs/components/JobsView";
import { DEV_JOB_FIXTURES } from "@/features/jobs/fixtures";
import { jobStore } from "@/lib/jobs/store";

export const metadata: Metadata = {
  title: "My Jobs — Slots Studio",
  description: "Monitor and manage background generative pipelines and asset processing jobs.",
  robots: { index: false, follow: false },
};

export default async function JobsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";

  if (!token) {
    redirect("/login?callbackUrl=/app/jobs");
  }

  const session = await verifySessionToken(token);
  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/jobs");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/jobs");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const [jobsResult, projectsResult] = await Promise.all([
    getJobs(context.workspace.id),
    getProjects(context.workspace.id),
  ]);

  let jobs = jobsResult.data || [];

  // Seed dev fixtures in development if empty
  if (jobs.length === 0) {
    for (const fixture of DEV_JOB_FIXTURES) {
      await jobStore.create({
        ...fixture,
        workspaceId: context.workspace.id,
      });
    }
    const seeded = await getJobs(context.workspace.id);
    jobs = seeded.data || DEV_JOB_FIXTURES;
  }

  const projects = projectsResult.data || [];

  return (
    <div className="space-y-6">
      <JobsView initialJobs={jobs} projects={projects} />
    </div>
  );
}
