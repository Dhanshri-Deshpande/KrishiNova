import nodemailer from "nodemailer"

interface SendOtpOptions {
  toEmail: string
  otp: string
  purpose?: "login" | "signup" | "generic"
  userName?: string
}

interface SendOtpResult {
  success: boolean
  emailSent: boolean
  message: string
  devOtp?: string
  error?: string
}

/**
 * Creates and returns a Nodemailer transporter configured for Gmail
 */
function getTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD

  if (!user || !pass) {
    return null
  }

  // Gmail SMTP transporter with TLS
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, ""), // strip any spaces from 16-char app password
    },
  })
}

/**
 * Generates Krishinova branded HTML email template for OTP delivery
 */
function getEmailHtml(otp: string, purpose: string, userName?: string): string {
  const greeting = userName ? `Hello <strong>${userName}</strong>,` : "Hello Farmer,"
  const actionText =
    purpose === "signup"
      ? "register your new Krishinova account"
      : purpose === "login"
      ? "log in to your Krishinova dashboard"
      : "verify your account"

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Krishinova OTP</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f6f4; padding: 30px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
            
            <!-- Header Banner -->
            <tr>
              <td style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px 24px; text-align: center;">
                <div style="font-size: 34px; margin-bottom: 8px;">🌾</div>
                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Krishinova</h1>
                <p style="margin: 6px 0 0 0; color: #dcfce7; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Smart Agriculture & Farm Intelligence</p>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 36px 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">${greeting}</p>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                  Use the one-time verification code below to ${actionText}:
                </p>

                <!-- OTP Display Box -->
                <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
                  <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #15803d; margin-bottom: 8px;">
                    Your One-Time Password
                  </div>
                  <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #166534; font-family: 'Courier New', Courier, monospace;">
                    ${otp}
                  </div>
                  <div style="font-size: 13px; color: #16a34a; font-weight: 500; margin-top: 8px;">
                    ⏱️ Valid for 5 minutes
                  </div>
                </div>

                <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #6b7280;">
                  ⚠️ <strong>Security Notice:</strong> Please never share this OTP with anyone. Krishinova staff will never ask for your verification code.
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6b7280;">
                  If you did not request this OTP, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #f3f4f6; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  Krishinova Farm Decision Platform • Empowering Indian Farmers 🌱
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

/**
 * Sends real-time OTP to the user's Gmail address
 */
export async function sendOtpEmail({
  toEmail,
  otp,
  purpose = "login",
  userName,
}: SendOtpOptions): Promise<SendOtpResult> {
  const transporter = getTransporter()
  const fromUser = process.env.GMAIL_USER || process.env.SMTP_USER || "krishinova.auth@gmail.com"

  // 1. If Gmail credentials are NOT provided in .env.local
  if (!transporter) {
    console.log(`\n======================================================`)
    console.log(`🔔 [Krishinova Real-Time OTP System]`)
    console.log(`📧 Recipient: ${toEmail}`)
    console.log(`🔑 OTP Code : ${otp}`)
    console.log(`⏱️  Valid for: 5 Minutes (Purpose: ${purpose})`)
    console.log(`⚠️  Note: GMAIL_USER or GMAIL_APP_PASSWORD not found in .env.local.`)
    console.log(`👉 Add GMAIL_USER and GMAIL_APP_PASSWORD in .env.local to send real emails to inbox.`)
    console.log(`======================================================\n`)

    return {
      success: true,
      emailSent: false,
      message: "OTP generated. (Gmail SMTP not configured in .env.local, check terminal/dev preview)",
      devOtp: otp,
    }
  }

  // 2. Transporter is configured: send actual email via Gmail SMTP
  try {
    const actionSubject =
      purpose === "signup" ? "Create Account Verification" : "Login Verification"

    const mailOptions = {
      from: `"Krishinova Agriculture" <${fromUser}>`,
      to: toEmail,
      subject: `${otp} is your Krishinova ${actionSubject} Code`,
      text: `Your Krishinova OTP verification code is: ${otp}. It is valid for 5 minutes. Please do not share this code with anyone.`,
      html: getEmailHtml(otp, purpose, userName),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`\n✅ [Krishinova Email] OTP successfully sent to ${toEmail} (MessageId: ${info.messageId})\n`)

    return {
      success: true,
      emailSent: true,
      message: `OTP sent successfully to your Gmail (${toEmail}). Please check your inbox or spam folder.`,
    }
  } catch (error: any) {
    console.error(`❌ [Krishinova Email] Failed to send email via Gmail SMTP:`, error?.message || error)

    // Fallback: don't block user flow, provide terminal OTP
    console.log(`\n======================================================`)
    console.log(`🔔 [Krishinova Real-Time OTP Fallback]`)
    console.log(`📧 Recipient: ${toEmail}`)
    console.log(`🔑 OTP Code : ${otp}`)
    console.log(`======================================================\n`)

    return {
      success: true,
      emailSent: false,
      message: `Failed to dispatch email (${error?.message || "SMTP error"}). Please verify Gmail credentials.`,
      devOtp: otp,
      error: error?.message,
    }
  }
}
