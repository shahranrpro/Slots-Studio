import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getWorkspaceBillingState } from "@/lib/billing/service";

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

    const result = await getWorkspaceBillingState(
      context.workspace.id,
      session.userId,
      context.user.name,
      context.user.email,
      context.workspace.name
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("GET /api/workspace/billing error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
