import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import {
  createWorkspaceForUser,
  getUserWorkspaces,
  getUserOnboardingState,
} from "@/lib/workspace/service";

export async function GET() {
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

    const [workspaces, onboarding] = await Promise.all([
      getUserWorkspaces(session.userId),
      getUserOnboardingState(session.userId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        workspaces,
        onboarding,
      },
    });
  } catch (error) {
    console.error("Workspace GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve workspace details." },
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

    const body = await request.json();
    const { name } = body;

    const result = await createWorkspaceForUser(session.userId, name);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to create workspace.",
          fieldErrors: result.fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workspace POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create workspace." },
      { status: 500 }
    );
  }
}
