import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { retryJob } from "@/lib/jobs/service";

export async function POST(
  _request: Request,
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

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json({ success: false, error: "No active workspace." }, { status: 400 });
    }

    const result = await retryJob(activeWorkspace.id, id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to retry job." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job Retry POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retry job." },
      { status: 500 }
    );
  }
}
