import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserFromSession } from "@/lib/auth/service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await getUserFromSession(session);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user,
      session,
    });
  } catch (error) {
    console.error("Session API Error:", error);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Failed to retrieve session." },
      { status: 500 }
    );
  }
}
