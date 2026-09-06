import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getContentStudioState } from "@/lib/content/service";

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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required." },
        { status: 400 }
      );
    }

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json(
        { success: false, error: "No active workspace found." },
        { status: 404 }
      );
    }

    const result = await getContentStudioState(activeWorkspace.id, projectId);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to load Content Studio state." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Content Studio GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
