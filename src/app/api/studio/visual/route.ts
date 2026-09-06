import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import {
  getVisualStudioState,
  generateVisualOutputs,
  addVisualReference,
} from "@/features/visual-studio/services/visualStudioService";
import { type VisualMode, type VisualSettingsConfig } from "@/features/visual-studio/types";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session?.userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
  }

  const workspaces = await getUserWorkspaces(session.userId);
  const activeWorkspace = workspaces[0];

  if (!activeWorkspace) {
    return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 });
  }

  const result = await getVisualStudioState(activeWorkspace.id, projectId);
  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session?.userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, projectId, workspaceId, mode, settings, selectedReferenceIds, variantsCount, referenceName, referenceType } = body;

    const workspaces = await getUserWorkspaces(session.userId);
    let targetWorkspaceId = workspaces[0]?.id;

    if (workspaceId) {
      const allowed = workspaces.find((w) => w.id === workspaceId);
      if (!allowed) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access to requested workspace." },
          { status: 403 }
        );
      }
      targetWorkspaceId = allowed.id;
    }

    if (!targetWorkspaceId) {
      return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 });
    }

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    if (action === "add_reference") {
      if (!referenceName) {
        return NextResponse.json({ success: false, error: "Reference name is required" }, { status: 400 });
      }
      const addResult = await addVisualReference(
        targetWorkspaceId,
        projectId,
        referenceName,
        referenceType || "STYLE"
      );
      return NextResponse.json(addResult);
    }

    const isAsync = Boolean(body.async) || request.headers.get("x-async") === "true";

    // Default action: generate visual outputs
    const genResult = await generateVisualOutputs(
      {
        workspaceId: targetWorkspaceId,
        projectId,
        mode: (mode as VisualMode) || "studio",
        settings: (settings as VisualSettingsConfig) || {
          aspectRatio: "1:1",
          lighting: "key_softbox",
          background: "dark_cyc",
          environment: "studio_loft",
          composition: "center_hero",
          modelDirection: "pose_front",
        },
        selectedReferenceIds,
        variantsCount: typeof variantsCount === "number" ? variantsCount : 2,
      },
      { async: isAsync }
    );

    return NextResponse.json(genResult);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process visual generation request." },
      { status: 500 }
    );
  }
}
