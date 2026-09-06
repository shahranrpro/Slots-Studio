import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { generateStudioConcepts } from "@/features/product-studio/services/productStudioService";

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
    const { projectId, variantsCount } = body;
    const isAsync = Boolean(body.async) || request.headers.get("x-async") === "true";

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Missing projectId." }, { status: 400 });
    }

    const result = await generateStudioConcepts(
      activeWorkspace.id,
      projectId,
      variantsCount || 3,
      { async: isAsync }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Generation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Product Generate POST Error:", error);
    return NextResponse.json(
      { success: false, error: "We could not complete this generation. Please try again." },
      { status: 500 }
    );
  }
}
