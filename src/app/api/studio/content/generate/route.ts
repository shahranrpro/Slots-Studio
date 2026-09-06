import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { generateContentOutput } from "@/lib/content/service";

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

    const body = await request.json();
    const { projectId, contentType, templateId, tone, audience, customInstructions, workspaceId } = body;

    if (!projectId || !contentType || !tone || !audience) {
      return NextResponse.json(
        { success: false, error: "Missing required generation parameters." },
        { status: 400 }
      );
    }

    const workspaces = await getUserWorkspaces(session.userId);
    let targetWorkspaceId = workspaces[0]?.id;

    if (workspaceId) {
      const allowed = workspaces.find((w) => w.id === workspaceId);
      if (!allowed) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access to requested workspace." },
          { status: 403 }
        );
      }
      targetWorkspaceId = allowed.id;
    }

    if (!targetWorkspaceId) {
      return NextResponse.json(
        { success: false, error: "No active workspace found." },
        { status: 404 }
      );
    }

    const result = await generateContentOutput(targetWorkspaceId, {
      projectId,
      contentType,
      templateId,
      tone,
      audience,
      customInstructions,
      userId: session.userId,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate content." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Content Generate POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
