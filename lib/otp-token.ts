import crypto from "crypto"

const SECRET_KEY =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "krishinova-otp-secret-key-secure-seed-987654"

/**
 * Creates a stateless signed token for OTP verification in serverless environments (e.g. Vercel)
 * This ensures verification succeeds even if the verify request lands on a different serverless instance.
 */
export function createSignedOtpToken(
  email: string,
  otp: string,
  expiresAt: number
): string {
  const normalizedEmail = email.trim().toLowerCase()
  const payload = `${normalizedEmail}:${otp}:${expiresAt}`
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex")

  return `${expiresAt}.${signature}`
}

/**
 * Verifies a stateless signed token against user input
 */
export function verifySignedOtpToken(
  email: string,
  inputOtp: string,
  token: string
): { valid: boolean; reason: string } {
  if (!token || !token.includes(".")) {
    return { valid: false, reason: "Invalid verification token format." }
  }

  const [expiresAtStr, providedSignature] = token.split(".")
  const expiresAt = parseInt(expiresAtStr, 10)

  if (isNaN(expiresAt) || !providedSignature) {
    return { valid: false, reason: "Malformed verification token." }
  }

  // Check if token has expired
  if (Date.now() > expiresAt) {
    return { valid: false, reason: "The OTP has expired. Please request a new code." }
  }

  const normalizedEmail = email.trim().toLowerCase()
  const cleanInputOtp = inputOtp.trim()
  const expectedPayload = `${normalizedEmail}:${cleanInputOtp}:${expiresAt}`
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(expectedPayload)
    .digest("hex")

  // Constant time comparison to prevent timing attacks
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature)
  )

  if (!isMatch) {
    return { valid: false, reason: "Incorrect OTP code." }
  }

  return { valid: true, reason: "OTP verified successfully." }
}
