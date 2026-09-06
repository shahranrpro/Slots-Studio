import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { saveProductBrief } from "@/features/product-studio/services/productStudioService";

export async function POST(request: Request) {
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

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json({ success: false, error: "No active workspace." }, { status: 400 });
    }

    const body = await request.json();
    const { projectId, brief } = body;

    if (!projectId || !brief) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const result = await saveProductBrief(activeWorkspace.id, projectId, brief);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Product Brief POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save product brief." },
      { status: 500 }
    );
  }
}
