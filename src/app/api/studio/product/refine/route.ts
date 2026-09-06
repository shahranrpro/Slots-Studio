import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { refineStudioConcept } from "@/features/product-studio/services/productStudioService";

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
    const { projectId, baseConceptId, instructions } = body;

    if (!projectId || !baseConceptId || !instructions) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const result = await refineStudioConcept(activeWorkspace.id, projectId, {
      baseConceptId,
      instructions,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Refinement failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Product Refine POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to refine concept. Please try again." },
      { status: 500 }
    );
  }
}
