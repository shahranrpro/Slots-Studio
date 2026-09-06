import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { exportTechPack } from "@/lib/production/service";
import { type ExportTechPackRequest } from "@/lib/production/types";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json({ success: false, error: "No active workspace." }, { status: 403 });
    }

    const body: ExportTechPackRequest = await request.json();
    if (!body.techPackId) {
      return NextResponse.json({ success: false, error: "Tech Pack ID is required." }, { status: 400 });
    }

    const result = await exportTechPack(activeWorkspace.id, body.techPackId, body.format || "MARKDOWN");
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("POST /api/studio/production/export error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
