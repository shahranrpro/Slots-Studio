import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { changeSubscriptionPlan } from "@/lib/billing/service";
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

    const body = await req.json();
    const { planId, billingInterval } = body;

    if (!planId || !billingInterval) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    // Security: Check if current user is OWNER
    const members = getMembers(context.workspace.id);
    const currentMember = members.find((m) => m.userId === session.userId);
    if (!currentMember || currentMember.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Unauthorized: Only Owners can change the subscription plan." }, { status: 403 });
    }

    const result = await changeSubscriptionPlan(
      context.workspace.id,
      session.userId,
      context.user.name,
      body.planId,
      body.billingInterval || "MONTHLY"
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("POST /api/workspace/billing/plan error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
