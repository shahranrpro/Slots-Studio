import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getMembers, getInvitations } from "@/lib/billing/store";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const context = await resolveAuthenticatedWorkspaceContext(session);
    if (!context) {
      return NextResponse.json({ success: false, error: "Workspace context not found" }, { status: 403 });
    }

    const members = getMembers(context.workspace.id);
    const invitations = getInvitations(context.workspace.id);

    return NextResponse.json({
      success: true,
      data: {
        members,
        invitations,
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/workspace/team error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
