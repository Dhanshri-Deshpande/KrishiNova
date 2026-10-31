import { NextResponse } from "next/server"
import { verifyStoredOtp, normalizeEmail } from "@/lib/otp-store"
import { verifySignedOtpToken } from "@/lib/otp-token"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || !body.email || !body.otp) {
      return NextResponse.json(
        { success: false, error: "Both email and OTP code are required." },
        { status: 400 }
      )
    }

    const email = normalizeEmail(body.email)
    const otp = String(body.otp).trim()
    const token = body.token ? String(body.token).trim() : null

    // 1. First, check the in-memory store (works for local development and warm single-instance)
    const memoryResult = verifyStoredOtp(email, otp)
    if (memoryResult.valid) {
      return NextResponse.json({
        success: true,
        message: memoryResult.reason,
      })
    }

    // 2. If memory check failed (e.g. fresh lambda / different container on Vercel), check stateless signed token
    if (token) {
      const tokenResult = verifySignedOtpToken(email, otp, token)
      if (tokenResult.valid) {
        return NextResponse.json({
          success: true,
          message: tokenResult.reason,
        })
      }
      return NextResponse.json(
        { success: false, error: tokenResult.reason },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: memoryResult.reason },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Error in /api/auth/verify-otp:", error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error while verifying OTP.",
      },
      { status: 500 }
    )
  }
}
