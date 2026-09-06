import { NextResponse } from "next/server";
import { resetUserPassword } from "@/lib/auth/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    const result = await resetUserPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to reset password.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You may now log in.",
    });
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
