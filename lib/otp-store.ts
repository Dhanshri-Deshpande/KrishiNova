// In-memory OTP storage for Krishinova real-time OTP authentication
// Using globalThis to ensure OTP store persists across Next.js API requests and hot-reloads

interface OtpRecord {
  otp: string
  expiresAt: number
  attempts: number
  createdAt: number
  lastSentAt: number
}

interface GlobalOtpStore {
  krishinovaOtpMap?: Map<string, OtpRecord>
}

const globalStore = globalThis as unknown as GlobalOtpStore

if (!globalStore.krishinovaOtpMap) {
  globalStore.krishinovaOtpMap = new Map<string, OtpRecord>()
}

const otpMap = globalStore.krishinovaOtpMap

// Configuration
const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000 // 30 seconds
const MAX_ATTEMPTS = 5

/**
 * Generate a cryptographically clean 6-digit numeric OTP
 */
export function generateOtp(): string {
  const min = 100000
  const max = 999999
  return Math.floor(min + Math.random() * (max - min + 1)).toString()
}

/**
 * Normalizes email address for consistent dictionary lookup
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Generate and store a 6-digit OTP for a given email
 */
export function generateAndStoreOtp(email: string): {
  success: boolean
  otp: string
  cooldownRemaining?: number
  message?: string
} {
  const normalized = normalizeEmail(email)
  const now = Date.now()
  const existing = otpMap.get(normalized)

  // Rate limiting: enforce resend cooldown
  if (existing && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
    const cooldownRemaining = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000)
    return {
      success: false,
      otp: existing.otp,
      cooldownRemaining,
      message: `Please wait ${cooldownRemaining} seconds before requesting a new OTP.`,
    }
  }

  const otp = generateOtp()
  otpMap.set(normalized, {
    otp,
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    createdAt: now,
    lastSentAt: now,
  })

  // Periodically clean up expired entries
  cleanupExpiredOtps()

  return { success: true, otp }
}

/**
 * Verify an input OTP against the stored code for an email
 */
export function verifyStoredOtp(
  email: string,
  inputOtp: string
): { valid: boolean; reason: string } {
  const normalized = normalizeEmail(email)
  const record = otpMap.get(normalized)
  const cleanInput = inputOtp.trim()

  if (!record) {
    return {
      valid: false,
      reason: "No OTP was requested for this email, or it has expired.",
    }
  }

  const now = Date.now()

  // Check expiration
  if (now > record.expiresAt) {
    otpMap.delete(normalized)
    return {
      valid: false,
      reason: "The OTP has expired. Please request a new one.",
    }
  }

  // Check max attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    otpMap.delete(normalized)
    return {
      valid: false,
      reason: "Too many incorrect attempts. Please request a new OTP.",
    }
  }

  // Increment attempts count
  record.attempts += 1

  if (record.otp !== cleanInput) {
    const remaining = MAX_ATTEMPTS - record.attempts
    return {
      valid: false,
      reason: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    }
  }

  // Success! Delete OTP so it cannot be reused
  otpMap.delete(normalized)
  return {
    valid: true,
    reason: "OTP verified successfully.",
  }
}

/**
 * Check if an email has an active unexpired OTP
 */
export function hasActiveOtp(email: string): boolean {
  const normalized = normalizeEmail(email)
  const record = otpMap.get(normalized)
  if (!record) return false
  if (Date.now() > record.expiresAt) {
    otpMap.delete(normalized)
    return false
  }
  return true
}

/**
 * Clean up expired records from the in-memory map
 */
function cleanupExpiredOtps() {
  const now = Date.now()
  for (const [key, value] of otpMap.entries()) {
    if (now > value.expiresAt) {
      otpMap.delete(key)
    }
  }
}
