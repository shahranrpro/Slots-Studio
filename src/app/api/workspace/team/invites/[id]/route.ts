import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { revokeInvitation } from "@/lib/billing/service";

import { getMembers } from "@/lib/billing/store";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: invitationId } = await params;

    // Security: Check if current user is OWNER or ADMIN
    const members = getMembers(context.workspace.id);
    const currentMember = members.find((m) => m.userId === session.userId);
    if (!currentMember || (currentMember.role !== "OWNER" && currentMember.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Only Admins can revoke invitations." }, { status: 403 });
    }

    const result = await revokeInvitation(context.workspace.id, invitationId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("DELETE /api/workspace/team/invites/[id] error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
