import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { notificationService } from "@/lib/notifications/service";

export async function POST(req: Request) {
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

    let workspaceId: string | undefined;
    try {
      const body = await req.json();
      workspaceId = body.workspaceId;
    } catch {
      // Empty body allowed
    }

    const updatedCount = await notificationService.markAllRead(session.userId, workspaceId);

    return NextResponse.json({
      success: true,
      data: { updatedCount },
    });
  } catch (err: unknown) {
    console.error("POST /api/notifications/read-all error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to mark all notifications as read." },
      { status: 500 }
    );
  }
}
