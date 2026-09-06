import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { notificationService } from "@/lib/notifications/service";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const success = await notificationService.markRead(id, session.userId);

    return NextResponse.json({
      success,
      data: { id, isRead: true },
    });
  } catch (err: unknown) {
    console.error("PATCH /api/notifications/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update notification." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const success = await notificationService.deleteNotification(id, session.userId);

    return NextResponse.json({
      success,
      data: { id, deleted: true },
    });
  } catch (err: unknown) {
    console.error("DELETE /api/notifications/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification." },
      { status: 500 }
    );
  }
}
