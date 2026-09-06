import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { refineContentOutput } from "@/lib/content/service";

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
    const { outputId, refinementNotes, customInstructions } = body;

    if (!outputId || !refinementNotes) {
      return NextResponse.json(
        { success: false, error: "Output ID and refinement notes are required." },
        { status: 400 }
      );
    }

    const workspaces = await getUserWorkspaces(session.userId);
    const activeWorkspace = workspaces[0];

    if (!activeWorkspace) {
      return NextResponse.json(
        { success: false, error: "No active workspace found." },
        { status: 404 }
      );
    }

    const result = await refineContentOutput(activeWorkspace.id, {
      outputId,
      refinementNotes,
      customInstructions,
      userId: session.userId,
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to refine content." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Content Refine POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
