import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import {
  getUserOnboardingState,
  saveOnboardingProgress,
  completeUserOnboarding,
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

    const onboarding = await getUserOnboardingState(session.userId);

    return NextResponse.json({
      success: true,
      data: onboarding,
    });
  } catch (error) {
    console.error("Onboarding GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve onboarding state." },
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
    const { action, step, answers } = body;

    if (action === "complete") {
      const result = await completeUserOnboarding(session.userId);
      return NextResponse.json({
        success: result.success,
        data: result.data,
      });
    }

    const result = await saveOnboardingProgress(session.userId, step || 1, answers);

    return NextResponse.json({
      success: result.success,
      data: result.data,
    });
  } catch (error) {
    console.error("Onboarding POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update onboarding state." },
      { status: 500 }
    );
  }
}
