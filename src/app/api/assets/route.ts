import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getAssets, createAsset } from "@/lib/assets/service";
import { type AssetType, type AssetSource, type AssetStatus } from "@/lib/assets/types";

export async function GET(request: Request) {
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
    const search = searchParams.get("search") || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const assetType = (searchParams.get("assetType") as AssetType) || undefined;
    const source = (searchParams.get("source") as AssetSource) || undefined;
    const status = (searchParams.get("status") as AssetStatus) || undefined;
    const includeArchived = searchParams.get("includeArchived") === "true";

    const result = await getAssets(activeWorkspace.id, {
      search,
      projectId,
      assetType,
      source,
      status,
      includeArchived,
    });

    if (result.success && result.data) {
      result.data = result.data.map((a) => ({
        ...a,
        previewUrl: a.previewUrl || (a.storageKey || a.previewSvg ? `/api/assets/${a.id}/preview` : undefined),
      }));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Assets GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve assets." },
      { status: 500 }
    );
  }
}

import {
  uploadFileToStorage,
  deleteFileFromStorage,
  STORAGE_BUCKET_PRIVATE,
} from "@/lib/storage";

function inferAssetType(mimeType: string): AssetType {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text/")) return "DOCUMENT";
  return "OTHER";
}

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

    const contentTypeHeader = request.headers.get("content-type") || "";

    // 1. Multipart Form Data File Upload
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form data." },
          { status: 400 }
        );
      }

      const rawName = formData.get("name");
      const name = rawName ? String(rawName).trim() : file.name;
      const projectId = formData.get("projectId") ? String(formData.get("projectId")) : undefined;
      const projectName = formData.get("projectName") ? String(formData.get("projectName")) : undefined;
      const slotCode = formData.get("slotCode") ? String(formData.get("slotCode")) : undefined;
      const source = (formData.get("source") as AssetSource) || "UPLOAD";
      const status = (formData.get("status") as AssetStatus) || "REVIEW";

      const explicitType = formData.get("assetType") as AssetType | null;
      const assetType = explicitType || inferAssetType(file.type || "");

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload binary to Supabase Storage
      const uploadResult = await uploadFileToStorage({
        workspaceId: activeWorkspace.id,
        projectId,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        buffer,
        metadata: {
          originalFilename: file.name,
          uploadedBy: session.userId,
          workspaceId: activeWorkspace.id,
        },
      });

      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error || "Failed to upload file to storage." },
          { status: 400 }
        );
      }

      // Create Asset record in database
      const createResult = await createAsset({
        workspaceId: activeWorkspace.id,
        projectId,
        projectName,
        slotCode,
        name,
        assetType,
        mimeType: uploadResult.contentType,
        storageKey: uploadResult.path,
        storageBucket: uploadResult.bucket,
        sizeBytes: uploadResult.sizeBytes,
        source,
        status,
        metadata: {
          originalFilename: file.name,
          storageBucket: uploadResult.bucket,
          storagePath: uploadResult.path,
          uploadedBy: session.userId,
        },
      });

      // Rollback storage object if DB record creation failed
      if (!createResult.success || !createResult.data) {
        await deleteFileFromStorage(uploadResult.path).catch(() => {});
        return NextResponse.json(
          { success: false, error: createResult.error || "Failed to register asset in database." },
          { status: 500 }
        );
      }

      // Attach dynamic preview URL to the created asset response
      createResult.data.previewUrl = `/api/assets/${createResult.data.id}/preview`;

      return NextResponse.json(createResult, { status: 201 });
    }

    // 2. JSON Metadata Creation (Programmatic / Phase 3.1 Contract)
    const body = await request.json();
    const {
      projectId,
      projectName,
      slotCode,
      name,
      assetType,
      mimeType,
      storageKey,
      thumbnailKey,
      previewSvg,
      width,
      height,
      sizeBytes,
      source,
      status,
      metadata,
    } = body;

    if (!name || !assetType || !storageKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, assetType, storageKey)." },
        { status: 400 }
      );
    }

    const result = await createAsset({
      workspaceId: activeWorkspace.id,
      projectId,
      projectName,
      slotCode,
      name,
      assetType,
      mimeType: mimeType || "application/octet-stream",
      storageKey,
      storageBucket: STORAGE_BUCKET_PRIVATE,
      thumbnailKey,
      previewSvg,
      width,
      height,
      sizeBytes,
      source: source || "UPLOAD",
      status: status || "REVIEW",
      metadata,
    });

    if (result.data) {
      result.data.previewUrl = `/api/assets/${result.data.id}/preview`;
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Assets POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create asset." },
      { status: 500 }
    );
  }
}

