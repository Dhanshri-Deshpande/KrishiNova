"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  AlertCircle,
  CheckCircle,
  MapPin,
  Upload,
  Calendar,
  Mail,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react"
import type { Language } from "../language-context"

interface SignUpFormProps {
  language: Language
  onAuthSuccess: (userData: any) => void
  onToggleMode: () => void
}

const translations = {
  en: {
    title: "Create Account",
    fullName: "Full Name",
    email: "Gmail / Email Address",
    emailPlaceholder: "farmer@gmail.com",
    dob: "Date of Birth",
    mobile: "Mobile Number",
    profilePic: "Profile Picture",
    latitude: "Latitude",
    longitude: "Longitude",
    landArea: "Land Area (acres)",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    ph: "pH Level",
    signUp: "Sign Up & Send OTP",
    sending: "Sending OTP to Gmail...",
    haveAccount: "Already have an account?",
    login: "Login",
    otp: "Enter 6-Digit OTP",
    otpSent: "Real-time OTP has been sent to your Gmail:",
    verifyOtp: "Verify OTP & Complete Registration",
    verifying: "Verifying OTP...",
    resendOtp: "Resend OTP",
    resendIn: "Resend in",
    seconds: "s",
    changeEmail: "Change details",
    accountCreated: "Account Created Successfully!",
    selectLocation: "Select Location on Map",
    soilFactors: "Soil Nutrient Factors",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    selectGender: "Select Gender",
    invalidDOB: "You must be at least 18 years old",
    futureDate: "Date of birth cannot be in the future",
    choosePhoto: "Choose Photo",
    photoOnly: "Photos only (JPG, PNG)",
    invalidEmail: "Please enter a valid Gmail / Email address (e.g. name@gmail.com)",
    devModeNotice: "Demo / Dev Mode (Gmail SMTP not configured in .env.local). Use this OTP:",
    smtpTip: "To receive actual emails in your inbox, set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local",
  },
  hi: {
    title: "खाता बनाएं",
    fullName: "पूरा नाम",
    email: "जीमेल / ईमेल पता",
    emailPlaceholder: "kisan@gmail.com",
    dob: "जन्म तिथि",
    mobile: "मोबाइल नंबर",
    profilePic: "प्रोफाइल चित्र",
    latitude: "अक्षांश (Latitude)",
    longitude: "देशांतर (Longitude)",
    landArea: "भूमि क्षेत्र (एकड़)",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फॉस्फोरस (P)",
    potassium: "पोटेशियम (K)",
    ph: "pH स्तर",
    signUp: "साइन अप करें और OTP भेजें",
    sending: "Gmail पर OTP भेजा जा रहा है...",
    haveAccount: "पहले से खाता है?",
    login: "लॉगिन करें",
    otp: "6-अंकों का OTP दर्ज करें",
    otpSent: "रीयल-टाइम OTP आपके Gmail पर भेजा गया है:",
    verifyOtp: "OTP सत्यापित करें और पंजीकरण पूरा करें",
    verifying: "सत्यापित किया जा रहा है...",
    resendOtp: "OTP पुनः भेजें",
    resendIn: "पुनः भेजें",
    seconds: "सेकंड",
    changeEmail: "विवरण बदलें",
    accountCreated: "खाता सफलतापूर्वक बनाया गया!",
    selectLocation: "नक्शे पर स्थान चुनें",
    soilFactors: "मिट्टी पोषक तत्व",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    selectGender: "लिंग चुनें",
    invalidDOB: "आपकी आयु कम से कम 18 वर्ष होनी चाहिए",
    futureDate: "जन्म तिथि भविष्य में नहीं हो सकती",
    choosePhoto: "फोटो चुनें",
    photoOnly: "केवल फोटो (JPG, PNG)",
    invalidEmail: "कृपया एक वैध जीमेल / ईमेल पता दर्ज करें",
    devModeNotice: "डेमो मोड (Gmail SMTP कॉन्फ़िगर नहीं है)। इस OTP का उपयोग करें:",
    smtpTip: "इनबॉक्स में ईमेल प्राप्त करने के लिए .env.local में GMAIL_USER और GMAIL_APP_PASSWORD जोड़ें",
  },
  ur: {
    title: "اکاؤنٹ بنائیں",
    fullName: "مکمل نام",
    email: "جی میل / ای میل ایڈریس",
    emailPlaceholder: "kisan@gmail.com",
    dob: "پیدائش کی تاریخ",
    mobile: "موبائل نمبر",
    profilePic: "پروفائل تصویر",
    latitude: "عرض بلد (Latitude)",
    longitude: "طول بلد (Longitude)",
    landArea: "زمین کا رقبہ (ایکڑ)",
    nitrogen: "نائٹروجن (N)",
    phosphorus: "فاسفورس (P)",
    potassium: "پوٹاشیم (K)",
    ph: "pH سطح",
    signUp: "سائن اپ کریں اور OTP حاصل کریں",
    sending: "Gmail پر OTP بھیجا جا رہا ہے...",
    haveAccount: "پہلے سے اکاؤنٹ ہے؟",
    login: "لاگ ان کریں",
    otp: "6 ہندسوں کا OTP درج کریں",
    otpSent: "ریئل ٹائم OTP آپ کے Gmail پر بھیج دیا گیا ہے:",
    verifyOtp: "OTP تصدیق کریں اور رجسٹریشن مکمل کریں",
    verifying: "تصدیق ہو رہی ہے...",
    resendOtp: "دوبارہ OTP بھیجیں",
    resendIn: "دوبارہ بھیجیں",
    seconds: "سیکنڈ",
    changeEmail: "تفصیلات تبدیل کریں",
    accountCreated: "اکاؤنٹ کامیابی سے بنایا گیا!",
    selectLocation: "نقشے پر مقام منتخب کریں",
    soilFactors: "مٹی کے غذائی اجزاء",
    gender: "صنف",
    male: "مرد",
    female: "عورت",
    other: "دوسرا",
    selectGender: "صنف منتخب کریں",
    invalidDOB: "آپ کی عمر کم از کم 18 سال ہونی چاہیے",
    futureDate: "پیدائش کی تاریخ مستقبل میں نہیں ہو سکتی",
    choosePhoto: "فوٹو منتخب کریں",
    photoOnly: "صرف فوٹو (JPG, PNG)",
    invalidEmail: "براہ کرم درست جی میل / ای میل ایڈریس درج کریں",
    devModeNotice: "ڈیمو موڈ۔ اس OTP کا استعمال کریں:",
    smtpTip: "ان باکس میں براہ راست ای میل حاصل کرنے کے لیے .env.local ترتیب دیں",
  },
  mr: {
    title: "खाते तयार करा",
    fullName: "पूर्ण नाव",
    email: "जीमेल / ईमेल पत्ता",
    emailPlaceholder: "shetkari@gmail.com",
    dob: "जन्मतारीख",
    mobile: "मोबाईल नंबर",
    profilePic: "प्रोफाइल चित्र",
    latitude: "अक्षांश (Latitude)",
    longitude: "रेखांश (Longitude)",
    landArea: "जमीन क्षेत्र (एकर)",
    nitrogen: "नायट्रोजन (N)",
    phosphorus: "फॉस्फरस (P)",
    potassium: "पोटॅशियम (K)",
    ph: "pH स्तर",
    signUp: "साइन अप करा आणि OTP पाठवा",
    sending: "Gmail वर OTP पाठवत आहे...",
    haveAccount: "आधीच खाते आहे?",
    login: "लॉगिन करा",
    otp: "6-अंकी OTP टाका",
    otpSent: "रिअल-टाइम OTP आपल्या Gmail वर पाठवला गेला आहे:",
    verifyOtp: "OTP पडताळणी करा आणि नोंदणी पूर्ण करा",
    verifying: "पडताळणी चालू आहे...",
    resendOtp: "OTP पुन्हा पाठवा",
    resendIn: "पुन्हा पाठवा",
    seconds: "सेकंद",
    changeEmail: "माहिती बदला",
    accountCreated: "खाते यशस्वीरित्या तयार झाले!",
    selectLocation: "नकाशावर स्थान निवडा",
    soilFactors: "मातीचे पोषक घटक",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "इतर",
    selectGender: "लिंग निवडा",
    invalidDOB: "आपली वय किमान 18 वर्षे असली पाहिजे",
    futureDate: "जन्मतारीख भविष्यात असू शकत नाही",
    choosePhoto: "फोटो निवडा",
    photoOnly: "फक्त फोटो (JPG, PNG)",
    invalidEmail: "कृपया वैध जीमेल / ईमेल पत्ता टाका",
    devModeNotice: "डेमो मोड (Gmail SMTP कॉन्फिगर केलेले नाही). हा OTP वापरा:",
    smtpTip: "इनबॉक्समध्ये प्रत्यक्ष ईमेल मिळवण्यासाठी .env.local मध्ये GMAIL_USER आणि GMAIL_APP_PASSWORD जोडा",
  },
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/

export default function SignUpForm({ language, onAuthSuccess, onToggleMode }: SignUpFormProps) {
  const t = translations[language] || translations.en
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    mobile: "",
    profilePic: null as File | null,
    profilePicPreview: null as string | null,
    latitude: "",
    longitude: "",
    landArea: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  })
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otp, setOtp] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [otpToken, setOtpToken] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // DOB validation (must be 18+)
  const validateDOB = (dob: string): string | null => {
    if (!dob) return null
    const birthDate = new Date(dob)
    const today = new Date()

    if (birthDate > today) return t.futureDate

    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      if (age - 1 < 18) return t.invalidDOB
    } else {
      if (age < 18) return t.invalidDOB
    }
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "dob") {
      const error = validateDOB(value)
      setErrors((prev) => ({ ...prev, dob: error || "" }))
    }
    if (name === "email") {
      if (errors.email) {
        setErrors((prev) => ({ ...prev, email: "" }))
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            profilePic: file,
            profilePicPreview: reader.result as string,
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleSendOtp = async (isResend = false) => {
    setGeneralError(null)

    const cleanEmail = formData.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrors((prev) => ({ ...prev, email: t.invalidEmail }))
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          purpose: "signup",
          userName: formData.fullName,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setGeneralError(data.error || "Failed to dispatch OTP.")
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

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to connect to authentication server.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    const dobError = validateDOB(formData.dob)
    if (dobError) {
      setErrors((prev) => ({ ...prev, dob: dobError }))
      return
    }
    if (!formData.gender) {
      setErrors((prev) => ({ ...prev, gender: t.selectGender }))
      return
    }
    const cleanEmail = formData.email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrors((prev) => ({ ...prev, email: t.invalidEmail }))
      return
    }

    handleSendOtp(false)
  }

  const handleOtpVerify = async () => {
    setGeneralError(null)
    const cleanOtp = otp.trim()
    if (cleanOtp.length < 4) return

    setIsVerifying(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          otp: cleanOtp,
          token: otpToken,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setGeneralError(data.error || "Invalid OTP code.")
        return
      }

      // Success! Save registered user to localStorage registry
      const newUser = {
        ...formData,
        id: Date.now(),
        email: formData.email.trim().toLowerCase(),
        predictions: [],
        totalPredictions: 0,
      }

      try {
        const savedUsersJson = localStorage.getItem("krishinova_registered_users")
        const registeredUsers = savedUsersJson ? JSON.parse(savedUsersJson) : []
        // update existing or push new
        const updatedUsers = Array.isArray(registeredUsers)
          ? registeredUsers.filter((u: any) => u.email?.toLowerCase() !== newUser.email)
          : []
        updatedUsers.push(newUser)
        localStorage.setItem("krishinova_registered_users", JSON.stringify(updatedUsers))
      } catch (e) {
        // ignore localStorage errors
      }

      setShowSuccess(true)
      setTimeout(() => {
        onAuthSuccess(newUser)
      }, 1500)
    } catch (err: any) {
      setGeneralError(err?.message || "Verification failed.")
    } finally {
      setIsVerifying(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center animate-fade-in-up bg-card/90 p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-100">
          <CheckCircle className="w-20 h-20 text-emerald-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-foreground mb-2">{t.accountCreated}</h2>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={formRef} className="min-h-screen flex items-center justify-center p-4 py-8 scroll-smooth">
      <Card className="w-full max-w-2xl shadow-2xl border-emerald-100 bg-card/95 backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{t.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Join Krishinova smart agriculture platform
              </p>
            </div>
          </div>

          {generalError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 flex items-start gap-2.5 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="flex-1">{generalError}</span>
            </div>
          )}

          {!showOtpStep ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border-2 border-dashed border-emerald-400 overflow-hidden shadow-inner">
                    {formData.profilePicPreview ? (
                      <img src={formData.profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-emerald-600/70" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110">
                    <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
                    <Upload className="w-4 h-4" />
                  </label>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">{t.photoOnly}</p>
              </div>

              {/* Name + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.fullName}</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Patil"
                    required
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.gender}</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">{t.selectGender}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.other}</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Gmail / Email Address (Primary for OTP) */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  {t.email}
                  <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Real-time OTP on this Gmail
                  </span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.emailPlaceholder}
                  required
                  className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* DOB + Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.dob}</label>
                  <div className="relative">
                    <Input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className={`h-11 ${errors.dob ? "border-red-500" : ""}`}
                      max={
                        new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    <Calendar className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{t.mobile}</label>
                  <Input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {/* Location (Lat/Lng) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <MapPin className="w-4 h-4 inline-block mr-1 text-emerald-600" />
                    {t.latitude}
                  </label>
                  <Input
                    name="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 19.0760"
                    required
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <MapPin className="w-4 h-4 inline-block mr-1 text-emerald-600" />
                    {t.longitude}
                  </label>
                  <Input
                    name="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 72.8777"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {/* Land Area */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{t.landArea}</label>
                <Input
                  name="landArea"
                  type="number"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                  required
                  className="h-11"
                />
              </div>

              {/* Soil Factors */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 text-sm">{t.soilFactors}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["nitrogen", "phosphorus", "potassium", "ph"].map((factor) => (
                    <div key={factor}>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t[factor as keyof typeof t]}
                      </label>
                      <Input
                        name={factor}
                        type="number"
                        step={factor === "ph" ? "0.1" : "1"}
                        value={formData[factor as keyof typeof formData] as string}
                        onChange={handleInputChange}
                        placeholder={factor === "ph" ? "0-14" : "0-100"}
                        required
                        className="h-10 bg-background"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.sending}
                  </span>
                ) : (
                  t.signUp
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                {t.haveAccount}{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-emerald-600 font-semibold hover:underline ml-1"
                >
                  {t.login}
                </button>
              </p>
            </form>
          ) : (
            /* OTP STEP */
            <div className="space-y-6">
              {/* Recipient banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-emerald-800 font-medium">{t.otpSent}</p>
                  <p className="text-base font-bold text-emerald-950 truncate">{formData.email}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpStep(false)
                      setGeneralError(null)
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
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
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
                <label className="block text-sm font-semibold text-foreground mb-2 text-center">
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

              {/* Verify Button */}
              <Button
                onClick={handleOtpVerify}
                disabled={otp.length < 4 || isVerifying}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 shadow-md hover:shadow-lg transition-all"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.verifying}
                  </span>
                ) : (
                  t.verifyOtp
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
                    onClick={() => handleSendOtp(true)}
                    disabled={isLoading}
                    className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    {t.resendOtp}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
