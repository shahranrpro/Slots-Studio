import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getProductStudioState } from "@/features/product-studio/services/productStudioService";
import { getProjects } from "@/lib/projects/service";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json({ success: false, error: "No active workspace." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    let projectId = searchParams.get("projectId");

    // If no projectId provided, default to the most recent workspace project
    if (!projectId) {
      const projectsResult = await getProjects(activeWorkspace.id);
      if (projectsResult.success && projectsResult.data && projectsResult.data.length > 0) {
        projectId = projectsResult.data[0].id;
      }
    }

    if (!projectId) {
      return NextResponse.json({
        success: false,
        noProjects: true,
        error: "No projects in workspace. Please create a project first.",
      });
    }

    const stateResult = await getProductStudioState(activeWorkspace.id, projectId);

    if (!stateResult.success) {
      return NextResponse.json(
        { success: false, error: stateResult.error || "Failed to load studio state." },
        { status: 404 }
      );
    }

    return NextResponse.json(stateResult);
  } catch (error) {
    console.error("Product Studio GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load Product Studio." },
      { status: 500 }
    );
  }
}
