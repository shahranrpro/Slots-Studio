import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { updateVisualOutputStatus } from "@/features/visual-studio/services/visualStudioService";
import { type VisualOutputStatus } from "@/features/visual-studio/types";

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

  const workspaces = await getUserWorkspaces(session.userId);
  const activeWorkspace = workspaces[0];

  if (!activeWorkspace) {
    return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { projectId, outputId, status } = body;

    if (!projectId || !outputId || !status) {
      return NextResponse.json(
        { success: false, error: "Project ID, Output ID, and Status are required." },
        { status: 400 }
      );
    }

    const result = await updateVisualOutputStatus(
      activeWorkspace.id,
      projectId,
      outputId,
      status as VisualOutputStatus
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update visual review decision." },
      { status: 500 }
    );
  }
}
