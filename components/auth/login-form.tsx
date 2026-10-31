"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Mail, ShieldCheck, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react"
import type { Language } from "../language-context"

interface LoginFormProps {
  language: Language
  onAuthSuccess: (userData: any) => void
  onToggleMode: () => void
}

const translations = {
  en: {
    title: "Login to Krishinova",
    subtitle: "Enter your Gmail address to receive a secure real-time OTP",
    email: "Gmail / Email Address",
    emailPlaceholder: "farmer@gmail.com",
    sendOtp: "Send OTP to Gmail",
    sending: "Sending OTP...",
    otp: "Enter 6-Digit OTP",
    otpSent: "Real-time OTP has been sent to your Gmail:",
    verifyAndLogin: "Verify & Login",
    verifying: "Verifying...",
    resendOtp: "Resend OTP",
    resendIn: "Resend in",
    seconds: "s",
    changeEmail: "Change email",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    invalidEmail: "Please enter a valid Gmail / Email address.",
    devModeNotice: "Demo / Dev Mode (Gmail SMTP not configured in .env.local). Use this OTP:",
    smtpTip: "To receive actual emails in your inbox, set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local",
  },
  hi: {
    title: "Krishinova में लॉगिन करें",
    subtitle: "सुरक्षित रीयल-टाइम OTP प्राप्त करने के लिए अपना Gmail पता दर्ज करें",
    email: "जीमेल / ईमेल पता",
    emailPlaceholder: "kisan@gmail.com",
    sendOtp: "Gmail पर OTP भेजें",
    sending: "OTP भेजा जा रहा है...",
    otp: "6-अंकों का OTP दर्ज करें",
    otpSent: "रीयल-टाइम OTP आपके Gmail पर भेजा गया है:",
    verifyAndLogin: "सत्यापित करें और लॉगिन करें",
    verifying: "सत्यापित किया जा रहा है...",
    resendOtp: "OTP पुनः भेजें",
    resendIn: "पुनः भेजें",
    seconds: "सेकंड",
    changeEmail: "ईमेल बदलें",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें",
    invalidEmail: "कृपया एक वैध जीमेल / ईमेल पता दर्ज करें।",
    devModeNotice: "डेमो मोड (Gmail SMTP कॉन्फ़िगर नहीं है)। इस OTP का उपयोग करें:",
    smtpTip: "इनबॉक्स में ईमेल प्राप्त करने के लिए .env.local में GMAIL_USER और GMAIL_APP_PASSWORD जोड़ें",
  },
  ur: {
    title: "Krishinova میں لاگ ان کریں",
    subtitle: "محفوظ ریئل ٹائم OTP حاصل کرنے کے لیے اپنا Gmail پتہ درج کریں",
    email: "جی میل / ای میل ایڈریس",
    emailPlaceholder: "kisan@gmail.com",
    sendOtp: "Gmail پر OTP بھیجیں",
    sending: "OTP بھیجا جا رہا ہے...",
    otp: "6 ہندسوں کا OTP درج کریں",
    otpSent: "ریئل ٹائم OTP آپ کے Gmail پر بھیجا گیا ہے:",
    verifyAndLogin: "تصدیق کریں اور لاگ ان کریں",
    verifying: "تصدیق ہو رہی ہے...",
    resendOtp: "دوبارہ OTP بھیجیں",
    resendIn: "دوبارہ بھیجیں",
    seconds: "سیکنڈ",
    changeEmail: "ای میل تبدیل کریں",
    noAccount: "اکاؤنٹ نہیں ہے؟",
    signUp: "سائن اپ کریں",
    invalidEmail: "براہ کرم درست جی میل / ای میل ایڈریس درج کریں۔",
    devModeNotice: "ڈیمو موڈ۔ اس OTP کا استعمال کریں:",
    smtpTip: "ان باکس میں براہ راست ای میل حاصل کرنے کے لیے .env.local ترتیب دیں",
  },
  mr: {
    title: "Krishinova मध्ये लॉगिन करा",
    subtitle: "सुरक्षित रिअल-टाइम OTP मिळवण्यासाठी आपला Gmail पत्ता प्रविष्ट करा",
    email: "जीमेल / ईमेल पत्ता",
    emailPlaceholder: "shetkari@gmail.com",
    sendOtp: "Gmail वर OTP पाठवा",
    sending: "OTP पाठवत आहे...",
    otp: "6-अंकी OTP टाका",
    otpSent: "रिअल-टाइम OTP आपल्या Gmail वर पाठवला गेला आहे:",
    verifyAndLogin: "पडताळणी करा आणि लॉगिन करा",
    verifying: "पडताळणी चालू आहे...",
    resendOtp: "OTP पुन्हा पाठवा",
    resendIn: "पुन्हा पाठवा",
    seconds: "सेकंद",
    changeEmail: "ईमेल बदला",
    noAccount: "खाते नाही?",
    signUp: "साइन अप करा",
    invalidEmail: "कृपया वैध जीमेल / ईमेल पत्ता टाका.",
    devModeNotice: "डेमो मोड (Gmail SMTP कॉन्फिगर केलेले नाही). हा OTP वापरा:",
    smtpTip: "इनबॉक्समध्ये प्रत्यक्ष ईमेल मिळवण्यासाठी .env.local मध्ये GMAIL_USER आणि GMAIL_APP_PASSWORD जोडा",
  },
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

export default function LoginForm({ language, onAuthSuccess, onToggleMode }: LoginFormProps) {
  const t = translations[language] || translations.en
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [otpToken, setOtpToken] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage(t.invalidEmail)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, purpose: "login" }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to send OTP. Please try again.")
        if (data.cooldownRemaining) {
          setCountdown(data.cooldownRemaining)
        }
        return
      }

      setShowOtpStep(true)
      setCountdown(30)
      setOtp("")
      if (data.token) {
        setOtpToken(data.token)
      }
      if (data.devOtp) {
        setDevOtp(data.devOtp)
      } else {
        setDevOtp(null)
      }
      setSuccessMessage(data.message || t.otpSent)
    } catch (err: any) {
      setErrorMessage(err?.message || "Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    const cleanOtp = otp.trim()
    if (cleanOtp.length < 4) return

    setIsVerifying(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: cleanOtp, token: otpToken }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Invalid OTP code.")
        return
      }

      // Check if user has saved profile in localStorage
      let matchedProfile = null
      try {
        const savedUsersJson = localStorage.getItem("krishinova_registered_users")
        if (savedUsersJson) {
          const registeredUsers = JSON.parse(savedUsersJson)
          if (Array.isArray(registeredUsers)) {
            matchedProfile = registeredUsers.find(
              (u: any) => u.email?.toLowerCase() === email.trim().toLowerCase()
            )
          }
        }
      } catch (e) {
        // ignore storage parse error
      }

      const displayName =
        matchedProfile?.fullName || email.split("@")[0] || "Farmer"

      onAuthSuccess({
        id: matchedProfile?.id || Date.now(),
        email: email.trim().toLowerCase(),
        fullName: displayName,
        mobile: matchedProfile?.mobile || "",
        gender: matchedProfile?.gender || "other",
        dob: matchedProfile?.dob || "",
        landArea: matchedProfile?.landArea || "5",
        nitrogen: matchedProfile?.nitrogen || 50,
        phosphorus: matchedProfile?.phosphorus || 30,
        potassium: matchedProfile?.potassium || 40,
        ph: matchedProfile?.ph || 6.8,
        latitude: matchedProfile?.latitude || 19.076,
        longitude: matchedProfile?.longitude || 72.8777,
        profilePicPreview: matchedProfile?.profilePicPreview || null,
        predictions: matchedProfile?.predictions || [],
        totalPredictions: matchedProfile?.totalPredictions || 0,
      })
    } catch (err: any) {
      setErrorMessage(err?.message || "Verification failed. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-emerald-100 bg-card/95 backdrop-blur-sm">
        <div className="p-8">
          {/* Header Icon & Title */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xs mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2.5 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {!showOtpStep ? (
            /* STEP 1: Enter Gmail */
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  {t.email}
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    className="h-12 pl-3 text-base focus-visible:ring-emerald-500 border-border"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.sending}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t.sendOtp}
                  </span>
                )}
              </Button>

              <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/50">
                {t.noAccount}{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-emerald-600 font-semibold hover:underline ml-1"
                >
                  {t.signUp}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: Verify Real-Time OTP */
            <form onSubmit={handleOtpVerify} className="space-y-5">
              {/* Recipient badge with change button */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-800 font-medium">{t.otpSent}</p>
                  <p className="text-sm font-bold text-emerald-950 truncate">{email}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpStep(false)
                      setErrorMessage(null)
                      setDevOtp(null)
                    }}
                    className="text-xs text-emerald-700 underline font-medium mt-1 inline-flex items-center gap-1 hover:text-emerald-900"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    {t.changeEmail}
                  </button>
                </div>
              </div>

              {/* Dev / Demo OTP Highlight Card */}
              {devOtp && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    {t.devModeNotice}
                  </div>
                  <div className="text-center py-1">
                    <span className="inline-block bg-white border border-amber-400 text-amber-900 font-mono font-extrabold text-2xl tracking-widest px-4 py-1 rounded-md shadow-sm">
                      {devOtp}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-tight">
                    💡 {t.smtpTip}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 text-center">
                  {t.otp}
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setOtp(val)
                  }}
                  placeholder="------"
                  maxLength={6}
                  className="text-center text-3xl font-mono tracking-[0.5em] h-14 bg-background border-2 border-emerald-400 focus-visible:ring-emerald-500 rounded-xl"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <Button
                type="submit"
                disabled={otp.length < 4 || isVerifying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 shadow-md hover:shadow-lg transition-all"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.verifying}
                  </span>
                ) : (
                  t.verifyAndLogin
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center text-xs text-muted-foreground pt-1">
                {countdown > 0 ? (
                  <span className="text-muted-foreground font-medium">
                    {t.resendIn} <strong className="text-emerald-600">{countdown}</strong> {t.seconds}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                    className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    {t.resendOtp}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
