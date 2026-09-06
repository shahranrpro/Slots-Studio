import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { AppShell } from "@/components/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect("/login?callbackUrl=/app");
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session?.userId) {
    redirect("/login?callbackUrl=/app");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app");
  }

  return (
    <AppShell
      userName={context.user.name}
      userEmail={context.user.email}
      workspaceName={context.workspace.name}
      workspaceSlug={context.workspace.slug}
    >
      {children}
    </AppShell>
  );
}
