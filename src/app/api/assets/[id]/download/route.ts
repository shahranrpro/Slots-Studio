import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getAssetDownloadData } from "@/lib/assets/service";
import { downloadFileFromStorage } from "@/lib/storage";

function getFileExtension(mimeType: string, filename: string): string {
  if (filename.includes(".")) {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  }
  if (mimeType.includes("svg")) return "svg";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  if (mimeType.includes("mp4") || mimeType.includes("video")) return "mp4";
  if (mimeType.includes("json")) return "json";
  return "bin";
}

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

    const result = await getAssetDownloadData(activeWorkspace.id, id);

    if (!result.success || !result.asset) {
      return NextResponse.json(
        { success: false, error: result.error || "Asset not found." },
        { status: 404 }
      );
    }

    const asset = result.asset;
    const ext = getFileExtension(asset.mimeType, asset.name);
    const safeBaseName = asset.name.replace(/[^a-zA-Z0-9_-]/g, "_");
    const downloadFilename = safeBaseName.endsWith(`.${ext}`) ? safeBaseName : `${safeBaseName}.${ext}`;

    const headers = new Headers();
    headers.set("Content-Type", asset.mimeType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${downloadFilename}"`);

    // 1. Real binary payload from Supabase Storage
    if (asset.storageKey) {
      const storageResult = await downloadFileFromStorage(asset.storageKey);
      if (storageResult.success && storageResult.buffer) {
        headers.set("Content-Length", String(storageResult.sizeBytes || storageResult.buffer.byteLength));
        return new NextResponse(new Uint8Array(storageResult.buffer), {
          status: 200,
          headers,
        });
      }
    }

    // 2. Vector SVG payload
    if (asset.previewSvg) {
      headers.set("Content-Type", "image/svg+xml");
      return new NextResponse(asset.previewSvg, {
        status: 200,
        headers,
      });
    }

    // 3. Fallback simulated binary/text payload for legacy development fixtures
    const simulatedContent = `Slots Studio Asset Manifest\nID: ${asset.id}\nName: ${asset.name}\nType: ${asset.assetType}\nMIME: ${asset.mimeType}\nSource: ${asset.source}\nStatus: ${asset.status}\nProject: ${asset.projectName || "N/A"} (${asset.slotCode || "N/A"})\nCreated: ${asset.createdAt}\n`;

    return new NextResponse(simulatedContent, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Asset Download Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download asset." },
      { status: 500 }
    );
  }
}
