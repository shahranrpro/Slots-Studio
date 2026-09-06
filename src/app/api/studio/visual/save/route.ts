import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { saveVisualOutputToProject } from "@/features/visual-studio/services/visualStudioService";

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
    const { projectId, outputId } = body;

    if (!projectId || !outputId) {
      return NextResponse.json(
        { success: false, error: "Project ID and Output ID are required." },
        { status: 400 }
      );
    }

    const result = await saveVisualOutputToProject(
      activeWorkspace.id,
      projectId,
      outputId
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save visual asset to project." },
      { status: 500 }
    );
  }
}
