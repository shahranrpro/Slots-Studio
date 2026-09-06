import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { resolveAuthenticatedWorkspaceContext } from "@/lib/workspace/service";
import { getUsageLedger, getSubscription, SUBSCRIPTION_PLANS } from "@/lib/billing/store";
import { calculateCreditSummary } from "@/lib/billing/service";

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

    const ledger = getUsageLedger(context.workspace.id);
    const sub = getSubscription(context.workspace.id);
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === sub?.planId) || SUBSCRIPTION_PLANS[0];
    const credits = calculateCreditSummary(plan, ledger, sub?.currentPeriodEnd || new Date().toISOString());

    return NextResponse.json({
      success: true,
      data: {
        credits,
        ledger: ledger.slice(0, 100),
      },
    });
  } catch (err: unknown) {
    console.error("GET /api/workspace/usage error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
