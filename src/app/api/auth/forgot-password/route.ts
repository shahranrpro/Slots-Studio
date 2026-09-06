import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const result = await requestPasswordReset(email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email address, you will receive password reset instructions.",
      // Include token in dev for straightforward manual testing/verification
      devToken: process.env.NODE_ENV !== "production" ? result.data?.resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
