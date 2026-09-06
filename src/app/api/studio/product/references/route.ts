import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { addReference, deleteReference } from "@/features/product-studio/services/productStudioService";

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
    const { projectId, name, type, value, notes } = body;

    if (!projectId || !name || !type) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const result = await addReference(activeWorkspace.id, projectId, {
      name,
      type,
      value: value || name,
      notes,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Product References POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add reference." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const referenceId = searchParams.get("referenceId");

    if (!projectId || !referenceId) {
      return NextResponse.json({ success: false, error: "Missing parameters." }, { status: 400 });
    }

    const result = await deleteReference(activeWorkspace.id, projectId, referenceId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Product References DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove reference." },
      { status: 500 }
    );
  }
}
