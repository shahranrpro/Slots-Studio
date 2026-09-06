import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getAssetById, updateAsset, archiveAsset } from "@/lib/assets/service";

export async function GET(
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

    const result = await getAssetById(activeWorkspace.id, id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Asset not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Asset GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve asset." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
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

    const body = await request.json();
    const { name, status, metadata } = body;

    const result = await updateAsset(activeWorkspace.id, id, {
      name,
      status,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update asset." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Asset PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update asset." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Soft-archive asset
    const result = await archiveAsset(activeWorkspace.id, id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to archive asset." },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Asset DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to archive asset." },
      { status: 500 }
    );
  }
}
