import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserWorkspaces } from "@/lib/workspace/service";
import { getJobs, createJob } from "@/lib/jobs/service";
import { type JobStatus, type StudioContext, type JobType } from "@/lib/jobs/types";

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
    const studio = (searchParams.get("studio") as StudioContext) || undefined;
    const jobType = (searchParams.get("jobType") as JobType) || undefined;
    const status = (searchParams.get("status") as JobStatus) || undefined;

    const result = await getJobs(activeWorkspace.id, {
      search,
      projectId,
      studio,
      jobType,
      status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Jobs GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve jobs." },
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
    const { projectId, projectName, slotCode, studio, jobType, inputSummary, outputIds } = body;

    if (!studio || !jobType) {
      return NextResponse.json(
        { success: false, error: "Studio and Job Type are required." },
        { status: 400 }
      );
    }

    const result = await createJob({
      workspaceId: activeWorkspace.id,
      projectId,
      projectName,
      slotCode,
      createdBy: session.userId,
      studio,
      jobType,
      inputSummary,
      outputIds,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Jobs POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create job." },
      { status: 500 }
    );
  }
}
