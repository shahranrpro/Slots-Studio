import React from "react";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getProjects } from "@/lib/projects/service";
import { getAssets, createAsset } from "@/lib/assets/service";
import { AssetLibrary, DEV_ASSET_FIXTURES } from "@/features/assets";

export const metadata: Metadata = {
  title: "Assets — Slots Studio",
  description: "Manage creative assets, renders, and media files.",
  robots: { index: false, follow: false },
};

export default async function AssetsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
  const session = token ? await verifySessionToken(token) : null;

  if (!session?.userId) {
    redirect("/login?callbackUrl=/app/assets");
  }

  const context = await resolveAuthenticatedWorkspaceContext(session);
  if (!context) {
    redirect("/login?callbackUrl=/app/assets");
  }

  if (!context.onboarding.completed) {
    redirect("/app/onboarding");
  }

  const [projectsResult, assetsResult] = await Promise.all([
    getProjects(context.workspace.id),
    getAssets(context.workspace.id),
  ]);

  const assets = assetsResult.data || [];

  // If in development mode and assets are empty, populate initial development fixtures
  if (assets.length === 0) {
    for (const fixture of DEV_ASSET_FIXTURES) {
      const created = await createAsset({
        workspaceId: context.workspace.id,
        projectId: fixture.projectId,
        projectName: fixture.projectName,
        slotCode: fixture.slotCode,
        name: fixture.name,
        assetType: fixture.assetType,
        mimeType: fixture.mimeType,
        storageKey: fixture.storageKey,
        previewSvg: fixture.previewSvg,
        width: fixture.width,
        height: fixture.height,
        sizeBytes: fixture.sizeBytes,
        source: fixture.source,
        status: fixture.status,
        metadata: fixture.metadata,
      });
      if (created.success && created.data) {
        assets.push(created.data);
      }
    }
  }

  return (
    <AssetLibrary
      initialAssets={assets}
      projects={projectsResult.data || []}
    />
  );
}
