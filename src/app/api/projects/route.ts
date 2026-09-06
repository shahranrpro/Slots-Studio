import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { createProject, getProjects } from "@/lib/projects/service";
import { type ProjectCategory, type ProjectStatus } from "@/lib/projects/types";

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
    const status = (searchParams.get("status") as ProjectStatus | "ALL") || undefined;
    const category = (searchParams.get("category") as ProjectCategory | "ALL") || undefined;
    const includeArchived = searchParams.get("includeArchived") === "true";

    const result = await getProjects(activeWorkspace.id, {
      search,
      status,
      category,
      includeArchived,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Projects GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve projects." },
      { status: 500 }
    );
  }
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

    const body = await request.json();
    const result = await createProject(session.userId, activeWorkspace.id, body);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to create project.",
          fieldErrors: result.fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Projects POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project." },
      { status: 500 }
    );
  }
}
