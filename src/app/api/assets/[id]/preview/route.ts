import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getAssetById } from "@/lib/assets/service";
import { downloadFileFromStorage } from "@/lib/storage";

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
    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Asset not found." },
        { status: 404 }
      );
    }

    const asset = result.data;

    // 1. Fetch real binary from Supabase Storage
    if (asset.storageKey) {
      const storageResult = await downloadFileFromStorage(asset.storageKey);
      if (storageResult.success && storageResult.buffer) {
        return new NextResponse(new Uint8Array(storageResult.buffer), {
          status: 200,
          headers: {
            "Content-Type": asset.mimeType || storageResult.contentType || "application/octet-stream",
            "Content-Length": String(storageResult.sizeBytes || storageResult.buffer.byteLength),
            "Cache-Control": "private, max-age=3600",
          },
        });
      }
    }

    // 2. Vector SVG preview fallback
    if (asset.previewSvg) {
      return new NextResponse(asset.previewSvg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Asset binary not available for preview." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Asset Preview Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to render asset preview." },
      { status: 500 }
    );
  }
}
