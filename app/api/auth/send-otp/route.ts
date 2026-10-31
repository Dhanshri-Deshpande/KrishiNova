import { NextResponse } from "next/server"
import { generateAndStoreOtp, normalizeEmail } from "@/lib/otp-store"
import { createSignedOtpToken } from "@/lib/otp-token"
import { sendOtpEmail } from "@/lib/email-service"

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || !body.email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      )
    }

    const email = normalizeEmail(body.email)

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Gmail or Email address (e.g., farmer@gmail.com)." },
        { status: 400 }
      )
    }

    const purpose: "login" | "signup" = body.purpose === "signup" ? "signup" : "login"
    const userName: string | undefined = body.userName

    // Generate and store OTP in memory store
    const storeResult = generateAndStoreOtp(email)

    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: storeResult.message || "Please wait before requesting another OTP.",
          cooldownRemaining: storeResult.cooldownRemaining,
        },
        { status: 429 }
      )
    }

    // Generate stateless token for resilient serverless/Vercel verification
    const expiresAt = Date.now() + OTP_EXPIRY_MS
    const token = createSignedOtpToken(email, storeResult.otp, expiresAt)

    // Send real-time OTP via Gmail / SMTP
    const emailResult = await sendOtpEmail({
      toEmail: email,
      otp: storeResult.otp,
      purpose,
      userName,
    })

    return NextResponse.json({
      success: true,
      message: emailResult.message,
      emailSent: emailResult.emailSent,
      devOtp: emailResult.devOtp, // available for testing if SMTP is not configured
      token, // serverless verification token
    })
  } catch (error: any) {
    console.error("Error in /api/auth/send-otp:", error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error while sending OTP.",
      },
      { status: 500 }
    )
  }
}
