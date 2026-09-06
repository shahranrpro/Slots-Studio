import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { notificationService } from "@/lib/notifications/service";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const workspaceId = searchParams.get("workspaceId") || undefined;

    const data = await notificationService.getUserNotifications(session.userId, {
      limit,
      unreadOnly,
      workspaceId,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve notifications." },
      { status: 500 }
    );
  }
}
