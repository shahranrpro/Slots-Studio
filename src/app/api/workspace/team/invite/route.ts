import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { inviteTeamMember } from "@/lib/billing/service";
import { type InviteMemberRequest } from "@/lib/billing/types";

import { getMembers } from "@/lib/billing/store";

export async function POST(req: Request) {
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

    const body: InviteMemberRequest = await req.json();
    if (!body.email || !body.role) {
      return NextResponse.json({ success: false, error: "Email and role are required." }, { status: 400 });
    }

    // Security: Check if current user is OWNER or ADMIN
    const isOwner = context.workspace.ownerId === session.userId;
    const members = getMembers(context.workspace.id);
    const currentMember = members.find((m) => m.userId === session.userId);
    const hasAdminRole = currentMember && (currentMember.role === "OWNER" || currentMember.role === "ADMIN");

    if (!isOwner && !hasAdminRole) {
      return NextResponse.json({ success: false, error: "Unauthorized: Only Admins can invite members." }, { status: 403 });
    }

    const result = await inviteTeamMember(
      context.workspace.id,
      session.userId,
      context.user.name,
      body.email,
      body.role
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("POST /api/workspace/team/invite error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
